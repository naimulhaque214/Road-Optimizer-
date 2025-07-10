import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { Feature } from 'ol';
import { Point, LineString } from 'ol/geom';
import { Style, Icon, Stroke, Fill, Circle, Text } from 'ol/style';
import { fromLonLat, toLonLat } from 'ol/proj';
import { RoutePoint, OptimizationResult } from '../App';

interface MapComponentProps {
  points: RoutePoint[];
  result: OptimizationResult | null;
  selectedPoint: string | null;
  onPointClick: (id: string) => void;
  onMapClick: (point: Omit<RoutePoint, 'id'>) => void;
}

export const MapComponent: React.FC<MapComponentProps> = ({
  points,
  result,
  selectedPoint,
  onPointClick,
  onMapClick
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<Map | null>(null);
  const vectorSourceRef = useRef<VectorSource>(new VectorSource());
  const routeSourceRef = useRef<VectorSource>(new VectorSource());
  const [clickMode, setClickMode] = useState<'add' | 'select'>('add');
  const [isMapReady, setIsMapReady] = useState(false);

  // Generate location name based on coordinates
  const generateLocationName = useCallback((lat: number, lng: number): string => {
    const majorCities = [
      { name: 'Dhaka', lat: 23.6850, lng: 90.3563 },
      { name: 'Chittagong', lat: 22.3569, lng: 91.7832 },
      { name: 'Sylhet', lat: 24.8949, lng: 91.8687 },
      { name: 'Rajshahi', lat: 24.3745, lng: 88.6042 },
      { name: 'Khulna', lat: 22.8456, lng: 89.5403 },
      { name: 'Barisal', lat: 22.7010, lng: 90.3535 },
      { name: 'Rangpur', lat: 25.7439, lng: 89.2752 },
      { name: 'Mymensingh', lat: 24.7471, lng: 90.4203 },
    ];

    // Find the nearest major city
    let nearestCity = majorCities[0];
    let minDistance = Math.abs(lat - nearestCity.lat) + Math.abs(lng - nearestCity.lng);

    for (const city of majorCities) {
      const distance = Math.abs(lat - city.lat) + Math.abs(lng - city.lng);
      if (distance < minDistance) {
        minDistance = distance;
        nearestCity = city;
      }
    }

    // If very close to a major city, use that name with a suffix
    if (minDistance < 0.5) {
      return `Near ${nearestCity.name}`;
    }

    return `Point ${points.length + 1}`;
  }, [points.length]);

  // Create map click handler
  const createMapClickHandler = useCallback((mode: 'add' | 'select') => {
    return (event: any) => {
      if (!mapInstanceRef.current) return;
      
      const map = mapInstanceRef.current;
      const feature = map.forEachFeatureAtPixel(event.pixel, (feature) => feature);
      
      if (feature && feature.get('id')) {
        // Clicked on existing point
        onPointClick(feature.get('id'));
      } else if (mode === 'add') {
        // Add new point
        const coordinates = toLonLat(event.coordinate);
        
        // Generate a location name based on approximate position
        const locationName = generateLocationName(coordinates[1], coordinates[0]);
        
        onMapClick({
          lat: coordinates[1],
          lng: coordinates[0],
          name: locationName,
          priority: 1,
          isPriority: false,
        });
      }
    };
  }, [onPointClick, onMapClick, generateLocationName]);

  // Create pointer move handler
  const createPointerMoveHandler = useCallback((mode: 'add' | 'select') => {
    return (event: any) => {
      if (!mapInstanceRef.current) return;
      
      const map = mapInstanceRef.current;
      const feature = map.forEachFeatureAtPixel(event.pixel, (feature) => feature);
      const targetElement = map.getTargetElement();
      
      if (feature) {
        targetElement.style.cursor = 'pointer';
      } else if (mode === 'add') {
        targetElement.style.cursor = 'crosshair';
      } else {
        targetElement.style.cursor = '';
      }
    };
  }, []);

  // Initialize map
  useEffect(() => {
    if (!mapRef.current) return;

    // Initialize map centered on Bangladesh
    const map = new Map({
      target: mapRef.current,
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
        new VectorLayer({
          source: vectorSourceRef.current,
          style: (feature) => {
            const pointId = feature.get('id');
            const point = points.find(p => p.id === pointId);
            const isSelected = selectedPoint === pointId;
            const isPriority = point?.isPriority;
            
            // Check if this point is part of the optimized route
            let routeOrder = -1;
            if (result && result.route) {
              routeOrder = result.route.findIndex(p => p.id === pointId);
            }

            // If part of optimized route, show green circle with number above
            if (routeOrder >= 0) {
              return new Style({
                image: new Circle({
                  radius: 12, // Standard size for the dot
                  fill: new Fill({
                    color: '#16a34a', // Green color for optimized route
                  }),
                  stroke: new Stroke({
                    color: '#ffffff',
                    width: 3,
                  }),
                }),
                text: new Text({
                  text: (routeOrder + 1).toString(),
                  font: 'bold 16px Arial', // Larger font for visibility
                  fill: new Fill({
                    color: '#ffffff', // White text
                  }),
                  stroke: new Stroke({
                    color: '#16a34a', // Green outline for contrast
                    width: 3,
                  }),
                  backgroundFill: new Fill({
                    color: '#16a34a', // Green background
                  }),
                  backgroundStroke: new Stroke({
                    color: '#ffffff',
                    width: 2,
                  }),
                  padding: [4, 6, 4, 6], // Padding around text
                  offsetY: -35, // Position text above the circle (negative Y moves up)
                  textAlign: 'center',
                  textBaseline: 'middle',
                }),
              });
            }
            
            // Default styling for non-optimized points
            return new Style({
              image: new Circle({
                radius: isSelected ? 12 : 8,
                fill: new Fill({
                  color: isPriority ? '#dc2626' : isSelected ? '#2563eb' : '#059669',
                }),
                stroke: new Stroke({
                  color: '#ffffff',
                  width: 2,
                }),
              }),
            });
          },
        }),
        new VectorLayer({
          source: routeSourceRef.current,
          style: new Style({
            stroke: new Stroke({
              color: '#16a34a', // Green color for optimized route line
              width: 4,
            }),
          }),
        }),
      ],
      view: new View({
        center: fromLonLat([90.3563, 23.6850]), // Dhaka, Bangladesh
        zoom: 7,
      }),
    });

    mapInstanceRef.current = map;
    setIsMapReady(true);

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.dispose();
        mapInstanceRef.current = null;
      }
      setIsMapReady(false);
    };
  }, []);

  // Handle map clicks and pointer moves
  useEffect(() => {
    if (!mapInstanceRef.current || !isMapReady) return;

    const map = mapInstanceRef.current;
    const clickHandler = createMapClickHandler(clickMode);
    const pointerMoveHandler = createPointerMoveHandler(clickMode);

    // Add event listeners
    map.on('click', clickHandler);
    map.on('pointermove', pointerMoveHandler);

    return () => {
      // Remove event listeners
      map.un('click', clickHandler);
      map.un('pointermove', pointerMoveHandler);
    };
  }, [clickMode, isMapReady, createMapClickHandler, createPointerMoveHandler]);

  // Update points on map (trigger re-render when result changes to update styling)
  useEffect(() => {
    if (!vectorSourceRef.current) return;

    vectorSourceRef.current.clear();
    
    points.forEach(point => {
      const feature = new Feature({
        geometry: new Point(fromLonLat([point.lng, point.lat])),
        id: point.id,
        name: point.name,
        priority: point.priority,
        isPriority: point.isPriority,
      });
      
      vectorSourceRef.current.addFeature(feature);
    });
  }, [points, result]); // Added result as dependency to trigger re-render

  // Update route on map
  useEffect(() => {
    if (!routeSourceRef.current) return;

    routeSourceRef.current.clear();
    
    if (result && result.route.length > 1) {
      const coordinates = result.route.map(point => fromLonLat([point.lng, point.lat]));
      
      const routeFeature = new Feature({
        geometry: new LineString(coordinates),
      });
      
      routeSourceRef.current.addFeature(routeFeature);
      
      // Fit map to route with some padding
      if (mapInstanceRef.current) {
        const view = mapInstanceRef.current.getView();
        const extent = routeSourceRef.current.getExtent();
        view.fit(extent, { 
          padding: [100, 80, 80, 80], // Extra top padding for number labels
          duration: 1000 // Smooth animation to route
        });
      }
    }
  }, [result]);

  // Handle mode switching
  const handleModeChange = useCallback((mode: 'add' | 'select') => {
    setClickMode(mode);
  }, []);

  return (
    <div className="relative w-full h-full">
      <div ref={mapRef} className="w-full h-full" />
      
      {/* Map Controls */}
      <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg p-2 flex space-x-2">
        <button
          onClick={() => handleModeChange('select')}
          className={`px-3 py-1 rounded text-sm transition-colors font-medium ${
            clickMode === 'select' 
              ? 'bg-blue-600 text-white shadow-md' 
              : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
          }`}
        >
          Select
        </button>
        <button
          onClick={() => handleModeChange('add')}
          className={`px-3 py-1 rounded text-sm transition-colors font-medium ${
            clickMode === 'add' 
              ? 'bg-green-600 text-white shadow-md' 
              : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
          }`}
        >
          Add Point
        </button>
      </div>
      
      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-3 text-sm">
        <div className="space-y-2">
          {result ? (
            <>
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <div className="w-6 h-6 bg-green-700 rounded-full"></div>
                  <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-green-700 text-white text-xs font-bold px-1 rounded">1</div>
                </div>
                <span>Route Order (Numbers Above Dots)</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-1 h-6 bg-green-700"></div>
                <span>Optimized Route Path</span>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-600 rounded-full"></div>
                <span>Priority Points</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                <span>Regular Points</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                <span>Selected Point</span>
              </div>
            </>
          )}
        </div>
      </div>
      
      {/* Click Mode Indicator */}
      <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-3 text-sm">
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full transition-colors ${
            clickMode === 'add' ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
          }`}></div>
          <span className="font-medium">
            {clickMode === 'add' ? 'Click map to add points' : 'Click points to select'}
          </span>
        </div>
      </div>
    </div>
  );
};