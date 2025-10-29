import { useState, useEffect } from "react";

/**
 * A helper function for getting the dimensions of the browser window.
 *
 * @returns The width and height of the browser window.
 */
function getWindowDimensions() {
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height,
  };
}

/**
 * A hook for accessing the dimensions of the browser window.
 *
 * Updates reactively when the window is resized.
 *
 * @returns The dimensions of the browser window (width and height).
 */
export default function useWindow() {
  const [windowDimensions, setWindowDimensions] = useState(
    getWindowDimensions()
  );

  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowDimensions;
}
