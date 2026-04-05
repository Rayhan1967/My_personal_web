import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { neonColors } from './data'

function useAnimatedCounter(target, duration = 1200, suffix = '') {
  const [count, setCount] = useState(0)
  
  useEffect(() => {
    setCount(0)
    const startTime = Date.now()
    const startValue = 0
    const endValue = Number(target) || 0
    
    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      const easeOut = 1 - Math.pow(1 - progress, 3)
      const current = Math.floor(startValue + (endValue - startValue) * easeOut)
      setCount(current)
      
      if (progress < 1) requestAnimationFrame(animate)
    }
    
    requestAnimationFrame(animate)
  }, [target, duration])
  
  return count + suffix
}

function RadialGauge({ value, max, color, size = 80 }) {
  const percentage = Math.min((value / max) * 100, 100)
  const circumference = 2 * Math.PI * 35
  const strokeDashoffset = circumference - (percentage / 100) * circumference
  
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size/2} cy={size/2} r={35}
          fill="none"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="6"
        />
        <motion.circle
          cx={size/2} cy={size/2} r={35}
          fill="none"
          stroke={color}
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          style={{ filter: `drop-shadow(0 0 8px ${color})` }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-lg font-bold" style={{ color, textShadow: `0 0 10px ${color}` }}>
          {percentage}%
        </span>
      </div>
    </div>
  )
}

