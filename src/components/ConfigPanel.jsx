import React from 'react'

const ConfigPanel = ({ companyInfo, setCompanyInfo, services, setServices }) => {
  const handleCompanyInfoChange = (field, value) => {
    setCompanyInfo(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleServiceChange = (category, type, field, value) => {
    setServices(prev => ({
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

  return (
    <div className="config-panel">
      <h2>🔧 效益評估配置面板</h2>
      
      <div className="config-section">
        <h3>📋 公司資訊</h3>
        <div className="config-row">
          <label>
            公司名稱:
            <input 
              type="text" 
              value={companyInfo.companyName}
              onChange={(e) => handleCompanyInfoChange('companyName', e.target.value)}
            />
          </label>
        </div>
        <div className="config-row">
          <label>
            年營業額 (NT$):
            <input 
              type="number" 
              value={companyInfo.annualRevenue}
              onChange={(e) => handleCompanyInfoChange('annualRevenue', parseInt(e.target.value) || 0)}
            />
          </label>
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
      </div>

      <div className="config-section">
        <h3>⚖️ 服務權重設定</h3>
        
        <div className="service-category">
          <h4>平台與應用層服務</h4>
          {Object.entries(services.platform).map(([type, config]) => (
            <div key={type} className="service-config">
              <h5>{type.charAt(0).toUpperCase() + type.slice(1)} MA</h5>
              <div className="config-controls">
                <label className="checkbox-label">
                  <input 
                    type="checkbox" 
                    checked={config.enabled}
                    onChange={(e) => handleServiceChange('platform', type, 'enabled', e.target.checked)}
                  />
                  啟用此方案
                </label>
                {config.enabled && (
                  <>
                    <label>
                      基礎價格: NT$ {config.price.toLocaleString()}
                    </label>
                    <label>
                      權重係數:
                      <input 
                        type="number" 
                        min="0.1" 
                        max="5" 
                        step="0.1"
                        value={config.weight}
                        onChange={(e) => handleServiceChange('platform', type, 'weight', parseFloat(e.target.value) || 1)}
                      />
                    </label>
                    <label>
                      調整後價格: NT$ {(config.price * config.weight).toLocaleString()}
                    </label>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="service-category">
          <h4>硬體基礎層服務</h4>
          {Object.entries(services.hardware).map(([type, config]) => (
            <div key={type} className="service-config">
              <h5>{type.charAt(0).toUpperCase() + type.slice(1)} MA</h5>
              <div className="config-controls">
                <label className="checkbox-label">
                  <input 
                    type="checkbox" 
                    checked={config.enabled}
                    onChange={(e) => handleServiceChange('hardware', type, 'enabled', e.target.checked)}
                  />
                  啟用此方案
                </label>
                {config.enabled && (
                  <>
                    <label>
                      基礎價格: NT$ {config.price.toLocaleString()}
                    </label>
                    <label>
                      權重係數:
                      <input 
                        type="number" 
                        min="0.1" 
                        max="5" 
                        step="0.1"
                        value={config.weight}
                        onChange={(e) => handleServiceChange('hardware', type, 'weight', parseFloat(e.target.value) || 1)}
                      />
                    </label>
                    <label>
                      調整後價格: NT$ {(config.price * config.weight).toLocaleString()}
                    </label>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="config-section">
        <h3>ℹ️ 權重設定說明</h3>
        <div className="info-box">
          <p>• 權重係數可調整各方案的價格，範圍為 0.1 - 5.0</p>
          <p>• 1.0 = 原價；小於 1.0 = 折扣；大於 1.0 = 加價</p>
          <p>• 可用於模擬不同商務條件下的效益分析</p>
          <p>• 取消勾選可暫時隱藏該方案</p>
        </div>
      </div>
    </div>
  )
}

export default ConfigPanel