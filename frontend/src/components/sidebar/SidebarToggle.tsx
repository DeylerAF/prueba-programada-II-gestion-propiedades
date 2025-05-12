"use client";

import { useEffect, useState, useRef } from "react";
import { PanelLeft, PanelLeftClose } from "lucide-react";
import {
  initializeSidebar,
  toggleSidebar,
  type SidebarState,
} from "../../hooks/sidebar";
import { getViewportWidth, breakpoints } from "../../hooks/responsive";

interface SidebarToggleProps {
  isOpen?: boolean;
}

/**
 * SidebarToggle component for toggling sidebar visibility
 */
const SidebarToggle = ({ isOpen = true }: SidebarToggleProps) => {
  const [sidebarState, setSidebarState] = useState<SidebarState>({
    isOpen,
    isMobileView: false,
  });
  const openIconRef = useRef<HTMLDivElement>(null);
  const closeIconRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Get all required elements
    const elements = {
      sidebar: document.getElementById("sidebar"),
      content: document.getElementById("content"),
      toggleButtons: document.querySelectorAll<HTMLElement>(".toggle-sidebar"),
      layoutToggle: document.getElementById("layout-sidebar-toggle"),
      overlay: document.getElementById("sidebar-overlay"),
    };

    const { sidebar, content, toggleButtons, layoutToggle, overlay } = elements;

    // Exit if required elements are missing
    if (!sidebar || !content) return;

    // Initialize sidebar state
    const state = initializeSidebar(sidebar, content, layoutToggle);
    setSidebarState(state);

    // Set initial icon visibility and ARIA attributes    updateIcons(state.isOpen);
    updateAriaAttributes(state.isOpen, toggleButtons);

    // Handler for toggling sidebar
    const handleToggleSidebar = () => {
      if (!sidebar || !content) return;

      // Get current state from React state, not the closure variable
      setSidebarState((prevState) => {
        const newIsOpen = toggleSidebar(sidebar, content, prevState.isOpen);
        // Update icons and ARIA attributes with the new state
        updateIcons(newIsOpen);
        updateAriaAttributes(newIsOpen, toggleButtons);
        return { ...prevState, isOpen: newIsOpen };
      });
    };

    // Function to update ARIA attributes
    function updateAriaAttributes(
      isOpen: boolean,
      buttons: NodeListOf<HTMLElement>
    ) {
      buttons.forEach((btn) => {
        btn.setAttribute("aria-expanded", isOpen ? "true" : "false");
      });
    }

    // Add click handler to toggle buttons
    toggleButtons.forEach((btn) => {
      btn.addEventListener("click", handleToggleSidebar);
    }); // Handler for closing sidebar on mobile
    const closeSidebarOnMobile = (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (state.isOpen && state.isMobileView) {
        handleToggleSidebar();
      }
    };

    // Add click handler to overlay
    if (overlay) {
      overlay.addEventListener("click", closeSidebarOnMobile);
    }

    // Handle viewport changes
    const handleResize = () => {
      const viewportWidth = getViewportWidth();
      const isMobileViewNow = viewportWidth < breakpoints.md;

      // Only reinitialize if viewport type changed
      if (state.isMobileView !== isMobileViewNow) {
        const newState = initializeSidebar(sidebar, content, layoutToggle);
        setSidebarState(newState);
        updateIcons(newState.isOpen);
        updateAriaAttributes(newState.isOpen, toggleButtons);
      }
    };

    window.addEventListener("resize", handleResize);

    // Add keyboard support
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && state.isOpen && state.isMobileView) {
        handleToggleSidebar();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    // Cleanup
    return () => {
      toggleButtons.forEach((btn) => {
        btn.removeEventListener("click", handleToggleSidebar);
      });
      if (overlay) {
        overlay.removeEventListener("click", closeSidebarOnMobile);
      }
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // Update icon visibility
  const updateIcons = (isOpen: boolean) => {
    if (openIconRef.current && closeIconRef.current) {
      openIconRef.current.style.display = isOpen ? "none" : "block";
      closeIconRef.current.style.display = isOpen ? "block" : "none";
    }
  };

  return (
    <button
      className="toggle-sidebar p-2 rounded-md transition-colors hover:bg-[var(--sidebar-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-500)] focus:ring-opacity-50"
      aria-label="Toggle Sidebar"
      aria-expanded={sidebarState.isOpen ? "true" : "false"}
      aria-controls="sidebar"
    >
      <div
        ref={closeIconRef}
        style={{ display: sidebarState.isOpen ? "block" : "none" }}
      >
        <PanelLeftClose className="w-5 h-5" aria-hidden="true" />
      </div>
      <div
        ref={openIconRef}
        style={{ display: sidebarState.isOpen ? "none" : "block" }}
      >
        <PanelLeft className="w-5 h-5" aria-hidden="true" />
      </div>
    </button>
  );
};

export default SidebarToggle;
