import React from 'react';
import Stadium3DView from './Stadium3DView';

export default function CircularStadiumView({
  bookedSeatIds = [],
  selectedSeats = [],
  onSeatToggle,
  onClearSeats,
  onProceed,
  onBack,
  stadium
}) {
  return (
    <Stadium3DView
      bookedSeatIds={bookedSeatIds}
      selectedSeats={selectedSeats}
      onSeatToggle={onSeatToggle}
      onClearSeats={onClearSeats}
      onProceed={onProceed}
      onBack={onBack}
      stadiumName={stadium?.name || stadium?.stadium_name || 'Apex Central Arena'}
      stadium={stadium}
      seatingTiers={stadium?.seating_tiers || stadium?.seatingTiers}
    />
  );
}
