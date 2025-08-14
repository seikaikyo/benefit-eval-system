import React from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CForm,
  CFormLabel,
  CFormInput,
  CInputGroup,
  CButton,
  CButtonGroup,
  CFormCheck,
  CBadge
} from '@coreui/react'
import {
  cilCopy,
  cilTrash,
  cilMove,
  cilPlus,
  cilX
} from '@coreui/icons'
import CIcon from '@coreui/icons-react'

const ServiceConfigCard = ({ 
  type, 
  config, 
  category,
  onServiceChange,
  onServiceDuplicate,
  onServiceDelete,
  onFeatureChange,
  onAddFeature,
  onRemoveFeature,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDrop,
  canDelete
}) => {
  
  const getVariantColor = (type) => {
    switch(type) {
      case 'basic': return 'success'
      case 'advanced': return 'warning'  
      case 'premium': return 'danger'
      default: return 'primary'
    }
  }

  return (
    <CCol md={4} className="mb-4">
      <CCard 
        className="h-100 shadow-sm"
        draggable={true}
        onDragStart={(e) => onDragStart(e, category, type)}
        onDragEnd={onDragEnd}
        onDragOver={onDragOver}
        onDrop={(e) => onDrop(e, category, type)}
        style={{ cursor: 'default' }}
      >
        <CCardHeader className="bg-light d-flex justify-content-between align-items-center py-2">
          <div className="d-flex align-items-center">
            <CIcon icon={cilMove} className="me-2 text-muted" size="sm" />
            <CBadge color={getVariantColor(type)} className="me-2">
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </CBadge>
          </div>
          <CButtonGroup size="sm">
            <CButton 
              color="info" 
              variant="ghost"
              onClick={() => onServiceDuplicate(category, type)}
              title="複製此方案"
            >
              <CIcon icon={cilCopy} size="sm" />
            </CButton>
            {canDelete && (
              <CButton 
                color="danger" 
                variant="ghost"
                onClick={() => onServiceDelete(category, type)}
                title="刪除此方案"
              >
                <CIcon icon={cilTrash} size="sm" />
              </CButton>
            )}
          </CButtonGroup>
        </CCardHeader>
        
        <CCardBody className="p-3" onMouseDown={(e) => e.stopPropagation()}>
          <div className="mb-3">
            <CFormCheck 
              id={`${category}-${type}-enabled`}
              label="啟用此方案"
              checked={config.enabled}
              onChange={(e) => onServiceChange(category, type, 'enabled', e.target.checked)}
            />
          </div>

          {/* 方案名稱輸入框 - 移到啟用方案下方 */}
          <div className="mb-3">
            <CFormLabel htmlFor={`${category}-${type}-name`} className="form-label-sm">
              方案名稱
            </CFormLabel>
            <CFormInput 
              id={`${category}-${type}-name`}
              type="text" 
              value={config.title}
              onChange={(e) => onServiceChange(category, type, 'title', e.target.value)}
              size="sm"
              onMouseDown={(e) => e.stopPropagation()}
              onFocus={(e) => e.stopPropagation()}
              onClick={(e) => e.stopPropagation()}
              onDragStart={(e) => e.preventDefault()}
              draggable={false}
              placeholder="輸入方案名稱"
              style={{ 
                cursor: 'text !important',
                pointerEvents: 'auto !important',
                userSelect: 'text !important',
                WebkitUserSelect: 'text !important'
              }}
            />
          </div>
          
          {config.enabled && (
            <>
              <CForm onMouseDown={(e) => e.stopPropagation()}>
                {/* 1. 產品編號 */}
                <div className="mb-3">
                  <CFormLabel htmlFor={`${category}-${type}-code`} className="form-label-sm">
                    產品編號
                  </CFormLabel>
                  <CFormInput 
                    id={`${category}-${type}-code`}
                    type="text" 
                    value={config.productCode}
                    onChange={(e) => onServiceChange(category, type, 'productCode', e.target.value)}
                    size="sm"
                    onMouseDown={(e) => e.stopPropagation()}
                    onFocus={(e) => e.stopPropagation()}
                    onClick={(e) => e.stopPropagation()}
                    draggable={false}
                    style={{ 
                      cursor: 'text !important',
                      pointerEvents: 'auto !important',
                      userSelect: 'text !important'
                    }}
                  />
                </div>

                {/* 2. 服務標題 */}
                <div className="mb-3">
                  <CFormLabel htmlFor={`${category}-${type}-service-title`} className="form-label-sm">
                    服務標題
                  </CFormLabel>
                  <CFormInput 
                    id={`${category}-${type}-service-title`}
                    type="text" 
                    value={`WISE-IoT SRP 維運 ${category === 'platform' ? '平台與應用層' : '硬體基礎層'} ${type.charAt(0).toUpperCase() + type.slice(1)} MA`}
                    onChange={(e) => onServiceChange(category, type, 'serviceTitle', e.target.value)}
                    size="sm"
                    onMouseDown={(e) => e.stopPropagation()}
                    onFocus={(e) => e.stopPropagation()}
                    onClick={(e) => e.stopPropagation()}
                    draggable={false}
                    style={{ 
                      cursor: 'text !important',
                      pointerEvents: 'auto !important',
                      userSelect: 'text !important'
                    }}
                  />
                </div>
                
                {/* 3. 價格 */}
                <div className="mb-3">
                  <CFormLabel htmlFor={`${category}-${type}-price`} className="form-label-sm">
                    價格 (NT$)
                  </CFormLabel>
                  <CFormInput 
                    id={`${category}-${type}-price`}
                    type="number" 
                    value={config.price}
                    onChange={(e) => onServiceChange(category, type, 'price', parseInt(e.target.value) || 0)}
                    size="sm"
                    onMouseDown={(e) => e.stopPropagation()}
                    onFocus={(e) => e.stopPropagation()}
                    onClick={(e) => e.stopPropagation()}
                    draggable={false}
                    style={{ 
                      cursor: 'text !important',
                      pointerEvents: 'auto !important',
                      userSelect: 'text !important'
                    }}
                  />
                </div>
              </CForm>
              
              <div className="border-top pt-3">
                <CFormLabel className="form-label-sm fw-semibold mb-2">
                  服務項目
                </CFormLabel>
                <div className="service-features">
                  {config.features.map((feature, index) => (
                    <CInputGroup key={index} className="mb-2" size="sm">
                      <CFormInput 
                        type="text" 
                        value={feature}
                        onChange={(e) => onFeatureChange(category, type, index, e.target.value)}
                        placeholder="輸入服務項目"
                      />
                      <CButton 
                        color="danger"
                        variant="outline"
                        onClick={() => onRemoveFeature(category, type, index)}
                        title="刪除項目"
                      >
                        <CIcon icon={cilX} size="sm" />
                      </CButton>
                    </CInputGroup>
                  ))}
                  <div className="d-grid">
                    <CButton 
                      color="success"
                      variant="outline"
                      size="sm"
                      onClick={() => onAddFeature(category, type)}
                      className="mt-2"
                    >
                      <CIcon icon={cilPlus} size="sm" className="me-1" />
                      新增項目
                    </CButton>
                  </div>
                </div>
              </div>
            </>
          )}
        </CCardBody>
      </CCard>
    </CCol>
  )
}

export default ServiceConfigCard