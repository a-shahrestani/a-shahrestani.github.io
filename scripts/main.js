const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Mobile navigation toggle
const navToggle = document.querySelector('.nav__toggle');
const navLinks = document.querySelector('.nav__links');

if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', !isExpanded);
    navLinks.classList.toggle('active');
  });
  
  // Close menu when clicking a link
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navToggle.setAttribute('aria-expanded', 'false');
      navLinks.classList.remove('active');
    });
  });
  
  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!navToggle.contains(e.target) && !navLinks.contains(e.target)) {
      navToggle.setAttribute('aria-expanded', 'false');
      navLinks.classList.remove('active');
    }
  });
}

// Full-screen section switching
const sections = document.querySelectorAll('section[id]');
const sidebarLinks = document.querySelectorAll('.sidebar__link');
let isScrolling = false;
let currentSectionIndex = 0;

// Debug: Check if sidebar links exist
if (sidebarLinks.length === 0) {
  console.warn('No sidebar links found');
}

// Get section order
const sectionIds = Array.from(sections).map(s => s.id);

function resetExpandedStates() {
  // Reset all expandable items
  const timelineItems = document.querySelectorAll('.timeline__item[aria-expanded="true"]');
  timelineItems.forEach(item => {
    item.setAttribute('aria-expanded', 'false');
    const header = item.querySelector('.timeline__header');
    if (header) header.setAttribute('aria-expanded', 'false');
  });

  const skillCards = document.querySelectorAll('.skill-card[aria-expanded="true"]');
  skillCards.forEach(card => {
    card.setAttribute('aria-expanded', 'false');
    const header = card.querySelector('.skill-card__header');
    if (header) header.setAttribute('aria-expanded', 'false');
  });

  // Hide "Load more" expanded items
  const hiddenItems = document.querySelectorAll('.timeline__item--hidden');
  hiddenItems.forEach(item => {
    item.style.display = 'none';
  });

  // Reset load more/less buttons
  const loadMoreBtn = document.getElementById('load-more-experience');
  const loadLessBtn = document.getElementById('load-less-experience');
  if (loadMoreBtn) loadMoreBtn.style.display = 'inline-flex';
  if (loadLessBtn) loadLessBtn.style.display = 'none';

  // Reset expand/collapse all buttons
  const expandAllExp = document.getElementById('expand-all-experience');
  const collapseAllExp = document.getElementById('collapse-all-experience');
  if (expandAllExp) expandAllExp.style.display = 'inline-flex';
  if (collapseAllExp) collapseAllExp.style.display = 'none';
  
  // Reset skills view to summary
  const skillsSummary = document.querySelector('.skills__summary');
  if (skillsSummary) skillsSummary.style.display = 'grid';
}

