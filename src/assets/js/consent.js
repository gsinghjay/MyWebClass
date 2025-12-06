/**
 * Cookie Consent Management
 * Handles cookie consent banner, preferences modal, and localStorage persistence
 */

const CookieConsent = {
  CONSENT_KEY: 'cookie-consent',
  ANALYTICS_KEY: 'analytics-consent',

  /**
   * Show the consent banner
   */
  showBanner() {
    const banner = document.getElementById('cookie-consent');
    if (banner) {
      banner.classList.add('visible');
      banner.setAttribute('aria-hidden', 'false');
    }
  },

  /**
   * Hide the consent banner
   */
  hideBanner() {
    const banner = document.getElementById('cookie-consent');
    if (banner) {
      banner.classList.remove('visible');
      banner.setAttribute('aria-hidden', 'true');
    }
  },

  /**
   * Show the preferences modal
   */
  showPreferencesModal() {
    const modal = document.getElementById('cookie-preferences-modal');
    if (modal) {
      modal.classList.add('visible');
      modal.setAttribute('aria-hidden', 'false');

      // Set checkbox to current preference
      const analyticsCheckbox = document.getElementById('analytics-consent');
      if (analyticsCheckbox) {
        analyticsCheckbox.checked = localStorage.getItem(this.ANALYTICS_KEY) === 'true';
      }
    }
  },

  /**
   * Hide the preferences modal
   */
  hidePreferencesModal() {
    const modal = document.getElementById('cookie-preferences-modal');
    if (modal) {
      modal.classList.remove('visible');
      modal.setAttribute('aria-hidden', 'true');
    }
  },

  /**
   * Accept all cookies
   */
  acceptAll() {
    localStorage.setItem(this.CONSENT_KEY, 'accepted');
    localStorage.setItem(this.ANALYTICS_KEY, 'true');
    this.hideBanner();
    window.dispatchEvent(new CustomEvent('consent-changed', { detail: { analytics: true } }));
  },

  /**
   * Reject all cookies
   */
  rejectAll() {
    localStorage.setItem(this.CONSENT_KEY, 'rejected');
    localStorage.setItem(this.ANALYTICS_KEY, 'false');
    this.hideBanner();
    window.dispatchEvent(new CustomEvent('consent-changed', { detail: { analytics: false } }));
  },

  /**
   * Save custom preferences
   */
  savePreferences() {
    const analyticsCheckbox = document.getElementById('analytics-consent');
    const analyticsConsent = analyticsCheckbox?.checked || false;

    localStorage.setItem(this.CONSENT_KEY, 'custom');
    localStorage.setItem(this.ANALYTICS_KEY, analyticsConsent.toString());

    this.hidePreferencesModal();
    this.hideBanner();

    window.dispatchEvent(new CustomEvent('consent-changed', { detail: { analytics: analyticsConsent } }));
  },

  /**
   * Initialize consent management
   */
  init() {
    const consentStatus = localStorage.getItem(this.CONSENT_KEY);

    // Show banner if no consent decision has been made
    if (!consentStatus) {
      setTimeout(() => this.showBanner(), 1000);
    }

    // Bind event listeners
    const acceptBtn = document.getElementById('accept-cookies');
    const rejectBtn = document.getElementById('reject-cookies');
    const preferencesBtn = document.getElementById('cookie-preferences');
    const savePreferencesBtn = document.getElementById('save-preferences');
    const closePreferencesBtn = document.getElementById('close-preferences');
    const manageConsentBtn = document.getElementById('manage-consent');

    if (acceptBtn) {
      acceptBtn.addEventListener('click', () => this.acceptAll());
    }

    if (rejectBtn) {
      rejectBtn.addEventListener('click', () => this.rejectAll());
    }

    if (preferencesBtn) {
      preferencesBtn.addEventListener('click', () => {
        this.hideBanner();
        this.showPreferencesModal();
      });
    }

    if (savePreferencesBtn) {
      savePreferencesBtn.addEventListener('click', () => this.savePreferences());
    }

    if (closePreferencesBtn) {
      closePreferencesBtn.addEventListener('click', () => this.hidePreferencesModal());
    }

    if (manageConsentBtn) {
      manageConsentBtn.addEventListener('click', () => this.showPreferencesModal());
    }

    // Close modal when clicking outside
    const modal = document.getElementById('cookie-preferences-modal');
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          this.hidePreferencesModal();
        }
      });
    }
  }
};

// Initialize on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => CookieConsent.init());
} else {
  CookieConsent.init();
}
