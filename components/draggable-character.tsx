'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';

interface DraggableCharacterProps {
  id?: string;
  src: string;
  alt: string;
  initialX: number;
  initialY: number;
  mobileX?: number;
  mobileY?: number;
  className?: string;
  debug?: boolean;
}

export function DraggableCharacter({
  id,
  src,
  alt,
  initialX,
  initialY,
  mobileX,
  mobileY,
  className = '',
  debug = false,
}: DraggableCharacterProps) {
  const [position, setPosition] = useState({ x: initialX, y: initialY });
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 640) {
      if (mobileX !== undefined && mobileY !== undefined) {
        setPosition({ x: mobileX, y: mobileY });
      }
    }
  }, [mobileX, mobileY]);

  const dragStart = useRef({ x: 0, y: 0, posX: 0, posY: 0 });

  const handleStart = (clientX: number, clientY: number) => {
    setIsDragging(true);
    dragStart.current = {
      x: clientX,
      y: clientY,
      posX: position.x,
      posY: position.y,
    };
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    handleStart(e.clientX, e.clientY);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches[0]) {
      handleStart(e.touches[0].clientX, e.touches[0].clientY);
    }
  };

  useEffect(() => {
    const handleMove = (clientX: number, clientY: number) => {
      if (!isDragging) return;

      const deltaX = clientX - dragStart.current.x;
      const deltaY = clientY - dragStart.current.y;

      setPosition({
        x: Math.round(dragStart.current.posX + deltaX),
        y: Math.round(dragStart.current.posY + deltaY),
      });
    };

    const handleMouseMove = (e: MouseEvent) => handleMove(e.clientX, e.clientY);
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches[0]) {
        handleMove(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    const handleEnd = () => setIsDragging(false);

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleEnd);
      window.addEventListener('touchmove', handleTouchMove, { passive: false });
      window.addEventListener('touchend', handleEnd);

      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleEnd);
        window.removeEventListener('touchmove', handleTouchMove);
        window.removeEventListener('touchend', handleEnd);
      };
    }
  }, [isDragging]);

  return (
    <div
      id={id}
      className={`${className} cursor-grab active:cursor-grabbing select-none group`}
      style={{
        position: 'absolute',
        left: `${position.x}px`,
        top: `${position.y}px`,
        zIndex: isDragging ? 50 : 20,
        touchAction: 'none',
        transition: isDragging ? 'none' : 'all 0.1s ease-out',
      }}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
    >
      {debug && (
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black/80 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap z-[60] pointer-events-none font-mono">
          x: {position.x}, y: {position.y}
        </div>
      )}
      <div className="relative w-24 h-32 sm:w-32 sm:h-40 drop-shadow-xl hover:scale-105 transition-transform">
        <Image
          src={src || "/placeholder.svg"}
          alt={alt}
          fill
          className="object-contain pointer-events-none"
          priority
          draggable={false}
        />
      </div>
    </div>
  );
}
