import React from 'react'

const Footer = () => {
  return (
    <footer style={{
      background: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)',
      color: 'white',
      padding: '2rem',
      marginTop: '3rem',
      textAlign: 'center',
      borderRadius: '10px 10px 0 0'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '2rem',
          flexWrap: 'wrap'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <span>🎨 設計開發:</span>
            <a 
              href="https://github.com/seikaikyo/benefit-eval-system" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{
                color: '#fff',
                textDecoration: 'none',
                fontWeight: 'bold',
                borderBottom: '2px solid rgba(255,255,255,0.3)',
                paddingBottom: '2px'
              }}
              onMouseOver={(e) => e.target.style.borderBottom = '2px solid #fff'}
              onMouseOut={(e) => e.target.style.borderBottom = '2px solid rgba(255,255,255,0.3)'}
            >
              選我正解
            </a>
          </div>
        </div>
        
        <div style={{
          fontSize: '0.9rem',
          opacity: '0.8',
          borderTop: '1px solid rgba(255,255,255,0.2)',
          paddingTop: '1rem',
          marginTop: '1rem'
        }}>
          <p style={{ margin: '0' }}>
            WISE-IoT SRP 維護服務效益評估系統 V2.1.8 © 2025 | 
            Built with React + Vite + CoreUI
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer