import React from 'react'

const ComparisonTable = ({ companyInfo, serviceDetails }) => {
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
              <td className="category-header">24小時生產適用性</td>
              <td className="platform-col" style={{background: '#ffebee'}}>
                <div className="feature-item" style={{color: '#d32f2f', fontWeight: 'bold'}}>⚠️ 不建議</div>
                <div className="feature-item">僅5*8支持，夜班發生問題無法即時處理</div>
                <div className="feature-item">無定期巡檢，風險較高</div>
                <div className="feature-item">適合：有強大內部維運團隊的環境</div>
              </td>
              <td className="platform-col" style={{background: '#fff3e0'}}>
                <div className="feature-item" style={{color: '#f57c00', fontWeight: 'bold'}}>⚠️ 有條件適用</div>
                <div className="feature-item">5*8支持，夜班仍有風險</div>
                <div className="feature-item">有定期巡檢，可預防性發現問題</div>
                <div className="feature-item">適合：有夜班維運人員的環境</div>
              </td>
              <td className="platform-col" style={{background: '#e8f5e8'}}>
                <div className="feature-item" style={{color: '#2e7d32', fontWeight: 'bold'}}>✅ 強烈建議</div>
                <div className="feature-item">5*8支持，但有專家諮詢服務</div>
                <div className="feature-item">原廠專家可協助架構優化</div>
                <div className="feature-item">適合：需要專業指導的連續生產</div>
              </td>
              <td className="hardware-col" style={{background: '#ffebee'}}>
                <div className="feature-item" style={{color: '#d32f2f', fontWeight: 'bold'}}>⚠️ 不建議</div>
                <div className="feature-item">僅5*8支持，夜班硬體故障風險高</div>
                <div className="feature-item">無定期巡檢，預防性維護不足</div>
                <div className="feature-item">適合：有備援系統的環境</div>
              </td>
              <td className="hardware-col" style={{background: '#fff3e0'}}>
                <div className="feature-item" style={{color: '#f57c00', fontWeight: 'bold'}}>⚠️ 有條件適用</div>
                <div className="feature-item">5*8支持，夜班硬體問題需自行處理</div>
                <div className="feature-item">有預防性維護，降低故障機率</div>
                <div className="feature-item">適合：有內部硬體維修能力</div>
              </td>
              <td className="hardware-col" style={{background: '#e8f5e8'}}>
                <div className="feature-item" style={{color: '#2e7d32', fontWeight: 'bold'}}>✅ 強烈建議</div>
                <div className="feature-item">7*24全時段技術支持</div>
                <div className="feature-item">7*8到場服務，快速響應</div>
                <div className="feature-item">最適合：關鍵連續生產環境</div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="summary-box">
        <h3>基於年營業額{(companyInfo.annualRevenue / 10000).toFixed(1)}億的成本效益分析</h3>
        
        <div style={{background: 'linear-gradient(135deg, #2196f3 0%, #1976d2 100%)', padding: '20px', borderRadius: '8px', marginBottom: '20px', color: 'white'}}>
          <h4 style={{margin: '0 0 15px 0'}}>💰 停機成本 vs 維運成本計算</h4>
          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', textAlign: 'center'}}>
            <div style={{background: 'rgba(255,255,255,0.15)', padding: '15px', borderRadius: '6px'}}>
              <p style={{margin: '5px 0', fontSize: '16px', fontWeight: 'bold'}}>年營業額</p>
              <p style={{margin: '0', fontSize: '24px', color: '#ffeb3b'}}>{(companyInfo.annualRevenue / 10000).toFixed(1)}億</p>
            </div>
            <div style={{background: 'rgba(255,255,255,0.15)', padding: '15px', borderRadius: '6px'}}>
              <p style={{margin: '5px 0', fontSize: '16px', fontWeight: 'bold'}}>日營業額</p>
              <p style={{margin: '0', fontSize: '24px', color: '#ffeb3b'}}>{calculateDailyRevenue()}萬</p>
            </div>
            <div style={{background: 'rgba(255,255,255,0.15)', padding: '15px', borderRadius: '6px'}}>
              <p style={{margin: '5px 0', fontSize: '16px', fontWeight: 'bold'}}>時營業額</p>
              <p style={{margin: '0', fontSize: '24px', color: '#ffeb3b'}}>{calculateHourlyRevenue()}萬</p>
            </div>
          </div>
        </div>

        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px', marginTop: '15px'}}>
          <div className="summary-item" style={{background: 'rgba(244, 67, 54, 0.2)'}}>
            <h4>Basic MA 組合方案</h4>
            <p><strong>年成本：{formatPrice(getCombinedPrice('basic', 'basic'))}</strong></p>
            <p style={{color: '#d32f2f', fontWeight: 'bold'}}>❌ 高風險</p>
            <p>僅5*8支援，對24小時生產環境風險過高。</p>
          </div>
          <div className="summary-item" style={{background: 'rgba(255, 152, 0, 0.2)'}}>
            <h4>Advanced MA 組合方案</h4>
            <p><strong>年成本：{formatPrice(getCombinedPrice('advanced', 'advanced'))}</strong></p>
            <p style={{color: '#f57c00', fontWeight: 'bold'}}>⚠️ 中等風險</p>
            <p>有預防性維護但夜班故障風險仍存在。</p>
          </div>
          <div className="summary-item" style={{background: 'rgba(76, 175, 80, 0.2)'}}>
            <h4>Premium MA 組合方案</h4>
            <p><strong>年成本：{formatPrice(getCombinedPrice('premium', 'premium'))}</strong></p>
            <p style={{color: '#2e7d32', fontWeight: 'bold'}}>✅ 最佳選擇</p>
            <p>7*24支援，最適合關鍵生產環境。</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ComparisonTable