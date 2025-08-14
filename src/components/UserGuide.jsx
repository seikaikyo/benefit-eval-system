import React from 'react'
import {
  CSidebarNav,
  CNavGroup,
  CNavItem,
  CNavTitle
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
  cilBuilding,
  cilIndustry,
  cilNotes,
  cilSettings,
  cilChart,
  cilMoney,
  cilDescription,
  cilSpeedometer
} from '@coreui/icons'

const UserGuide = () => {
  
  // 導航錨點配置 - 使用CoreUI圖標
  const navigationItems = [
    { 
      id: 'company-info', 
      icon: cilBuilding,
      label: '公司資訊', 
      description: '統編查詢與基本資料' 
    },
    { 
      id: 'shift-pattern', 
      icon: cilIndustry,
      label: '生產班別', 
      description: '選擇生產模式' 
    },
    { 
      id: 'special-requirements', 
      icon: cilNotes,
      label: '特殊需求', 
      description: '填寫客製化需求' 
    },
    { 
      id: 'service-config', 
      icon: cilSettings,
      label: '服務配置', 
      description: '調整服務方案與價格' 
    },
    { 
      id: 'comparison-table-container', 
      icon: cilChart,
      label: '方案比較', 
      description: '查看詳細對照表' 
    },
    { 
      id: 'cost-analysis', 
      icon: cilMoney,
      label: '成本分析', 
      description: '檢視停機風險評估' 
    },
    { 
      id: 'export-section', 
      icon: cilDescription,
      label: '匯出報價', 
      description: '生成PDF或Excel報價書' 
    }
  ]
  
  // 平滑滾動到指定區域
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start',
        inline: 'nearest'
      })
      // 高亮顯示目標元素
      element.style.boxShadow = '0 0 20px rgba(25, 118, 210, 0.3)'
      setTimeout(() => {
        element.style.boxShadow = ''
      }, 2000)
    }
  }


  return (
    <div style={{ padding: '1rem 0' }}>
      <CSidebarNav>
        <CNavTitle>
          <CIcon icon={cilSpeedometer} className="me-2" />
          報價單快速導航
        </CNavTitle>
        
        {navigationItems.map((item) => (
          <CNavItem
            key={item.id}
            href="#"
            onClick={(e) => {
              e.preventDefault()
              scrollToSection(item.id)
            }}
            style={{ cursor: 'pointer' }}
          >
            <CIcon customClassName="nav-icon" icon={item.icon} />
            {item.label}
          </CNavItem>
        ))}

        <CNavGroup
          toggler={
            <>
              <CIcon customClassName="nav-icon" icon={cilNotes} />
              使用說明
            </>
          }
        >
          <CNavItem>基本操作指南</CNavItem>
          <CNavItem>進階功能說明</CNavItem>
          <CNavItem>常見問題解決</CNavItem>
          <CNavItem>使用技巧</CNavItem>
        </CNavGroup>
      </CSidebarNav>
    </div>
  )
}

export default UserGuide