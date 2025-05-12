import { useEffect, useState, useCallback } from "react";
// Custom hook to manage sidebar state and logic
export function useSidebar() {
  const [isMobileView, setIsMobileView] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // Function to close the sidebar (used by overlay and outside clicks)
  const closeSidebar = useCallback(() => {
    const toggleBtn = document.querySelector(".toggle-sidebar") as HTMLElement;
    if (toggleBtn) {
      // Manually trigger a click event to ensure proper behavior
      const clickEvent = new MouseEvent("click", {
        bubbles: true,
        cancelable: true,
        view: window,
      });
      toggleBtn.dispatchEvent(clickEvent);
    }
  }, []);

  // Function to close sidebar when navigating on mobile
  const closeSidebarOnNavigation = useCallback(() => {
    const viewportWidth = getViewportWidth();
    const isMobile = viewportWidth < breakpoints.md;
    if (isMobile) {
      closeSidebar();
    }
  }, [closeSidebar]);

  useEffect(() => {
    // Check viewport size and update state
    const checkViewport = () => {
      const viewportWidth = getViewportWidth();
      const isMobile = viewportWidth < breakpoints.md;
      setIsMobileView(isMobile);
      updateOverlayVisibility(isMobile, isOpen);
    };

    // Function to update overlay visibility
    const updateOverlayVisibility = (
      isMobile: boolean,
      sidebarOpen: boolean
    ) => {
      const overlay = document.getElementById("sidebar-overlay");
      if (overlay) {
        if (isMobile && sidebarOpen) {
          overlay.classList.remove("hidden");
        } else {
          overlay.classList.add("hidden");
        }
      }
    };

    // Check initially and on resize
    checkViewport();
    window.addEventListener("resize", checkViewport);

    // Function to check if sidebar is open by examining transform style
    const checkSidebarState = () => {
      const sidebar = document.getElementById("sidebar");
      if (sidebar) {
        const style = window.getComputedStyle(sidebar);
        const transform = style.getPropertyValue("transform");
        const matrix = transform.match(/matrix\(.*\)/);
        let sidebarOpen = false;
        if (matrix === null || transform === "none") {
          sidebarOpen = !isMobileView;
        } else {
          sidebarOpen =
            !transform.includes("matrix") || !transform.includes("-");
        }
        setIsOpen(sidebarOpen);
        updateOverlayVisibility(isMobileView, sidebarOpen);
      }
    };

    // Handle direct clicks on the overlay
    const setupOverlayClickHandler = () => {
      const overlay = document.getElementById("sidebar-overlay");
      if (overlay) {
        // Remove existing event listeners by cloning and replacing
        const newOverlay = overlay.cloneNode(true);
        if (overlay.parentNode) {
          overlay.parentNode.replaceChild(newOverlay, overlay);
        }
        document
          .getElementById("sidebar-overlay")
          ?.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();
            closeSidebar();
          });
      }
    };

    // Setup overlay click handler initially and whenever dependencies change
    setupOverlayClickHandler();

    // Handle clicks outside the sidebar to close it on mobile
    const handleOutsideClick = (event: MouseEvent) => {
      const sidebar = document.getElementById("sidebar");
      const overlay = document.getElementById("sidebar-overlay");
      if (!sidebar) return;
      if (!isMobileView || !isOpen) return;
      const target = event.target as Node;
      const isToggleButton = (target as HTMLElement).closest(".toggle-sidebar");
      const isOverlay = overlay && overlay.contains(target);
      if (!sidebar.contains(target) && !isToggleButton && !isOverlay) {
        closeSidebar();
      }
    };
    document.addEventListener("click", handleOutsideClick);
    setTimeout(checkSidebarState, 100);

    // Use MutationObserver to detect sidebar class changes
    const sidebar = document.getElementById("sidebar");
    let observer: MutationObserver | null = null;
    if (sidebar) {
      observer = new MutationObserver(checkSidebarState);
      observer.observe(sidebar, {
        attributes: true,
        attributeFilter: ["class", "style"],
      });
    }
    return () => {
      window.removeEventListener("resize", checkViewport);
      document.removeEventListener("click", handleOutsideClick);
      const overlay = document.getElementById("sidebar-overlay");
      if (overlay) {
        const newOverlay = overlay.cloneNode(true);
        if (overlay.parentNode) {
          overlay.parentNode.replaceChild(newOverlay, overlay);
        }
      }
      if (observer) {
        observer.disconnect();
      }
    };
  }, [isMobileView, isOpen, closeSidebar]);

  return { closeSidebar, closeSidebarOnNavigation };
}

