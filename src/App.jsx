import React, { useRef, useCallback, useState, useEffect } from 'react'
import ForceGraph2D from 'react-force-graph-2d'
import { motion, AnimatePresence } from 'framer-motion'
import Inspector from './components/Inspector'

function BackgroundParticles() {
  const canvasRef = useRef(null)
  
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    
    const particles = []
    const particleCount = 30
    
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        radius: Math.random() * 1.5 + 0.5,
        alpha: Math.random() * 0.3 + 0.1,
        color: '#00f2ff'
      })
    }
    
    let animationId
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      particles.forEach(p => {
        p.x += p.vx
        p.y += p.vy
        
        if (p.x < 0) p.x = canvas.width
        if (p.x > canvas.width) p.x = 0
        if (p.y < 0) p.y = canvas.height
        if (p.y > canvas.height) p.y = 0
        
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
        ctx.fillStyle = p.color
        ctx.globalAlpha = p.alpha
        ctx.fill()
        ctx.globalAlpha = 1
      })
      
      animationId = requestAnimationFrame(animate)
    }
    
    animate()
    
    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    window.addEventListener('resize', handleResize)
    
    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('resize', handleResize)
    }
  }, [])
  
  return <canvas ref={canvasRef} className="fixed inset-0 w-full h-full pointer-events-none z-0" style={{ opacity: 0.3 }} />
}

const graphData = {
  nodes: [
    { id: 'Me', group: 'center', val: 35, details: { level: 'Professional', summary: 'DevOps & Golang Backend Engineer', projects: ['Portfolio'], proficiency: 95, yearsExp: 5, projectCount: 25 } },
    { id: 'Golang', group: 'backend', val: 22, details: { level: 'Expert', summary: 'High-performance backend', projects: ['API'], proficiency: 90, yearsExp: 4, projectCount: 15 } },
    { id: 'DevOps', group: 'ops', val: 22, details: { level: 'Expert', summary: 'CI/CD pipelines', projects: ['GitHub Actions'], proficiency: 92, yearsExp: 5, projectCount: 20 } },
    { id: 'K8s', group: 'ops', val: 16, details: { level: 'Advanced', summary: 'Container orchestration', projects: ['EKS'], proficiency: 75, yearsExp: 3, projectCount: 8 } },
    { id: 'Docker', group: 'ops', val: 16, details: { level: 'Expert', summary: 'Containerization', projects: ['Dockerfiles'], proficiency: 88, yearsExp: 4, projectCount: 12 } },
    { id: 'CI/CD', group: 'ops', val: 16, details: { level: 'Expert', summary: 'Pipeline design', projects: ['Pipelines'], proficiency: 85, yearsExp: 4, projectCount: 10 } },
    { id: 'Terraform', group: 'ops', val: 16, details: { level: 'Advanced', summary: 'IaC', projects: ['Modules'], proficiency: 72, yearsExp: 2, projectCount: 7 } },
    { id: 'AWS', group: 'cloud', val: 16, details: { level: 'Advanced', summary: 'Cloud architecture', projects: ['Serverless'], proficiency: 78, yearsExp: 3, projectCount: 9 } },
    { id: 'PostgreSQL', group: 'backend', val: 13, details: { level: 'Advanced', summary: 'Database design', projects: ['DB'], proficiency: 80, yearsExp: 4, projectCount: 11 } },
    { id: 'Redis', group: 'backend', val: 13, details: { level: 'Intermediate', summary: 'Caching', projects: ['Cache'], proficiency: 65, yearsExp: 2, projectCount: 5 } },
    { id: 'gRPC', group: 'backend', val: 13, details: { level: 'Advanced', summary: 'Microservices', projects: ['APIs'], proficiency: 70, yearsExp: 2, projectCount: 6 } },
    { id: 'Linux', group: 'ops', val: 13, details: { level: 'Expert', summary: 'System admin', projects: ['Scripts'], proficiency: 90, yearsExp: 5, projectCount: 14 } },
  ],
  links: [
    { source: 'Me', target: 'Golang' },
    { source: 'Me', target: 'DevOps' },
    { source: 'DevOps', target: 'K8s' },
    { source: 'DevOps', target: 'Docker' },
    { source: 'DevOps', target: 'CI/CD' },
    { source: 'DevOps', target: 'Terraform' },
    { source: 'DevOps', target: 'AWS' },
    { source: 'DevOps', target: 'Linux' },
    { source: 'Golang', target: 'PostgreSQL' },
    { source: 'Golang', target: 'Redis' },
    { source: 'Golang', target: 'gRPC' },
    { source: 'AWS', target: 'K8s' },
    { source: 'AWS', target: 'Terraform' },
  ],
}

