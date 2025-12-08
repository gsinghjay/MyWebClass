/**
 * Gallery Filter Module
 * Implements client-side filtering of design style cards by category
 * Features: URL state sync, keyboard accessible, progressive enhancement
 */
(function() {
  'use strict';

  const QUERY_PARAM = 'category';

  // DOM references (captured once)
  let filterContainer;
  let galleryCards;
  let filterButtons;

  /**
   * Get initial filter from URL query parameter
   * @returns {string} Category slug or 'all'
   */
  function getInitialFilter() {
    const params = new URLSearchParams(window.location.search);
    return params.get(QUERY_PARAM) || 'all';
  }

  /**
   * Update URL with current filter state
   * @param {string} category - Category slug or 'all'
   */
  function updateUrl(category) {
    const url = new URL(window.location);
    if (category === 'all') {
      url.searchParams.delete(QUERY_PARAM);
    } else {
      url.searchParams.set(QUERY_PARAM, category);
    }
    window.history.pushState({ category }, '', url);
  }

  /**
   * Update filter button visual states
   * @param {string} activeCategory - Currently active category
   */
  function updateButtonStates(activeCategory) {
    filterButtons.forEach(btn => {
      const isActive = btn.dataset.filter === activeCategory;
      btn.setAttribute('aria-pressed', isActive);

      if (isActive) {
        btn.classList.remove('bg-white', 'text-black', 'hover:bg-neutral-100');
        btn.classList.add('bg-black', 'text-white');
      } else {
        btn.classList.remove('bg-black', 'text-white');
        btn.classList.add('bg-white', 'text-black', 'hover:bg-neutral-100');
      }
    });
  }

  /**
   * Apply filter to gallery cards
   * @param {string} category - Category slug or 'all'
   */
  function applyFilter(category) {
    let visibleCount = 0;

    galleryCards.forEach(card => {
      const cardCategory = card.dataset.category;
      const shouldShow = category === 'all' || cardCategory === category;

      if (shouldShow) {
        card.style.display = '';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });

    // Update button states
    updateButtonStates(category);

    // Update URL (without triggering page reload)
    updateUrl(category);

    // Announce to screen readers
    announceFilterResult(category, visibleCount);
  }

  /**
   * Announce filter result to screen readers
   * @param {string} category - Active category
   * @param {number} count - Number of visible items
   */
  function announceFilterResult(category, count) {
    // Find or create live region
    let liveRegion = document.getElementById('filter-announcement');
    if (!liveRegion) {
      liveRegion = document.createElement('div');
      liveRegion.id = 'filter-announcement';
      liveRegion.setAttribute('aria-live', 'polite');
      liveRegion.setAttribute('aria-atomic', 'true');
      liveRegion.className = 'sr-only';
      document.body.appendChild(liveRegion);
    }

    const categoryLabel = category === 'all' ? 'all styles' : category.replace(/-/g, ' ');
    liveRegion.textContent = `Showing ${count} ${count === 1 ? 'design' : 'designs'} for ${categoryLabel}`;
  }

  /**
   * Handle filter button click
   * @param {Event} event - Click event
   */
  function handleFilterClick(event) {
    const button = event.target.closest('.filter-btn');
    if (!button) return;

    const category = button.dataset.filter;
    applyFilter(category);
  }

  /**
   * Handle browser back/forward navigation
   * @param {PopStateEvent} event - PopState event
   */
  function handlePopState(event) {
    const category = event.state?.category || getInitialFilter();
    applyFilter(category);
  }

  /**
   * Initialize the gallery filter
   */
  function init() {
    // Get DOM elements
    filterContainer = document.getElementById('filter-buttons');
    galleryCards = document.querySelectorAll('.gallery-card[data-category]');

    // Early exit if no filter container (progressive enhancement)
    if (!filterContainer || galleryCards.length === 0) {
      return;
    }

    filterButtons = filterContainer.querySelectorAll('.filter-btn');

    // Attach event listeners
    filterContainer.addEventListener('click', handleFilterClick);
    window.addEventListener('popstate', handlePopState);

    // Apply initial filter from URL
    const initialCategory = getInitialFilter();
    if (initialCategory !== 'all') {
      applyFilter(initialCategory);
    }
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
