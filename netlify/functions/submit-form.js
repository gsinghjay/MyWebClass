/**
 * Netlify Function: Form Submission Handler
 *
 * Receives form submissions and:
 * 1. Creates a gallerySubmission document in Sanity (pending status)
 * 2. Sends Discord notification (if webhook configured)
 * 3. Syncs to Airtable CRM (if API key configured)
 *
 * Environment Variables Required:
 * - SANITY_PROJECT_ID
 * - SANITY_DATASET
 * - SANITY_API_TOKEN (write access)
 *
 * Optional:
 * - DISCORD_WEBHOOK_URL
 * - AIRTABLE_API_KEY
 * - AIRTABLE_BASE_ID
 * - AIRTABLE_TABLE_NAME
 */

const SANITY_PROJECT_ID = process.env.SANITY_PROJECT_ID;
const SANITY_DATASET = process.env.SANITY_DATASET || 'production';
const SANITY_API_TOKEN = process.env.SANITY_API_TOKEN;
const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL;
const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
const AIRTABLE_TABLE_NAME = process.env.AIRTABLE_TABLE_NAME || 'Submissions';

/**
 * Create a document in Sanity CMS
 */
async function createSanityDocument(submission) {
  const mutations = [{
    create: {
      _type: 'gallerySubmission',
      submitterName: submission.name,
      submitterEmail: submission.email,
      styleRef: {
        _type: 'reference',
        _ref: submission.styleId // Will need to look up by slug
      },
      demoUrl: submission.demoUrl,
      authenticityExplanation: submission.authenticity,
      hasPublicDisplayConsent: submission.consent === 'true' || submission.consent === true,
      hasMarketingConsent: submission.marketing === 'true' || submission.marketing === true,
      status: 'pending',
      submittedAt: new Date().toISOString(),
      isFeatured: false
    }
  }];

  // If we have a style slug instead of ID, we need to look it up first
  if (submission.style && !submission.styleId) {
    const styleQuery = encodeURIComponent(`*[_type == "designStyle" && slug.current == "${submission.style}"][0]._id`);
    const styleUrl = `https://${SANITY_PROJECT_ID}.api.sanity.io/v2021-10-21/data/query/${SANITY_DATASET}?query=${styleQuery}`;

    try {
      const styleResponse = await fetch(styleUrl, {
        headers: {
          'Authorization': `Bearer ${SANITY_API_TOKEN}`
        }
      });
      const styleData = await styleResponse.json();
      if (styleData.result) {
        mutations[0].create.styleRef._ref = styleData.result;
      } else {
        // Style not found - remove the reference to avoid error
        delete mutations[0].create.styleRef;
      }
    } catch (error) {
      console.error('Failed to look up style:', error);
      delete mutations[0].create.styleRef;
    }
  }

  const url = `https://${SANITY_PROJECT_ID}.api.sanity.io/v2021-10-21/data/mutate/${SANITY_DATASET}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${SANITY_API_TOKEN}`
    },
    body: JSON.stringify({ mutations })
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Sanity mutation failed: ${error}`);
  }

  return response.json();
}

/**
 * Send Discord notification
 */
async function sendDiscordNotification(submission, styleName) {
  if (!DISCORD_WEBHOOK_URL) {
    console.log('Discord webhook not configured, skipping notification');
    return null;
  }

  const message = {
    content: `🎨 **New Submission:** "${styleName || submission.style}" by ${submission.name}\nDemo: ${submission.demoUrl}`
  };

  try {
    const response = await fetch(DISCORD_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(message)
    });

    if (!response.ok) {
      console.error('Discord notification failed:', response.status);
    }
    return response;
  } catch (error) {
    console.error('Discord notification error:', error);
    return null;
  }
}

/**
 * Sync to Airtable CRM
 */
async function syncToAirtable(submission) {
  if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) {
    console.log('Airtable not configured, skipping CRM sync');
    return null;
  }

  const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(AIRTABLE_TABLE_NAME)}`;

  const record = {
    fields: {
      'Name': submission.name,
      'Email': submission.email,
      'Style': submission.style,
      'Demo URL': submission.demoUrl,
      'Submission Date': new Date().toISOString().split('T')[0],
      'Status': 'Pending',
      'Marketing Opt-In': submission.marketing === 'true' || submission.marketing === true
    }
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${AIRTABLE_API_KEY}`
      },
      body: JSON.stringify(record)
    });

    if (!response.ok) {
      console.error('Airtable sync failed:', response.status);
    }
    return response;
  } catch (error) {
    console.error('Airtable sync error:', error);
    return null;
  }
}

/**
 * Parse form data from various content types
 */
function parseFormData(body, contentType) {
  if (contentType?.includes('application/json')) {
    return JSON.parse(body);
  }

  if (contentType?.includes('application/x-www-form-urlencoded')) {
    const params = new URLSearchParams(body);
    const data = {};
    for (const [key, value] of params) {
      data[key] = value;
    }
    return data;
  }

  // Try JSON parsing as fallback
  try {
    return JSON.parse(body);
  } catch {
    return {};
  }
}

/**
 * Main handler
 */
export async function handler(event) {
  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  // Check for required environment variables
  if (!SANITY_PROJECT_ID || !SANITY_API_TOKEN) {
    console.error('Missing required Sanity environment variables');
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Server configuration error' })
    };
  }

  try {
    const contentType = event.headers['content-type'] || event.headers['Content-Type'];
    const submission = parseFormData(event.body, contentType);

    // Validate required fields
    const required = ['name', 'email', 'style', 'demoUrl', 'authenticity', 'consent'];
    const missing = required.filter(field => !submission[field]);

    if (missing.length > 0) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: 'Missing required fields',
          fields: missing
        })
      };
    }

    // Validate consent
    if (submission.consent !== 'true' && submission.consent !== true) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Public display consent is required' })
      };
    }

    // Create Sanity document (primary - must succeed)
    const sanityResult = await createSanityDocument(submission);
    console.log('Sanity document created:', sanityResult);

    // Send Discord notification (non-blocking)
    sendDiscordNotification(submission).catch(err =>
      console.error('Discord notification failed:', err)
    );

    // Sync to Airtable (non-blocking)
    syncToAirtable(submission).catch(err =>
      console.error('Airtable sync failed:', err)
    );

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        success: true,
        message: 'Submission received successfully'
      })
    };

  } catch (error) {
    console.error('Submission error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Failed to process submission',
        details: error.message
      })
    };
  }
}