const neonColors = { center: '#00f2ff', backend: '#adff2f', ops: '#ff00ff', cloud: '#ffff00' }

const filterGroups = [
  { id: 'all', label: 'ALL', color: '#00f2ff' },
  { id: 'center', label: 'CORE', color: '#00f2ff' },
  { id: 'backend', label: 'BACKEND', color: '#adff2f' },
  { id: 'ops', label: 'DEVOPS', color: '#ff00ff' },
  { id: 'cloud', label: 'CLOUD', color: '#ffff00' },
]

function Toast({ message, type, onClose, duration = 3000 }) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration)
    return () => clearTimeout(timer)
  }, [onClose, duration])

  const colors = { success: '#adff2f', info: '#00f2ff', warning: '#ffbd2e', error: '#ff3333' }

  return (
    <motion.div 
      initial={{ y: 50, opacity: 0 }} 
      animate={{ y: 0, opacity: 1 }} 
      exit={{ y: 20, opacity: 0 }} 
      className="fixed bottom-52 right-6 glass-panel rounded-lg px-4 py-3 pr-8 flex items-center gap-3 z-50" 
      style={{ borderLeft: `3px solid ${colors[type]}` }}
    >
      <span style={{ color: colors[type] }}>{type === 'success' ? '✓' : type === 'info' ? 'ℹ' : type === 'warning' ? '⚠' : '✕'}</span>
      <span className="text-white/80 text-sm">{message}</span>
      <button 
        onClick={onClose}
        className="absolute top-2 right-2 w-5 h-5 flex items-center justify-center text-white/40 hover:text-white/80 transition-colors text-xs"
      >
        ×
      </button>
    </motion.div>
  )
}

function SearchBar({ onSearch, onClose }) {
  const [query, setQuery] = useState('')
  const inputRef = useRef()

  useEffect(() => { inputRef.current?.focus() }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (query.trim()) { onSearch(query.trim()); setQuery('') }
  }

  return (
    <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }} className="fixed top-20 left-1/2 -translate-x-1/2 z-50">
      <form onSubmit={handleSubmit} className="glass-panel rounded-lg px-4 py-2 flex items-center gap-3">
        <span className="text-[#00f2ff]">⌕</span>
        <input ref={inputRef} type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search nodes..." className="bg-transparent text-white/80 text-sm outline-none w-48 placeholder-white/30" />
        <button type="button" onClick={onClose} className="text-white/40 hover:text-white">✕</button>
      </form>
    </motion.div>
  )
}

function ContextMenu({ x, y, node, onClose, onAction }) {
  useEffect(() => {
    const handleClick = () => onClose()
    window.addEventListener('click', handleClick)
    return () => window.removeEventListener('click', handleClick)
  }, [onClose])

  return (
    <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="fixed z-50 glass-panel rounded-lg py-2 min-w-[160px]" style={{ left: Math.min(x, window.innerWidth - 180), top: Math.min(y, window.innerHeight - 200) }}>
      <div className="px-3 py-1 text-xs text-white/40 border-b border-white/10">{node?.id}</div>
      {[{ label: 'View Details', icon: '◈', action: 'view' }, { label: 'Focus Node', icon: '◎', action: 'focus' }, { label: 'Copy ID', icon: '⎘', action: 'copy' }, { label: 'Connections', icon: '⇌', action: 'connections' }].map((item, i) => (
        <button key={i} onClick={() => onAction(item.action, node)} className="w-full px-3 py-2 text-sm text-white/70 hover:bg-white/10 hover:text-white flex items-center gap-2 text-left">
          <span className="text-[#00f2ff]">{item.icon}</span>{item.label}
        </button>
      ))}
    </motion.div>
  )
}

