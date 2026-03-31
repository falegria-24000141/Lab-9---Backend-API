// =============================================================================
// COMPONENTE REGISTER BUTTON
// =============================================================================
// Botón registro
//
// Hook React 19
// Actualización inmediata
//
// Patrón optimista
// 1. Clic usuario
// 2. Update inmediato
// 3. Acción servidor
// 4. Revierte error
// 5. Confirma éxito
// =============================================================================

'use client';

import { useOptimistic, useTransition, useState } from 'react';
import { Button } from '@/components/ui/button';
import { registerForEventAction } from '@/actions/eventActions';
import { Loader2, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RegisterButtonProps {
  eventId: string;
  availableSpots: number;
  isAvailable: boolean;
}

// Renderiza botón
export function RegisterButton({
  eventId,
  availableSpots,
  isAvailable,
}: RegisterButtonProps): React.ReactElement {
  
  // Estado transición
  const [isPending, startTransition] = useTransition();

  // Estado error
  const [error, setError] = useState<string | null>(null);

  // Estado optimista
  const [optimisticSpots, addOptimistic] = useOptimistic(
    availableSpots,
    // Resta plazas
    (currentSpots: number) => Math.max(0, currentSpots - 1)
  );

  // Variables estado
  const showRegistered = optimisticSpots < availableSpots && !error;
  const canRegister = isAvailable && optimisticSpots > 0 && !showRegistered;

  // Maneja registro
  function handleRegister(): void {
    // Limpia errores
    setError(null);
    
    // Update optimista
    addOptimistic('register');

    // Acción servidor
    startTransition(async () => {
      const result = await registerForEventAction(eventId);

      if (!result.success) {
        // Muestra error
        setError(result.message || 'Fallo al registrar');
      }
    });
  }

  // Ya registrado
  if (showRegistered) {
    return (
      <Button variant="secondary" disabled className="w-full gap-2">
        <CheckCircle className="h-4 w-4" />
        Registrado
      </Button>
    );
  }

  // Sin plazas
  if (!canRegister) {
    return (
      <div className="w-full flex flex-col gap-2">
        <Button variant="secondary" disabled className="w-full">
          {optimisticSpots === 0 ? 'Evento Agotado' : 'No disponible'}
        </Button>
        {error && <span className="text-red-500 text-sm text-center">{error}</span>}
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-2">
      <Button
        onClick={handleRegister}
        disabled={isPending}
        className={cn('w-full gap-2', isPending && 'cursor-wait')}
      >
        {isPending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Registrando
          </>
        ) : (
          `Registrarme (${optimisticSpots} plazas)`
        )}
      </Button>
      {error && <span className="text-red-500 text-sm text-center">{error}</span>}
    </div>
  );
}