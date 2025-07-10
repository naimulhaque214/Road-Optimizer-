import React, { useState, useCallback } from "react";
import { MapComponent } from "./components/MapComponent";
import { CoordinateInput } from "./components/CoordinateInput";
import { PrioritySelector } from "./components/PrioritySelector";
import { OptimizationPanel } from "./components/OptimizationPanel";
import { ResultsDisplay } from "./components/ResultsDisplay";
import { Button } from "./components/ui/button";
import { Card } from "./components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "./components/ui/tabs";
import { Badge } from "./components/ui/badge";
import { Progress } from "./components/ui/progress";
import { toast } from "sonner@2.0.3";
import {
  MapPin,
  Route,
  Settings,
  Play,
  Pause,
  RotateCcw,
} from "lucide-react";

export interface RoutePoint {
  id: string;
  lat: number;
  lng: number;
  name: string;
  priority: number;
  isPriority: boolean;
}

export interface OptimizationResult {
  route: RoutePoint[];
  totalDistance: number;
  generation: number;
  fitness: number;
}

function App() {
  const [points, setPoints] = useState<RoutePoint[]>([]);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizationProgress, setOptimizationProgress] =
    useState(0);
  const [result, setResult] =
    useState<OptimizationResult | null>(null);
  const [selectedPoint, setSelectedPoint] = useState<
    string | null
  >(null);

  const handleAddPoint = useCallback(
    (point: Omit<RoutePoint, "id">) => {
      const newPoint: RoutePoint = {
        ...point,
        id: `point-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      };
      setPoints((prev) => [...prev, newPoint]);
      toast.success(`Added point: ${point.name}`);
    },
    [],
  );

  const handleRemovePoint = useCallback((id: string) => {
    setPoints((prev) => prev.filter((p) => p.id !== id));
    toast.success("Point removed");
  }, []);

  const handleUpdatePoint = useCallback(
    (id: string, updates: Partial<RoutePoint>) => {
      setPoints((prev) =>
        prev.map((p) =>
          p.id === id ? { ...p, ...updates } : p,
        ),
      );
    },
    [],
  );

  const handleOptimize = useCallback(async () => {
    if (points.length < 2) {
      toast.error("Please add at least 2 points to optimize");
      return;
    }

    setIsOptimizing(true);
    setOptimizationProgress(0);
    setResult(null);

    try {
      // Simulate genetic algorithm optimization
      const { GeneticAlgorithm } = await import(
        "./services/GeneticAlgorithm"
      );
      const ga = new GeneticAlgorithm(points);

      const result = await ga.optimize((progress) => {
        setOptimizationProgress(progress);
      });

      setResult(result);
      toast.success("Route optimized successfully!");
    } catch (error) {
      toast.error("Optimization failed");
      console.error("Optimization error:", error);
    } finally {
      setIsOptimizing(false);
    }
  }, [points]);

  const handleReset = useCallback(() => {
    setPoints([]);
    setResult(null);
    setOptimizationProgress(0);
    setSelectedPoint(null);
    toast.success("All data cleared");
  }, []);

  const priorityPoints = points.filter((p) => p.isPriority);
  const regularPoints = points.filter((p) => !p.isPriority);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-blue-600 rounded-xl shadow-lg">
                <Route className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Road Optimizer
                </h1>
                <p className="text-gray-600">
                  Optimize your routes{" "}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="px-3 py-1">
                <MapPin className="w-4 h-4 mr-1" />
                {points.length} Points
              </Badge>
              {priorityPoints.length > 0 && (
                <Badge variant="default" className="px-3 py-1">
                  {priorityPoints.length} Priority
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Panel - Controls */}
          <div className="space-y-6">
            <Card className="p-6 shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <Tabs defaultValue="points" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="points">
                    Points
                  </TabsTrigger>
                  <TabsTrigger value="priority">
                    Priority
                  </TabsTrigger>
                  <TabsTrigger value="settings">
                    Settings
                  </TabsTrigger>
                </TabsList>

                <TabsContent
                  value="points"
                  className="space-y-4"
                >
                  <CoordinateInput
                    onAddPoint={handleAddPoint}
                  />
                  <div className="space-y-2">
                    <h3 className="font-medium text-gray-900">
                      Added Points
                    </h3>
                    <div className="max-h-60 overflow-y-auto space-y-2">
                      {points.map((point) => (
                        <div
                          key={point.id}
                          className={`p-3 rounded-lg border transition-all hover:shadow-md cursor-pointer ${
                            selectedPoint === point.id
                              ? "border-blue-500 bg-blue-50"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                          onClick={() =>
                            setSelectedPoint(point.id)
                          }
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-medium text-sm">
                                {point.name}
                              </div>
                              <div className="text-xs text-gray-500">
                                {point.lat.toFixed(4)},{" "}
                                {point.lng.toFixed(4)}
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              {point.isPriority && (
                                <Badge
                                  variant="default"
                                  className="text-xs"
                                >
                                  P{point.priority}
                                </Badge>
                              )}
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleRemovePoint(point.id);
                                }}
                                className="h-6 w-6 p-0 hover:bg-red-100"
                              >
                                ×
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent
                  value="priority"
                  className="space-y-4"
                >
                  <PrioritySelector
                    points={points}
                    onUpdatePoint={handleUpdatePoint}
                  />
                </TabsContent>

                <TabsContent
                  value="settings"
                  className="space-y-4"
                >
                  <OptimizationPanel />
                </TabsContent>
              </Tabs>
            </Card>
          </div>

          {/* Map Section */}
          <div className="lg:col-span-2">
            <Card className="p-6 shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  Map View
                </h2>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleOptimize}
                    disabled={isOptimizing || points.length < 2}
                    className="hover:bg-blue-50 hover:border-blue-300 transition-colors"
                  >
                    {isOptimizing ? (
                      <Pause className="w-4 h-4 mr-2" />
                    ) : (
                      <Play className="w-4 h-4 mr-2" />
                    )}
                    {isOptimizing
                      ? "Optimizing..."
                      : "Optimize Route"}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleReset}
                    className="hover:bg-red-50 hover:border-red-300 transition-colors"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Reset
                  </Button>
                </div>
              </div>

              {isOptimizing && (
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">
                      Optimization Progress
                    </span>
                    <span className="text-sm font-medium text-blue-600">
                      {Math.round(optimizationProgress)}%
                    </span>
                  </div>
                  <Progress
                    value={optimizationProgress}
                    className="h-2"
                  />
                </div>
              )}

              <div className="h-96 lg:h-[600px] rounded-lg overflow-hidden shadow-inner">
                <MapComponent
                  points={points}
                  result={result}
                  selectedPoint={selectedPoint}
                  onPointClick={setSelectedPoint}
                  onMapClick={handleAddPoint}
                />
              </div>
            </Card>
          </div>

          {/* Right Panel - Results */}
          <div className="space-y-6">
            {result ? (
              <Card className="p-6 shadow-xl border-0 bg-white/80 backdrop-blur-sm">
                <ResultsDisplay result={result} />
              </Card>
            ) : (
              <Card className="p-6 shadow-xl border-0 bg-white/80 backdrop-blur-sm">
                <div className="text-center py-8">
                  <Route className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No Route Optimized
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Add at least 2 points and click "Optimize
                    Route" to see results here.
                  </p>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <strong>Quick Start:</strong>
                      <br />
                      1. Click "Add Point" mode on the map
                      <br />
                      2. Click locations on the map
                      <br />
                      3. Set priorities if needed
                      <br />
                      4. Click "Optimize Route"
                    </p>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;