function MiniMap() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }} className="fixed bottom-48 right-6 w-32 h-20 glass-panel rounded-lg overflow-hidden z-30">
      <div className="w-full h-full relative">
        <div className="absolute inset-2">
          {graphData.nodes.map((node, i) => (
            <div key={i} className="absolute w-1.5 h-1.5 rounded-full" style={{ background: neonColors[node.group], left: `${(i % 4) * 25 + 10}%`, top: `${Math.floor(i / 4) * 50 + 15}%`, boxShadow: `0 0 4px ${neonColors[node.group]}` }} />
          ))}
        </div>
      </div>
    </motion.div>
  )
}

function KeyboardHints() {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2 }} className="fixed bottom-6 right-6 glass-panel rounded-lg p-3 z-30">
      <div className="text-[10px] text-white/40 uppercase tracking-wider mb-2">Shortcuts</div>
      <div className="space-y-1 text-[10px]">
        <div className="flex items-center gap-2"><kbd className="px-1.5 py-0.5 bg-white/10 rounded text-white/60">N</kbd><span className="text-white/50">Nav Mode</span></div>
        <div className="flex items-center gap-2"><kbd className="px-1.5 py-0.5 bg-white/10 rounded text-white/60">/</kbd><span className="text-white/50">Search</span></div>
        <div className="flex items-center gap-2"><kbd className="px-1.5 py-0.5 bg-white/10 rounded text-white/60">ESC</kbd><span className="text-white/50">Close</span></div>
        <div className="flex items-center gap-2"><kbd className="px-1.5 py-0.5 bg-white/10 rounded text-white/60">F</kbd><span className="text-white/50">Fullscreen</span></div>
      </div>
    </motion.div>
  )
}

function Header({ isFullscreen, onToggleFullscreen }) {
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <motion.header initial={{ y: -64, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5 }} className="fixed top-0 left-0 right-0 h-16 glass-panel flex items-center justify-between px-6 z-50">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded border border-[#00f2ff] flex items-center justify-center cursor-pointer hover:bg-[#00f2ff]/10 transition-colors" onClick={onToggleFullscreen}>
            <span className="text-[#00f2ff] text-sm">{isFullscreen ? '⊡' : '◈'}</span>
          </div>
          <div>
            <h1 className="text-white font-semibold text-sm tracking-wide">CONTROL CENTER</h1>
            <p className="text-[#00f2ff]/60 text-[10px]">DevOps Infrastructure</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="text-[#00f2ff]/60">Cluster:</span>
          <span className="text-[#adff2f]">Main-01</span>
          <span className="text-[#00f2ff]/40">/</span>
          <span className="text-[#00f2ff]">Nodes</span>
        </div>
      </div>
      <div className="flex items-center gap-8">
        <motion.div whileHover={{ scale: 1.05 }} className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#adff2f] status-dot" />
          <span className="text-xs text-[#adff2f]">SYSTEM ONLINE</span>
        </motion.div>
        <div className="text-right">
          <div className="text-[#00f2ff] text-lg font-medium tracking-wider">{currentTime.toLocaleTimeString('en-US', { hour12: false })}</div>
          <div className="text-white/40 text-[10px]">{currentTime.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: '2-digit', year: 'numeric' })}</div>
        </div>
      </div>
    </motion.header>
  )
}