function showSection(sectionId, scrollToTop = true) {
  // Reset expanded states when switching sections
  resetExpandedStates();
  
  // Hide all sections
  sections.forEach(section => {
    section.classList.remove('active');
    // Scroll section content to top
    section.scrollTop = 0;
  });
  
  // Show target section
  const targetSection = document.getElementById(sectionId);
  if (targetSection) {
    targetSection.classList.add('active');
    // Update current section index
    currentSectionIndex = sectionIds.indexOf(sectionId);
    // Scroll to top if needed
    if (scrollToTop) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }
  
  // Update active sidebar link
  sidebarLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${sectionId}`) {
      link.classList.add('active');
    }
  });
}

// Scroll-based navigation - requires 2 scrolls to switch sections
// Only enable on desktop (above 1200px)
let scrollTimeout;
let scrollCount = 0;
let lastScrollDirection = 0;
let scrollResetTimeout;

function isDesktop() {
  return window.innerWidth > 1200;
}

function isMobile() {
  return window.innerWidth <= 1024;
}

window.addEventListener('wheel', (e) => {
  // Only enable section switching on desktop
  if (!isDesktop()) return;
  
  if (isScrolling) return;
  
  const activeSection = document.querySelector('.section.active');
  if (!activeSection) return;
  
  const sectionScrollTop = activeSection.scrollTop;
  const sectionHeight = activeSection.clientHeight;
  const sectionScrollHeight = activeSection.scrollHeight;
  
  // Reset scroll count if direction changes or timeout
  clearTimeout(scrollResetTimeout);
  if ((e.deltaY > 0 && lastScrollDirection < 0) || (e.deltaY < 0 && lastScrollDirection > 0)) {
    scrollCount = 0;
  }
  lastScrollDirection = e.deltaY;
  
  // Reset scroll count after 500ms of no scrolling
  scrollResetTimeout = setTimeout(() => {
    scrollCount = 0;
  }, 500);
  
  // Check if at top and scrolling up
  if (sectionScrollTop === 0 && e.deltaY < 0 && currentSectionIndex > 0) {
    scrollCount++;
    if (scrollCount >= 2) {
      e.preventDefault();
      isScrolling = true;
      scrollCount = 0;
      const prevSectionId = sectionIds[currentSectionIndex - 1];
      showSection(prevSectionId, false);
      setTimeout(() => {
        const prevSection = document.getElementById(prevSectionId);
        if (prevSection) {
          prevSection.scrollTop = prevSection.scrollHeight;
        }
        isScrolling = false;
      }, 100);
    }
  }
  // Check if at bottom and scrolling down
  else if (sectionScrollTop + sectionHeight >= sectionScrollHeight - 10 && e.deltaY > 0 && currentSectionIndex < sectionIds.length - 1) {
    scrollCount++;
    if (scrollCount >= 2) {
      e.preventDefault();
      isScrolling = true;
      scrollCount = 0;
      const nextSectionId = sectionIds[currentSectionIndex + 1];
      showSection(nextSectionId, false);
      setTimeout(() => {
        isScrolling = false;
      }, 100);
    }
  } else {
    // Reset count if not at edge
    scrollCount = 0;
  }
  
  clearTimeout(scrollTimeout);
  scrollTimeout = setTimeout(() => {
    isScrolling = false;
  }, 1000);
}, { passive: false });

// Get current page type
const currentPage = document.body.getAttribute('data-page');

// Initialize: Check for hash in URL, otherwise show hero section
// Only use section switching on desktop
const initialHash = window.location.hash;
if (isDesktop()) {
  if (initialHash && initialHash.length > 1) {
    const targetSectionId = initialHash.substring(1);
    // Check if this section exists on the page
    const targetSection = document.getElementById(targetSectionId);
    if (targetSection) {
      showSection(targetSectionId);
    } else {
      showSection('hero');
    }
  } else {
    showSection('hero');
  }
} else {
  // On mobile, show all sections
  sections.forEach(section => {
    section.classList.add('active');
  });
  
  // If there's a hash, scroll to it
  if (initialHash && initialHash.length > 1) {
    setTimeout(() => {
      const targetElement = document.querySelector(initialHash);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  }
}

// Sidebar link clicks - use event delegation to ensure it works
document.addEventListener('click', (e) => {
  // Check if clicking on expand icon
  const expandIcon = e.target.closest('.sidebar__expand');
  if (expandIcon) {
    e.preventDefault();
    e.stopPropagation();
    const sidebarGroup = expandIcon.closest('.sidebar__group');
    const parentLink = expandIcon.closest('.sidebar__link--parent');
    if (sidebarGroup && parentLink) {
      sidebarGroup.classList.toggle('expanded');
      parentLink.classList.toggle('expanded');
    }
    return;
  }
  
  const sidebarLink = e.target.closest('.sidebar__link');
  if (!sidebarLink) return;
  
  e.preventDefault();
  
  // Handle parent links with children - toggle expand AND navigate
  if (sidebarLink.classList.contains('sidebar__link--parent')) {
    const sidebarGroup = sidebarLink.closest('.sidebar__group');
    if (sidebarGroup) {
      sidebarGroup.classList.toggle('expanded');
      sidebarLink.classList.toggle('expanded');
    }
  }
  
  const targetId = sidebarLink.getAttribute('href');
  if (targetId && targetId.startsWith('#')) {
    const sectionId = targetId.substring(1);
    
    // Handle child links - navigate to projects section and scroll to project
    if (sidebarLink.classList.contains('sidebar__link--child')) {
      // Expand parent group if not already expanded
      const sidebarGroup = sidebarLink.closest('.sidebar__group');
      if (sidebarGroup && !sidebarGroup.classList.contains('expanded')) {
        sidebarGroup.classList.add('expanded');
        const parentLink = sidebarGroup.querySelector('.sidebar__link--parent');
        if (parentLink) parentLink.classList.add('expanded');
      }
      
      // Navigate to projects section first
      if (isDesktop()) {
        showSection('projects', false);
      }
      
      // Then scroll to the specific project
      setTimeout(() => {
        const targetElement = document.getElementById(sectionId);
        const projectsSection = document.getElementById('projects');
        if (targetElement && projectsSection) {
          const elementTop = targetElement.offsetTop - projectsSection.offsetTop;
          projectsSection.scrollTo({
            top: elementTop - 40,
            behavior: 'smooth'
          });
        }
      }, 300);
    } else {
      // Regular navigation
      if (isDesktop()) {
        showSection(sectionId);
      }
    }
  }
});

// Active sidebar link is now handled by showSection function for all pages

// Prevent default scroll behavior for anchor links on desktop
const allAnchorLinks = document.querySelectorAll('a[href^="#"]');
allAnchorLinks.forEach(link => {
  link.addEventListener('click', evt => {
    const targetId = link.getAttribute('href');
    if (targetId && targetId.startsWith('#')) {
      evt.preventDefault();
      const sectionId = targetId.substring(1);
      
      if (isDesktop()) {
        showSection(sectionId);
      } else {
        // On mobile, scroll to the section with minimal offset
        const targetElement = document.getElementById(sectionId);
        if (targetElement) {
          const navHeight = 70; // Account for fixed nav height
          const elementPosition = targetElement.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - navHeight;
          
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }
    }
  });
});

// Expand/Collapse functionality for timeline
function initExpandable(containerSelector, itemSelector, headerSelector) {
  const container = document.querySelector(containerSelector);
  if (!container) return null;

  const items = container.querySelectorAll(itemSelector);
  const headers = container.querySelectorAll(headerSelector);

  headers.forEach(header => {
    header.addEventListener('click', (e) => {
      e.stopPropagation();
      const item = header.closest(itemSelector);
      if (!item) return;
      
      const isExpanded = item.getAttribute('aria-expanded') === 'true';
      
      item.setAttribute('aria-expanded', !isExpanded);
      header.setAttribute('aria-expanded', !isExpanded);
    });
  });

  return {
    expandAll: () => {
      items.forEach(item => {
        item.setAttribute('aria-expanded', 'true');
        const header = item.querySelector(headerSelector);
        if (header) header.setAttribute('aria-expanded', 'true');
      });
    },
    collapseAll: () => {
      items.forEach(item => {
        item.setAttribute('aria-expanded', 'false');
        const header = item.querySelector(headerSelector);
        if (header) header.setAttribute('aria-expanded', 'false');
      });
    }
  };
}

// Initialize timeline expandable
const experienceControls = initExpandable('.timeline', '.timeline__item', '.timeline__header');

// Expand/Collapse all buttons
const expandAllExp = document.getElementById('expand-all-experience');
const collapseAllExp = document.getElementById('collapse-all-experience');
const expandAllSkills = document.getElementById('expand-all-skills');
const collapseAllSkills = document.getElementById('collapse-all-skills');

if (expandAllExp && experienceControls) {
  expandAllExp.addEventListener('click', () => {
    experienceControls.expandAll();
    expandAllExp.style.display = 'none';
    collapseAllExp.style.display = 'inline-flex';
  });
}

if (collapseAllExp && experienceControls) {
  collapseAllExp.addEventListener('click', () => {
    experienceControls.collapseAll();
    expandAllExp.style.display = 'inline-flex';
    collapseAllExp.style.display = 'none';
  });
}

if (expandAllSkills && skillsControls) {
  expandAllSkills.addEventListener('click', () => {
    skillsControls.expandAll();
    expandAllSkills.style.display = 'none';
    collapseAllSkills.style.display = 'inline-flex';
  });
}

if (collapseAllSkills && skillsControls) {
  collapseAllSkills.addEventListener('click', () => {
    skillsControls.collapseAll();
    expandAllSkills.style.display = 'inline-flex';
    collapseAllSkills.style.display = 'none';
  });
}

// ScrollReveal animations removed - using full-screen section switching instead

// Tilt on project thumbs
if (window.VanillaTilt) {
  VanillaTilt.init(document.querySelectorAll('.project__thumb'), { max: 12, speed: 400, glare: true, 'max-glare': 0.2 });
}


// Load more/less experience
const loadMoreBtn = document.getElementById('load-more-experience');
const loadLessBtn = document.getElementById('load-less-experience');
const hiddenItems = document.querySelectorAll('.timeline__item--hidden');

if (loadMoreBtn && hiddenItems.length > 0) {
  loadMoreBtn.addEventListener('click', () => {
    hiddenItems.forEach((item, index) => {
      setTimeout(() => {
        item.removeAttribute('style');
        item.style.display = 'block';
        item.style.opacity = '0';
        // Trigger animation
        requestAnimationFrame(() => {
          item.style.opacity = '1';
        });
      }, index * 50);
    });
    setTimeout(() => {
      loadMoreBtn.style.display = 'none';
      if (loadLessBtn) loadLessBtn.style.display = 'inline-flex';
    }, hiddenItems.length * 50);
  });
}

if (loadLessBtn && hiddenItems.length > 0) {
  loadLessBtn.addEventListener('click', () => {
    hiddenItems.forEach((item, index) => {
      setTimeout(() => {
        item.style.opacity = '0';
        setTimeout(() => {
          item.style.display = 'none';
        }, 200);
      }, index * 30);
    });
    setTimeout(() => {
      loadLessBtn.style.display = 'none';
      if (loadMoreBtn) loadMoreBtn.style.display = 'inline-flex';
      // Scroll to experience section
      const experienceSection = document.getElementById('experience');
      if (experienceSection) {
        const offset = 80;
        const elementPosition = experienceSection.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    }, hiddenItems.length * 30 + 200);
  });
}
