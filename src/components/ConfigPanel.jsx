import React from 'react'
import TaxIdLookup from './TaxIdLookup'

const ConfigPanel = ({ companyInfo, setCompanyInfo, serviceDetails, setServiceDetails, shiftPatterns }) => {
  const handleCompanyInfoChange = (field, value) => {
    setCompanyInfo(prev => ({
      ...prev,
      [field]: value
    }))
  }

  // 處理統編查詢結果自動填入
  const handleCompanyInfoFound = (foundInfo) => {
    setCompanyInfo(prev => ({
      ...prev,
      companyName: foundInfo.companyName || prev.companyName,
      address: foundInfo.address || prev.address,
      contact: foundInfo.contact || prev.contact,
      taxId: foundInfo.taxId || prev.taxId,
      phone: foundInfo.phone || prev.phone
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
      
      <div id="company-info" className="config-section">
        <h3>📋 公司資訊</h3>
        
        {/* 統編查詢功能 */}
        <TaxIdLookup onCompanyInfoFound={handleCompanyInfoFound} />
        
        <div className="company-info-grid">
          <div className="company-col">
            <label>
              公司名稱:
              <input 
                type="text" 
                value={companyInfo.companyName}
                onChange={(e) => handleCompanyInfoChange('companyName', e.target.value)}
                placeholder="可通過統編查詢自動填入"
                style={{
                  background: companyInfo.companyName ? '#f0fff0' : 'white',
                  borderColor: companyInfo.companyName ? '#4caf50' : '#ced4da'
                }}
              />
            </label>
            <label>
              聯絡地址:
              <input 
                type="text" 
                value={companyInfo.address}
                onChange={(e) => handleCompanyInfoChange('address', e.target.value)}
                placeholder="可通過統編查詢自動填入"
                style={{
                  background: companyInfo.address ? '#f0fff0' : 'white',
                  borderColor: companyInfo.address ? '#4caf50' : '#ced4da'
                }}
              />
            </label>
            <label>
              聯絡人:
              <input 
                type="text" 
                value={companyInfo.contact}
                onChange={(e) => handleCompanyInfoChange('contact', e.target.value)}
                placeholder="可通過統編查詢自動填入"
                style={{
                  background: companyInfo.contact ? '#f0fff0' : 'white',
                  borderColor: companyInfo.contact ? '#4caf50' : '#ced4da'
                }}
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
                placeholder="可使用上方查詢功能自動填入"
                style={{
                  background: companyInfo.taxId ? '#f0fff0' : 'white',
                  borderColor: companyInfo.taxId ? '#4caf50' : '#ced4da'
                }}
              />
              {companyInfo.taxId && (
                <small style={{color: '#4caf50', fontSize: '12px'}}>
                  ✓ 統編已填入
                </small>
              )}
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
              Email:
              <input 
                type="email" 
                value={companyInfo.email}
                onChange={(e) => handleCompanyInfoChange('email', e.target.value)}
                placeholder="company@example.com"
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
        <div className="shift-requirements-grid">
          <div id="shift-pattern" className="shift-patterns-section">
            <h4>🏭 生產班別模式</h4>
            <div className="radio-group">
              {Object.entries(shiftPatterns).map(([key, pattern]) => (
                <label key={key} className="radio-label">
                  <input 
                    type="radio" 
                    name="shiftPattern"
                    value={key}
                    checked={companyInfo.shiftPattern === key}
                    onChange={(e) => handleCompanyInfoChange('shiftPattern', e.target.value)}
                  />
                  <div className="radio-content">
                    <strong>{pattern.name}</strong>
                    <span className="radio-description">{pattern.description}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>
          
          <div id="special-requirements" className="requirements-section">
            <h4>📝 特殊需求</h4>
            <textarea 
              value={companyInfo.specialRequirements}
              onChange={(e) => handleCompanyInfoChange('specialRequirements', e.target.value)}
              placeholder="請描述客戶的特殊需求，例如：&#10;• 24小時四班二輪制生產環境&#10;• 系統停機影響重大&#10;• 需要中文介面支援&#10;• 特殊安全要求等..."
              rows="8"
            />
          </div>
        </div>
      </div>

      <div className="config-section">
        <h3>📝 服務項目內容編輯</h3>
        
        <div id="service-config" className="service-category">
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
        <h3>📊 服務項目對比表</h3>
        <div className="service-comparison">
          <table className="comparison-table-config">
            <thead>
              <tr>
                <th style={{width: '15%'}}>服務類型</th>
                <th style={{width: '25%'}}>Basic MA</th>
                <th style={{width: '30%'}}>Advanced MA</th>
                <th style={{width: '30%'}}>Premium MA</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="category-header">平台層價格</td>
                <td className="price-cell">NT$ {serviceDetails.platform.basic.price.toLocaleString()}</td>
                <td className="price-cell">NT$ {serviceDetails.platform.advanced.price.toLocaleString()}</td>
                <td className="price-cell">NT$ {serviceDetails.platform.premium.price.toLocaleString()}</td>
              </tr>
              <tr>
                <td className="category-header">平台層項目</td>
                <td className="features-cell">
                  {serviceDetails.platform.basic.enabled ? (
                    <>
                      {serviceDetails.platform.basic.features.slice(0, 2).map((feature, index) => (
                        <div key={index} className="feature-preview">• {feature}</div>
                      ))}
                      {serviceDetails.platform.basic.features.length > 2 && 
                        <div className="feature-more">...等 {serviceDetails.platform.basic.features.length} 項</div>
                      }
                    </>
                  ) : (
                    <div className="not-included">未包含此服務</div>
                  )}
                </td>
                <td className="features-cell">
                  {serviceDetails.platform.advanced.enabled ? (
                    <>
                      {serviceDetails.platform.advanced.features.slice(0, 2).map((feature, index) => (
                        <div key={index} className="feature-preview">• {feature}</div>
                      ))}
                      {serviceDetails.platform.advanced.features.length > 2 && 
                        <div className="feature-more">...等 {serviceDetails.platform.advanced.features.length} 項</div>
                      }
                    </>
                  ) : (
                    <div className="not-included">未包含此服務</div>
                  )}
                </td>
                <td className="features-cell">
                  {serviceDetails.platform.premium.enabled ? (
                    <>
                      {serviceDetails.platform.premium.features.slice(0, 2).map((feature, index) => (
                        <div key={index} className="feature-preview">• {feature}</div>
                      ))}
                      {serviceDetails.platform.premium.features.length > 2 && 
                        <div className="feature-more">...等 {serviceDetails.platform.premium.features.length} 項</div>
                      }
                    </>
                  ) : (
                    <div className="not-included">未包含此服務</div>
                  )}
                </td>
              </tr>
              <tr>
                <td className="category-header">硬體層價格</td>
                <td className="price-cell">NT$ {serviceDetails.hardware.basic.price.toLocaleString()}</td>
                <td className="price-cell">NT$ {serviceDetails.hardware.advanced.price.toLocaleString()}</td>
                <td className="price-cell">NT$ {serviceDetails.hardware.premium.price.toLocaleString()}</td>
              </tr>
              <tr>
                <td className="category-header">硬體層項目</td>
                <td className="features-cell">
                  {serviceDetails.hardware.basic.enabled ? (
                    <>
                      {serviceDetails.hardware.basic.features.slice(0, 2).map((feature, index) => (
                        <div key={index} className="feature-preview">• {feature}</div>
                      ))}
                      {serviceDetails.hardware.basic.features.length > 2 && 
                        <div className="feature-more">...等 {serviceDetails.hardware.basic.features.length} 項</div>
                      }
                    </>
                  ) : (
                    <div className="not-included">未包含此服務</div>
                  )}
                </td>
                <td className="features-cell">
                  {serviceDetails.hardware.advanced.enabled ? (
                    <>
                      {serviceDetails.hardware.advanced.features.slice(0, 2).map((feature, index) => (
                        <div key={index} className="feature-preview">• {feature}</div>
                      ))}
                      {serviceDetails.hardware.advanced.features.length > 2 && 
                        <div className="feature-more">...等 {serviceDetails.hardware.advanced.features.length} 項</div>
                      }
                    </>
                  ) : (
                    <div className="not-included">未包含此服務</div>
                  )}
                </td>
                <td className="features-cell">
                  {serviceDetails.hardware.premium.enabled ? (
                    <>
                      {serviceDetails.hardware.premium.features.slice(0, 2).map((feature, index) => (
                        <div key={index} className="feature-preview">• {feature}</div>
                      ))}
                      {serviceDetails.hardware.premium.features.length > 2 && 
                        <div className="feature-more">...等 {serviceDetails.hardware.premium.features.length} 項</div>
                      }
                    </>
                  ) : (
                    <div className="not-included">未包含此服務</div>
                  )}
                </td>
              </tr>
              <tr>
                <td className="category-header">組合總價</td>
                <td className="total-price-cell">
                  NT$ {((serviceDetails.platform.basic.enabled ? serviceDetails.platform.basic.price : 0) + 
                        (serviceDetails.hardware.basic.enabled ? serviceDetails.hardware.basic.price : 0)).toLocaleString()}
                </td>
                <td className="total-price-cell">
                  NT$ {((serviceDetails.platform.advanced.enabled ? serviceDetails.platform.advanced.price : 0) + 
                        (serviceDetails.hardware.advanced.enabled ? serviceDetails.hardware.advanced.price : 0)).toLocaleString()}
                </td>
                <td className="total-price-cell">
                  NT$ {((serviceDetails.platform.premium.enabled ? serviceDetails.platform.premium.price : 0) + 
                        (serviceDetails.hardware.premium.enabled ? serviceDetails.hardware.premium.price : 0)).toLocaleString()}
                </td>
              </tr>
            </tbody>
          </table>
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