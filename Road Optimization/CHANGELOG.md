# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Initial project setup
- Basic documentation

## [1.0.0] - 2024-07-10

### Added
- Interactive map with OpenLayers focused on Bangladesh
- Click-to-add point functionality with automatic location naming
- Priority system for route points
- Genetic algorithm implementation for TSP optimization
- Visual route display with numbered sequence (1→2→3→4...)
- Route export functionality (copy to clipboard and JSON download)
- Modern UI with Tailwind CSS and Shadcn components
- Responsive design for desktop and mobile
- Real-time route optimization
- Point management with selection and deletion
- Map controls for different interaction modes
- Legend and visual indicators for different point types

### Features
- **Map Integration**: OpenLayers-based map centered on Bangladesh
- **Point Management**: Add, select, and manage route points
- **Priority System**: Designate high-priority areas to visit first
- **Route Optimization**: Advanced genetic algorithm for solving TSP
- **Visual Feedback**: Clear numbered route visualization
- **Export Options**: Copy routes or download as JSON
- **Responsive Design**: Works on desktop and mobile devices

### Technical Details
- Built with React 18+ and TypeScript
- Styling with Tailwind CSS v4.0
- Map rendering with OpenLayers
- UI components from Shadcn/ui
- Icons from Lucide React
- Toast notifications with Sonner
- Custom genetic algorithm implementation

### Performance
- Optimizes routes with 2-50 points efficiently
- Client-side computation (no server required)
- Smooth map interactions and animations
- Optimized bundle size and loading times

---

## Release Notes Format

Each release includes:
- **Added**: New features
- **Changed**: Changes in existing functionality
- **Deprecated**: Soon-to-be removed features
- **Removed**: Removed features
- **Fixed**: Bug fixes
- **Security**: Security vulnerability fixes

## Version Numbering

We use [Semantic Versioning](https://semver.org/):
- **MAJOR**: Incompatible API changes
- **MINOR**: Backward-compatible functionality additions
- **PATCH**: Backward-compatible bug fixes

## Links

- [Compare versions](https://github.com/naimulhaque214/Road-Optimizer/compare)
- [Release tags](https://github.com/naimulhaque214/Road-Optimizer/tags)
- [Issues](https://github.com/naimulhaque214/Road-Optimizer/issues)