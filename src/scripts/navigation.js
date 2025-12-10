// Mobile menu toggle with focus trap
(function() {
  const mobileMenuButton = document.getElementById('mobile-menu-button');
  const mobileMenu = document.getElementById('mobile-menu');
  const menuIcon = document.getElementById('menu-icon');
  const closeIcon = document.getElementById('close-icon');

  if (!mobileMenuButton || !mobileMenu) return;

  // Helper to close menu and return focus
  function closeMenu() {
    mobileMenu.classList.add('hidden');
    mobileMenuButton.setAttribute('aria-expanded', 'false');
    menuIcon.classList.remove('hidden');
    closeIcon.classList.add('hidden');
    mobileMenuButton.focus();
  }

  // Helper to open menu and focus first link
  function openMenu() {
    mobileMenu.classList.remove('hidden');
    mobileMenuButton.setAttribute('aria-expanded', 'true');
    menuIcon.classList.add('hidden');
    closeIcon.classList.remove('hidden');
    const firstLink = mobileMenu.querySelector('a');
    if (firstLink) firstLink.focus();
  }

  mobileMenuButton.addEventListener('click', function() {
    const isExpanded = mobileMenuButton.getAttribute('aria-expanded') === 'true';
    if (isExpanded) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  // Close menu when clicking outside
  document.addEventListener('click', function(event) {
    const isClickInside = mobileMenuButton.contains(event.target) || mobileMenu.contains(event.target);
    const isExpanded = mobileMenuButton.getAttribute('aria-expanded') === 'true';

    if (!isClickInside && isExpanded) {
      closeMenu();
    }
  });

  // Close menu on escape key and handle focus trap
  document.addEventListener('keydown', function(event) {
    const isExpanded = mobileMenuButton.getAttribute('aria-expanded') === 'true';

    if (event.key === 'Escape' && isExpanded) {
      closeMenu();
      return;
    }

    // Focus trap: Tab within mobile menu (includes hamburger button)
    if (event.key === 'Tab' && isExpanded) {
      const menuFocusables = mobileMenu.querySelectorAll('a, button');
      const firstMenuFocusable = menuFocusables[0];
      const lastMenuFocusable = menuFocusables[menuFocusables.length - 1];

      // If on hamburger button, Tab goes to first menu item, Shift+Tab goes to last
      if (document.activeElement === mobileMenuButton) {
        event.preventDefault();
        if (event.shiftKey) {
          lastMenuFocusable.focus();
        } else {
          firstMenuFocusable.focus();
        }
      } else if (event.shiftKey && document.activeElement === firstMenuFocusable) {
        event.preventDefault();
        lastMenuFocusable.focus();
      } else if (!event.shiftKey && document.activeElement === lastMenuFocusable) {
        event.preventDefault();
        firstMenuFocusable.focus();
      }
    }
  });
})();
