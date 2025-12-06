const form = document.getElementById('submission-form');
const successMessage = document.getElementById('success-message');
const submitButton = document.getElementById('submit-button');
const formMessage = document.getElementById('form-message');

function showError(fieldId, message) {
  const errorElement = document.getElementById(fieldId + '-error');
  if (errorElement) {
    errorElement.textContent = message;
  }
}

function clearErrors() {
  const errorElements = document.querySelectorAll('.form-error');
  errorElements.forEach(function(el) { el.textContent = ''; });
}

function validateForm(formData) {
  clearErrors();
  var isValid = true;

  if (!formData.name || formData.name.trim().length < 2) {
    showError('name', 'Please enter your name (at least 2 characters)');
    isValid = false;
  }

  var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!formData.email || !emailRegex.test(formData.email)) {
    showError('email', 'Please enter a valid email address');
    isValid = false;
  }

  if (!formData.styleName || formData.styleName.trim().length < 3) {
    showError('style-name', 'Please enter the design style name');
    isValid = false;
  }

  var urlRegex = /^https?:\/\/.+/;
  if (!formData.demoUrl || !urlRegex.test(formData.demoUrl)) {
    showError('demo-url', 'Please enter a valid URL (must start with http:// or https://)');
    isValid = false;
  }

  if (formData.screenshotUrl && !urlRegex.test(formData.screenshotUrl)) {
    showError('screenshot-url', 'Please enter a valid URL or leave this field empty');
    isValid = false;
  }

  if (!formData.explanation || formData.explanation.trim().length < 100) {
    showError('explanation', 'Please provide at least 100 characters explaining your design');
    isValid = false;
  }

  if (formData.explanation && formData.explanation.trim().length > 2000) {
    showError('explanation', 'Explanation is too long (maximum 2000 characters)');
    isValid = false;
  }

  if (!formData.privacyConsent) {
    showError('privacy', 'You must agree to the terms to submit');
    isValid = false;
  }

  return isValid;
}

function handleSubmit(e) {
  e.preventDefault();

  var formData = {
    name: document.getElementById('name').value,
    email: document.getElementById('email').value,
    styleName: document.getElementById('style-name').value,
    demoUrl: document.getElementById('demo-url').value,
    screenshotUrl: document.getElementById('screenshot-url').value,
    explanation: document.getElementById('explanation').value,
    privacyConsent: document.getElementById('privacy-consent').checked
  };

  if (!validateForm(formData)) {
    return;
  }

  submitButton.disabled = true;
  submitButton.textContent = 'Submitting...';
  formMessage.textContent = '';
  formMessage.className = '';

  try {
    console.log('Form submission data:', formData);
    form.classList.add('hidden');
    successMessage.classList.remove('hidden');
  } catch (error) {
    console.error('Submission error:', error);

    formMessage.textContent = 'An error occurred. Please email your submission to hello@mywebclass.org';
    formMessage.style.color = 'var(--color-red)';
    formMessage.style.padding = 'var(--spacing-md)';
    formMessage.style.border = '2px solid var(--color-red)';
    formMessage.style.marginTop = 'var(--spacing-md)';

    submitButton.disabled = false;
    submitButton.textContent = 'Submit Design';
  }
}

if (form) {
  form.addEventListener('submit', handleSubmit);
}

var inputs = form && form.querySelectorAll('input, textarea');
if (inputs) {
  inputs.forEach(function(input) {
    input.addEventListener('blur', function() {
      var fieldId = input.id;
      var errorElement = document.getElementById(fieldId + '-error');
      if (errorElement && errorElement.textContent) {
        errorElement.textContent = '';
      }
    });
  });
}
