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

  // 監聽滾動事件，決定是否顯示按鈕
  useEffect(() => {
    const toggleVisibility = () => {
      let scrolled = 0
      
      if (isMobile) {
        // 手機版檢查 .admin-main 容器的滾動
        const adminMain = document.querySelector('.admin-main')
        if (adminMain) {
          scrolled = adminMain.scrollTop
        }
      } else {
        // 桌面版檢查 window 滾動
        scrolled = window.pageYOffset || 
                   document.documentElement.scrollTop || 
                   document.body.scrollTop || 0
      }
      
      if (scrolled > 300) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    // 初始檢查
    toggleVisibility()
    
    if (isMobile) {
      // 手機版監聽 .admin-main 容器的滾動
      const adminMain = document.querySelector('.admin-main')
      if (adminMain) {
        adminMain.addEventListener('scroll', toggleVisibility, { passive: true })
        return () => {
          adminMain.removeEventListener('scroll', toggleVisibility)
        }
      }
    } else {
      // 桌面版監聽 window 滾動
      window.addEventListener('scroll', toggleVisibility, { passive: true })
      return () => {
        window.removeEventListener('scroll', toggleVisibility)
      }
    }
  }, [isMobile])

  // 平滑滾動到頂部
  const scrollToTop = () => {
    if (isMobile) {
      // 手機版滾動 .admin-main 容器
      const adminMain = document.querySelector('.admin-main')
      if (adminMain) {
        if (adminMain.scrollTo) {
          adminMain.scrollTo({
            top: 0,
            behavior: 'smooth'
          })
        } else {
          adminMain.scrollTop = 0
        }
      }
    } else {
      // 桌面版滾動 window
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