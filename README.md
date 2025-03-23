# Vibe Coding Game Jam Website

An immersive 3D website for the 2025 Vibe Coding Game Jam, built with React, ThreeJS, and TailwindCSS.

## Features

- Interactive 3D environment
- Responsive design for both desktop and mobile
- Gesture controls for mobile devices
- Immersive loading screen
- Smooth transitions between sections
- Ambient particle effects
- 3D models and text elements

## Technologies Used

- React 19
- Three.js
- React Three Fiber / Drei
- TailwindCSS
- TypeScript
- GSAP for animations

## Getting Started

### Prerequisites

- Node.js 18+ installed on your machine
- A modern web browser

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/cursor-vibe-jam.git
cd cursor-vibe-jam
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Project Structure

- `/src/components/three` - 3D components using Three.js
- `/src/components` - UI components
- `/src/hooks` - Custom React hooks
- `/src/utils` - Utility functions
- `/public` - Static assets

## Performance Optimization

The website is optimized for performance with:
- Deferred loading of 3D assets
- Efficient rendering using instanced meshes
- Mobile-optimized settings for lower-end devices
- Responsive quality settings based on device capabilities

## Mobile Support

The website supports mobile devices with:
- Touch controls
- Device orientation controls
- Responsive design that adapts to smaller screens
- Fullscreen mode for an immersive experience

## License

MIT

## Acknowledgements

- Special thanks to the Vibe Coding Game Jam team
- All the judges and sponsors of the event
- The ThreeJS and React communities
