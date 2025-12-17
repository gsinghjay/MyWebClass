// Cookie Consent Management with GA4 Consent Mode v2
(function() {
  const CONSENT_KEY = 'cookie_consent';
  const GA4_MEASUREMENT_ID = window.GA4_MEASUREMENT_ID || null;
  const cookieBanner = document.getElementById('cookie-banner');
  const acceptButton = document.getElementById('cookie-accept');
  const rejectButton = document.getElementById('cookie-reject');
  const preferencesButton = document.getElementById('cookie-preferences');
  const cookieSettingsLink = document.getElementById('cookie-settings-link');

  // Modal elements
  const cookieModal = document.getElementById('cookie-modal');
  const modalBackdrop = document.getElementById('cookie-modal-backdrop');
  const analyticsToggle = document.getElementById('analytics-toggle');
  const analyticsStatus = document.getElementById('analytics-status');
  const cookieStatusText = document.getElementById('cookie-status-text');
  const modalSaveButton = document.getElementById('cookie-modal-save');
  const modalCancelButton = document.getElementById('cookie-modal-cancel');
  const cookiePolicyLink = document.getElementById('cookie-policy-link');
  const cookieToast = document.getElementById('cookie-toast');

  // Track if GA4 has been loaded this session
  let ga4Loaded = false;

  // Track modal trigger element for focus return
  let modalTrigger = null;

  if (!cookieBanner) return;

  // ============================================
  // Preferences Storage (JSON format with migration)
  // ============================================

  // Set preferences as JSON object
  function setPreferences(prefs) {
    try {
      localStorage.setItem(CONSENT_KEY, JSON.stringify(prefs));
      return true;
    } catch (e) {
      console.error('Could not save cookie preferences:', e);
      return false;
    }
  }

  // Get preferences (handles migration from legacy string format)
  function getPreferences() {
    try {
      const stored = localStorage.getItem(CONSENT_KEY);
      if (!stored) return null;

      // Try to parse as JSON (new format)
      try {
        return JSON.parse(stored);
      } catch {
        // Legacy string format - migrate AND persist
        let migrated = null;
        if (stored === 'accepted') {
          migrated = { analytics: true, marketing: false };
        } else if (stored === 'rejected') {
          migrated = { analytics: false, marketing: false };
        }
        if (migrated) {
          // Persist migration to avoid re-migrating on every page load
          setPreferences(migrated);
        }
        return migrated;
      }
    } catch (e) {
      return null;
    }
  }

  // Legacy getter for backward compatibility
  function getConsent() {
    const prefs = getPreferences();
    if (!prefs) return null;
    return prefs.analytics ? 'accepted' : 'rejected';
  }

  // Legacy setter for backward compatibility (Accept All / Reject All buttons)
  function setConsent(value) {
    if (value === 'accepted') {
      return setPreferences({ analytics: true, marketing: false });
    } else if (value === 'rejected') {
      return setPreferences({ analytics: false, marketing: false });
    }
    return false;
  }

  // ============================================
  // GA4 Consent Mode
  // ============================================

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
    };

    script.onerror = function() {
      console.error('GA4: Failed to load analytics script');
    };
  }

  // ============================================
  // Banner Show/Hide
  // ============================================

  // Hide banner with smooth transition (slide down + fade out)
  function hideBanner() {
    cookieBanner.classList.add('opacity-0', 'translate-y-full');
    // Set invisible after transition completes for accessibility
    setTimeout(function() {
      cookieBanner.classList.add('invisible');
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

  // ============================================
  // Modal Show/Hide
  // ============================================

  // Update toggle visual state
  function updateToggleState(isEnabled) {
    if (analyticsToggle) {
      analyticsToggle.setAttribute('aria-checked', isEnabled ? 'true' : 'false');
    }
    if (analyticsStatus) {
      analyticsStatus.textContent = isEnabled ? 'Enabled' : 'Disabled';
    }
  }

  // Update status text display
  function updateStatusText() {
    if (!cookieStatusText) return;
    const prefs = getPreferences();
    if (!prefs) {
      cookieStatusText.textContent = 'Not set';
    } else if (prefs.analytics) {
      cookieStatusText.textContent = 'Accepted';
    } else {
      cookieStatusText.textContent = 'Rejected';
    }
  }

  // Show modal with smooth transition
  function showModal(triggerElement) {
    if (!cookieModal) return;

    modalTrigger = triggerElement;
    document.body.style.overflow = 'hidden'; // Prevent body scroll

    // Remove invisible first to allow transition
    cookieModal.classList.remove('invisible');

    // Set toggle states from current preferences
    const prefs = getPreferences();
    const isAnalyticsEnabled = prefs ? prefs.analytics : false;
    updateToggleState(isAnalyticsEnabled);
    updateStatusText();

    // Use requestAnimationFrame to ensure class removal is processed before adding opacity
    requestAnimationFrame(function() {
      cookieModal.classList.remove('opacity-0');
      // Focus first interactive element (analytics toggle)
      if (analyticsToggle) {
        analyticsToggle.focus();
      }
    });
  }

  // Hide modal with smooth transition
  function hideModal() {
    if (!cookieModal) return;

    document.body.style.overflow = ''; // Restore body scroll

    // Add opacity for fade out transition
    cookieModal.classList.add('opacity-0');

    // Set invisible after transition completes for accessibility
    setTimeout(function() {
      cookieModal.classList.add('invisible');

      // Return focus to trigger element (AC7)
      if (modalTrigger) {
        modalTrigger.focus();
        modalTrigger = null;
      }
    }, 300);
  }

  // ============================================
  // Toast Notification
  // ============================================

  function showToast() {
    if (!cookieToast) return;

    // Show toast
    cookieToast.classList.remove('invisible', 'opacity-0', 'translate-y-4');

    // Hide after 3 seconds
    setTimeout(function() {
      cookieToast.classList.add('opacity-0', 'translate-y-4');
      setTimeout(function() {
        cookieToast.classList.add('invisible');
      }, 300);
    }, 3000);
  }

  // ============================================
  // Modal Focus Trap
  // ============================================

  function setupModalFocusTrap() {
    if (!cookieModal) return;

    cookieModal.addEventListener('keydown', function(e) {
      // Don't trap focus if modal is hidden (invisible)
      if (cookieModal.classList.contains('invisible')) return;

      // ESC closes modal (AC5, AC7)
      if (e.key === 'Escape') {
        e.preventDefault();
        hideModal();
        return;
      }

      // Focus trap
      if (e.key === 'Tab') {
        const focusableElements = cookieModal.querySelectorAll(
          'button:not([disabled]), a[href]'
        );
        const firstFocusable = focusableElements[0];
        const lastFocusable = focusableElements[focusableElements.length - 1];

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
    });
  }

  // ============================================
  // Banner Focus Trap
  // ============================================

  function setupBannerFocusTrap() {
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
      // ESC does NOT dismiss banner - user must make explicit choice (AC6 from Story 3.1)
    });
  }

  // ============================================
  // Event Handlers
  // ============================================

  // Toggle click handler
  if (analyticsToggle) {
    analyticsToggle.addEventListener('click', function() {
      const isChecked = this.getAttribute('aria-checked') === 'true';
      updateToggleState(!isChecked);
    });

    // Keyboard support for toggle (Space/Enter)
    analyticsToggle.addEventListener('keydown', function(e) {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        this.click();
      }
    });
  }

  // Save button
  if (modalSaveButton) {
    modalSaveButton.addEventListener('click', function() {
      const isAnalyticsEnabled = analyticsToggle &&
        analyticsToggle.getAttribute('aria-checked') === 'true';

      // Save preferences
      setPreferences({ analytics: isAnalyticsEnabled, marketing: false });

      // Update GA4 consent
      if (isAnalyticsEnabled) {
        loadAnalytics();
      } else {
        updateConsentMode(false);
      }

      hideModal();
      showToast();
    });
  }

  // Cancel button
  if (modalCancelButton) {
    modalCancelButton.addEventListener('click', function() {
      hideModal();
    });
  }

  // Backdrop click closes modal
  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', function() {
      hideModal();
    });
  }

  // Handle accept button (banner)
  acceptButton.addEventListener('click', function() {
    setConsent('accepted');
    hideBanner();
    loadAnalytics();
  });

  // Handle reject button (banner)
  rejectButton.addEventListener('click', function() {
    setConsent('rejected');
    updateConsentMode(false);
    hideBanner();
  });

  // Handle preferences button - opens modal (Story 3.2 change)
  preferencesButton.addEventListener('click', function() {
    hideBanner();
    showModal(this);
  });

  // Handle Cookie Settings footer link - opens modal (Story 3.2 change)
  if (cookieSettingsLink) {
    cookieSettingsLink.addEventListener('click', function(e) {
      e.preventDefault();
      showModal(this);
    });
  }

  // ============================================
  // Initialization
  // ============================================

  // Check consent on page load
  function checkConsent() {
    const prefs = getPreferences();

    if (prefs === null) {
      // No consent recorded, show banner
      showBanner();
    } else if (prefs.analytics) {
      // User accepted analytics, load them
      loadAnalytics();
    }
    // If rejected, consent mode stays denied (set in base.njk)
  }

  // Initialize
  setupBannerFocusTrap();
  setupModalFocusTrap();
  checkConsent();
})();