function FilterSidebar({ activeFilter, onFilterChange, onSearchClick }) {
  return (
    <motion.div initial={{ x: -100, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.5, delay: 0.2 }} className="fixed left-6 top-24 glass-panel rounded-lg p-3 z-30">
      <div className="text-[10px] text-white/40 uppercase tracking-wider mb-3">Filters</div>
      <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={onSearchClick} className="w-full mb-3 px-3 py-2 rounded text-xs bg-[#00f2ff]/10 border border-[#00f2ff]/30 text-[#00f2ff] flex items-center gap-2 justify-center hover:bg-[#00f2ff]/20 transition-colors">
        <span>⌕</span> Search
      </motion.button>
      <div className="flex flex-col gap-2">
        {filterGroups.map((filter) => (
          <motion.button key={filter.id} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => onFilterChange(filter.id === 'all' ? null : filter.id)} className={`px-3 py-2 rounded text-xs font-medium transition-all ${activeFilter === (filter.id === 'all' ? null : filter.id) ? 'border' : 'text-white/40 hover:text-white/80'}`} style={{ background: activeFilter === (filter.id === 'all' ? null : filter.id) ? `${filter.color}15` : 'transparent', borderColor: activeFilter === (filter.id === 'all' ? null : filter.id) ? filter.color : 'transparent', color: activeFilter === (filter.id === 'all' ? null : filter.id) ? filter.color : undefined }}>
            {filter.label}
          </motion.button>
        ))}
      </div>
    </motion.div>
  )
}

function FloatingStats({ activeNode }) {
  return (
    <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5, delay: 0.3 }} className="fixed bottom-6 left-6 glass-panel rounded-lg p-4 z-30">
      <div className="text-[10px] text-white/40 uppercase tracking-wider mb-3">Network Stats</div>
      <div className="flex gap-6">
        <div><div className="text-2xl font-bold text-[#00f2ff]">{graphData.nodes.length}</div><div className="text-[10px] text-white/50 uppercase">NODES</div></div>
        <div><div className="text-2xl font-bold text-[#adff2f]">{graphData.links.length}</div><div className="text-[10px] text-white/50 uppercase">LINKS</div></div>
        <div><div className="text-2xl font-bold text-[#ff00ff]">{activeNode || '—'}</div><div className="text-[10px] text-white/50 uppercase">ACTIVE</div></div>
      </div>
    </motion.div>
  )
}

function ScanlineOverlay() {
  return <div className="scanline-overlay" />
}

function NavigationHelp({ mode }) {
  if (!mode) return null
  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }} 
      animate={{ opacity: 1, x: 0 }}
      className="fixed top-20 left-1/2 -translate-x-1/2 glass-panel rounded-lg px-6 py-3 z-50"
    >
      <div className="flex items-center gap-4 text-xs">
        <span className="text-[#00f2ff]">Navigation Mode</span>
        <div className="flex items-center gap-1">
          <kbd className="px-2 py-1 bg-white/10 rounded">↑↓</kbd>
          <span className="text-white/50">Navigate</span>
        </div>
        <div className="flex items-center gap-1">
          <kbd className="px-2 py-1 bg-white/10 rounded">Enter</kbd>
          <span className="text-white/50">Select</span>
        </div>
        <div className="flex items-center gap-1">
          <kbd className="px-2 py-1 bg-white/10 rounded">ESC</kbd>
          <span className="text-white/50">Exit</span>
        </div>
      </div>
    </motion.div>
  )
}

