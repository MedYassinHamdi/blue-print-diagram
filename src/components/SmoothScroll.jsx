/**
 * Smooth Scroll Wrapper Component
 *
 * Provides smooth scrolling behavior using Lenis library.
 * Wraps application content for enhanced scroll experience.
 *
 * @author Yassin Hamdi
 */

import { ReactLenis } from "@studio-freight/react-lenis";

export function SmoothScroll({ children }) {
  return (
    <ReactLenis root options={{ lerp: 0.1, duration: 1.5, smoothTouch: true }}>
      {children}
    </ReactLenis>
  );
}
