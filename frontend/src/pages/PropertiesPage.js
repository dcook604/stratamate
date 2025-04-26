import React, { useState } from 'react';
import PropertyList from '../components/PropertyList';
import PropertyForm from '../components/PropertyForm';
import UnitList from '../components/UnitList';
import TicketList from '../components/TicketList';
import UnitForm from '../components/UnitForm';

const PropertiesPage = () => {
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [editingUnit, setEditingUnit] = useState(null);
  const [unitListKey, setUnitListKey] = useState(0); // to force UnitList refresh

  const refreshUnits = () => setUnitListKey((k) => k + 1);

  return (
    <div>
      <PropertyList onSelect={property => {
        setSelectedProperty(property);
        setSelectedUnit(null);
        setEditingUnit(null);
      }} />
      <PropertyForm onSuccess={() => {}} />
      {selectedProperty && (
        <div style={{ marginTop: '2em' }}>
          <h3>Managing: {selectedProperty.name}</h3>
          <UnitForm
            propertyId={selectedProperty.id}
            unit={editingUnit}
            onSuccess={() => {
              refreshUnits();
              setEditingUnit(null);
            }}
          />
          <UnitList
            key={unitListKey}
            propertyId={selectedProperty.id}
            onSelect={unit => setSelectedUnit(unit)}
            onEdit={unit => setEditingUnit(unit)}
          />
        </div>
      )}
      {selectedUnit && (
        <div style={{ marginTop: '2em' }}>
          <h4>Unit {selectedUnit.number} Tickets</h4>
          <TicketList unitId={selectedUnit.id} />
        </div>
      )}
    </div>
  );
};

export default PropertiesPage;
