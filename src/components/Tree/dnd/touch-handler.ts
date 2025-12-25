/**
 * Touch event handler for enabling drag and drop on mobile devices
 * Converts touch events to mouse-like events that react-dnd can handle
 */

import React from "react";

export interface TouchHandlerOptions {
  /** Minimum distance in pixels before drag starts (helps distinguish from taps) */
  dragThreshold?: number;
  /** Delay in ms before drag starts (helps distinguish from scrolling) */
  dragDelay?: number;
  /** Element ref to attach touch handlers to */
  elementRef: React.RefObject<HTMLElement>;
  /** Callback when drag should start */
  onDragStart?: (touch: Touch) => void;
  /** Callback when drag should end */
  onDragEnd?: () => void;
  /** Check if element can be dragged */
  canDrag?: () => boolean;
}

interface TouchState {
  startX: number;
  startY: number;
  currentX: number;
  currentY: number;
  identifier: number;
  isDragging: boolean;
  delayTimer?: number;
}

/**
 * Hook to add touch event handling for drag and drop
 */
export function useTouchHandler(options: TouchHandlerOptions) {
  const {
    dragThreshold = 10,
    dragDelay = 150,
    elementRef,
    onDragStart,
    onDragEnd,
    canDrag = () => true,
  } = options;

  const touchStateRef = React.useRef<TouchState | null>(null);
  const dragPreviewRef = React.useRef<HTMLElement | null>(null);

  React.useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const handleTouchStart = (e: TouchEvent) => {
      // Don't interfere if can't drag
      if (!canDrag()) return;

      // Only handle single touch
      if (e.touches.length !== 1) return;

      const touch = e.touches[0];

      // Initialize touch state
      touchStateRef.current = {
        startX: touch.clientX,
        startY: touch.clientY,
        currentX: touch.clientX,
        currentY: touch.clientY,
        identifier: touch.identifier,
        isDragging: false,
      };

      // Set delay timer
      touchStateRef.current.delayTimer = window.setTimeout(() => {
        if (touchStateRef.current && !touchStateRef.current.isDragging) {
          const distance = Math.sqrt(
            Math.pow(touchStateRef.current.currentX - touchStateRef.current.startX, 2) +
            Math.pow(touchStateRef.current.currentY - touchStateRef.current.startY, 2)
          );

          // Only start drag if we haven't moved too much (still looks like a press)
          if (distance < dragThreshold) {
            startDrag(touch);
          }
        }
      }, dragDelay);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!touchStateRef.current) return;

      const touch = Array.from(e.touches).find(
        (t) => t.identifier === touchStateRef.current!.identifier
      );

      if (!touch) return;

      touchStateRef.current.currentX = touch.clientX;
      touchStateRef.current.currentY = touch.clientY;

      if (touchStateRef.current.isDragging) {
        // Prevent scrolling while dragging
        e.preventDefault();

        // Update drag preview position
        if (dragPreviewRef.current) {
          dragPreviewRef.current.style.transform = `translate(${touch.clientX}px, ${touch.clientY}px)`;
        }

        // Simulate mouse move for react-dnd
        const mouseEvent = new MouseEvent('mousemove', {
          bubbles: true,
          cancelable: true,
          clientX: touch.clientX,
          clientY: touch.clientY,
        });

        const targetElement = document.elementFromPoint(touch.clientX, touch.clientY);
        targetElement?.dispatchEvent(mouseEvent);
      } else {
        // Check if we've moved beyond threshold - cancel drag if so
        const distance = Math.sqrt(
          Math.pow(touch.clientX - touchStateRef.current.startX, 2) +
          Math.pow(touch.clientY - touchStateRef.current.startY, 2)
        );

        if (distance > dragThreshold * 2) {
          // User is scrolling, cancel the drag delay
          if (touchStateRef.current.delayTimer) {
            clearTimeout(touchStateRef.current.delayTimer);
            touchStateRef.current.delayTimer = undefined;
          }
        }
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!touchStateRef.current) return;

      const touch = Array.from(e.changedTouches).find(
        (t) => t.identifier === touchStateRef.current!.identifier
      );

      if (!touch) return;

      // Clear delay timer if still pending
      if (touchStateRef.current.delayTimer) {
        clearTimeout(touchStateRef.current.delayTimer);
      }

      if (touchStateRef.current.isDragging) {
        e.preventDefault();
        endDrag(touch);
      }

      touchStateRef.current = null;
    };

    const handleTouchCancel = () => {
      if (touchStateRef.current?.delayTimer) {
        clearTimeout(touchStateRef.current.delayTimer);
      }

      if (touchStateRef.current?.isDragging) {
        endDrag(null);
      }

      touchStateRef.current = null;
    };

    const startDrag = (touch: Touch) => {
      if (!touchStateRef.current) return;

      touchStateRef.current.isDragging = true;

      // Add visual feedback class
      element.classList.add('touch-dragging');

      // Trigger drag start callback
      onDragStart?.(touch);

      // Simulate mouse down for react-dnd
      const mouseEvent = new MouseEvent('mousedown', {
        bubbles: true,
        cancelable: true,
        clientX: touch.clientX,
        clientY: touch.clientY,
      });
      element.dispatchEvent(mouseEvent);
    };

    const endDrag = (touch: Touch | null) => {
      if (!touchStateRef.current?.isDragging) return;

      element.classList.remove('touch-dragging');

      if (touch) {
        // Simulate mouse up for react-dnd
        const mouseEvent = new MouseEvent('mouseup', {
          bubbles: true,
          cancelable: true,
          clientX: touch.clientX,
          clientY: touch.clientY,
        });

        const targetElement = document.elementFromPoint(touch.clientX, touch.clientY);
        targetElement?.dispatchEvent(mouseEvent);
      }

      // Remove drag preview
      if (dragPreviewRef.current) {
        dragPreviewRef.current.remove();
        dragPreviewRef.current = null;
      }

      onDragEnd?.();
    };

    // Add event listeners with passive: false to allow preventDefault
    element.addEventListener('touchstart', handleTouchStart, { passive: false });
    element.addEventListener('touchmove', handleTouchMove, { passive: false });
    element.addEventListener('touchend', handleTouchEnd, { passive: false });
    element.addEventListener('touchcancel', handleTouchCancel, { passive: false });

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);
      element.removeEventListener('touchcancel', handleTouchCancel);

      if (touchStateRef.current?.delayTimer) {
        clearTimeout(touchStateRef.current.delayTimer);
      }
    };
  }, [dragThreshold, dragDelay, canDrag, onDragStart, onDragEnd]);

  return {
    isTouchDragging: touchStateRef.current?.isDragging ?? false,
  };
}
