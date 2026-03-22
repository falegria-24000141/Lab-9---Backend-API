// =============================================================================
// PÁGINA: DETALLE DE PROPIEDAD - Real Estate React
// =============================================================================
// Página que muestra información detallada de una propiedad.
//
// ## useParams()
// Hook de React Router que extrae parámetros de la URL.
// La ruta /property/:id define un parámetro dinámico 'id'.
// =============================================================================

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, MapPin, Bed, Bath, Square, Calendar, Tag, 
  X, ChevronLeft, ChevronRight, Search 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { getPropertyById, deleteProperty } from '@/lib/storage';
import {
  PROPERTY_TYPE_LABELS,
  OPERATION_TYPE_LABELS,
  AMENITY_LABELS,
  type Amenity,
} from '@/types/property';
import { formatPrice, formatArea } from '@/lib/utils';

/**
 * Página de detalle de una propiedad con Galería Modal.
 */
export function PropertyDetailPage(): React.ReactElement {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Estado para la galería modal (Challenge Lab - Parte 2)
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

  // Obtenemos la propiedad por ID
  const property = id ? getPropertyById(id) : undefined;

  // Lógica de navegación de la galería
  const handleNext = useCallback(() => {
    if (property && selectedImageIndex !== null) {
      setSelectedImageIndex((selectedImageIndex + 1) % property.images.length);
    }
  }, [property, selectedImageIndex]);

  const handlePrev = useCallback(() => {
    if (property && selectedImageIndex !== null) {
      setSelectedImageIndex((selectedImageIndex - 1 + property.images.length) % property.images.length);
    }
  }, [property, selectedImageIndex]);

  const handleClose = () => setSelectedImageIndex(null);

  // Manejo de teclado para la galería (Esc, Flechas)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedImageIndex === null) return;
      if (e.key === 'Escape') handleClose();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedImageIndex, handleNext, handlePrev]);

  // Si no existe la propiedad, mostramos error
  if (!property) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Propiedad no encontrada</h1>
        <p className="text-muted-foreground mb-6">
          La propiedad que buscas no existe o ha sido eliminada.
        </p>
        <Button asChild>
          <Link to="/">Volver al listado</Link>
        </Button>
      </div>
    );
  }

  const handleDelete = (): void => {
    if (window.confirm('¿Estás seguro de eliminar esta propiedad?')) {
      deleteProperty(property.id);
      navigate('/');
    }
  };

  const mainImage = property.images[0] ?? `https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1200`;

  return (
    <div className="container mx-auto px-4 py-12 relative">
      {/* Header con navegación */}
      <div className="mb-6">
        <Button asChild variant="ghost" className="mb-4">
          <Link to="/">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver al listado
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Imagen principal interactiva */}
          <div 
            className="relative rounded-xl overflow-hidden cursor-pointer group shadow-lg"
            onClick={() => setSelectedImageIndex(0)}
          >
            <img
              src={mainImage}
              alt={property.title}
              className="w-full h-[450px] object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="text-white font-semibold flex items-center gap-2 bg-white/20 backdrop-blur-md px-6 py-3 rounded-full">
                <Search className="h-5 w-5" /> Ver galería
              </span>
            </div>
            <span
              className={`absolute top-4 left-4 px-4 py-1.5 text-sm font-semibold rounded-full shadow-md ${
                property.operationType === 'venta' ? 'bg-emerald-500 text-white' : 'bg-blue-500 text-white'
              }`}
            >
              {OPERATION_TYPE_LABELS[property.operationType]}
            </span>
          </div>

          {/* Galería de imágenes adicionales */}
          {property.images.length > 1 && (
            <div className="grid grid-cols-4 gap-3">
              {property.images.map((img, index) => (
                <div 
                  key={index} 
                  className={`relative h-24 cursor-pointer overflow-hidden rounded-lg border-2 ${selectedImageIndex === index ? 'border-primary' : 'border-transparent'}`}
                  onClick={() => setSelectedImageIndex(index)}
                >
                  <img
                    src={img}
                    alt={`${property.title} - Imagen ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          )}

          <Card className="border-none shadow-sm bg-card/50">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-4">Descripción</h2>
              <p className="text-muted-foreground whitespace-pre-line leading-relaxed">
                {property.description}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="sticky top-24 shadow-xl border-none">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-2">
                <Tag className="h-5 w-5 text-primary" />
                <span className="text-4xl font-black text-primary">
                  {formatPrice(property.price)}
                </span>
              </div>
              {property.operationType === 'alquiler' && (
                <p className="text-muted-foreground mb-6 font-medium">por mes</p>
              )}

              <h1 className="text-2xl font-bold mb-4 leading-tight">{property.title}</h1>

              <div className="flex items-start gap-2 text-muted-foreground mb-6">
                <MapPin className="h-5 w-5 mt-1 shrink-0 text-red-500" />
                <p className="font-medium text-foreground">{property.address}, {property.city}</p>
              </div>

              <div className="grid grid-cols-3 gap-4 py-6 border-y mb-6">
                <div className="text-center">
                  <Bed className="h-5 w-5 mx-auto mb-1 text-primary/70" />
                  <p className="font-bold">{property.bedrooms}</p>
                </div>
                <div className="text-center border-x">
                  <Bath className="h-5 w-5 mx-auto mb-1 text-primary/70" />
                  <p className="font-bold">{property.bathrooms}</p>
                </div>
                <div className="text-center">
                  <Square className="h-5 w-5 mx-auto mb-1 text-primary/70" />
                  <p className="font-bold">{formatArea(property.area)}</p>
                </div>
              </div>

              <div className="space-y-3">
                <Button className="w-full h-12 font-bold" size="lg">Contactar al vendedor</Button>
                <Button variant="outline" className="w-full h-12">Agendar visita</Button>
                <Button variant="ghost" className="w-full text-destructive" onClick={handleDelete}>
                  Eliminar propiedad
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* MODAL DE GALERÍA Parte 2 */}
      {selectedImageIndex !== null && (
        <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 backdrop-blur-sm">
          <button 
            onClick={handleClose} 
            className="absolute top-6 right-6 text-white/70 hover:text-white bg-white/10 p-2 rounded-full"
          >
            <X className="h-8 w-8" />
          </button>
          
          <button 
            onClick={handlePrev} 
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white bg-white/5 p-4 rounded-full"
          >
            <ChevronLeft className="h-10 w-10" />
          </button>

          <button 
            onClick={handleNext} 
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white bg-white/5 p-4 rounded-full"
          >
            <ChevronRight className="h-10 w-10" />
          </button>

          <div className="max-w-6xl max-h-[85vh] w-full flex flex-col items-center">
            <img 
              src={property.images[selectedImageIndex]} 
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl" 
              alt="Galería"
            />
            <div className="mt-4 text-white/80 font-medium font-mono">
              {selectedImageIndex + 1} / {property.images.length}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}