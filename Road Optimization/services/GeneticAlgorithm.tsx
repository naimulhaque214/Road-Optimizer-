import { RoutePoint, OptimizationResult } from '../App';

interface Individual {
  route: RoutePoint[];
  fitness: number;
}

export class GeneticAlgorithm {
  private points: RoutePoint[];
  private priorityPoints: RoutePoint[];
  private regularPoints: RoutePoint[];
  private populationSize: number;
  private generations: number;
  private mutationRate: number;
  private elitismRate: number;
  private crossoverRate: number;

  constructor(
    points: RoutePoint[],
    options: {
      populationSize?: number;
      generations?: number;
      mutationRate?: number;
      elitismRate?: number;
      crossoverRate?: number;
    } = {}
  ) {
    this.points = points;
    this.priorityPoints = points.filter(p => p.isPriority).sort((a, b) => a.priority - b.priority);
    this.regularPoints = points.filter(p => !p.isPriority);
    this.populationSize = options.populationSize || 100;
    this.generations = options.generations || 500;
    this.mutationRate = options.mutationRate || 0.02;
    this.elitismRate = options.elitismRate || 0.1;
    this.crossoverRate = options.crossoverRate || 0.8;
  }

  // Calculate distance between two points using Haversine formula
  private calculateDistance(point1: RoutePoint, point2: RoutePoint): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.toRad(point2.lat - point1.lat);
    const dLon = this.toRad(point2.lng - point1.lng);
    const lat1 = this.toRad(point1.lat);
    const lat2 = this.toRad(point2.lat);

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private toRad(deg: number): number {
    return deg * (Math.PI / 180);
  }

  // Calculate total route distance
  private calculateRouteDistance(route: RoutePoint[]): number {
    let totalDistance = 0;
    for (let i = 0; i < route.length - 1; i++) {
      totalDistance += this.calculateDistance(route[i], route[i + 1]);
    }
    // Add distance back to start (complete the circuit)
    totalDistance += this.calculateDistance(route[route.length - 1], route[0]);
    return totalDistance;
  }

  // Calculate fitness (lower distance = higher fitness)
  private calculateFitness(route: RoutePoint[]): number {
    const distance = this.calculateRouteDistance(route);
    return 1 / (1 + distance);
  }

  // Create a valid individual respecting priority constraints
  private createValidRoute(): RoutePoint[] {
    const route: RoutePoint[] = [];
    
    // Add priority points first in order
    route.push(...this.priorityPoints);
    
    // Shuffle regular points and add them
    const shuffledRegular = [...this.regularPoints];
    for (let i = shuffledRegular.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledRegular[i], shuffledRegular[j]] = [shuffledRegular[j], shuffledRegular[i]];
    }
    
