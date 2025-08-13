import React from 'react'

const ConfigPanel = ({ companyInfo, setCompanyInfo, serviceDetails, setServiceDetails, shiftPatterns }) => {
  const handleCompanyInfoChange = (field, value) => {
    setCompanyInfo(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleServiceDetailsChange = (category, type, field, value) => {
    setServiceDetails(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [type]: {
          ...prev[category][type],
          [field]: value
        }
      }
    }))
  }

  const handleFeatureChange = (category, type, index, value) => {
    setServiceDetails(prev => {
      const newFeatures = [...prev[category][type].features]
      newFeatures[index] = value
      return {
        ...prev,
        [category]: {
          ...prev[category],
          [type]: {
            ...prev[category][type],
            features: newFeatures
          }
        }
      }
    })
  }

  const addFeature = (category, type) => {
    setServiceDetails(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [type]: {
          ...prev[category][type],
          features: [...prev[category][type].features, '新增功能項目']
        }
      }
    }))
  }

  const removeFeature = (category, type, index) => {
    setServiceDetails(prev => {
      const newFeatures = prev[category][type].features.filter((_, i) => i !== index)
      return {
        ...prev,
        [category]: {
          ...prev[category],
          [type]: {
            ...prev[category][type],
            features: newFeatures
          }
        }
      }
    })
  }

  return (
    <div className="config-panel">
      <h2>🔧 報價單配置面板</h2>
      
      <div className="config-section">
        <h3>📋 公司資訊</h3>
        <div className="company-info-grid">
          <div className="company-col">
            <label>
              公司名稱:
              <input 
                type="text" 
                value={companyInfo.companyName}
                onChange={(e) => handleCompanyInfoChange('companyName', e.target.value)}
              />
            </label>
            <label>
              聯絡地址:
              <input 
                type="text" 
                value={companyInfo.address}
                onChange={(e) => handleCompanyInfoChange('address', e.target.value)}
              />
            </label>
            <label>
              聯絡人:
              <input 
                type="text" 
                value={companyInfo.contact}
                onChange={(e) => handleCompanyInfoChange('contact', e.target.value)}
              />
            </label>
          </div>
          <div className="company-col">
            <label>
              統一編號:
              <input 
                type="text" 
                value={companyInfo.taxId}
                onChange={(e) => handleCompanyInfoChange('taxId', e.target.value)}
              />
            </label>
            <label>
              電話:
              <input 
                type="text" 
                value={companyInfo.phone}
                onChange={(e) => handleCompanyInfoChange('phone', e.target.value)}
              />
            </label>
            <label>
              傳真:
              <input 
                type="text" 
                value={companyInfo.fax}
                onChange={(e) => handleCompanyInfoChange('fax', e.target.value)}
              />
            </label>
          </div>
          <div className="company-col">
            <label>
              報價日期:
              <input 
                type="date" 
                value={companyInfo.quoteDate}
                onChange={(e) => handleCompanyInfoChange('quoteDate', e.target.value)}
              />
            </label>
            <label>
              有效期限:
              <input 
                type="date" 
                value={companyInfo.validDate}
                onChange={(e) => handleCompanyInfoChange('validDate', e.target.value)}
              />
            </label>
            <label>
              年營業額 (萬元):
              <input 
                type="number" 
                value={companyInfo.annualRevenue}
                onChange={(e) => handleCompanyInfoChange('annualRevenue', parseInt(e.target.value) || 0)}
                placeholder="例如: 150000 (代表15億)"
              />
            </label>
          </div>
        </div>
        <div className="config-row">
          <label>
            特殊需求:
            <input 
              type="text" 
              value={companyInfo.specialRequirements}
              onChange={(e) => handleCompanyInfoChange('specialRequirements', e.target.value)}
            />
          </label>
        </div>
        
        <div className="config-row">
          <label>
            生產班別模式:
            <select 
              value={companyInfo.shiftPattern}
              onChange={(e) => handleCompanyInfoChange('shiftPattern', e.target.value)}
            >
              {Object.entries(shiftPatterns).map(([key, pattern]) => (
                <option key={key} value={key}>
                  {pattern.name} - {pattern.description}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <div className="config-section">
        <h3>📝 服務項目內容編輯</h3>
        
        <div className="service-category">
          <h4>平台與應用層服務</h4>
          {Object.entries(serviceDetails.platform).map(([type, config]) => (
            <div key={type} className="service-config">
              <div className="service-header">
                <h5>{type.charAt(0).toUpperCase() + type.slice(1)} MA</h5>
                <label className="checkbox-label">
                  <input 
                    type="checkbox" 
                    checked={config.enabled}
                    onChange={(e) => handleServiceDetailsChange('platform', type, 'enabled', e.target.checked)}
                  />
                  啟用此方案
                </label>
              </div>
              
              {config.enabled && (
                <>
                  <div className="service-basic-info">
                    <label>
                      產品編號:
                      <input 
                        type="text" 
                        value={config.productCode}
                        onChange={(e) => handleServiceDetailsChange('platform', type, 'productCode', e.target.value)}
                      />
                    </label>
                    <label>
                      服務標題:
                      <input 
                        type="text" 
                        value={config.title}
                        onChange={(e) => handleServiceDetailsChange('platform', type, 'title', e.target.value)}
                      />
                    </label>
                    <label>
                      價格 (NT$):
                      <input 
                        type="number" 
                        value={config.price}
                        onChange={(e) => handleServiceDetailsChange('platform', type, 'price', parseInt(e.target.value) || 0)}
                      />
                    </label>
                  </div>
                  
                  <div className="features-section">
                    <h6>服務項目：</h6>
                    {config.features.map((feature, index) => (
                      <div key={index} className="feature-row">
                        <input 
                          type="text" 
                          value={feature}
                          onChange={(e) => handleFeatureChange('platform', type, index, e.target.value)}
                        />
                        <button 
                          type="button" 
                          onClick={() => removeFeature('platform', type, index)}
                          className="remove-btn"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                    <button 
                      type="button" 
                      onClick={() => addFeature('platform', type)}
                      className="add-btn"
                    >
                      + 新增項目
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>

        <div className="service-category">
          <h4>硬體基礎層服務</h4>
          {Object.entries(serviceDetails.hardware).map(([type, config]) => (
            <div key={type} className="service-config">
              <div className="service-header">
                <h5>{type.charAt(0).toUpperCase() + type.slice(1)} MA</h5>
                <label className="checkbox-label">
                  <input 
                    type="checkbox" 
                    checked={config.enabled}
                    onChange={(e) => handleServiceDetailsChange('hardware', type, 'enabled', e.target.checked)}
                  />
                  啟用此方案
                </label>
              </div>
              
              {config.enabled && (
                <>
                  <div className="service-basic-info">
                    <label>
                      產品編號:
                      <input 
                        type="text" 
                        value={config.productCode}
                        onChange={(e) => handleServiceDetailsChange('hardware', type, 'productCode', e.target.value)}
                      />
                    </label>
                    <label>
                      服務標題:
                      <input 
                        type="text" 
                        value={config.title}
                        onChange={(e) => handleServiceDetailsChange('hardware', type, 'title', e.target.value)}
                      />
                    </label>
                    <label>
                      價格 (NT$):
                      <input 
                        type="number" 
                        value={config.price}
                        onChange={(e) => handleServiceDetailsChange('hardware', type, 'price', parseInt(e.target.value) || 0)}
                      />
                    </label>
                  </div>
                  
                  <div className="features-section">
                    <h6>服務項目：</h6>
                    {config.features.map((feature, index) => (
                      <div key={index} className="feature-row">
                        <input 
                          type="text" 
                          value={feature}
                          onChange={(e) => handleFeatureChange('hardware', type, index, e.target.value)}
                        />
                        <button 
                          type="button" 
                          onClick={() => removeFeature('hardware', type, index)}
                          className="remove-btn"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                    <button 
                      type="button" 
                      onClick={() => addFeature('hardware', type)}
                      className="add-btn"
                    >
                      + 新增項目
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="config-section">
        <h3>ℹ️ 使用說明</h3>
        <div className="info-box">
          <p>• 營業額單位為萬元，例如輸入 150000 代表 15 億元</p>
          <p>• 可以編輯服務項目的標題、產品編號和功能清單</p>
          <p>• 使用「+ 新增項目」可以加入更多服務項目</p>
          <p>• 取消勾選可暫時隱藏該方案</p>
        </div>
      </div>
    </div>
  )
}

export default ConfigPanel