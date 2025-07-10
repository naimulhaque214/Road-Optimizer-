import React, { useState } from 'react';
import { Card } from './ui/card';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Button } from './ui/button';
import { Separator } from './ui/separator';
import { Settings, Zap, Clock, Target, RotateCcw, Info } from 'lucide-react';

interface OptimizationSettings {
  preset: 'fast' | 'balanced' | 'precise';
  useAdvancedOptimization: boolean;
  respectTrafficPatterns: boolean;
}

export const OptimizationPanel: React.FC = () => {
  const [settings, setSettings] = useState<OptimizationSettings>({
    preset: 'balanced',
    useAdvancedOptimization: true,
    respectTrafficPatterns: false,
  });

  const handleSettingChange = (key: keyof OptimizationSettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const presets = [
    {
      name: 'Fast',
      value: 'fast' as const,
      icon: <Zap className="w-4 h-4" />,
      description: 'Quick optimization (10-15 seconds)',
      color: 'bg-yellow-100 border-yellow-300 text-yellow-800'
    },
    {
      name: 'Balanced',
      value: 'balanced' as const,
      icon: <Target className="w-4 h-4" />,
      description: 'Good balance of speed and accuracy (30-45 seconds)',
      color: 'bg-green-100 border-green-300 text-green-800'
    },
    {
      name: 'Precise',
      value: 'precise' as const,
      icon: <Clock className="w-4 h-4" />,
      description: 'Best possible route (1-2 minutes)',
      color: 'bg-blue-100 border-blue-300 text-blue-800'
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Settings className="w-5 h-5 text-gray-600" />
        <Label className="text-lg font-medium">Optimization Settings</Label>
      </div>

      {/* Optimization Presets */}
      <div>
        <Label className="text-sm font-medium mb-3 block">Optimization Mode</Label>
        <div className="space-y-2">
          {presets.map((preset) => (
            <div
              key={preset.value}
              className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                settings.preset === preset.value
                  ? preset.color
                  : 'bg-gray-50 border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => handleSettingChange('preset', preset.value)}
            >
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${
                  settings.preset === preset.value ? 'bg-white/50' : 'bg-white'
                }`}>
                  {preset.icon}
                </div>
                <div className="flex-1">
                  <div className="font-medium">{preset.name}</div>
                  <div className="text-sm opacity-75">{preset.description}</div>
                </div>
                <div className={`w-4 h-4 rounded-full border-2 ${
                  settings.preset === preset.value
                    ? 'bg-current border-current'
                    : 'border-gray-300'
                }`} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Additional Options */}
      <div className="space-y-4">
        <Label className="text-sm font-medium">Additional Options</Label>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm font-medium">Advanced Optimization</Label>
              <p className="text-xs text-gray-600">Uses 2-opt local search for better routes</p>
            </div>
            <Switch
              checked={settings.useAdvancedOptimization}
              onCheckedChange={(checked) => handleSettingChange('useAdvancedOptimization', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm font-medium">Traffic Patterns</Label>
              <p className="text-xs text-gray-600">Consider typical traffic when optimizing</p>
            </div>
            <Switch
              checked={settings.respectTrafficPatterns}
              onCheckedChange={(checked) => handleSettingChange('respectTrafficPatterns', checked)}
            />
          </div>
        </div>
      </div>

      <Separator />

      {/* Distance Calculation Method */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Distance Calculation</Label>
        <div className="bg-gray-50 p-3 rounded-lg">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span className="text-sm">Using Haversine formula for accurate distances</span>
          </div>
          <p className="text-xs text-gray-600 mt-1">
            Calculates great-circle distances between coordinates
          </p>
        </div>
      </div>

      {/* Info Panel */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <div className="flex items-start space-x-2">
          <Info className="w-4 h-4 text-blue-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-blue-800 mb-1">How it works</h4>
            <p className="text-sm text-blue-700">
              Our genetic algorithm finds the shortest route while respecting your priority points. 
              Priority points are always visited first in the order you specify.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};