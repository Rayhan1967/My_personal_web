import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { neonColors } from './data'

export default function Inspector({ node, onClose }) {
  if (!node) return null

  const { level, summary, projects, proficiency, yearsExp, projectCount } = node.details || {}
  const color = neonColors[node.group] || '#00f2ff'

  const ProgressBar = ({ label, value, max = 100, barColor, icon, delay = 0 }) => {
    const safeValue = Number(value) || 0
    const safeMax = Number(max) || 1
    const percentage = Math.min((safeValue / safeMax) * 100, 100)
    
    return (
      <div className="mb-4 last:mb-0">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span style={{ color: barColor, filter: `drop-shadow(0 0 4px ${barColor})` }}>{icon}</span>
            <span className="text-xs text-white/70">{label}</span>
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
            className="absolute inset-y-0 left-0 rounded-full"
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
      </div>
    )
  }

  const StatCard = ({ label, value, cardColor, icon, delay = 0 }) => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, type: 'spring', stiffness: 200 }}
      className="relative bg-white/5 rounded-xl p-3 overflow-hidden hover:bg-white/10 transition-all cursor-pointer group"
    >
      <div className="flex flex-col items-center text-center gap-2">
        <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${cardColor}30, ${cardColor}10)`, border: `2px solid ${cardColor}50`, boxShadow: `0 0 20px ${cardColor}30, inset 0 0 15px ${cardColor}20` }}>
          <span className="text-xl" style={{ color: cardColor }}>{icon}</span>
        </div>
        <div>
          <div className="text-xl font-bold" style={{ color: cardColor, textShadow: `0 0 10px ${cardColor}60` }}>{value}</div>
          <div className="text-[9px] text-white/40 uppercase tracking-wider">{label}</div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-0.5 opacity-50 group-hover:opacity-100 transition-opacity" style={{ background: `linear-gradient(90deg, transparent, ${cardColor}, transparent)` }} />
    </motion.div>
  )

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
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div 
                className="w-12 h-12 rounded-lg border-2 flex items-center justify-center"
                style={{ borderColor: color, boxShadow: `0 0 20px ${color}40` }}
              >
                <span style={{ color }} className="text-xl">◈</span>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">{node.id}</h2>
                <span 
                  className="text-xs px-2 py-0.5 rounded"
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
            <button 
              onClick={onClose}
              className="w-8 h-8 rounded-full border border-white/20 text-white/60 hover:border-neon-cyan hover:text-neon-cyan transition-all flex items-center justify-center"
            >
              ×
            </button>
          </div>

          {/* Level Badge */}
          <div className="mb-6">
            <span 
              className="text-xs font-medium px-3 py-1.5 rounded"
              style={{ 
                background: 'rgba(173, 255, 47, 0.1)', 
                color: '#adff2f',
                border: '1px solid #adff2f40'
              }}
            >
              ★ {level}
            </span>
          </div>

          {/* Metrics Section */}
          <div className="mb-6">
            <h3 className="text-xs text-white/40 uppercase tracking-wider mb-4 border-b border-white/10 pb-2 flex items-center gap-2">
              <span style={{ color }}>◆</span> Metrics
            </h3>
            
            {/* Stat Cards Row */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              <StatCard label="Years" value={yearsExp || 0} cardColor="#00f2ff" icon="◆" delay={0.1} />
              <StatCard label="Projects" value={projectCount || 0} cardColor="#ff00ff" icon="◇" delay={0.2} />
              <StatCard label="Level" value={level || 'N/A'} cardColor="#adff2f" icon="★" delay={0.3} />
            </div>

            {/* Progress Bars */}
            <div className="bg-white/5 rounded-xl p-4">
              <ProgressBar label="Proficiency" value={proficiency} max={100} barColor={color} icon="◈" delay={0.4} />
              <ProgressBar label="Experience" value={yearsExp} max={10} barColor="#00f2ff" icon="◉" delay={0.5} />
              <ProgressBar label="Projects" value={projectCount} max={30} barColor="#ff00ff" icon="◆" delay={0.6} />
            </div>
          </div>

          {/* Summary */}
          <div className="mb-6">
            <h3 className="text-xs text-white/40 uppercase tracking-wider mb-3 border-b border-white/10 pb-2">
              Summary
            </h3>
            <p className="text-sm text-white/80 leading-relaxed">
              {summary}
            </p>
          </div>

          {/* Projects */}
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
                  className="text-xs px-3 py-1.5 rounded cursor-pointer hover:scale-105 transition-transform"
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

          {/* Quick Actions */}
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

          {/* Footer */}
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