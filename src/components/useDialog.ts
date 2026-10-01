import { useEffect, useRef } from "react";
import { useLenis } from "lenis/react";

export default function useDialog<T extends HTMLElement = HTMLDivElement>(open: boolean, onClose: () => void) {
  const ref = useRef<T>(null);
  const closeRef = useRef(onClose);
  closeRef.current = onClose;
  const lenis = useLenis();

  useEffect(() => {
    if (!open) return;
    const dialog = ref.current;
    if (!dialog) return;
    const previousFocus = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    const focusable = () => Array.from(dialog.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), input, textarea, select, [tabindex="0"]',
    )).filter((element) => element.getClientRects().length > 0);
    lenis?.stop();
    document.body.style.overflow = "hidden";
    document.body.dataset.dialogOpen = "true";
    const inertElements: Array<[HTMLElement, boolean]> = [];
    let branch: HTMLElement = dialog;
    while (branch.parentElement) {
      for (const sibling of branch.parentElement.children) {
        if (sibling !== branch && sibling instanceof HTMLElement) {
          inertElements.push([sibling, sibling.inert]);
          sibling.inert = true;
        }
      }
      if (branch.parentElement === document.body) break;
      branch = branch.parentElement;
    }
    (focusable()[0] ?? dialog).focus({ preventScroll: true });
    const observer = new MutationObserver(() => {
      if (!dialog.contains(document.activeElement)) {
        (focusable()[0] ?? dialog).focus({ preventScroll: true });
      }
    });
    observer.observe(dialog, { childList: true, subtree: true });
    const keydown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeRef.current();
      }
      if (event.key !== "Tab") return;
      const items = focusable();
      const first = items[0];
      const last = items[items.length - 1];
      if (!first) {
        event.preventDefault();
        dialog.focus();
      } else if (event.shiftKey && (document.activeElement === first || !dialog.contains(document.activeElement))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (document.activeElement === last || !dialog.contains(document.activeElement))) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", keydown);
    return () => {
      document.removeEventListener("keydown", keydown);
      observer.disconnect();
      document.body.style.overflow = overflow;
      delete document.body.dataset.dialogOpen;
      inertElements.forEach(([element, inert]) => { element.inert = inert; });
      lenis?.start();
      if (previousFocus?.isConnected) previousFocus.focus({ preventScroll: true });
    };
  }, [open, lenis]);

  return ref;
}