/**
 * Sidebar utility functions for managing sidebar state
 */
import { getViewportWidth, breakpoints } from "./responsive";

/**
 * Type definition for sidebar state
 */
export interface SidebarState {
  isOpen: boolean;
  isMobileView: boolean;
}

/**
 * CSS class mapping for sidebar states
 */
const SIDEBAR_CLASSES = {
  mobile: {
    open: "translate-x-0",
    closed: "-translate-x-full",
  },
  desktop: {
    sidebar: {
      open: "md:w-[16rem]",
      closed: "md:w-16",
    },
    content: {
      open: "md:ml-64",
      closed: "md:ml-16",
    },
  },
  text: "md:hidden", // Class to hide/show text elements
  overlay: "hidden", // Class to hide/show overlay
  activeIcon: "text-[var(--accent-color)]", // Class for active link icon
};

/**
 * Apply classes to elements based on sidebar state
 * @param elements - The DOM elements
 * @param isMobile - Whether it's mobile view
 * @param isOpen - Whether sidebar is open
 */
const applySidebarClasses = (
  elements: {
    sidebar: HTMLElement | null;
    content: HTMLElement | null;
    overlay: HTMLElement | null;
    spans: NodeListOf<HTMLElement> | null;
  },
  isMobile: boolean,
  isOpen: boolean
): void => {
  const { sidebar, content, overlay, spans } = elements;

  if (!sidebar || !content) return;
  if (isMobile) {
    // Mobile view logic
    sidebar.classList.toggle(SIDEBAR_CLASSES.mobile.closed, !isOpen);
    sidebar.classList.toggle(SIDEBAR_CLASSES.mobile.open, isOpen);
    // Toggle overlay
    if (overlay) {
      if (isMobile && isOpen) {
        overlay.classList.remove("hidden");
      } else {
        overlay.classList.add("hidden");
      }
    }

    // Remove inert attribute when sidebar is open
    if (isOpen) {
      sidebar.removeAttribute("inert");
      const sidebarContent = sidebar.querySelector(".sidebar-content");
      if (sidebarContent) {
        sidebarContent.setAttribute("aria-hidden", "false");
      }
    }
  } else {
    // Desktop view logic
    sidebar.classList.toggle(SIDEBAR_CLASSES.desktop.sidebar.closed, !isOpen);
    sidebar.classList.toggle(SIDEBAR_CLASSES.desktop.sidebar.open, isOpen);
    content.classList.toggle(SIDEBAR_CLASSES.desktop.content.closed, !isOpen);
    content.classList.toggle(SIDEBAR_CLASSES.desktop.content.open, isOpen);

    // Toggle text visibility in desktop mode
    if (spans) {
      spans.forEach((span) => {
        span.classList.toggle(SIDEBAR_CLASSES.text, !isOpen);
      });
    }
  }
};

/**
 * Toggle the sidebar state
 * @param sidebar - The sidebar element
 * @param content - The content element
 * @param isCurrentlyOpen - Whether the sidebar is currently open
 * @returns The new sidebar state
 */
export const toggleSidebar = (
  sidebar: HTMLElement | null,
  content: HTMLElement | null,
  isCurrentlyOpen: boolean
): boolean => {
  const viewportWidth = getViewportWidth();
  const isMobileView = viewportWidth < breakpoints.md;
  const newIsOpen = !isCurrentlyOpen;
  const overlay = document.getElementById("sidebar-overlay");
  const spans = document.querySelectorAll<HTMLElement>("#sidebar span");

  applySidebarClasses(
    { sidebar, content, overlay, spans },
    isMobileView,
    newIsOpen
  ); // Explicitly show/hide overlay in mobile view
  if (overlay) {
    if (isMobileView && newIsOpen) {
      overlay.classList.remove("hidden");
    } else {
      overlay.classList.add("hidden");
    }
  }

  return newIsOpen;
};

/**
 * Initialize the sidebar based on device type
 * @param sidebar - The sidebar element
 * @param content - The content element
 * @param layoutToggle - The optional layout toggle button element
 * @returns The initial sidebar state
 */
