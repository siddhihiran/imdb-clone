"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, X, ChevronLeft, ChevronRight, Image as ImageIcon } from "lucide-react";

export interface MediaItem {
  type: "video" | "image";
  url: string;
  title: string;
  thumbnail?: string;
}

interface MediaCarouselModalProps {
  trailerUrl?: string;
  images?: string[];
  movieTitle: string;
}

export default function MediaCarouselModal({
  trailerUrl,
  images = [],
  movieTitle,
}: MediaCarouselModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Build media items list
  const mediaItems: MediaItem[] = [];
  if (trailerUrl) {
    mediaItems.push({
      type: "video",
      url: trailerUrl,
      title: `${movieTitle} - Official Trailer`,
    });
  }
  images.forEach((img, i) => {
    mediaItems.push({
      type: "image",
      url: img,
      title: `${movieTitle} - Photo ${i + 1}`,
    });
  });

  const handleOpen = (index = 0) => {
    setCurrentIndex(index);
    setIsOpen(true);
  };

  const handleClose = useCallback(() => {
    setIsOpen(false);
    // Restore focus back to trigger button for a11y
    setTimeout(() => {
      triggerRef.current?.focus();
    }, 50);
  }, []);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % mediaItems.length);
  }, [mediaItems.length]);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + mediaItems.length) % mediaItems.length);
  }, [mediaItems.length]);

  // Keyboard navigation & Focus Trapping
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        handleClose();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        handleNext();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        handlePrev();
      } else if (e.key === "Tab") {
        // Focus trap
        if (!modalRef.current) return;
        const focusableElements = modalRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement?.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement?.focus();
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    // Initial focus into modal close button
    const timer = setTimeout(() => {
      const closeBtn = modalRef.current?.querySelector<HTMLButtonElement>("[data-modal-close]");
      closeBtn?.focus();
    }, 100);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      clearTimeout(timer);
    };
  }, [isOpen, handleClose, handleNext, handlePrev]);

  // Convert youtube watch URL to embed URL
  const getEmbedUrl = (url: string) => {
    if (url.includes("youtube.com/watch?v=")) {
      const videoId = url.split("v=")[1]?.split("&")[0];
      return `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`;
    }
    if (url.includes("youtu.be/")) {
      const videoId = url.split("youtu.be/")[1]?.split("?")[0];
      return `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`;
    }
    return url;
  };

  const currentItem = mediaItems[currentIndex];

  return (
    <>
      <div className="flex flex-wrap items-center gap-4">
        <button
          ref={triggerRef}
          onClick={() => handleOpen(0)}
          className="bg-yellow-500 text-black px-8 py-3 rounded-xl font-semibold flex items-center gap-2 hover:bg-yellow-400 transition-all hover:scale-105 shadow-lg active:scale-95"
          aria-haspopup="dialog"
        >
          <Play className="w-5 h-5 fill-current" />
          Watch Trailer
        </button>

        {images.length > 0 && (
          <button
            onClick={() => handleOpen(1)}
            className="bg-zinc-800/80 backdrop-blur-md text-zinc-200 px-5 py-3 rounded-xl font-medium hover:bg-zinc-700 transition-all flex items-center gap-2 border border-zinc-700 active:scale-95"
          >
            <ImageIcon className="w-4 h-4 text-yellow-500" />
            <span>Gallery ({images.length})</span>
          </button>
        )}
      </div>

      {/* Accessible Modal Dialog */}
      <AnimatePresence>
        {isOpen && currentItem && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
          >
            <motion.div
              ref={modalRef}
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="relative w-full max-w-4xl bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-900/50">
                <div className="flex items-center gap-3">
                  <h3 id="modal-title" className="font-semibold text-lg text-white truncate max-w-md">
                    {currentItem.title}
                  </h3>
                  <span className="text-xs bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded-full">
                    {currentIndex + 1} of {mediaItems.length}
                  </span>
                </div>
                <button
                  data-modal-close
                  onClick={handleClose}
                  aria-label="Close media gallery"
                  className="text-zinc-400 hover:text-white p-2 rounded-xl hover:bg-zinc-800 transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-500"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Main Media View */}
              <div className="relative aspect-video w-full bg-black flex items-center justify-center overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                    className="w-full h-full flex items-center justify-center"
                  >
                    {currentItem.type === "video" ? (
                      <iframe
                        src={getEmbedUrl(currentItem.url)}
                        title={currentItem.title}
                        className="w-full h-full border-0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    ) : (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={currentItem.url}
                        alt={currentItem.title}
                        className="w-full h-full object-contain"
                      />
                    )}
                  </motion.div>
                </AnimatePresence>

                {/* Navigation Arrows */}
                {mediaItems.length > 1 && (
                  <>
                    <button
                      onClick={handlePrev}
                      aria-label="Previous slide"
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/90 text-white p-3 rounded-full border border-zinc-700/80 transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                      onClick={handleNext}
                      aria-label="Next slide"
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/90 text-white p-3 rounded-full border border-zinc-700/80 transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                  </>
                )}
              </div>

              {/* Thumbnail Strip */}
              {mediaItems.length > 1 && (
                <div className="flex items-center gap-3 p-4 overflow-x-auto bg-zinc-900/30 border-t border-zinc-800/80">
                  {mediaItems.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentIndex(idx)}
                      className={`relative w-20 aspect-video rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 ${
                        currentIndex === idx
                          ? "border-yellow-500 ring-2 ring-yellow-500/30 scale-105"
                          : "border-zinc-800 opacity-60 hover:opacity-100"
                      }`}
                      aria-label={`Go to slide ${idx + 1}`}
                    >
                      {item.type === "video" ? (
                        <div className="w-full h-full bg-zinc-800 flex items-center justify-center">
                          <Play className="w-4 h-4 text-yellow-500 fill-current" />
                        </div>
                      ) : (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={item.url}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
