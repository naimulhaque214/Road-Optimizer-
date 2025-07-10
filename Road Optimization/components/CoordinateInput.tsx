import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card } from './ui/card';
import { MapPin, Plus } from 'lucide-react';
import { RoutePoint } from '../App';

interface CoordinateInputProps {
  onAddPoint: (point: Omit<RoutePoint, 'id'>) => void;
}

export const CoordinateInput: React.FC<CoordinateInputProps> = ({ onAddPoint }) => {
  const [formData, setFormData] = useState({
    name: '',
    lat: '',
    lng: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const lat = parseFloat(formData.lat);
    const lng = parseFloat(formData.lng);
    
    if (isNaN(lat) || isNaN(lng)) {
      alert('Please enter valid coordinates');
      return;
    }
    
    // Validate Bangladesh coordinates (approximate bounds)
    if (lat < 20.5 || lat > 26.5 || lng < 88 || lng > 93) {
      alert('Coordinates should be within Bangladesh bounds');
      return;
    }

    onAddPoint({
      name: formData.name || `Point ${Date.now()}`,
      lat,
      lng,
      priority: 1,
      isPriority: false,
    });

    setFormData({ name: '', lat: '', lng: '' });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Quick preset locations in Bangladesh
  const presetLocations = [
    { name: 'Dhaka', lat: 23.6850, lng: 90.3563 },
    { name: 'Chittagong', lat: 22.3569, lng: 91.7832 },
    { name: 'Sylhet', lat: 24.8949, lng: 91.8687 },
    { name: 'Rajshahi', lat: 24.3745, lng: 88.6042 },
    { name: 'Khulna', lat: 22.8456, lng: 89.5403 },
    { name: 'Barisal', lat: 22.7010, lng: 90.3535 },
  ];

  const handlePresetClick = (location: { name: string; lat: number; lng: number }) => {
    setFormData({
      name: location.name,
      lat: location.lat.toString(),
      lng: location.lng.toString(),
    });
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="lat" className="text-sm font-medium">Latitude</Label>
            <Input
              id="lat"
              type="number"
              step="any"
              placeholder="23.6850"
              value={formData.lat}
              onChange={(e) => handleInputChange('lat', e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="lng" className="text-sm font-medium">Longitude</Label>
            <Input
              id="lng"
              type="number"
              step="any"
              placeholder="90.3563"
              value={formData.lng}
              onChange={(e) => handleInputChange('lng', e.target.value)}
              className="mt-1"
            />
          </div>
        </div>
        
        <div>
          <Label htmlFor="name" className="text-sm font-medium">Location Name</Label>
          <Input
            id="name"
            type="text"
            placeholder="Enter location name"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            className="mt-1"
          />
        </div>
        
        <Button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 transition-colors"
          disabled={!formData.lat || !formData.lng}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Point
        </Button>
      </form>

      {/* Preset Locations */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Quick Add - Major Cities</Label>
        <div className="grid grid-cols-2 gap-2">
          {presetLocations.map((location) => (
            <Button
              key={location.name}
              variant="outline"
              size="sm"
              onClick={() => handlePresetClick(location)}
              className="justify-start hover:bg-blue-50 hover:border-blue-300 transition-colors"
            >
              <MapPin className="w-3 h-3 mr-2" />
              {location.name}
            </Button>
          ))}
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 p-3 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>Tip:</strong> You can also click on the map to add points when "Add Point" mode is active.
        </p>
      </div>
    </div>
  );
};