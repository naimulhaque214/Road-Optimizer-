import React from 'react';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Card } from './ui/card';
import { Crown, MapPin, ArrowUp, ArrowDown } from 'lucide-react';
import { RoutePoint } from '../App';

interface PrioritySelectorProps {
  points: RoutePoint[];
  onUpdatePoint: (id: string, updates: Partial<RoutePoint>) => void;
}

export const PrioritySelector: React.FC<PrioritySelectorProps> = ({
  points,
  onUpdatePoint,
}) => {
  const priorityPoints = points.filter(p => p.isPriority).sort((a, b) => a.priority - b.priority);
  const regularPoints = points.filter(p => !p.isPriority);

  const handleTogglePriority = (id: string, isPriority: boolean) => {
    const updates: Partial<RoutePoint> = { isPriority };
    
    if (isPriority) {
      // Set priority to the next available number
      const maxPriority = Math.max(0, ...priorityPoints.map(p => p.priority));
      updates.priority = maxPriority + 1;
    } else {
      updates.priority = 1;
    }
    
    onUpdatePoint(id, updates);
  };

  const handlePriorityChange = (id: string, priority: number) => {
    onUpdatePoint(id, { priority });
  };

  const movePriorityUp = (id: string) => {
    const point = points.find(p => p.id === id);
    if (!point || point.priority <= 1) return;
    
    // Find the point with the priority one level up
    const targetPoint = priorityPoints.find(p => p.priority === point.priority - 1);
    if (targetPoint) {
      onUpdatePoint(targetPoint.id, { priority: point.priority });
      onUpdatePoint(id, { priority: point.priority - 1 });
    }
  };

  const movePriorityDown = (id: string) => {
    const point = points.find(p => p.id === id);
    if (!point || point.priority >= priorityPoints.length) return;
    
    // Find the point with the priority one level down
    const targetPoint = priorityPoints.find(p => p.priority === point.priority + 1);
    if (targetPoint) {
      onUpdatePoint(targetPoint.id, { priority: point.priority });
      onUpdatePoint(id, { priority: point.priority + 1 });
    }
  };

  return (
    <div className="space-y-6">
      {/* Priority Points */}
      <div>
        <div className="flex items-center space-x-2 mb-4">
          <Crown className="w-5 h-5 text-yellow-600" />
          <Label className="text-lg font-medium">Priority Points</Label>
          <Badge variant="secondary">{priorityPoints.length}</Badge>
        </div>
        
        {priorityPoints.length > 0 ? (
          <div className="space-y-2">
            {priorityPoints.map((point) => (
              <Card key={point.id} className="p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center justify-center w-8 h-8 bg-red-100 rounded-full">
                      <span className="text-red-600 font-bold text-sm">{point.priority}</span>
                    </div>
                    <div>
                      <p className="font-medium">{point.name}</p>
                      <p className="text-sm text-gray-500">
                        {point.lat.toFixed(4)}, {point.lng.toFixed(4)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <div className="flex flex-col space-y-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => movePriorityUp(point.id)}
                        disabled={point.priority <= 1}
                        className="h-6 w-6 p-0"
                      >
                        <ArrowUp className="w-3 h-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => movePriorityDown(point.id)}
                        disabled={point.priority >= priorityPoints.length}
                        className="h-6 w-6 p-0"
                      >
                        <ArrowDown className="w-3 h-3" />
                      </Button>
                    </div>
                    
                    <Switch
                      checked={point.isPriority}
                      onCheckedChange={(checked) => handleTogglePriority(point.id, checked)}
                    />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Crown className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>No priority points set</p>
            <p className="text-sm">Enable priority for points below</p>
          </div>
        )}
      </div>

      {/* Regular Points */}
      <div>
        <div className="flex items-center space-x-2 mb-4">
          <MapPin className="w-5 h-5 text-green-600" />
          <Label className="text-lg font-medium">Regular Points</Label>
          <Badge variant="secondary">{regularPoints.length}</Badge>
        </div>
        
        {regularPoints.length > 0 ? (
          <div className="space-y-2">
            {regularPoints.map((point) => (
              <Card key={point.id} className="p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <MapPin className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium">{point.name}</p>
                      <p className="text-sm text-gray-500">
                        {point.lat.toFixed(4)}, {point.lng.toFixed(4)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Label htmlFor={`priority-${point.id}`} className="text-sm">Priority</Label>
                    <Switch
                      id={`priority-${point.id}`}
                      checked={point.isPriority}
                      onCheckedChange={(checked) => handleTogglePriority(point.id, checked)}
                    />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <MapPin className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>No regular points</p>
            <p className="text-sm">Add points to get started</p>
          </div>
        )}
      </div>

      {/* Instructions */}
      <div className="bg-yellow-50 p-4 rounded-lg">
        <h4 className="font-medium text-yellow-800 mb-2">Priority System</h4>
        <ul className="text-sm text-yellow-700 space-y-1">
          <li>• Priority points will be visited first in order (1, 2, 3, etc.)</li>
          <li>• Regular points will be optimized after priority points</li>
          <li>• Use arrows to reorder priority points</li>
          <li>• The algorithm ensures priority points are visited in sequence</li>
        </ul>
      </div>
    </div>
  );
};