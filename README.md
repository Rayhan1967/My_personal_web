# DevOps & Golang Portfolio

A futuristic, interactive portfolio showcasing DevOps and Golang skills through a dynamic force-directed graph visualization.

![Portfolio Preview](https://via.placeholder.com/800x400/050510/00f2ff?text=DevOps+Portfolio)

## Features

### Interactive Skill Graph
- **Force-directed visualization** powered by `react-force-graph-2d`
- **Dynamic connections** between skills showing relationships
- **Click to explore** - view detailed metrics for each skill
- **Hover effects** with glowing highlights
- **Drag & drop** nodes to rearrange

### Visual Enhancements
- **Neon cyberpunk theme** with glassmorphism effects
- **Animated background particles** floating across the screen
- **Pulsing nodes** that randomly glow
- **Trail effects** when dragging nodes
- **Scanline overlay** for retro CRT aesthetic

### Navigation Modes
- **Mouse navigation** - click, hover, drag
- **Keyboard shortcuts** (vim-like):
  - `N` - Toggle navigation mode
  - `↑↓` or `j/k` - Navigate between nodes
  - `Enter` - Select node
  - `ESC` - Close panels
  - `/` - Open search
  - `F` - Toggle fullscreen
  - `0` - Reset zoom

### Inspector Panel
Click any node to view detailed metrics:
- **Circular progress indicators** for proficiency levels
- **Animated stat cards** with glow effects
- **Project tags** showcasing work examples
- **Skill summaries** with descriptions

## Tech Stack

### Frontend
- **React 18** - UI framework
- **Vite** - Build tool & dev server
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Smooth animations
- **react-force-graph-2d** - Interactive graph visualization

### Backend
- **Go** - High-performance server
- **WebSocket** - Real-time updates
- **gorilla/websocket** - WebSocket handling

## Installation

### Prerequisites
- Node.js 18+
- Go 1.21+
- npm or yarn

### Clone Repository
```bash
git clone https://github.com/Rayhan1967/My_personal_web.git
cd My_personal_web
```

### Install Dependencies
```bash
npm install
```

### Run Development Server
```bash
npm run dev
```

### Build for Production
```bash
npm run build
```

### Run Backend Server (Optional)
```bash
cd server
go run main.go
```

## Project Structure

```
├── src/
│   ├── App.jsx          # Main application component
│   ├── main.jsx        # React entry point
│   ├── index.css        # Global styles
│   └── components/
│       ├── Inspector.jsx # Detail panel component
│       └── data.js      # Graph data & colors
├── server/
│   └── main.go         # Go WebSocket server
├── public/
├── package.json
├── tailwind.config.js
├── vite.config.js
└── index.html
```

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `N` | Toggle navigation mode |
| `↑` / `k` | Navigate up |
| `↓` / `j` | Navigate down |
| `Enter` | Select highlighted node |
| `ESC` | Close inspector / exit mode |
| `/` | Open search bar |
| `F` | Toggle fullscreen |
| `0` | Reset zoom to fit |

## Skill Categories

### Core (Cyan)
- **Me** - Profile center node

### Backend (Green)
- **Golang** - Primary backend language
- **PostgreSQL** - Database management
- **Redis** - Caching & sessions
- **gRPC** - Microservices communication

### DevOps (Magenta)
- **DevOps** - CI/CD & automation
- **Docker** - Containerization
- **Kubernetes** - Orchestration
- **CI/CD** - Pipeline automation
- **Terraform** - Infrastructure as Code
- **Linux** - System administration

### Cloud (Yellow)
- **AWS** - Cloud platform

## Customization

### Modify Skills
Edit `src/components/data.js` to add or change skills:

```javascript
export const graphData = {
  nodes: [
    { id: 'NewSkill', group: 'backend', val: 20, details: {...} }
  ],
  links: [
    { source: 'Me', target: 'NewSkill' }
  ]
}
```

### Change Colors
Edit the `neonColors` object in `data.js`:

```javascript
export const neonColors = {
  center: '#00f2ff',
  backend: '#adff2f',
  ops: '#ff00ff',
  cloud: '#ffff00'
}
```

## Deployment

### GitHub Pages
1. Update `vite.config.js` with base path
2. Run `npm run build`
3. Deploy `dist/` folder

### Vercel
```bash
npm install -g vercel
vercel
```

### Netlify
```bash
npm install -g netlify-cli
netlify deploy
```

## License

MIT License - feel free to use this for your own portfolio!

## Author

**Rayhan**
- GitHub: [@Rayhan1967](https://github.com/Rayhan1967)

## Acknowledgments

- [react-force-graph](https://github.com/vasturiano/react-force-graph) - Graph visualization
- [Framer Motion](https://www.framer.com/motion/) - Animations
- [Tailwind CSS](https://tailwindcss.com/) - Styling
