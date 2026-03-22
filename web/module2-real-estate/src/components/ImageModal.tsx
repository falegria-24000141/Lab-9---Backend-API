// =============================================================================
// COMPONENTE: IMAGE MODAL
// =============================================================================
// Renderiza una vista a pantalla completa (Lightbox) para las imágenes.
// Maneja la navegación con botones y teclado (Esc, Flechas).
// =============================================================================

import React, { useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface ImageModalProps {
  images: string[];
  currentIndex: number;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}

export function ImageModal({ images, currentIndex, onClose, onNext, onPrev }: ImageModalProps): React.ReactElement | null {
  // Manejo de teclado para la galería (Esc, Flechas)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onNext();
      if (e.key === 'ArrowLeft') onPrev();
    };

    window.addEventListener('keydown', handleKeyDown);
    // Cleanup: removemos el listener cuando el modal se cierra/desmonta
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, onNext, onPrev]);

  return (
    <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 backdrop-blur-sm">
      {/* Controles del Modal */}
      <button 
        onClick={onClose} 
        className="absolute top-6 right-6 text-white/70 hover:text-white bg-white/10 p-2 rounded-full transition-colors"
        aria-label="Cerrar galería"
      >
        <X className="h-8 w-8" />
      </button>
      
      <button 
        onClick={onPrev} 
        className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white bg-white/5 p-4 rounded-full transition-colors"
        aria-label="Imagen anterior"
      >
        <ChevronLeft className="h-10 w-10" />
      </button>

      <button 
        onClick={onNext} 
        className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white bg-white/5 p-4 rounded-full transition-colors"
        aria-label="Siguiente imagen"
      >
        <ChevronRight className="h-10 w-10" />
      </button>

      {/* Imagen Full Screen */}
      <div className="max-w-5xl max-h-[85vh] w-full flex flex-col items-center">
        <img 
          src={images[currentIndex]} 
          className="max-w-full max-h-full object-contain rounded-sm shadow-2xl" 
          alt={`Vista en pantalla completa ${currentIndex + 1}`}
        />
        <div className="mt-4 text-white/80 font-medium">
          Imagen {currentIndex + 1} de {images.length}
        </div>
      </div>
    </div>
  );
}