import { useEffect } from "react";

/**
 * Custom hook to add a shadow to the header when scrolling down.
 * @param headerId The DOM id of the header element
 * @param shadowClass The CSS class to add for shadow
 */
/**
 * Custom hook to add a shadow to the header when scrolling down.
 * Supports both window and scrollable container.
 * @param headerId The DOM id of the header element
 * @param shadowClass The CSS class to add for shadow
 * @param scrollContainerId The DOM id of the scrollable container (optional, defaults to window)
 */
export function useHeaderShadow(
  headerId: string = "main-header",
  shadowClass: string = "shadow-lg",
  scrollContainerId?: string
) {
  useEffect(() => {
    const header = document.getElementById(headerId);
    if (!header) return;

    // Use scrollable container if provided, else window
    const scrollContainer = scrollContainerId
      ? document.getElementById(scrollContainerId)
      : window;

    // If scrollContainer is null (bad id), do nothing
    if (scrollContainerId && !scrollContainer) return;

    const getScrollY = () => {
      if (scrollContainer instanceof Window) return window.scrollY;
      if (scrollContainer instanceof HTMLElement)
        return scrollContainer.scrollTop;
      return 0;
    };

    const handleScroll = () => {
      if (getScrollY() > 4) {
        header.classList.add(shadowClass);
      } else {
        header.classList.remove(shadowClass);
      }
    };

    // Type guard for addEventListener
    if (
      scrollContainer instanceof Window ||
      scrollContainer instanceof HTMLElement
    ) {
      scrollContainer.addEventListener("scroll", handleScroll, {
        passive: true,
      });
      // Run once on mount
      handleScroll();
      return () => {
        scrollContainer.removeEventListener("scroll", handleScroll);
      };
    }
    // fallback: do nothing
    return;
  }, [headerId, shadowClass, scrollContainerId]);
}
