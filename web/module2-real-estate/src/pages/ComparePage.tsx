// =============================================================================
// COMPARE PAGE - Module 2: Real Estate React
// =============================================================================
// Esta página permite comparar hasta 3 propiedades seleccionadas.
// Implementa la lógica de "Best Value" resaltando las mejores métricas.
// =============================================================================

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Property, PROPERTY_TYPE_LABELS } from '@/types/property';
import { Button } from '@/components/ui/button';
import { Trash2, ArrowLeft, Star } from 'lucide-react';

export const ComparePage: React.FC = () => {
  const [compareList, setCompareList] = useState<Property[]>([]);

  // Cargamos las propiedades guardadas para comparar (usando localStorage para persistencia)
  useEffect(() => {
    const saved = localStorage.getItem('compare-list');
    if (saved) {
      setCompareList(JSON.parse(saved));
    }
  }, []);

  const removeFromCompare = (id: string) => {
    const updated = compareList.filter(p => p.id !== id);
    setCompareList(updated);
    localStorage.setItem('compare-list', JSON.stringify(updated));
  };

  // Lógica de "Best Value" (Solo si hay más de una propiedad)
  const prices = compareList.map(p => p.price);
  const areas = compareList.map(p => p.area);
  const pricePerSqm = compareList.map(p => p.price / p.area);

  const minPrice = Math.min(...prices);
  const maxArea = Math.max(...areas);
  const minPricePerSqm = Math.min(...pricePerSqm);

  if (compareList.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold mb-4">No hay propiedades para comparar</h2>
        <p className="text-muted-foreground mb-8">Selecciona hasta 3 propiedades desde el inicio para ver sus diferencias.</p>
        <Button asChild>
          <Link to="/"><ArrowLeft className="mr-2 h-4 w-4" /> Volver al Inicio</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Comparativa de Propiedades</h1>
        <p className="text-sm text-muted-foreground">{compareList.length} de 3 seleccionadas</p>
      </div>

      <div className="overflow-x-auto border rounded-xl shadow-sm bg-white">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-muted/50">
              <th className="p-4 border-b font-semibold text-muted-foreground w-1/4">Característica</th>
              {compareList.map(property => (
                <th key={property.id} className="p-4 border-b border-l min-w-[200px]">
                  <div className="flex flex-col gap-2">
                    <img 
                      src={property.images[0] || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=400'} 
                      alt={property.title}
                      className="h-32 w-full object-cover rounded-md"
                    />
                    <span className="font-bold line-clamp-1">{property.title}</span>
                    <Button 
                      variant="destructive" 
                      size="sm" 
                      onClick={() => removeFromCompare(property.id)}
                      className="w-full"
                    >
                      <Trash2 className="h-4 w-4 mr-2" /> Quitar
                    </Button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {/* Fila de Precio */}
            <tr>
              <td className="p-4 border-b font-medium">Precio</td>
              {compareList.map(p => (
                <td key={p.id} className={`p-4 border-b border-l ${p.price === minPrice ? 'bg-green-50 text-green-700 font-bold' : ''}`}>
                  ${p.price.toLocaleString()}
                  {p.price === minPrice && <Star className="inline h-4 w-4 ml-1" />}
                </td>
              ))}
            </tr>
            {/* Fila de Tipo */}
            <tr>
              <td className="p-4 border-b font-medium">Tipo</td>
              {compareList.map(p => (
                <td key={p.id} className="p-4 border-b border-l italic">
                  {PROPERTY_TYPE_LABELS[p.propertyType as keyof typeof PROPERTY_TYPE_LABELS]}
                </td>
              ))}
            </tr>
            {/* Fila de Área */}
            <tr>
              <td className="p-4 border-b font-medium">Área (m²)</td>
              {compareList.map(p => (
                <td key={p.id} className={`p-4 border-b border-l ${p.area === maxArea ? 'bg-green-50 text-green-700 font-bold' : ''}`}>
                  {p.area} m²
                  {p.area === maxArea && <Star className="inline h-4 w-4 ml-1" />}
                </td>
              ))}
            </tr>
            {/* Fila de Habitaciones */}
            <tr>
              <td className="p-4 border-b font-medium">Habitaciones</td>
              {compareList.map(p => (
                <td key={p.id} className="p-4 border-b border-l text-center">{p.bedrooms}</td>
              ))}
            </tr>
            {/* Fila de Precio por m² */}
            <tr>
              <td className="p-4 border-b font-medium">Precio/m²</td>
              {compareList.map(p => {
                const psm = p.price / p.area;
                return (
                  <td key={p.id} className={`p-4 border-b border-l ${psm === minPricePerSqm ? 'bg-blue-50 text-blue-700 font-bold' : ''}`}>
                    ${psm.toFixed(2)}
                  </td>
                );
              })}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};