import React, { useState } from 'react'
import './BoidsControls.css'
import type { BoidsSettings } from '../../BoidsParticules.d'

interface BoidsControlsProps {
  settings: BoidsSettings
  onSettingChange: (key: keyof BoidsSettings, value: number) => void
}

export const BoidsControls: React.FC<BoidsControlsProps> = ({
  settings,
  onSettingChange
}) => {
  const [isOpen, setIsOpen] = useState(false)

  const controls = [
    {
      label: '🚫 Force Séparation',
      key: 'separationForce' as keyof BoidsSettings,
      min: 0,
      max: 1,      // ← Encore plus petit
      step: 0.02,  // ← Pas plus fin
      description: 'Évitement des collisions'
    },
    {
      label: '➡️ Force Alignement',
      key: 'alignmentForce' as keyof BoidsSettings,
      min: 0,
      max: 0.8,    // ← Plus petit
      step: 0.02,  
      description: 'Suivre la direction du groupe'
    },
    {
      label: '🎯 Force Cohésion',
      key: 'cohesionForce' as keyof BoidsSettings,
      min: 0,
      max: 0.8,    // ← Plus petit
      step: 0.02,  
      description: 'Attraction vers le centre du groupe'
    },
    {
      label: '🏃 Vitesse Max',
      key: 'maxSpeed' as keyof BoidsSettings,
      min: 0.02,   
      max: 0.5,    // ← Plus petit max
      step: 0.02,  
      description: 'Vitesse maximum des boids'
    },
    {
      label: '⚡ Force Max',
      key: 'maxForce' as keyof BoidsSettings,
      min: 0.005,
      max: 0.05,   // ← Garder petit
      step: 0.005,
      description: 'Force maximum d\'accélération - Plus bas = mouvements plus doux'
    },
    {
      label: '🚧 Évitement Boundaries',
      key: 'boundaryAvoidance' as keyof BoidsSettings,
      min: 0,
      max: 3,
      step: 0.1,
      description: 'Force d\'évitement des murs - Plus élevé = évitement plus fort'
    }
  ]

  return (
    <div className={`boids-controls ${isOpen ? 'open' : ''}`}>
      <button 
        className="controls-toggle"
        onClick={() => setIsOpen(!isOpen)}
      >
        ⚙️ Contrôles Boids Classiques
      </button>
      
      {isOpen && (
        <div className="controls-panel">
          <h3>🐦 Algorithme de Reynolds</h3>
          
          <div className="info-box" style={{
            background: 'rgba(74, 144, 226, 0.1)',
            border: '1px solid rgba(74, 144, 226, 0.3)',
            borderRadius: '8px',
            padding: '10px',
            marginBottom: '15px',
            fontSize: '12px',
            color: '#ccc'
          }}>
            💡 <strong>Les 3 règles des boids :</strong> Séparation (éviter), Alignement (suivre), Cohésion (regrouper)
          </div>
          
          {controls.map(control => (
            <div key={control.key} className="control-group">
              <label className="control-label">
                {control.label}
                <span className="control-value">
                  {settings[control.key].toFixed(3)}
                </span>
              </label>
              
              <input
                type="range"
                min={control.min}
                max={control.max}
                step={control.step}
                value={settings[control.key]}
                onChange={(e) => onSettingChange(control.key, parseFloat(e.target.value))}
                className="control-slider"
              />
              
              <p className="control-description">{control.description}</p>
            </div>
          ))}
          
          <div className="presets">
            <h4>🎯 Comportements Classiques</h4>
            
            <button 
              onClick={() => {
                onSettingChange('separationForce', 2.0)
                onSettingChange('alignmentForce', 0.5)
                onSettingChange('cohesionForce', 0.3)
                onSettingChange('maxSpeed', 0.8)
                onSettingChange('maxForce', 0.025)
              }}
              className="preset-button"
            >
              🌊 Particules Libres
            </button>
            
            <button 
              onClick={() => {
                onSettingChange('separationForce', 1.5)
                onSettingChange('alignmentForce', 1.2)
                onSettingChange('cohesionForce', 1.0)
                onSettingChange('maxSpeed', 1.0)
                onSettingChange('maxForce', 0.03)
              }}
              className="preset-button"
            >
              🐟 Banc de Poissons
            </button>
            
            <button 
              onClick={() => {
                onSettingChange('separationForce', 1.0)
                onSettingChange('alignmentForce', 1.8)
                onSettingChange('cohesionForce', 1.2)
                onSettingChange('maxSpeed', 1.2)
                onSettingChange('maxForce', 0.04)
              }}
              className="preset-button"
            >
              ✈️ Vol d'Oiseaux
            </button>
            
            <button 
              onClick={() => {
                onSettingChange('separationForce', 0.8)
                onSettingChange('alignmentForce', 0.6)
                onSettingChange('cohesionForce', 1.8)
                onSettingChange('maxSpeed', 0.6)
                onSettingChange('maxForce', 0.02)
              }}
              className="preset-button"
            >
              🐝 Essaim Dense
            </button>

            <button 
              onClick={() => {
                onSettingChange('separationForce', 1.5)
                onSettingChange('alignmentForce', 1.0)
                onSettingChange('cohesionForce', 1.0)
                onSettingChange('maxSpeed', 1.0)
                onSettingChange('maxForce', 0.03)
              }}
              className="preset-button"
            >
              🔄 Équilibré (Défaut)
            </button>
          </div>

          <div className="tips" style={{
            marginTop: '15px',
            padding: '10px',
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '8px',
            fontSize: '11px',
            color: '#aaa'
          }}>
            <strong>📖 Guide d'utilisation :</strong><br/>
            • <strong>Séparation ↑</strong> = Les boids gardent plus leurs distances<br/>
            • <strong>Alignement ↑</strong> = Formation plus organisée (lignes, V)<br/>
            • <strong>Cohésion ↑</strong> = Groupes plus serrés (risque d'amas)<br/>
            • <strong>Force Max ↓</strong> = Mouvements plus fluides et naturels<br/>
            • <strong>Vitesse Max ↑</strong> = Animation plus rapide
          </div>

          <div className="performance-info" style={{
            marginTop: '10px',
            padding: '8px',
            background: 'rgba(0, 255, 0, 0.05)',
            borderRadius: '6px',
            fontSize: '10px',
            color: '#9f9'
          }}>
            ⚡ <strong>Performance :</strong> 100 boids, max 8 voisins par boid, boundaries douces
          </div>
        </div>
      )}
    </div>
  )
}