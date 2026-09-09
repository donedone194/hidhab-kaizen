"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Maximize2, X, Play, ChevronLeft, ChevronRight, Video } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface ProductGalleryProps {
  images: string[];
  videos?: string[];
  productName: string;
}

export default function ProductGallery({ images, videos = [], productName }: ProductGalleryProps) {
  const { locale, dir } = useLanguage();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activeMediaTab, setActiveMediaTab] = useState<"images" | "video">("images");

  const safeImages = images.length > 0 ? images : ["https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=900&auto=format&fit=crop&q=80"];
  const currentImage = safeImages[selectedIndex] || safeImages[0];
  const hasVideos = videos.length > 0;

  const nextImage = () => {
    setSelectedIndex((prev) => (prev + 1) % safeImages.length);
  };

  const prevImage = () => {
    setSelectedIndex((prev) => (prev - 1 + safeImages.length) % safeImages.length);
  };

  // Helper to extract YouTube or Vimeo embed URL if applicable
  const getEmbedUrl = (url: string) => {
    if (url.includes("youtube.com/watch?v=")) {
      const videoId = url.split("v=")[1]?.split("&")[0];
      return `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1`;
    }
    if (url.includes("youtu.be/")) {
      const videoId = url.split("youtu.be/")[1]?.split("?")[0];
      return `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1`;
    }
    if (url.includes("youtube.com/shorts/")) {
      const videoId = url.split("shorts/")[1]?.split("?")[0];
      return `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1`;
    }
    if (url.includes("vimeo.com/")) {
      const videoId = url.split("vimeo.com/")[1]?.split("?")[0];
      return `https://player.vimeo.com/video/${videoId}?autoplay=1`;
    }
    return url;
  };

  return (
    <div className="space-y-4">
      {/* Media Type Tabs (if videos exist) */}
      {hasVideos && (
        <div className="flex items-center gap-2 p-1.5 bg-sand-100/80 rounded-xl max-w-fit">
          <button
            type="button"
            onClick={() => setActiveMediaTab("images")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeMediaTab === "images"
                ? "bg-navy-950 text-white shadow-sm"
                : "text-charcoal-600 hover:text-navy-950"
            }`}
          >
            {locale === "ar" ? `الصور (${safeImages.length})` : `Photos (${safeImages.length})`}
          </button>
          <button
            type="button"
            onClick={() => setActiveMediaTab("video")}
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeMediaTab === "video"
                ? "bg-orange-500 text-white shadow-sm"
                : "text-charcoal-600 hover:text-orange-600"
            }`}
          >
            <Video className="w-3.5 h-3.5" />
            <span>{locale === "ar" ? "فيديو توضيحي" : "Vidéo démo"}</span>
          </button>
        </div>
      )}

      {/* Main Display Stage */}
      {activeMediaTab === "images" ? (
        <div className="relative aspect-square sm:aspect-4/3 w-full rounded-2xl overflow-hidden bg-sand-100 border border-sand-200 group">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentImage}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="relative w-full h-full"
            >
              <Image
                src={currentImage}
                alt={productName}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover object-center"
              />
            </motion.div>
          </AnimatePresence>

          {/* Lightbox Trigger */}
          <button
            type="button"
            onClick={() => setLightboxOpen(true)}
            className="absolute top-4 end-4 p-2.5 rounded-xl bg-navy-950/60 hover:bg-navy-950/90 text-white backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all shadow-md"
            aria-label="View larger image"
          >
            <Maximize2 className="w-4 h-4" />
          </button>

          {/* Prev/Next arrows if multiple images */}
          {safeImages.length > 1 && (
            <>
              <button
                type="button"
                onClick={dir === "rtl" ? nextImage : prevImage}
                className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-white/80 hover:bg-white text-navy-950 shadow-md backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={dir === "rtl" ? prevImage : nextImage}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-white/80 hover:bg-white text-navy-950 shadow-md backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}
        </div>
      ) : (
        /* Video Embed Stage */
        <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-navy-950 border border-navy-800 shadow-md">
          {videos[0] && (videos[0].includes("youtube") || videos[0].includes("youtu.be") || videos[0].includes("vimeo")) ? (
            <iframe
              src={getEmbedUrl(videos[0])}
              title={productName}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full border-0"
            />
          ) : (
            <video
              src={videos[0]}
              controls
              autoPlay
              playsInline
              className="w-full h-full object-contain bg-black"
            >
              {locale === "ar" ? "المتصفح لا يدعم تشغيل الفيديو." : "Votre navigateur ne supporte pas la lecture vidéo."}
            </video>
          )}
        </div>
      )}

      {/* Thumbnails Row */}
      {safeImages.length > 1 && activeMediaTab === "images" && (
        <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-thin">
          {safeImages.map((img, idx) => (
            <button
              key={img + idx}
              type="button"
              onClick={() => setSelectedIndex(idx)}
              className={`relative w-20 h-20 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                selectedIndex === idx
                  ? "border-orange-500 ring-2 ring-orange-500/30 scale-95"
                  : "border-sand-200 opacity-70 hover:opacity-100"
              }`}
            >
              <Image
                src={img}
                alt={`${productName} thumbnail ${idx + 1}`}
                fill
                sizes="80px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Fullscreen Lightbox Modal */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4 sm:p-8"
            onClick={() => setLightboxOpen(false)}
          >
            <button
              type="button"
              onClick={() => setLightboxOpen(false)}
              className="absolute top-6 end-6 p-3 rounded-full bg-white/10 hover:bg-white/25 text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            <div
              className="relative w-full max-w-4xl max-h-[85vh] aspect-square sm:aspect-4/3"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={currentImage}
                alt={productName}
                fill
                sizes="90vw"
                className="object-contain"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

