// Submission form client-side validation
(function() {
  const form = document.getElementById('submission-form');
  if (!form) return;

  // Validators return error message string if invalid, true if valid
  const validators = {
    name: (value) => value.trim().length > 0 || 'Name is required',
    email: (value) => {
      if (!value.trim()) return 'Email is required';
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || 'Please enter a valid email address';
    },
    style: (value) => value !== '' || 'Please select a design style',
    demoUrl: (value) => {
      if (!value.trim()) return 'Demo URL is required';
      return value.startsWith('https://') || 'Please enter a valid URL starting with https://';
    },
    screenshot: (value, input) => {
      if (!input || !input.files || input.files.length === 0) {
        return 'Screenshot is required';
      }
      const file = input.files[0];
      const allowedTypes = ['image/png', 'image/jpeg', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        return 'Please upload a JPG, PNG, or WebP image';
      }
      const maxSizeBytes = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSizeBytes) {
        return 'Screenshot must be less than 5MB';
      }
      return true;
    },
    authenticity: (value) => {
      if (!value.trim()) return 'Authenticity explanation is required';
      return value.trim().length >= 50 || 'Please provide at least 50 characters explaining your design';
    },
    consent: (value, input) => {
      return (input && input.checked) || 'You must consent to public display to submit';
    },
    marketing: () => true  // Optional field, no validation needed
  };

  /**
   * Show error for a field
   * @param {string} fieldName - The field name/id
   * @param {string} message - The error message to display
   */
  function showError(fieldName, message) {
    const input = document.getElementById(fieldName);
    const errorEl = document.getElementById(`${fieldName}-error`);

    if (input) {
      input.setAttribute('aria-invalid', 'true');
      input.classList.add('error');
      input.classList.remove('valid');
    }

    if (errorEl) {
      errorEl.textContent = message;
      errorEl.classList.remove('hidden');
    }
  }

  /**
   * Clear error for a field and optionally mark as valid
   * @param {string} fieldName - The field name/id
   * @param {boolean} markValid - Whether to add valid styling
   */
  function clearError(fieldName, markValid = false) {
    const input = document.getElementById(fieldName);
    const errorEl = document.getElementById(`${fieldName}-error`);

    if (input) {
      input.setAttribute('aria-invalid', 'false');
      input.classList.remove('error');
      if (markValid && input.classList.contains('form-input')) {
        input.classList.add('valid');
      }
    }

    if (errorEl) {
      errorEl.textContent = '';
      errorEl.classList.add('hidden');
    }
  }

  /**
   * Validate a single field
   * @param {string} fieldName - The field name/id
   * @param {boolean} applyValidStyle - Whether to apply valid styling on success
   * @returns {boolean} - True if valid, false if invalid
   */
  function validateField(fieldName, applyValidStyle = true) {
    const input = document.getElementById(fieldName);
    if (!input) return true;

    const validator = validators[fieldName];
    if (!validator) return true;

    const value = input.type === 'checkbox' ? '' : (input.value || '');
    const result = validator(value, input);

    if (result === true) {
      clearError(fieldName, applyValidStyle);
      return true;
    } else {
      showError(fieldName, result);
      return false;
    }
  }

  /**
   * Validate all form fields
   * @returns {string|null} - First invalid field name, or null if all valid
   */
  function validateForm() {
    const fields = ['name', 'email', 'style', 'demoUrl', 'screenshot', 'authenticity', 'consent'];
    let firstInvalidField = null;

    for (const field of fields) {
      const isValid = validateField(field);
      if (!isValid && !firstInvalidField) {
        firstInvalidField = field;
      }
    }

    return firstInvalidField;
  }

  // Add blur event listeners for real-time validation
  const textFields = ['name', 'email', 'style', 'demoUrl', 'authenticity'];
  textFields.forEach(fieldName => {
    const input = document.getElementById(fieldName);
    if (input) {
      input.addEventListener('blur', () => validateField(fieldName));
      // Also validate on input for better UX after first error
      input.addEventListener('input', () => {
        if (input.getAttribute('aria-invalid') === 'true') {
          validateField(fieldName);
        }
      });
    }
  });

  // Screenshot validation on change
  const screenshotInput = document.getElementById('screenshot');
  if (screenshotInput) {
    screenshotInput.addEventListener('change', () => validateField('screenshot'));
  }

  // Consent checkbox validation on change
  const consentInput = document.getElementById('consent');
  if (consentInput) {
    consentInput.addEventListener('change', () => validateField('consent'));
  }

  // Marketing checkbox change listener (for consistent UX, though always valid)
  const marketingInput = document.getElementById('marketing');
  if (marketingInput) {
    marketingInput.addEventListener('change', () => validateField('marketing'));
  }

  // Character counter for authenticity field
  const authenticityInput = document.getElementById('authenticity');
  const authenticityHelper = document.getElementById('authenticity-helper');
  if (authenticityInput && authenticityHelper) {
    const originalHelperText = authenticityHelper.textContent;

    function updateCharacterCount() {
      const length = authenticityInput.value.trim().length;
      const remaining = 50 - length;

      if (remaining > 0) {
        authenticityHelper.textContent = `${originalHelperText} (${remaining} more characters needed)`;
      } else {
        authenticityHelper.textContent = `${originalHelperText} (${length} characters)`;
      }
    }

    authenticityInput.addEventListener('input', updateCharacterCount);
    // Initial count
    updateCharacterCount();
  }

  // Expose validateForm globally for use in submit handler
  window.validateSubmissionForm = validateForm;
  window.showFormError = showError;
  window.clearFormError = clearError;
})();
