import React from 'react'

const ComparisonTable = ({ companyInfo, services }) => {
  const calculateDailyRevenue = () => {
    return Math.floor(companyInfo.annualRevenue / 365 / 10000)
  }

  const calculateHourlyRevenue = () => {
    return Math.floor(companyInfo.annualRevenue / 365 / 24 / 10000)
  }

  const formatPrice = (price) => {
    return `NT$ ${price.toLocaleString()}`
  }

  const getCombinedPrice = (platformType, hardwareType) => {
    const platformPrice = services.platform[platformType].enabled ? 
      services.platform[platformType].price * services.platform[platformType].weight : 0
    const hardwarePrice = services.hardware[hardwareType].enabled ? 
      services.hardware[hardwareType].price * services.hardware[hardwareType].weight : 0
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
              <th rowspan="2" style={{width: '20%', verticalAlign: 'middle'}}>服務類別</th>
              <th colspan="3" style={{textAlign: 'center', background: '#e3f2fd', color: '#1976d2'}}>平台與應用層</th>
              <th colspan="3" style={{textAlign: 'center', background: '#f3e5f5', color: '#9c27b0'}}>硬體基礎層</th>
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
              <td className="platform-col">32WSISPIT1EP01</td>
              <td className="platform-col">32WSISPIT1EP01</td>
              <td className="platform-col">32WSISPIT1EP01</td>
              <td className="hardware-col">HPC-8208-WS01-C*3<br/>968AC00100*2<br/>UN0-2372G-BTO*1</td>
              <td className="hardware-col">HPC-8208-WS01-C*3<br/>968AC00100*2<br/>UN0-2372G-BTO*1</td>
              <td className="hardware-col">HPC-8208-WS01-C*3<br/>968AC00100*2<br/>UN0-2372G-BTO*1</td>
            </tr>
            
            <tr>
              <td className="category-header">年度價格</td>
              <td className="platform-col price-highlight">
                {services.platform.basic.enabled ? formatPrice(services.platform.basic.price * services.platform.basic.weight) : '未選用'}
              </td>
              <td className="platform-col price-highlight">
                {services.platform.advanced.enabled ? formatPrice(services.platform.advanced.price * services.platform.advanced.weight) : '未選用'}
              </td>
              <td className="platform-col price-highlight">
                {services.platform.premium.enabled ? formatPrice(services.platform.premium.price * services.platform.premium.weight) : '未選用'}
              </td>
              <td className="hardware-col price-highlight">
                {services.hardware.basic.enabled ? formatPrice(services.hardware.basic.price * services.hardware.basic.weight) : '未選用'}
              </td>
              <td className="hardware-col price-highlight">
                {services.hardware.advanced.enabled ? formatPrice(services.hardware.advanced.price * services.hardware.advanced.weight) : '未選用'}
              </td>
              <td className="hardware-col price-highlight">
                {services.hardware.premium.enabled ? formatPrice(services.hardware.premium.price * services.hardware.premium.weight) : '未選用'}
              </td>
            </tr>

            {/* 其他服務項目行 */}
            <tr>
              <td className="category-header">技術支持等級</td>
              <td className="platform-col">
                <div className="feature-item">5*8 WISE-PaaS 遠端技術支持</div>
              </td>
              <td className="platform-col">
                <div className="feature-item">5*8 WISE-PaaS 遠端技術支持</div>
              </td>
              <td className="platform-col">
                <div className="feature-item">5*8 WISE-PaaS 遠端技術支持</div>
              </td>
              <td className="hardware-col">
                <div className="feature-item">5*8 技術支持</div>
                <div className="feature-item">工單系統/郵件/免付費電話</div>
              </td>
              <td className="hardware-col">
                <div className="feature-item">5*8 技術支持</div>
                <div className="feature-item">工單系統/郵件/免付費電話</div>
                <div className="feature-item">專屬Line報修管道</div>
              </td>
              <td className="hardware-col">
                <div className="feature-item">7*24 全時段技術支持</div>
                <div className="feature-item">工單系統/郵件/免付費電話</div>
                <div className="feature-item">專屬Line報修管道</div>
                <div className="feature-item">專線電話</div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="summary-box">
        <h3>基於年營業額{(companyInfo.annualRevenue / 100000000).toFixed(1)}億的成本效益分析</h3>
        
        <div style={{background: 'linear-gradient(135deg, #2196f3 0%, #1976d2 100%)', padding: '20px', borderRadius: '8px', marginBottom: '20px', color: 'white'}}>
          <h4 style={{margin: '0 0 15px 0'}}>💰 停機成本 vs 維運成本計算</h4>
          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', textAlign: 'center'}}>
            <div style={{background: 'rgba(255,255,255,0.15)', padding: '15px', borderRadius: '6px'}}>
              <p style={{margin: '5px 0', fontSize: '16px', fontWeight: 'bold'}}>年營業額</p>
              <p style={{margin: '0', fontSize: '24px', color: '#ffeb3b'}}>{(companyInfo.annualRevenue / 100000000).toFixed(1)}億</p>
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