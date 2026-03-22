// =============================================================================
// COMPONENTE: IMAGE GALLERY
// =============================================================================
// Muestra la imagen principal y las miniaturas de la propiedad.
// Gestiona el estado de apertura del ImageModal.
// =============================================================================

import React, { useState, useCallback } from 'react';
import { Search } from 'lucide-react';
import { OPERATION_TYPE_LABELS } from '@/types/property';
import { ImageModal } from './ImageModal';

interface ImageGalleryProps {
  images: string[];
  title: string;
  operationType: 'venta' | 'alquiler';
}

export function ImageGallery({ images, title, operationType }: ImageGalleryProps): React.ReactElement {
  // Estado para la galería modal (Challenge Lab - Parte 2)
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

  // Imagen por defecto si el array viene vacío
  const mainImage = images[0] ?? `https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1200`;

  // Lógica de navegación de la galería
  const handleNext = useCallback(() => {
    if (selectedImageIndex !== null) {
      setSelectedImageIndex((selectedImageIndex + 1) % images.length);
    }
  }, [images.length, selectedImageIndex]);

  const handlePrev = useCallback(() => {
    if (selectedImageIndex !== null) {
      setSelectedImageIndex((selectedImageIndex - 1 + images.length) % images.length);
    }
  }, [images.length, selectedImageIndex]);

  const handleClose = useCallback(() => {
    setSelectedImageIndex(null);
  }, []);

  return (
    <div className="space-y-6">
      {/* Imagen principal interactiva */}
      <div 
        className="relative rounded-lg overflow-hidden cursor-pointer group shadow-md"
        onClick={() => setSelectedImageIndex(0)}
      >
        <img
          src={mainImage}
          alt={title}
          className="w-full h-[400px] object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <span className="text-white font-semibold flex items-center gap-2 bg-white/20 backdrop-blur-md px-6 py-3 rounded-full">
            <Search className="h-5 w-5" /> Ver galería
          </span>
        </div>
        <span
          className={`absolute top-4 left-4 px-4 py-2 text-sm font-semibold rounded-full shadow-md ${
            operationType === 'venta' ? 'bg-green-500 text-white' : 'bg-blue-500 text-white'
          }`}
        >
          {OPERATION_TYPE_LABELS[operationType]}
        </span>
      </div>

      {/* Galería de imágenes adicionales (Miniaturas) */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {images.slice(1).map((img, index) => (
            <div 
              key={index} 
              // Sumamos 1 al index porque empezamos a mapear desde la segunda imagen (slice(1))
              className={`relative h-24 cursor-pointer overflow-hidden rounded-lg border-2 ${
                selectedImageIndex === index + 1 ? 'border-primary' : 'border-transparent group'
              }`}
              onClick={() => setSelectedImageIndex(index + 1)}
            >
              <img
                src={img}
                alt={`${title} - Imagen ${index + 2}`}
                className="w-full h-full object-cover transition-opacity group-hover:opacity-80"
              />
            </div>
          ))}
        </div>
      )}

      {/* Renderizado condicional del Modal */}
      {selectedImageIndex !== null && (
        <ImageModal 
          images={images}
          currentIndex={selectedImageIndex}
          onClose={handleClose}
          onNext={handleNext}
          onPrev={handlePrev}
        />
      )}
    </div>
  );
}