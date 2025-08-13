import React from 'react'

const ComparisonTable = ({ companyInfo, serviceDetails, shiftPatterns }) => {
  const calculateDailyRevenue = () => {
    return Math.floor(companyInfo.annualRevenue * 10000 / 365 / 10000)
  }

  const calculateHourlyRevenue = () => {
    return Math.floor(companyInfo.annualRevenue * 10000 / 365 / 24 / 10000)
  }

  const formatPrice = (price) => {
    return `NT$ ${price.toLocaleString()}`
  }

  const getCombinedPrice = (platformType, hardwareType) => {
    const platformPrice = serviceDetails.platform[platformType].enabled ? 
      serviceDetails.platform[platformType].price : 0
    const hardwarePrice = serviceDetails.hardware[hardwareType].enabled ? 
      serviceDetails.hardware[hardwareType].price : 0
    return platformPrice + hardwarePrice
  }

  // 智能分析服務適用性
  const analyzeServiceSuitability = (category, type) => {
    const service = serviceDetails[category][type]
    if (!service.enabled) return { level: 'disabled', recommendation: '未啟用', color: '#9e9e9e', items: ['此方案未啟用'] }
    
    const features = service.features.join(' ').toLowerCase()
    const currentShift = shiftPatterns[companyInfo.shiftPattern]
    const annualRevenueNT = companyInfo.annualRevenue * 10000
    const servicePrice = service.price
    
    // 分析關鍵字
    const has24x7 = features.includes('7*24') || features.includes('24小時') || features.includes('全時段')
    const has5x8 = features.includes('5*8') || features.includes('工作時間')
    const hasInspection = features.includes('巡檢') || features.includes('定期') || features.includes('檢查')
    const hasOnSite = features.includes('到場') || features.includes('現場') || features.includes('維修')
    
    // 計算停機損失 vs 服務成本比
    const hourlyRevenue = annualRevenueNT / 365 / 24
    const breakEvenHours = servicePrice / hourlyRevenue // 多少小時停機損失等於服務費用
    
    // 根據班別和服務特性評估
    let level, recommendation, color, items = []
    
    if (currentShift.workingHours >= 24) {
      // 24小時生產環境
      if (has24x7 && hasOnSite && hasInspection) {
        level = 'excellent'
        recommendation = '✅ 強烈推薦'
        color = '#2e7d32'
        items = [
          `💰 成本效益：避免 ${breakEvenHours.toFixed(1)} 小時停機即可回本`,
          '🔧 全時段技術支援，最適合連續生產',
          '🚀 到場服務與預防性維護並重',
          '⚡ 風險最小化，生產連續性最大化'
        ]
      } else if (has5x8 && hasInspection) {
        level = 'conditional'
        recommendation = '⚠️ 有條件適用'
        color = '#f57c00'
        items = [
          `💰 成本效益：避免 ${breakEvenHours.toFixed(1)} 小時停機即可回本`,
          '⏰ 夜班時段仍有風險，需內部支援',
          '🔍 有預防性維護，可降低故障機率',
          '👥 建議：配備夜班技術人員'
        ]
      } else {
        level = 'risky'
        recommendation = '❌ 不建議'
        color = '#d32f2f'
        items = [
          `💰 風險：單次 ${breakEvenHours.toFixed(1)} 小時停機損失就超過節省成本`,
          '🚨 24小時生產但缺乏夜間支援',
          '⚠️ 無預防性維護，故障風險高',
          '💡 建議：升級到更高級別方案'
        ]
      }
    } else if (currentShift.workingHours >= 12) {
      // 12小時或兩班制
      if (has24x7 || (has5x8 && hasInspection)) {
        level = 'excellent'
        recommendation = '✅ 推薦'
        color = '#2e7d32'
        items = [
          `💰 成本效益：避免 ${breakEvenHours.toFixed(1)} 小時停機即可回本`,
          '⚖️ 服務等級與生產需求匹配',
          '🔧 充足的技術支援覆蓋範圍'
        ]
      } else if (has5x8) {
        level = 'conditional'
        recommendation = '⚠️ 基本適用'
        color = '#f57c00'
        items = [
          `💰 成本效益：避免 ${breakEvenHours.toFixed(1)} 小時停機即可回本`,
          '⏰ 夜班時段風險可控',
          '🔧 基本技術支援已足夠'
        ]
      } else {
        level = 'basic'
        recommendation = '⚠️ 最低需求'
        color = '#ff9800'
        items = [
          `💰 成本考量：${breakEvenHours.toFixed(1)} 小時停機即抵消節省`,
          '⚖️ 服務等級偏低，適合風險承受度高的環境'
        ]
      }
    } else {
      // 8小時標準班制
      if (has5x8) {
        level = 'excellent'
        recommendation = '✅ 完全適用'
        color = '#2e7d32'
        items = [
          `💰 成本效益：避免 ${breakEvenHours.toFixed(1)} 小時停機即可回本`,
          '⏰ 服務時間與工作時間完美匹配',
          '💡 成本效益最佳化的選擇'
        ]
      } else {
        level = 'basic'
        recommendation = '✅ 基本適用'
        color = '#4caf50'
        items = [
          `💰 成本效益：避免 ${breakEvenHours.toFixed(1)} 小時停機即可回本`,
          '⚖️ 基本服務滿足標準班制需求'
        ]
      }
    }
    
    return { level, recommendation, color, items }
  }

  return (
    <div id="comparison-table-container">
      <div className="header">
        <h1>研華 WISE-IoT SRP 維運服務方案比較表</h1>
        <p>客戶：{companyInfo.companyName} | 報價日期：{companyInfo.quoteDate} | 有效期限：{companyInfo.validDate}</p>
        <p style={{background: 'rgba(255,255,255,0.2)', padding: '8px', borderRadius: '5px', marginTop: '10px'}}>
          🏭 <strong>特殊需求：{companyInfo.specialRequirements}</strong> - 系統停機影響重大
        </p>
      </div>

      <div className="comparison-container">
        <table className="comparison-table">
          <thead>
            <tr>
              <th rowSpan="2" style={{width: '20%', verticalAlign: 'middle'}}>服務類別</th>
              <th colSpan="3" style={{textAlign: 'center', background: '#e3f2fd', color: '#1976d2'}}>平台與應用層</th>
              <th colSpan="3" style={{textAlign: 'center', background: '#f3e5f5', color: '#9c27b0'}}>硬體基礎層</th>
            </tr>
            <tr>
              <th style={{width: '13.33%'}} className="platform-col">Basic MA</th>
              <th style={{width: '13.33%'}} className="platform-col">Advanced MA</th>
              <th style={{width: '13.33%'}} className="platform-col">Premium MA</th>
              <th style={{width: '13.33%'}} className="hardware-col">Basic MA</th>
              <th style={{width: '13.33%'}} className="hardware-col">Advanced MA</th>
              <th style={{width: '13.33%'}} className="hardware-col">Premium MA</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="category-header">產品編號</td>
              <td className="platform-col">{serviceDetails.platform.basic.productCode}</td>
              <td className="platform-col">{serviceDetails.platform.advanced.productCode}</td>
              <td className="platform-col">{serviceDetails.platform.premium.productCode}</td>
              <td className="hardware-col">{serviceDetails.hardware.basic.productCode}</td>
              <td className="hardware-col">{serviceDetails.hardware.advanced.productCode}</td>
              <td className="hardware-col">{serviceDetails.hardware.premium.productCode}</td>
            </tr>
            
            <tr>
              <td className="category-header">年度價格</td>
              <td className="platform-col price-highlight">
                {serviceDetails.platform.basic.enabled ? formatPrice(serviceDetails.platform.basic.price) : '未選用'}
              </td>
              <td className="platform-col price-highlight">
                {serviceDetails.platform.advanced.enabled ? formatPrice(serviceDetails.platform.advanced.price) : '未選用'}
              </td>
              <td className="platform-col price-highlight">
                {serviceDetails.platform.premium.enabled ? formatPrice(serviceDetails.platform.premium.price) : '未選用'}
              </td>
              <td className="hardware-col price-highlight">
                {serviceDetails.hardware.basic.enabled ? formatPrice(serviceDetails.hardware.basic.price) : '未選用'}
              </td>
              <td className="hardware-col price-highlight">
                {serviceDetails.hardware.advanced.enabled ? formatPrice(serviceDetails.hardware.advanced.price) : '未選用'}
              </td>
              <td className="hardware-col price-highlight">
                {serviceDetails.hardware.premium.enabled ? formatPrice(serviceDetails.hardware.premium.price) : '未選用'}
              </td>
            </tr>

            <tr>
              <td className="category-header">服務項目詳細</td>
              <td className="platform-col">
                {serviceDetails.platform.basic.enabled && serviceDetails.platform.basic.features.map((feature, index) => (
                  <div key={index} className="feature-item">{feature}</div>
                ))}
              </td>
              <td className="platform-col">
                {serviceDetails.platform.advanced.enabled && serviceDetails.platform.advanced.features.map((feature, index) => (
                  <div key={index} className="feature-item">{feature}</div>
                ))}
              </td>
              <td className="platform-col">
                {serviceDetails.platform.premium.enabled && serviceDetails.platform.premium.features.map((feature, index) => (
                  <div key={index} className="feature-item">{feature}</div>
                ))}
              </td>
              <td className="hardware-col">
                {serviceDetails.hardware.basic.enabled && serviceDetails.hardware.basic.features.map((feature, index) => (
                  <div key={index} className="feature-item">{feature}</div>
                ))}
              </td>
              <td className="hardware-col">
                {serviceDetails.hardware.advanced.enabled && serviceDetails.hardware.advanced.features.map((feature, index) => (
                  <div key={index} className="feature-item">{feature}</div>
                ))}
              </td>
              <td className="hardware-col">
                {serviceDetails.hardware.premium.enabled && serviceDetails.hardware.premium.features.map((feature, index) => (
                  <div key={index} className="feature-item">{feature}</div>
                ))}
              </td>
            </tr>

            <tr>
              <td className="category-header">{shiftPatterns[companyInfo.shiftPattern].name} 適用性分析</td>
              {['basic', 'advanced', 'premium'].map(type => {
                const analysis = analyzeServiceSuitability('platform', type)
                return (
                  <td key={`platform-${type}`} className="platform-col" style={{
                    border: `2px solid ${analysis.level === 'excellent' ? '#4caf50' : analysis.level === 'conditional' ? '#ff9800' : analysis.level === 'disabled' ? '#9e9e9e' : '#f44336'}`,
                    background: 'white'
                  }}>
                    <div className="feature-item" style={{color: analysis.color, fontWeight: 'bold', padding: '5px', borderRadius: '4px', background: analysis.level === 'excellent' ? '#f1f8e9' : analysis.level === 'conditional' ? '#fff8e1' : analysis.level === 'disabled' ? '#fafafa' : '#ffebee'}}>{analysis.recommendation}</div>
                    {analysis.items.map((item, index) => (
                      <div key={index} className="feature-item">{item}</div>
                    ))}
                  </td>
                )
              })}
              {['basic', 'advanced', 'premium'].map(type => {
                const analysis = analyzeServiceSuitability('hardware', type)
                return (
                  <td key={`hardware-${type}`} className="hardware-col" style={{
                    border: `2px solid ${analysis.level === 'excellent' ? '#4caf50' : analysis.level === 'conditional' ? '#ff9800' : analysis.level === 'disabled' ? '#9e9e9e' : '#f44336'}`,
                    background: 'white'
                  }}>
                    <div className="feature-item" style={{color: analysis.color, fontWeight: 'bold', padding: '5px', borderRadius: '4px', background: analysis.level === 'excellent' ? '#f1f8e9' : analysis.level === 'conditional' ? '#fff8e1' : analysis.level === 'disabled' ? '#fafafa' : '#ffebee'}}>{analysis.recommendation}</div>
                    {analysis.items.map((item, index) => (
                      <div key={index} className="feature-item">{item}</div>
                    ))}
                  </td>
                )
              })}
            </tr>
          </tbody>
        </table>
      </div>

      <div className="summary-box">
        <h3>💰 停機風險成本分析</h3>
        
        {/* 基礎營收數據 */}
        <div style={{
          border: '2px solid #2196f3', 
          borderRadius: '8px', 
          padding: '20px', 
          marginBottom: '20px',
          background: 'linear-gradient(135deg, #f8fbff 0%, #e3f2fd 100%)'
        }}>
          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', textAlign: 'center'}}>
            <div style={{border: '1px solid #2196f3', padding: '15px', borderRadius: '6px', background: 'white'}}>
              <p style={{margin: '5px 0', fontSize: '14px', color: '#1976d2', fontWeight: 'bold'}}>年營業額</p>
              <p style={{margin: '0', fontSize: '20px', color: '#d32f2f', fontWeight: 'bold'}}>{(companyInfo.annualRevenue / 10000).toFixed(1)}億</p>
            </div>
            <div style={{border: '1px solid #2196f3', padding: '15px', borderRadius: '6px', background: 'white'}}>
              <p style={{margin: '5px 0', fontSize: '14px', color: '#1976d2', fontWeight: 'bold'}}>日營業額</p>
              <p style={{margin: '0', fontSize: '20px', color: '#f57c00', fontWeight: 'bold'}}>{calculateDailyRevenue()}萬</p>
            </div>
            <div style={{border: '1px solid #2196f3', padding: '15px', borderRadius: '6px', background: 'white'}}>
              <p style={{margin: '5px 0', fontSize: '14px', color: '#1976d2', fontWeight: 'bold'}}>時營業額</p>
              <p style={{margin: '0', fontSize: '20px', color: '#ff5722', fontWeight: 'bold'}}>{calculateHourlyRevenue()}萬</p>
            </div>
          </div>
          <div style={{textAlign: 'center', marginTop: '15px', padding: '10px', border: '1px dashed #ff5722', borderRadius: '5px', background: '#fff3e0'}}>
            <span style={{color: '#e65100', fontWeight: 'bold'}}>⚠️ 表班故障警示無人處理，可能延誤4小時以上造成損失</span>
          </div>
        </div>

        {/* 停機時間損失計算 */}
        <div style={{
          border: '2px solid #ff9800',
          borderRadius: '8px',
          padding: '20px',
          marginBottom: '20px',
          background: 'linear-gradient(135deg, #fffbf3 0%, #fff8e1 100%)'
        }}>
          <h4 style={{margin: '0 0 15px 0', color: '#e65100'}}>⚠️ 停機風險成本分析</h4>
          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px'}}>
            <div style={{textAlign: 'center', padding: '15px', border: '1px solid #ffcc02', borderRadius: '6px', background: '#fffde7'}}>
              <p style={{margin: '5px 0', fontSize: '16px', color: '#f57c00', fontWeight: 'bold'}}>2小時停機</p>
              <p style={{margin: '0', fontSize: '18px', color: '#d84315', fontWeight: 'bold'}}>損失{calculateHourlyRevenue() * 2}萬</p>
            </div>
            <div style={{textAlign: 'center', padding: '15px', border: '1px solid #ff6f00', borderRadius: '6px', background: '#fff3e0'}}>
              <p style={{margin: '5px 0', fontSize: '16px', color: '#f57c00', fontWeight: 'bold'}}>4小時停機</p>
              <p style={{margin: '0', fontSize: '18px', color: '#d84315', fontWeight: 'bold'}}>損失{calculateHourlyRevenue() * 4}萬</p>
            </div>
            <div style={{textAlign: 'center', padding: '15px', border: '1px solid #e65100', borderRadius: '6px', background: '#fbe9e7'}}>
              <p style={{margin: '5px 0', fontSize: '16px', color: '#f57c00', fontWeight: 'bold'}}>8小時停機</p>
              <p style={{margin: '0', fontSize: '18px', color: '#d84315', fontWeight: 'bold'}}>損失{calculateHourlyRevenue() * 8}萬</p>
            </div>
          </div>
        </div>

        {/* 方案成本效益比較 */}
        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px', marginBottom: '20px'}}>
          {/* Basic方案 */}
          <div style={{
            border: '2px solid #f44336',
            borderRadius: '8px',
            padding: '15px',
            background: '#ffebee'
          }}>
            <h4 style={{margin: '0 0 10px 0', color: '#c62828'}}>Basic MA 方案</h4>
            <p style={{margin: '5px 0', fontWeight: 'bold'}}>年成本：{formatPrice(getCombinedPrice('basic', 'basic'))}</p>
            <p style={{color: '#d32f2f', fontWeight: 'bold', margin: '5px 0'}}>❌ 高風險</p>
            <p style={{margin: '5px 0', fontSize: '14px'}}>一次2小時停機損失({calculateHourlyRevenue() * 2}萬)就超過與Premium的差額，對15億營業面言風險太高。</p>
          </div>

          {/* Advanced方案 */}
          <div style={{
            border: '2px solid #ff9800',
            borderRadius: '8px',
            padding: '15px',
            background: '#fff8e1'
          }}>
            <h4 style={{margin: '0 0 10px 0', color: '#f57c00'}}>Advanced MA 方案</h4>
            <p style={{margin: '5px 0', fontWeight: 'bold'}}>年成本：{formatPrice(getCombinedPrice('advanced', 'advanced'))}</p>
            <p style={{color: '#f57c00', fontWeight: 'bold', margin: '5px 0'}}>⚠️ 中等風險</p>
            <p style={{margin: '5px 0', fontSize: '14px'}}>有預防維護但夜班故障風險仍存在，一次4小時停機損失可能超過年整體節省效益。</p>
          </div>

          {/* Premium方案 */}
          <div style={{
            border: '2px solid #4caf50',
            borderRadius: '8px',
            padding: '15px',
            background: '#e8f5e8'
          }}>
            <h4 style={{margin: '0 0 10px 0', color: '#2e7d32'}}>Premium MA 方案</h4>
            <p style={{margin: '5px 0', fontWeight: 'bold'}}>年成本：{formatPrice(getCombinedPrice('premium', 'premium'))}</p>
            <p style={{color: '#2e7d32', fontWeight: 'bold', margin: '5px 0'}}>✅ 最佳投資</p>
            <p style={{margin: '5px 0', fontSize: '14px'}}>7*24支援，最適合連續性要求。成本僅佔年營業額0.067%，ROI極高。</p>
          </div>
        </div>

        {/* Premium方案詳細優勢 */}
        <div style={{
          border: '2px solid #4caf50',
          borderRadius: '8px',
          padding: '20px',
          background: 'linear-gradient(135deg, #f1f8e9 0%, #e8f5e8 100%)',
          marginBottom: '20px'
        }}>
          <h4 style={{margin: '0 0 15px 0', color: '#2e7d32', textAlign: 'center'}}>🌟 Premium方案：最明智的投資決策</h4>
          
          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px'}}>
            <div>
              <h5 style={{color: '#2e7d32', margin: '0 0 10px 0'}}>🎯 成本占比極低</h5>
              <p style={{margin: '0', fontSize: '14px'}}>維護成本占年營業額僅{((getCombinedPrice('premium', 'premium') / (companyInfo.annualRevenue * 10000)) * 100).toFixed(3)}%</p>
              <p style={{margin: '5px 0', fontSize: '14px'}}>相當於每天投資{Math.round(getCombinedPrice('premium', 'premium') / 365).toLocaleString()}元獲得全方位保障</p>
            </div>
            
            <div>
              <h5 style={{color: '#2e7d32', margin: '0 0 10px 0'}}>⚡ 回本速度極快</h5>
              <p style={{margin: '0', fontSize: '14px'}}>避免一次{(getCombinedPrice('premium', 'premium') / (calculateHourlyRevenue() * 10000)).toFixed(1)}小時停機即可回本</p>
              <p style={{margin: '5px 0', fontSize: '14px'}}>一年避免1天大停機超值{(24 * calculateHourlyRevenue() - getCombinedPrice('premium', 'premium') / 10000).toFixed(0)}萬效益</p>
            </div>
          </div>
        </div>

        {/* 成本對比總結 */}
        <div style={{
          border: '2px solid #673ab7',
          borderRadius: '8px',
          padding: '20px',
          background: 'linear-gradient(135deg, #f8f5ff 0%, #ede7f6 100%)'
        }}>
          <h4 style={{margin: '0 0 15px 0', color: '#4527a0', textAlign: 'center'}}>📊 Premium方案年成本 vs 單次停機損失</h4>
          <div style={{
            textAlign: 'center',
            padding: '15px',
            border: '1px solid #9c27b0',
            borderRadius: '6px',
            background: 'white',
            fontSize: '18px',
            fontWeight: 'bold'
          }}>
            <span style={{color: '#4caf50'}}>{getCombinedPrice('premium', 'premium').toLocaleString()}萬建置成本</span>
            <span style={{margin: '0 20px', color: '#666'}}>&lt;</span>
            <span style={{color: '#f44336'}}>{Math.round((getCombinedPrice('premium', 'premium') / (calculateHourlyRevenue() * 10000)) * 24)}小時停機損失({Math.round(getCombinedPrice('premium', 'premium') / (calculateHourlyRevenue() * 10000) * 24 * calculateHourlyRevenue())}萬)</span>
          </div>
        </div>

        {/* 最終建議 */}
        <div style={{
          border: '2px solid #4caf50',
          borderRadius: '8px',
          padding: '20px',
          marginTop: '20px',
          background: 'linear-gradient(135deg, #e8f5e8 0%, #c8e6c8 100%)'
        }}>
          <h4 style={{margin: '0 0 15px 0', color: '#2e7d32'}}>🎯 Premium方案優勢總結</h4>
          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px'}}>
            <div>
              <div style={{margin: '5px 0', display: 'flex', alignItems: 'center'}}>
                <span style={{color: '#4caf50', marginRight: '8px'}}>✓</span>
                <span style={{fontSize: '14px'}}>平台層：原廠專家諮詢</span>
              </div>
              <div style={{margin: '5px 0', display: 'flex', alignItems: 'center'}}>
                <span style={{color: '#4caf50', marginRight: '8px'}}>✓</span>
                <span style={{fontSize: '14px'}}>硬體層：7*24全時段支援</span>
              </div>
              <div style={{margin: '5px 0', display: 'flex', alignItems: 'center'}}>
                <span style={{color: '#4caf50', marginRight: '8px'}}>✓</span>
                <span style={{fontSize: '14px'}}>7*8到場服務優先等級</span>
              </div>
            </div>
            <div>
              <div style={{margin: '5px 0', display: 'flex', alignItems: 'center'}}>
                <span style={{color: '#4caf50', marginRight: '8px'}}>✓</span>
                <span style={{fontSize: '14px'}}>專線電話先進維護</span>
              </div>
              <div style={{margin: '5px 0', display: 'flex', alignItems: 'center'}}>
                <span style={{color: '#4caf50', marginRight: '8px'}}>✓</span>
                <span style={{fontSize: '14px'}}>預防性件更換最大化</span>
              </div>
              <div style={{margin: '5px 0', display: 'flex', alignItems: 'center'}}>
                <span style={{color: '#4caf50', marginRight: '8px'}}>✓</span>
                <span style={{fontSize: '14px'}}>業績優化調整指導</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ComparisonTable