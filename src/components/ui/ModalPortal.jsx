import { createPortal } from "react-dom";

/**
 * Renders modal overlays on document.body so they aren't clipped
 * by layout overflow:hidden and sit above the app chrome.
 */
const ModalPortal = ({ isOpen, children }) => {
  if (!isOpen) return null;
  return createPortal(children, document.body);
};

export default ModalPortal;
