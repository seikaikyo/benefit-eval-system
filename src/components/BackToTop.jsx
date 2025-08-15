import React, { useState, useEffect } from 'react'
import CIcon from '@coreui/icons-react'
import { cilArrowTop } from '@coreui/icons'

const BackToTop = () => {
  const [isVisible, setIsVisible] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    // 檢查是否為手機版
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // 監聽滾動事件，決定是否顯示按鈕（僅桌面版）
  useEffect(() => {
    if (isMobile) {
      // 手機版直接顯示，不做滾動偵測
      setIsVisible(true)
      return
    }

    const toggleVisibility = () => {
      const scrolled = window.pageYOffset || 
                      document.documentElement.scrollTop || 
                      document.body.scrollTop || 0
      
      if (scrolled > 300) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    // 桌面版才做滾動偵測
    toggleVisibility()
    window.addEventListener('scroll', toggleVisibility, { passive: true })
    
    return () => {
      window.removeEventListener('scroll', toggleVisibility)
    }
  }, [isMobile])

  // 平滑滾動到頂部
  const scrollToTop = () => {
    // 多種方式確保兼容性
    if (window.scrollTo) {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      })
    } else {
      // 回退方案
      document.documentElement.scrollTop = 0
      document.body.scrollTop = 0
    }
  }

  return (
    <button
      className={`back-to-top-btn ${isVisible ? 'visible' : 'hidden'}`}
      onClick={scrollToTop}
      aria-label="回到頂部"
      title="回到頂部"
      style={{ 
        display: isVisible ? 'flex' : 'none',
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        zIndex: 99999
      }}
    >
      <CIcon icon={cilArrowTop} size="lg" />
    </button>
  )
}

export default BackToTop