    route.push(...shuffledRegular);
    return route;
  }

  // Create initial population
  private createInitialPopulation(): Individual[] {
    const population: Individual[] = [];
    
    for (let i = 0; i < this.populationSize; i++) {
      const route = this.createValidRoute();
      const fitness = this.calculateFitness(route);
      population.push({ route, fitness });
    }
    
    return population;
  }

  // Tournament selection
  private selectParent(population: Individual[]): Individual {
    const tournamentSize = 5;
    const tournament: Individual[] = [];
    
    for (let i = 0; i < tournamentSize; i++) {
      const randomIndex = Math.floor(Math.random() * population.length);
      tournament.push(population[randomIndex]);
    }
    
    return tournament.reduce((best, current) => 
      current.fitness > best.fitness ? current : best
    );
  }

  // Order crossover (OX) respecting priority constraints
  private crossover(parent1: Individual, parent2: Individual): Individual {
    if (Math.random() > this.crossoverRate) {
      return Math.random() < 0.5 ? parent1 : parent2;
    }

    const route1 = parent1.route;
    const route2 = parent2.route;
    
    // Always keep priority points at the beginning
    const child: RoutePoint[] = [...this.priorityPoints];
    
    // Only crossover the regular points
    const regularRoute1 = route1.slice(this.priorityPoints.length);
    const regularRoute2 = route2.slice(this.priorityPoints.length);
    
    if (regularRoute1.length === 0) {
      return { route: child, fitness: this.calculateFitness(child) };
    }
    
    // Perform order crossover on regular points
    const start = Math.floor(Math.random() * regularRoute1.length);
    const end = Math.floor(Math.random() * regularRoute1.length);
    const [startPos, endPos] = [Math.min(start, end), Math.max(start, end)];
    
    const childRegular: RoutePoint[] = new Array(regularRoute1.length);
    
    // Copy segment from parent1
    for (let i = startPos; i <= endPos; i++) {
      childRegular[i] = regularRoute1[i];
    }
    
    // Fill remaining positions with parent2 order
    let currentPos = 0;
    for (const point of regularRoute2) {
      if (!childRegular.includes(point)) {
        while (childRegular[currentPos] !== undefined) {
          currentPos++;
        }
        childRegular[currentPos] = point;
      }
    }
    
    child.push(...childRegular);
    
    return { route: child, fitness: this.calculateFitness(child) };
  }

  // Mutation (swap two regular points)
  private mutate(individual: Individual): Individual {
    if (Math.random() > this.mutationRate) {
      return individual;
    }

    const route = [...individual.route];
    const regularStartIndex = this.priorityPoints.length;
    
    if (route.length - regularStartIndex < 2) {
      return individual;
    }
    
    // Only mutate regular points
    const idx1 = regularStartIndex + Math.floor(Math.random() * (route.length - regularStartIndex));
    const idx2 = regularStartIndex + Math.floor(Math.random() * (route.length - regularStartIndex));
    
    if (idx1 !== idx2) {
      [route[idx1], route[idx2]] = [route[idx2], route[idx1]];
    }
    
    return { route, fitness: this.calculateFitness(route) };
  }

  // Local search optimization (2-opt)
  private localSearch(individual: Individual): Individual {
    let route = [...individual.route];
    let improved = true;
    const regularStartIndex = this.priorityPoints.length;
    
    while (improved) {
      improved = false;
      
      for (let i = regularStartIndex; i < route.length - 1; i++) {
        for (let j = i + 2; j < route.length; j++) {
          const newRoute = [...route];
          
          // Reverse the segment between i and j
          const segment = newRoute.slice(i, j + 1).reverse();
          newRoute.splice(i, j - i + 1, ...segment);
          
          const newFitness = this.calculateFitness(newRoute);
          
          if (newFitness > individual.fitness) {
            route = newRoute;
            individual = { route, fitness: newFitness };
            improved = true;
          }
        }
      }
    }
    
    return individual;
  }

  // Main optimization function
  async optimize(onProgress?: (progress: number) => void): Promise<OptimizationResult> {
    let population = this.createInitialPopulation();
    let bestIndividual = population.reduce((best, current) => 
      current.fitness > best.fitness ? current : best
    );
    
    for (let generation = 0; generation < this.generations; generation++) {
      const newPopulation: Individual[] = [];
      
      // Elitism - keep best individuals
      const eliteCount = Math.floor(this.populationSize * this.elitismRate);
      const sortedPopulation = population.sort((a, b) => b.fitness - a.fitness);
      newPopulation.push(...sortedPopulation.slice(0, eliteCount));
      
      // Generate new individuals
      while (newPopulation.length < this.populationSize) {
        const parent1 = this.selectParent(population);
        const parent2 = this.selectParent(population);
        
        let child = this.crossover(parent1, parent2);
        child = this.mutate(child);
        
        // Apply local search occasionally
        if (Math.random() < 0.1) {
          child = this.localSearch(child);
        }
        
        newPopulation.push(child);
      }
      
      population = newPopulation;
      
      // Update best individual
      const currentBest = population.reduce((best, current) => 
        current.fitness > best.fitness ? current : best
      );
      
      if (currentBest.fitness > bestIndividual.fitness) {
        bestIndividual = currentBest;
      }
      
      // Report progress
      if (onProgress) {
        const progress = ((generation + 1) / this.generations) * 100;
        onProgress(progress);
      }
      
      // Add small delay to allow UI updates
      if (generation % 10 === 0) {
        await new Promise(resolve => setTimeout(resolve, 1));
      }
    }
    
    return {
      route: bestIndividual.route,
      totalDistance: this.calculateRouteDistance(bestIndividual.route),
      generation: this.generations,
      fitness: bestIndividual.fitness,
    };
  }
}