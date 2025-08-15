import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  CContainer,
  CHeader,
  CHeaderBrand,
  CHeaderNav,
  CHeaderToggler,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilMenu, cilIndustry } from '@coreui/icons'

const AppHeader = () => {
  const dispatch = useDispatch()
  const sidebarShow = useSelector((state) => state.sidebarShow)

  return (
    <CHeader position="sticky" className="mb-4 d-print-none p-0">
      <CContainer className="h-auto px-3" fluid>
        <CHeaderToggler
          className="ps-1"
          style={{ marginInlineStart: '-14px' }}
          onClick={() => dispatch({ type: 'set', sidebarShow: !sidebarShow })}
        >
          <CIcon icon={cilMenu} size="lg" />
        </CHeaderToggler>
        <CHeaderBrand className="mx-auto d-lg-none">
          <CIcon icon={cilIndustry} height={48} alt="WISE-IoT Logo" />
        </CHeaderBrand>
        <CHeaderNav className="d-none d-md-flex me-auto">
          <div className="header-title">
            <h4 className="mb-0">WISE-IoT SRP 維護服務效益評估系統</h4>
          </div>
        </CHeaderNav>
      </CContainer>
    </CHeader>
  )
}

export default AppHeader