export const initializeSidebar = (
  sidebar: HTMLElement | null,
  content: HTMLElement | null,
  layoutToggle?: HTMLElement | null
): SidebarState => {
  const viewportWidth = getViewportWidth();
  const isMobileView = viewportWidth < breakpoints.md;
  const isTabletView =
    viewportWidth >= breakpoints.md && viewportWidth < breakpoints.lg;

  // Default: closed on mobile and tablet, open on desktop
  const isOpen = !(isMobileView || isTabletView);

  if (!sidebar || !content) {
    return { isOpen, isMobileView };
  }

  // Reset all classes first
  sidebar.classList.remove(
    SIDEBAR_CLASSES.mobile.open,
    SIDEBAR_CLASSES.mobile.closed,
    SIDEBAR_CLASSES.desktop.sidebar.open,
    SIDEBAR_CLASSES.desktop.sidebar.closed
  );

  content.classList.remove(
    SIDEBAR_CLASSES.desktop.content.open,
    SIDEBAR_CLASSES.desktop.content.closed
  );

  const overlay = document.getElementById("sidebar-overlay");
  const spans = document.querySelectorAll<HTMLElement>("#sidebar span");
  // Apply proper classes based on state
  applySidebarClasses(
    { sidebar, content, overlay, spans },
    isMobileView,
    isOpen
  );

  // Ensure overlay is handled correctly on initialization
  if (overlay) {
    if (isMobileView && isOpen) {
      overlay.classList.remove("hidden");
    } else {
      overlay.classList.add("hidden");
    }
  }

  // Layout toggle visibility
  if (layoutToggle) {
    layoutToggle.classList.toggle(SIDEBAR_CLASSES.text, !isMobileView);
  }

  // Add appropriate ARIA attributes
  updateSidebarAccessibility(sidebar, isOpen);

  return { isOpen, isMobileView };
};

/**
 * Update ARIA attributes for better accessibility
 * @param sidebar The sidebar element
 * @param isOpen Whether the sidebar is open
 */
const updateSidebarAccessibility = (
  sidebar: HTMLElement | null,
  isOpen: boolean
): void => {
  if (!sidebar) return;

  // Instead of using aria-hidden which can cause accessibility issues with focused elements,
  // we'll use the inert attribute for closed sidebars on mobile
  const viewportWidth = getViewportWidth();
  const isMobileView = viewportWidth < breakpoints.md;

  // Only apply these attributes on mobile view when sidebar is closed
  if (isMobileView && !isOpen) {
    // For desktop view or open sidebar, we don't need these attributes
    sidebar.setAttribute("inert", "");
    // Keep aria-hidden for backwards compatibility but only apply to internal content
    const sidebarContent = sidebar.querySelector(".sidebar-content");
    if (sidebarContent) {
      sidebarContent.setAttribute("aria-hidden", "true");
    }
  } else {
    // Remove attributes when sidebar is open or on desktop
    sidebar.removeAttribute("inert");
    // For desktop or open sidebar, content should be accessible
    const sidebarContent = sidebar.querySelector(".sidebar-content");
    if (sidebarContent) {
      sidebarContent.removeAttribute("aria-hidden");
    }
  }
};

/**
 * Update the sidebar toggle icons based on state
 * @param openIcon - The open icon element
 * @param closeIcon - The close icon element
 * @param state - The current sidebar state
 * @param layoutToggle - The optional layout toggle button
 */
export const updateSidebarIcons = (
  openIcon: HTMLElement | null,
  closeIcon: HTMLElement | null,
  state: SidebarState,
  layoutToggle?: HTMLElement | null
): void => {
  if (!openIcon || !closeIcon) return;

  // Set icon visibility based on sidebar state
  openIcon.style.display = state.isOpen ? "none" : "block";
  closeIcon.style.display = state.isOpen ? "block" : "none";

  // Only handle layout toggle in mobile view
  if (layoutToggle && state.isMobileView) {
    layoutToggle.style.display = state.isOpen ? "none" : "block";
  }
};

/**
 * Handle clicks outside the sidebar to close it on mobile
 * @param event - The click event
 * @param state - The current sidebar state
 * @param sidebar - The sidebar element
 * @param content - The content element
 * @returns The updated sidebar state
 */
export const handleOutsideClick = (
  event: MouseEvent,
  state: SidebarState,
  sidebar: HTMLElement | null,
  content: HTMLElement | null
): SidebarState => {
  // Only proceed if on mobile and sidebar is open
  if (!state.isMobileView || !state.isOpen || !sidebar) {
    return state;
  }

  // Check if click is outside sidebar
  const target = event.target as Node;
  if (sidebar.contains(target)) {
    return state;
  }

  // Toggle sidebar closed
  const newIsOpen = toggleSidebar(sidebar, content, true);
  return { ...state, isOpen: newIsOpen };
};