function InteractiveProgressBar({ label, value, max, barColor, icon, delay = 0 }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const safeValue = Number(value) || 0
  const safeMax = Number(max) || 1
  const percentage = Math.min((safeValue / safeMax) * 100, 100)
  
  return (
    <div 
      className="mb-4 last:mb-0"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <div className="flex items-center justify-between mb-2 cursor-pointer">
        <div className="flex items-center gap-2">
          <span style={{ color: barColor, filter: `drop-shadow(0 0 4px ${barColor})` }}>{icon}</span>
          <span className="text-xs text-white/70">{label}</span>
          <span className="text-[10px] text-white/30 ml-1">(click to expand)</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-sm font-bold" style={{ color: barColor, textShadow: `0 0 8px ${barColor}60` }}>
            {safeValue}{label === 'Proficiency' ? '%' : label === 'Experience' ? ' yrs' : ''}
          </span>
          <span className="text-[10px] text-white/30">/ {safeMax}</span>
        </div>
      </div>
      <div className="relative h-3 bg-white/5 rounded-full overflow-hidden border border-white/10">
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full cursor-pointer"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1.2, delay, ease: 'easeOut' }}
          style={{
            background: `linear-gradient(90deg, ${barColor}80, ${barColor})`,
            boxShadow: `0 0 12px ${barColor}, 0 0 24px ${barColor}40`
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
      </div>
      
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="mt-3 p-3 bg-white/5 rounded-lg border border-white/10">
              <div className="grid grid-cols-2 gap-2 text-[10px]">
                <div className="text-white/50">Current: <span className="text-white">{safeValue}</span></div>
                <div className="text-white/50">Max: <span className="text-white">{safeMax}</span></div>
                <div className="text-white/50">Progress: <span className="text-white">{percentage.toFixed(1)}%</span></div>
                <div className="text-white/50">Remaining: <span className="text-white">{safeMax - safeValue}</span></div>
              </div>
              <div className="mt-2 pt-2 border-t border-white/10">
                <div className="text-[9px] text-white/40">
                  {label === 'Proficiency' ? 'Expert level requires 90+' : 
                   label === 'Experience' ? 'Each year represents 1 year of hands-on work' :
                   'Project count from actual delivered work'}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <AnimatePresence>
        {isHovered && !isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            className="absolute z-50 mt-1 px-2 py-1 bg-black/90 rounded text-[10px] text-white whitespace-nowrap border border-white/20"
            style={{ boxShadow: `0 0 10px ${barColor}40` }}
          >
            {label}: {safeValue}/{safeMax} ({percentage.toFixed(1)}%)
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function StatCard({ label, value, cardColor, icon, delay = 0, onClick, isActive }) {
  const [isHovered, setIsHovered] = useState(false)
  const count = useAnimatedCounter(Number(value) || 0)
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, type: 'spring', stiffness: 200 }}
      className={`relative bg-white/5 rounded-xl p-3 overflow-hidden cursor-pointer transition-all ${isActive ? 'ring-2' : ''}`}
      style={{ 
        border: isActive ? `2px solid ${cardColor}` : '2px solid transparent',
        boxShadow: isActive ? `0 0 20px ${cardColor}40` : 'none'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      <motion.div
        animate={{ scale: isHovered ? 1.05 : 1 }}
        transition={{ type: 'spring', stiffness: 300 }}
        className="flex flex-col items-center text-center gap-2"
      >
        <div 
          className="w-12 h-12 rounded-full flex items-center justify-center"
          style={{ 
            background: `linear-gradient(135deg, ${cardColor}30, ${cardColor}10)`, 
            border: `2px solid ${cardColor}50`, 
            boxShadow: `0 0 20px ${cardColor}30, inset 0 0 15px ${cardColor}20` 
          }}
        >
          <span className="text-xl" style={{ color: cardColor }}>{icon}</span>
        </div>
        <div>
          <div className="text-xl font-bold" style={{ color: cardColor, textShadow: `0 0 10px ${cardColor}60` }}>
            {label === 'Level' ? value : count}
          </div>
          <div className="text-[9px] text-white/40 uppercase tracking-wider">{label}</div>
        </div>
      </motion.div>
      <motion.div 
        className="absolute bottom-0 left-0 right-0 h-0.5"
        style={{ background: `linear-gradient(90deg, transparent, ${cardColor}, transparent)` }}
        animate={{ opacity: isHovered ? 1 : 0.5 }}
      />
    </motion.div>
  )
}

export default function Inspector({ node, onClose, onStatClick }) {
  if (!node) return null

  const { level, summary, projects, proficiency, yearsExp, projectCount } = node.details || {}
  const color = neonColors[node.group] || '#00f2ff'
  const [activeStat, setActiveStat] = useState(null)

  const handleStatClick = (stat) => {
    setActiveStat(stat)
    onStatClick?.(stat, node)
  }

  return (
    <AnimatePresence>
      {node && (
        <motion.div
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 100, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed top-20 right-4 w-80 rounded-lg glass-panel border border-white/20 p-5 z-40 overflow-y-auto max-h-[calc(100vh-6rem)]"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <motion.div 
                className="w-12 h-12 rounded-lg border-2 flex items-center justify-center"
                style={{ borderColor: color, boxShadow: `0 0 20px ${color}40` }}
                whileHover={{ scale: 1.1 }}
              >
                <span style={{ color }} className="text-xl">◈</span>
              </motion.div>
              <div>
                <h2 className="text-xl font-semibold text-white">{node.id}</h2>
                <span 
                  className="text-xs px-2 py-0.5 rounded cursor-pointer hover:scale-105 transition-transform"
                  style={{ 
                    background: `${color}20`, 
                    color,
                    border: `1px solid ${color}40`
                  }}
                >
                  {node.group.toUpperCase()}
                </span>
              </div>
            </div>
            <motion.button 
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="w-8 h-8 rounded-full border border-white/20 text-white/60 hover:border-neon-cyan hover:text-neon-cyan transition-all flex items-center justify-center"
            >
              ×
            </motion.button>
          </div>

          <div className="mb-6">
            <motion.span 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', delay: 0.2 }}
              className="text-xs font-medium px-3 py-1.5 rounded cursor-pointer"
              style={{ 
                background: 'rgba(173, 255, 47, 0.1)', 
                color: '#adff2f',
                border: '1px solid #adff2f40'
              }}
            >
              ★ {level}
            </motion.span>
          </div>

          <div className="mb-6">
            <h3 className="text-xs text-white/40 uppercase tracking-wider mb-4 border-b border-white/10 pb-2 flex items-center gap-2">
              <span style={{ color }}>◆</span> Metrics
            </h3>
            
            <div className="flex justify-center mb-4">
              <RadialGauge value={proficiency} max={100} color={color} size={100} />
            </div>

            <div className="grid grid-cols-3 gap-3 mb-4">
              <StatCard 
                label="Years" 
                value={yearsExp || 0} 
                cardColor="#00f2ff" 
                icon="◆" 
                delay={0.1} 
                onClick={() => handleStatClick('years')}
                isActive={activeStat === 'years'}
              />
              <StatCard 
                label="Projects" 
                value={projectCount || 0} 
                cardColor="#ff00ff" 
                icon="◇" 
                delay={0.2} 
                onClick={() => handleStatClick('projects')}
                isActive={activeStat === 'projects'}
              />
              <StatCard 
                label="Level" 
                value={level || 'N/A'} 
                cardColor="#adff2f" 
                icon="★" 
                delay={0.3} 
                onClick={() => handleStatClick('level')}
                isActive={activeStat === 'level'}
              />
            </div>

            <div className="bg-white/5 rounded-xl p-4">
              <InteractiveProgressBar label="Proficiency" value={proficiency} max={100} barColor={color} icon="◈" delay={0.4} />
              <InteractiveProgressBar label="Experience" value={yearsExp} max={10} barColor="#00f2ff" icon="◉" delay={0.5} />
              <InteractiveProgressBar label="Projects" value={projectCount} max={30} barColor="#ff00ff" icon="◆" delay={0.6} />
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-xs text-white/40 uppercase tracking-wider mb-3 border-b border-white/10 pb-2">
              Summary
            </h3>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-sm text-white/80 leading-relaxed"
            >
              {summary}
            </motion.p>
          </div>

          <div className="mb-6">
            <h3 className="text-xs text-white/40 uppercase tracking-wider mb-3 border-b border-white/10 pb-2">
              Projects
            </h3>
            <div className="flex flex-wrap gap-2">
              {projects?.map((project, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="text-xs px-3 py-1.5 rounded cursor-pointer"
                  style={{ 
                    background: 'rgba(255, 0, 255, 0.1)', 
                    color: '#ff00ff',
                    border: '1px solid rgba(255, 0, 255, 0.3)'
                  }}
                >
                  {project}
                </motion.span>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-white/10">
            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 py-2 px-4 rounded text-xs font-medium transition-all"
                style={{ 
                  background: `${color}20`, 
                  color,
                  border: `1px solid ${color}40`
                }}
              >
                View Code
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 py-2 px-4 rounded text-xs font-medium bg-white/5 text-white/60 border border-white/10 hover:border-neon-cyan hover:text-neon-cyan transition-all"
              >
                Documentation
              </motion.button>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-white/10">
            <div className="flex justify-between text-[10px] text-white/30">
              <span>ID: {node.id.toUpperCase()}</span>
              <span>VAL: {node.val}</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
