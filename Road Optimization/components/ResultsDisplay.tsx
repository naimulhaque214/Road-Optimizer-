import React from 'react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Separator } from './ui/separator';
import { Label } from './ui/label';
import { 
  Route, 
  MapPin, 
  Navigation, 
  Download,
  Copy
} from 'lucide-react';
import { OptimizationResult } from '../App';
import { toast } from 'sonner@2.0.3';

interface ResultsDisplayProps {
  result: OptimizationResult;
}

export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ result }) => {
  const handleCopyRoute = () => {
    const routeText = result.route.map((point, index) => 
      `${index + 1}. ${point.name} (${point.lat.toFixed(4)}, ${point.lng.toFixed(4)})`
    ).join('\n');
    
    navigator.clipboard.writeText(routeText);
    toast.success('Route copied to clipboard!');
  };

  const handleDownloadRoute = () => {
    const routeData = {
      totalDistance: result.totalDistance,
      route: result.route.map((point, index) => ({
        order: index + 1,
        name: point.name,
        latitude: point.lat,
        longitude: point.lng,
        priority: point.priority,
        isPriority: point.isPriority
      }))
    };

    const blob = new Blob([JSON.stringify(routeData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `optimized-route-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Route downloaded successfully!');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Route className="w-5 h-5 text-blue-600" />
          <Label className="text-lg font-medium">Optimization Results</Label>
        </div>
        <Badge variant="default" className="bg-green-600">
          Optimized
        </Badge>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 gap-4">
        <Card className="p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Navigation className="w-4 h-4 text-blue-600" />
            <Label className="text-sm">Total Distance</Label>
          </div>
          <div className="text-2xl font-bold">{result.totalDistance.toFixed(1)} km</div>
        </Card>
      </div>

      {/* Route Details */}
      <Card className="p-4">
        <div className="flex items-center space-x-2 mb-3">
          <MapPin className="w-4 h-4 text-red-600" />
          <Label className="text-sm font-medium">Route Order</Label>
        </div>
        
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {result.route.map((point, index) => (
            <div key={point.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center text-sm font-bold">
                  {index + 1}
                </div>
                <div>
                  <div className="font-medium text-sm">{point.name}</div>
                  <div className="text-xs text-gray-500">
                    {point.lat.toFixed(4)}, {point.lng.toFixed(4)}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                {point.isPriority && (
                  <Badge variant="destructive" className="text-xs">
                    P{point.priority}
                  </Badge>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Separator />

      {/* Action Buttons */}
      <div className="flex flex-col space-y-2">
        <Button
          onClick={handleCopyRoute}
          variant="outline"
          className="w-full hover:bg-blue-50 hover:border-blue-300 transition-colors"
        >
          <Copy className="w-4 h-4 mr-2" />
          Copy Route
        </Button>
        
        <Button
          onClick={handleDownloadRoute}
          variant="outline"
          className="w-full hover:bg-green-50 hover:border-green-300 transition-colors"
        >
          <Download className="w-4 h-4 mr-2" />
          Download Route
        </Button>
      </div>

      {/* Summary */}
      <div className="bg-green-50 p-4 rounded-lg">
        <h4 className="font-medium text-green-800 mb-2">Route Summary</h4>
        <p className="text-sm text-green-700">
          Optimized route visits {result.route.length} points covering {result.totalDistance.toFixed(1)} km. 
          {result.route.filter(p => p.isPriority).length > 0 && (
            ` Priority points are visited first as requested.`
          )}
        </p>
      </div>
    </div>
  );
};