/**
 * mobileKeyboard.ts
 * 
 * Sets --keyboard-height CSS variable on <html> when the virtual keyboard
 * opens on mobile. This is the fallback for browsers that don't support
 * env(keyboard-inset-height) natively (Firefox Android, Safari < 15, etc).
 *
 * Usage: import this file once in index.tsx — it self-registers.
 *
 * Place at: packages/client/src/mobileKeyboard.ts
 */

function setupKeyboardHeightTracking() {
  // Only bother on touch devices
  if (!("ontouchstart" in window)) return;

  const root = document.documentElement;

  // Method 1: Visual Viewport API (best — supported on iOS 13+, Chrome 61+)
  if (window.visualViewport) {
    const onViewportResize = () => {
      const keyboardHeight = Math.max(
        0,
        window.innerHeight - window.visualViewport!.height - window.visualViewport!.offsetTop
      );
      root.style.setProperty("--keyboard-height", `${keyboardHeight}px`);
    };

    window.visualViewport.addEventListener("resize", onViewportResize);
    window.visualViewport.addEventListener("scroll", onViewportResize);
    return; // don't set up the fallback if we have visualViewport
  }

  // Method 2: window resize fallback (less accurate but OK)
  const baseHeight = window.innerHeight;
  const onResize = () => {
    const keyboardHeight = Math.max(0, baseHeight - window.innerHeight);
    root.style.setProperty("--keyboard-height", `${keyboardHeight}px`);
  };

  window.addEventListener("resize", onResize);
}

setupKeyboardHeightTracking();
