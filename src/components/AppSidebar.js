import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { CSidebar, CSidebarBrand, CSidebarToggler } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilIndustry } from '@coreui/icons'

// 使用我們的 UserGuide 組件作為導航
import UserGuide from './UserGuide'

const AppSidebar = () => {
  const dispatch = useDispatch()
  const unfoldable = useSelector((state) => state.sidebarUnfoldable)
  const sidebarShow = useSelector((state) => state.sidebarShow)

  return (
    <CSidebar
      className="d-print-none sidebar sidebar-fixed"
      colorScheme="dark"
      placement="start"
      size="lg"
      unfoldable={unfoldable}
      visible={sidebarShow}
      onVisibleChange={(visible) => {
        dispatch({ type: 'set', sidebarShow: visible })
      }}
    >
      <CSidebarBrand className="d-md-flex">
        <CIcon icon={cilIndustry} height={35} className="sidebar-brand-full" />
        <div className="sidebar-brand-text">
          <div className="brand-title">WISE-IoT SRP</div>
          <div className="brand-subtitle">維護服務效益評估</div>
        </div>
      </CSidebarBrand>
      
      <UserGuide />
      
      <CSidebarToggler
        className="d-none d-lg-flex"
        onClick={() => dispatch({ type: 'set', sidebarUnfoldable: !unfoldable })}
      />
    </CSidebar>
  )
}

export default React.memo(AppSidebar)