import { useState, useRef, useCallback, useEffect } from 'react';
import { useFloating, autoUpdate, offset, flip, shift, arrow } from '@floating-ui/react';

interface UseReviewOverlayOptions {
  onOpen?: () => void;
  onClose?: () => void;
}

export function useReviewOverlay(options: UseReviewOverlayOptions = {}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const hoverTimeoutRef = useRef<NodeJS.Timeout>();
  const arrowRef = useRef<HTMLDivElement>(null);

  const { refs, floatingStyles, context, middlewareData } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    middleware: [
      offset(8),
      flip({ fallbackPlacements: ['top', 'bottom', 'left', 'right'] }),
      shift({ padding: 16 }),
      arrow({ element: arrowRef }),
    ],
    whileElementsMounted: autoUpdate,
    placement: 'top',
  });

  useEffect(() => {
    const checkTouchDevice = () => {
      setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
    };
    checkTouchDevice();
    window.addEventListener('resize', checkTouchDevice);
    return () => window.removeEventListener('resize', checkTouchDevice);
  }, []);

  const open = useCallback(() => {
    setIsOpen(true);
    options.onOpen?.();
  }, [options]);

  const close = useCallback(() => {
    setIsOpen(false);
    options.onClose?.();
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
  }, [options]);

  const handleTriggerMouseEnter = useCallback(() => {
    if (isTouchDevice) return;
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    open();
  }, [isTouchDevice, open]);

  const handleTriggerMouseLeave = useCallback(() => {
    if (isTouchDevice) return;
    hoverTimeoutRef.current = setTimeout(close, 100);
  }, [isTouchDevice, close]);

  const handleOverlayMouseEnter = useCallback(() => {
    if (isTouchDevice) return;
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
  }, [isTouchDevice]);

  const handleOverlayMouseLeave = useCallback(() => {
    if (isTouchDevice) return;
    close();
  }, [isTouchDevice, close]);

  const handleTriggerClick = useCallback((e: React.MouseEvent) => {
    if (!isTouchDevice) return;
    e.preventDefault();
    if (isOpen) close();
    else open();
  }, [isTouchDevice, isOpen, open, close]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (isOpen) close();
      else open();
    } else if (e.key === 'Escape' && isOpen) {
      close();
    }
  }, [isOpen, open, close]);

  // Close on outside click for touch devices
  useEffect(() => {
    if (!isTouchDevice || !isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (
        refs.floating.current &&
        refs.domReference.current &&
        !refs.floating.current.contains(e.target as Node) &&
        !refs.domReference.current.contains(e.target as Node)
      ) {
        close();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isTouchDevice, isOpen, close, refs]);

  return {
    isOpen,
    refs,
    floatingStyles,
    arrowRef,
    middlewareData,
    open,
    close,
    handlers: {
      trigger: {
        onMouseEnter: handleTriggerMouseEnter,
        onMouseLeave: handleTriggerMouseLeave,
        onClick: handleTriggerClick,
        onKeyDown: handleKeyDown,
      },
      overlay: {
        onMouseEnter: handleOverlayMouseEnter,
        onMouseLeave: handleOverlayMouseLeave,
      },
    },
  };
}
