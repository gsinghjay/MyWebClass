// Cookie Consent Management with GA4 Consent Mode v2
(function() {
  const CONSENT_KEY = 'cookie_consent';
  const GA4_MEASUREMENT_ID = window.GA4_MEASUREMENT_ID || null;
  const cookieBanner = document.getElementById('cookie-banner');
  const acceptButton = document.getElementById('cookie-accept');
  const rejectButton = document.getElementById('cookie-reject');
  const preferencesButton = document.getElementById('cookie-preferences');
  const cookieSettingsLink = document.getElementById('cookie-settings-link');

  // Track if GA4 has been loaded this session
  let ga4Loaded = false;

  if (!cookieBanner) return;

  // Check if user has already made a choice
  function getConsent() {
    try {
      return localStorage.getItem(CONSENT_KEY);
    } catch (e) {
      return null;
    }
  }

  // Save consent choice
  function setConsent(value) {
    try {
      localStorage.setItem(CONSENT_KEY, value);
      return true;
    } catch (e) {
      console.error('Could not save cookie consent:', e);
      return false;
    }
  }

  // Update GA4 consent mode
  function updateConsentMode(granted) {
    if (typeof gtag === 'function') {
      gtag('consent', 'update', {
        'analytics_storage': granted ? 'granted' : 'denied'
      });
    }
  }

  // Load GA4 analytics script
  function loadAnalytics() {
    // Always update consent mode first (even if GA4 won't load)
    updateConsentMode(true);

    // Skip if already loaded or no measurement ID configured
    if (ga4Loaded) return;
    if (!GA4_MEASUREMENT_ID || GA4_MEASUREMENT_ID === 'G-0000000000') {
      console.log('GA4: No valid measurement ID configured, skipping analytics load');
      return;
    }

    // Load GA4 script dynamically
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA4_MEASUREMENT_ID;
    document.head.appendChild(script);

    script.onload = function() {
      gtag('js', new Date());
      gtag('config', GA4_MEASUREMENT_ID);
      ga4Loaded = true;
      console.log('GA4: Analytics loaded with user consent');
    };

    script.onerror = function() {
      console.error('GA4: Failed to load analytics script');
    };
  }

  // Hide banner with smooth transition (slide down + fade out)
  function hideBanner() {
    cookieBanner.classList.add('opacity-0', 'translate-y-full');
    // Set invisible after transition completes for accessibility
    setTimeout(function() {
      cookieBanner.classList.add('invisible');
      document.body.focus();
    }, 300);
  }

  // Show banner with smooth transition (slide up + fade in)
  function showBanner() {
    // Remove invisible first to allow transition
    cookieBanner.classList.remove('invisible');
    // Use requestAnimationFrame to ensure class removal is processed before removing opacity
    requestAnimationFrame(function() {
      cookieBanner.classList.remove('opacity-0', 'translate-y-full');
      // Focus first interactive element for accessibility
      const firstFocusable = cookieBanner.querySelector('a[href], button');
      if (firstFocusable) {
        firstFocusable.focus();
      }
    });
  }

  // Show banner if no consent recorded, otherwise apply stored preference
  function checkConsent() {
    const consent = getConsent();

    if (consent === null) {
      // No consent recorded, show banner
      showBanner();
    } else if (consent === 'accepted') {
      // User accepted, load analytics
      loadAnalytics();
    }
    // If rejected, consent mode stays denied (set in base.njk)
  }

  // Handle accept button
  acceptButton.addEventListener('click', function() {
    setConsent('accepted');
    hideBanner();
    loadAnalytics();
  });

  // Handle reject button
  rejectButton.addEventListener('click', function() {
    setConsent('rejected');
    updateConsentMode(false);
    hideBanner();
  });

  // Handle preferences button (for MVP, same as accept - full modal is Story 3.2)
  preferencesButton.addEventListener('click', function() {
    setConsent('accepted');
    hideBanner();
    loadAnalytics();
  });

  // Handle Cookie Settings footer link (re-opens banner to change preference)
  if (cookieSettingsLink) {
    cookieSettingsLink.addEventListener('click', function(e) {
      e.preventDefault();
      showBanner();
    });
  }

  // Focus trap for accessibility - keeps focus within banner when visible
  function setupFocusTrap() {
    const focusableElements = cookieBanner.querySelectorAll('button, a[href]');
    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];

    cookieBanner.addEventListener('keydown', function(e) {
      // Don't trap focus if banner is hidden (has invisible class)
      if (cookieBanner.classList.contains('invisible')) return;

      if (e.key === 'Tab') {
        if (e.shiftKey) {
          // Shift + Tab
          if (document.activeElement === firstFocusable) {
            e.preventDefault();
            lastFocusable.focus();
          }
        } else {
          // Tab
          if (document.activeElement === lastFocusable) {
            e.preventDefault();
            firstFocusable.focus();
          }
        }
      }
      // ESC does NOT dismiss - user must make explicit choice (AC6)
    });
  }

  // Initialize
  setupFocusTrap();
  checkConsent();
})();