export default function App() {
  const graphRef = useRef()
  const containerRef = useRef()
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 })
  const [highlightedNodes, setHighlightedNodes] = useState(new Set())
  const [selectedNode, setSelectedNode] = useState(null)
  const [hoveredNode, setHoveredNode] = useState(null)
  const [activeFilter, setActiveFilter] = useState(null)
  const [showSearch, setShowSearch] = useState(false)
  const [contextMenu, setContextMenu] = useState(null)
  const [toasts, setToasts] = useState([])
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [pulseNode, setPulseNode] = useState(null)
  const [navMode, setNavMode] = useState(false)
  const [selectedNodeIndex, setSelectedNodeIndex] = useState(0)
  const [draggedNode, setDraggedNode] = useState(null)
  const [trailPoints, setTrailPoints] = useState([])
  const [linkParticles, setLinkParticles] = useState([])

  const addToast = useCallback((message, type = 'info', duration = 3000) => {
    const id = Date.now()
    setToasts(prev => [...prev, { id, message, type, duration }])
  }, [])

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect()
        setDimensions({ width: rect.width, height: rect.height })
      }
    }
    updateSize()
    window.addEventListener('resize', updateSize)
    const timeout = setTimeout(updateSize, 100)
    return () => { window.removeEventListener('resize', updateSize); clearTimeout(timeout) }
  }, [])

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') { 
        setSelectedNode(null); 
        setHighlightedNodes(new Set()); 
        setShowSearch(false); 
        setContextMenu(null);
        if (navMode) setNavMode(false);
      }
      if (e.key === '/') { e.preventDefault(); setShowSearch(true) }
      if (e.key === 'n' || e.key === 'N') { 
        e.preventDefault(); 
        setNavMode(prev => !prev); 
        addToast(navMode ? 'Navigation mode OFF' : 'Navigation mode ON - Use ↑↓ to navigate, Enter to select', 'info', 5000);
      }
      if (navMode) {
        if (e.key === 'ArrowUp' || e.key === 'k') {
          e.preventDefault()
          setSelectedNodeIndex(prev => Math.max(0, prev - 1))
        }
        if (e.key === 'ArrowDown' || e.key === 'j') {
          e.preventDefault()
          setSelectedNodeIndex(prev => Math.min(graphData.nodes.length - 1, prev + 1))
        }
        if (e.key === 'Enter') {
          e.preventDefault()
          const node = graphData.nodes[selectedNodeIndex]
          if (node) handleNodeClick(node)
        }
        if (e.key === 'h') {
          e.preventDefault()
          graphRef.current?.zoom(0.8, 300)
        }
        if (e.key === 'l') {
          e.preventDefault()
          graphRef.current?.zoom(1.2, 300)
        }
        return
      }
      if (e.key === 'f' || e.key === 'F') {
        if (!isFullscreen) { document.documentElement.requestFullscreen?.(); setIsFullscreen(true) } 
        else { document.exitFullscreen?.(); setIsFullscreen(false) }
      }
      if (e.key === '0') { graphRef.current?.zoomToFit(500, 50) }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isFullscreen, navMode, selectedNodeIndex, addToast])

  useEffect(() => {
    const interval = setInterval(() => {
      const randomNode = graphData.nodes[Math.floor(Math.random() * graphData.nodes.length)]
      setPulseNode(randomNode.id)
      setTimeout(() => setPulseNode(null), 600)
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    let particleId = 0
    const interval = setInterval(() => {
      if (graphData.links.length > 0) {
        const randomLink = graphData.links[Math.floor(Math.random() * graphData.links.length)]
        setLinkParticles(prev => {
          const newParticle = {
            id: particleId++,
            link: randomLink,
            progress: 0,
            speed: 0.02 + Math.random() * 0.02
          }
          const filtered = prev.filter(p => p.progress < 1)
          return [...filtered.slice(-20), newParticle]
        })
      }
    }, 200)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setLinkParticles(prev => prev.map(p => ({ ...p, progress: p.progress + p.speed })).filter(p => p.progress < 1))
    }, 16)
    return () => clearInterval(interval)
  }, [])

  const handleNodeClick = useCallback((node) => {
    if (!node || !node.id) return
    setSelectedNode(node)
    const connected = new Set()
    graphData.links.forEach(link => {
      const src = typeof link.source === 'object' ? link.source.id : link.source
      const tgt = typeof link.target === 'object' ? link.target.id : link.target
      if (src === node.id || tgt === node.id) connected.add(src === node.id ? tgt : src)
    })
    setHighlightedNodes(new Set([node.id, ...connected]))
    if (graphRef.current && node.x !== undefined && node.y !== undefined) {
      graphRef.current.centerAt(node.x, node.y, 500)
      graphRef.current.zoom(2, 500)
    }
    addToast(`Selected: ${node.id}`, 'info')
  }, [addToast])

  const handleNodeRightClick = useCallback((node, event) => {
    if (event) event.preventDefault()
    if (node) setContextMenu({ x: event.clientX, y: event.clientY, node })
  }, [])

  const handleNodeHover = useCallback((node) => {
    if (node) {
      setHoveredNode(node)
      const connected = new Set()
      graphData.links.forEach(link => {
        const src = typeof link.source === 'object' ? link.source.id : link.source
        const tgt = typeof link.target === 'object' ? link.target.id : link.target
        if (src === node.id || tgt === node.id) connected.add(src === node.id ? tgt : src)
      })
      setHighlightedNodes(new Set([node.id, ...connected]))
    } else {
      setHoveredNode(null)
    }
  }, [])

  const handleContextAction = useCallback((action, node) => {
    if (!node) return
    if (action === 'view') {
      setSelectedNode(node)
      const connected = new Set()
      graphData.links.forEach(link => {
        const src = typeof link.source === 'object' ? link.source.id : link.source
        const tgt = typeof link.target === 'object' ? link.target.id : link.target
        if (src === node.id || tgt === node.id) connected.add(src === node.id ? tgt : src)
      })
      setHighlightedNodes(new Set([node.id, ...connected]))
      if (graphRef.current && node.x !== undefined && node.y !== undefined) {
        graphRef.current.centerAt(node.x, node.y, 500)
        graphRef.current.zoom(2, 500)
      }
      addToast(`Selected: ${node.id}`, 'info')
    }
    if (action === 'focus') { if (node.x !== undefined && node.y !== undefined) { graphRef.current?.centerAt(node.x, node.y, 500); graphRef.current?.zoom(2.5, 500) } }
    if (action === 'copy') { navigator.clipboard?.writeText(node.id); addToast('Copied!', 'success') }
    if (action === 'connections') {
      const connected = new Set([node.id])
      graphData.links.forEach(link => {
        const src = typeof link.source === 'object' ? link.source.id : link.source
        const tgt = typeof link.target === 'object' ? link.target.id : link.target
        if (src === node.id || tgt === node.id) connected.add(src === node.id ? tgt : src)
      })
      setHighlightedNodes(connected)
      addToast(`${connected.size} connections`, 'success')
    }
    setContextMenu(null)
  }, [addToast])

  const handleSearch = useCallback((query) => {
    const node = graphData.nodes.find(n => n.id.toLowerCase().includes(query.toLowerCase()))
    if (node) { setShowSearch(false); handleNodeClick(node) } 
    else { addToast(`Not found: ${query}`, 'warning') }
  }, [handleNodeClick, addToast])

  const handleFilterChange = useCallback((group) => {
    setActiveFilter(group)
    if (!group) setHighlightedNodes(new Set())
    else {
      const groupMap = { center: ['Me'], backend: ['Golang', 'PostgreSQL', 'Redis', 'gRPC'], ops: ['DevOps', 'K8s', 'Docker', 'CI/CD', 'Terraform', 'Linux'], cloud: ['AWS'] }
      setHighlightedNodes(new Set(groupMap[group] || []))
    }
  }, [])

  const handleCloseInspector = useCallback(() => {
    setSelectedNode(null)
    setHighlightedNodes(new Set())
  }, [])

  const handleToggleFullscreen = useCallback(() => {
    if (!isFullscreen) { document.documentElement.requestFullscreen?.(); setIsFullscreen(true) } 
    else { document.exitFullscreen?.(); setIsFullscreen(false) }
  }, [isFullscreen])

  return (
    <div ref={containerRef} className="w-screen h-screen bg-[#050510] relative overflow-hidden">
      <BackgroundParticles />
      <ScanlineOverlay />
      <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: `linear-gradient(rgba(0, 242, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 242, 255, 0.03) 1px, transparent 1px)`, backgroundSize: '40px 40px' }} />

      <Header isFullscreen={isFullscreen} onToggleFullscreen={handleToggleFullscreen} />
      <FilterSidebar activeFilter={activeFilter} onFilterChange={handleFilterChange} onSearchClick={() => setShowSearch(true)} />
      <FloatingStats activeNode={selectedNode?.id} />
      <MiniMap />
      <KeyboardHints />
      <NavigationHelp mode={navMode} />

      <AnimatePresence>{showSearch && <SearchBar onSearch={handleSearch} onClose={() => setShowSearch(false)} />}</AnimatePresence>
      <AnimatePresence>{contextMenu && <ContextMenu {...contextMenu} onClose={() => setContextMenu(null)} onAction={handleContextAction} />}</AnimatePresence>
      <AnimatePresence>{toasts.map(toast => <Toast key={toast.id} {...toast} onClose={() => removeToast(toast.id)} />)}</AnimatePresence>

      <AnimatePresence>{showSearch && <SearchBar onSearch={handleSearch} onClose={() => setShowSearch(false)} />}</AnimatePresence>
      <AnimatePresence>{contextMenu && <ContextMenu {...contextMenu} onClose={() => setContextMenu(null)} onAction={handleContextAction} />}</AnimatePresence>
      <AnimatePresence>{toasts.map(toast => <Toast key={toast.id} {...toast} onClose={() => removeToast(toast.id)} />)}</AnimatePresence>

      <div className="absolute inset-0 pt-16">
        <ForceGraph2D
          ref={graphRef}
          graphData={graphData}
          width={dimensions.width}
          height={dimensions.height}
          backgroundColor="transparent"
          enableNodeDrag={true}
          enableZoomInteraction={true}
          enablePanInteraction={true}
          minZoom={0.5}
          maxZoom={8}
          d3AlphaDecay={0.02}
          d3VelocityDecay={0.3}
          warmupTicks={50}
          cooldownTicks={0}
          nodeLabel="id"
          onEngineStop={() => {
            graphRef.current?.zoomToFit(400, 50)
          }}
          linkCanvasObjectMode={() => 'after'}
          linkCanvasObject={(link, ctx, globalScale) => {
            const sourceNode = link.source
            const targetNode = link.target
            if (!sourceNode || !targetNode || sourceNode.x === undefined) return
            
            const sourceId = sourceNode.id || sourceNode
            const targetId = targetNode.id || targetNode
            const isConnectedToCenter = sourceId === 'Me' || targetId === 'Me'
            const isHighlighted = highlightedNodes.has(sourceId) && highlightedNodes.has(targetId)
            
            const sourceColor = neonColors[sourceNode.group] || '#00f2ff'
            const targetColor = neonColors[targetNode.group] || '#00f2ff'
            
            const x1 = sourceNode.x
            const y1 = sourceNode.y
            const x2 = targetNode.x
            const y2 = targetNode.y
            
            const dx = x2 - x1
            const dy = y2 - y1
            const dist = Math.sqrt(dx * dx + dy * dy)
            
            if (dist === 0) return
            
            const baseRadius1 = sourceNode.val || 12
            const baseRadius2 = targetNode.val || 12
            
            const startX = x1 + (dx / dist) * baseRadius1
            const startY = y1 + (dy / dist) * baseRadius1
            const endX = x2 - (dx / dist) * baseRadius2
            const endY = y2 - (dy / dist) * baseRadius2
            
            if (isHighlighted || isConnectedToCenter) {
              ctx.shadowColor = sourceColor
              ctx.shadowBlur = isHighlighted ? 15 : 8
              ctx.beginPath()
              ctx.moveTo(startX, startY)
              ctx.lineTo(endX, endY)
              ctx.strokeStyle = isHighlighted ? sourceColor : sourceColor + '60'
              ctx.lineWidth = (isHighlighted ? 2.5 : 1.5) / globalScale
              ctx.stroke()
              ctx.shadowBlur = 0
            }
          }}
          nodeCanvasObject={(node, ctx, globalScale) => {
            if (!node || !node.id || (activeFilter && node.group !== activeFilter)) return
            if (!Number.isFinite(node.x) || !Number.isFinite(node.y)) return
            
            const label = node.id
            const fontSize = 12 / globalScale
            const baseColor = neonColors[node.group] || '#fff'
            const isHighlighted = highlightedNodes.has(node.id)
            const isHovered = hoveredNode?.id === node.id
            const isSelected = selectedNode?.id === node.id
            const isPulsing = pulseNode === node.id
            const isNavSelected = navMode && graphData.nodes[selectedNodeIndex]?.id === node.id
            const isDragging = draggedNode === node.id
            const color = isHighlighted || isHovered ? baseColor : baseColor + 'bb'
            const baseRadius = node.val || 12
            const radius = isHighlighted ? baseRadius * 1.3 : baseRadius
            const proficiency = node.details?.proficiency || 50

            if (isNavSelected) {
              const navRadius = radius * 1.5
              ctx.beginPath()
              ctx.arc(node.x, node.y, navRadius, 0, 2 * Math.PI, false)
              ctx.strokeStyle = '#00f2ff'
              ctx.lineWidth = 2 / globalScale
              ctx.setLineDash([4 / globalScale, 4 / globalScale])
              ctx.stroke()
              ctx.setLineDash([])
              
              ctx.shadowColor = '#00f2ff'
              ctx.shadowBlur = 15
              ctx.beginPath()
              ctx.arc(node.x, node.y, navRadius * 1.3, 0, 2 * Math.PI, false)
              ctx.strokeStyle = '#00f2ff40'
              ctx.lineWidth = 1 / globalScale
              ctx.stroke()
              ctx.shadowBlur = 0
            }

            if (isSelected) {
              ctx.beginPath()
              ctx.arc(node.x, node.y, radius * 1.6, -Math.PI / 2, -Math.PI / 2 + (proficiency / 100) * 2 * Math.PI, false)
              ctx.strokeStyle = baseColor
              ctx.lineWidth = 2 / globalScale
              ctx.stroke()
            }

            if (isPulsing && !isHighlighted) {
              const pulseRadius = radius * 2
              ctx.beginPath()
              ctx.arc(node.x, node.y, pulseRadius, 0, 2 * Math.PI, false)
              ctx.strokeStyle = baseColor + '60'
              ctx.lineWidth = 2 / globalScale
              ctx.stroke()
            }

            if (isDragging) {
              trailPoints.forEach((point, i) => {
                const alpha = (i / trailPoints.length) * 0.3
                ctx.beginPath()
                ctx.arc(point.x, point.y, 4, 0, 2 * Math.PI, false)
                ctx.fillStyle = baseColor
                ctx.globalAlpha = alpha
                ctx.fill()
                ctx.globalAlpha = 1
              })
            }

            const glowIntensity = isHighlighted ? 0.5 : isHovered ? 0.35 : 0.15
            const glowRadius = radius * (isHighlighted ? 3 : 2.5)
            const alphaHex = Math.round(glowIntensity * 255).toString(16).padStart(2, '0')
            const gradient = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, glowRadius)
            gradient.addColorStop(0, baseColor + alphaHex)
            gradient.addColorStop(1, 'transparent')
            ctx.fillStyle = gradient
            ctx.beginPath()
            ctx.arc(node.x, node.y, glowRadius, 0, 2 * Math.PI, false)
            ctx.fill()

            ctx.beginPath()
            ctx.arc(node.x, node.y, radius, 0, 2 * Math.PI, false)
            ctx.fillStyle = color + '35'
            ctx.globalAlpha = isDragging ? 0.6 : 0.4
            ctx.fill()
            ctx.globalAlpha = 1

            ctx.strokeStyle = color
            ctx.lineWidth = (isHighlighted ? 2.5 : 1.5) / globalScale
            ctx.stroke()

            ctx.shadowColor = color
            ctx.shadowBlur = isHighlighted ? 20 : 10
            ctx.beginPath()
            ctx.arc(node.x, node.y, radius * 0.45, 0, 2 * Math.PI, false)
            ctx.fillStyle = color
            ctx.fill()
            ctx.shadowBlur = 0

            ctx.font = `bold ${fontSize}px "Fira Code", monospace`
            ctx.textAlign = 'center'
            ctx.textBaseline = 'middle'
            ctx.fillStyle = isHighlighted ? '#fff' : 'rgba(255,255,255,0.85)'
            ctx.fillText(label, node.x, node.y + radius + fontSize + 6)
          }}
          onNodeDragBegin={(node) => {
            setDraggedNode(node.id)
            setTrailPoints([])
          }}
          onNodeDrag={(node) => {
            if (node && node.x !== undefined) {
              setTrailPoints(prev => [...prev.slice(-15), { x: node.x, y: node.y }])
            }
          }}
          onNodeDragEnd={() => {
            setDraggedNode(null)
            setTrailPoints([])
          }}
          onNodeClick={handleNodeClick}
          onNodeHover={handleNodeHover}
          onNodeRightClick={handleNodeRightClick}
        />
      </div>

      <AnimatePresence>{selectedNode && <Inspector node={selectedNode} onClose={handleCloseInspector} />}</AnimatePresence>
    </div>
  )
}