import React from 'react'

const PDFQuote = ({ companyInfo, serviceDetails, shiftPatterns }) => {
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

  // 動態生成服務功能對照表
  const generateFeatureRows = () => {
    const rows = []
    
    // 收集所有不重複的功能項目名稱
    const allPlatformFeatures = new Set([
      ...serviceDetails.platform.basic.features,
      ...serviceDetails.platform.advanced.features,
      ...serviceDetails.platform.premium.features
    ])

    // 平台服務項目 - 按名稱匹配
    allPlatformFeatures.forEach(featureName => {
      if (featureName && featureName.trim()) {
        rows.push({
          type: 'platform',
          name: featureName,
          basic: serviceDetails.platform.basic.features.includes(featureName) ? '✓' : '✗',
          advanced: serviceDetails.platform.advanced.features.includes(featureName) ? '✓' : '✗',
          premium: serviceDetails.platform.premium.features.includes(featureName) ? '✓' : '✗'
        })
      }
    })

    // 收集所有不重複的硬體功能項目名稱
    const allHardwareFeatures = new Set([
      ...serviceDetails.hardware.basic.features,
      ...serviceDetails.hardware.advanced.features,
      ...serviceDetails.hardware.premium.features
    ])

    // 硬體服務項目 - 按名稱匹配
    allHardwareFeatures.forEach(featureName => {
      if (featureName && featureName.trim()) {
        rows.push({
          type: 'hardware',
          name: featureName,
          basic: serviceDetails.hardware.basic.features.includes(featureName) ? '✓' : '✗',
          advanced: serviceDetails.hardware.advanced.features.includes(featureName) ? '✓' : '✗',
          premium: serviceDetails.hardware.premium.features.includes(featureName) ? '✓' : '✗'
        })
      }
    })

    return rows
  }

  const featureRows = generateFeatureRows()
  const platformRows = featureRows.filter(row => row.type === 'platform')
  const hardwareRows = featureRows.filter(row => row.type === 'hardware')

  return (
    <div id="pdf-quote-container" style={{
      width: '794px', // A4寬度(210mm * 3.78)
      minHeight: '1123px', // A4高度(297mm * 3.78)
      margin: '0 auto',
      padding: '40px',
      background: 'white',
      fontFamily: 'Microsoft YaHei, Arial, sans-serif',
      fontSize: '12px',
      lineHeight: '1.4',
      color: '#333',
      boxSizing: 'border-box'
    }}>
      {/* 報價書頭部 */}
      <div style={{
        textAlign: 'center',
        marginBottom: '30px',
        borderBottom: '3px solid #1976d2',
        paddingBottom: '20px'
      }}>
        <h1 style={{
          fontSize: '24px',
          color: '#1976d2',
          margin: '0 0 10px 0',
          fontWeight: 'bold'
        }}>
          研華 WISE-IoT SRP 維運服務報價書
        </h1>
        <div style={{
          fontSize: '14px',
          color: '#666',
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: '15px'
        }}>
          <span>報價日期：{companyInfo.quoteDate}</span>
          <span>有效期限：{companyInfo.validDate}</span>
        </div>
      </div>

      {/* 客戶資訊 */}
      <div style={{
        marginBottom: '25px',
        padding: '15px',
        border: '1px solid #e0e0e0',
        borderRadius: '8px',
        background: '#f9f9f9'
      }}>
        <h3 style={{
          fontSize: '16px',
          color: '#1976d2',
          margin: '0 0 12px 0',
          borderBottom: '1px solid #e0e0e0',
          paddingBottom: '8px'
        }}>
          客戶資訊
        </h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '12px'
        }}>
          <div><strong>公司名稱：</strong>{companyInfo.companyName}</div>
          <div><strong>統一編號：</strong>{companyInfo.taxId}</div>
          <div><strong>聯絡人：</strong>{companyInfo.contact}</div>
          <div><strong>電話：</strong>{companyInfo.phone}</div>
          <div style={{gridColumn: '1 / -1'}}><strong>地址：</strong>{companyInfo.address}</div>
          <div><strong>年營業額：</strong>{(companyInfo.annualRevenue / 10000).toFixed(1)}億台幣</div>
          <div><strong>生產模式：</strong>{shiftPatterns[companyInfo.shiftPattern].name}</div>
        </div>
      </div>

      {/* 服務功能對照表 */}
      <div style={{ marginBottom: '25px' }}>
        <h3 style={{
          fontSize: '16px',
          color: '#1976d2',
          margin: '0 0 15px 0',
          borderBottom: '1px solid #e0e0e0',
          paddingBottom: '8px'
        }}>
          服務功能對照表
        </h3>
        <table style={{
          width: '100%',
          borderCollapse: 'collapse',
          fontSize: '11px'
        }}>
          <thead>
            <tr>
              <th style={{
                border: '1px solid #ddd',
                padding: '8px',
                background: '#f5f5f5',
                textAlign: 'left',
                width: '40%'
              }}>
                維運功能項目
              </th>
              <th style={{
                border: '1px solid #ddd',
                padding: '8px',
                background: '#ffebee',
                textAlign: 'center',
                width: '20%'
              }}>
                Basic
              </th>
              <th style={{
                border: '1px solid #ddd',
                padding: '8px',
                background: '#fff8e1',
                textAlign: 'center',
                width: '20%'
              }}>
                Advanced
              </th>
              <th style={{
                border: '1px solid #ddd',
                padding: '8px',
                background: '#e8f5e8',
                textAlign: 'center',
                width: '20%'
              }}>
                Premium
              </th>
            </tr>
          </thead>
          <tbody>
            {/* 平台與應用層 */}
            <tr>
              <td colSpan="4" style={{
                border: '1px solid #ddd',
                padding: '8px',
                background: '#e3f2fd',
                fontWeight: 'bold',
                color: '#1976d2'
              }}>
                平台與應用層
              </td>
            </tr>
            {platformRows.map((row, index) => (
              <tr key={`platform-${index}`}>
                <td style={{ border: '1px solid #ddd', padding: '6px' }}>{row.name}</td>
                <td style={{ border: '1px solid #ddd', padding: '6px', textAlign: 'center', color: row.basic === '✓' ? '#4caf50' : '#f44336', fontWeight: 'bold' }}>{row.basic}</td>
                <td style={{ border: '1px solid #ddd', padding: '6px', textAlign: 'center', color: row.advanced === '✓' ? '#4caf50' : '#f44336', fontWeight: 'bold' }}>{row.advanced}</td>
                <td style={{ border: '1px solid #ddd', padding: '6px', textAlign: 'center', color: row.premium === '✓' ? '#4caf50' : '#f44336', fontWeight: 'bold' }}>{row.premium}</td>
              </tr>
            ))}
            
            {/* 硬體基礎層 */}
            <tr>
              <td colSpan="4" style={{
                border: '1px solid #ddd',
                padding: '8px',
                background: '#f3e5f5',
                fontWeight: 'bold',
                color: '#9c27b0'
              }}>
                硬體基礎層
              </td>
            </tr>
            {hardwareRows.map((row, index) => (
              <tr key={`hardware-${index}`}>
                <td style={{ border: '1px solid #ddd', padding: '6px' }}>{row.name}</td>
                <td style={{ border: '1px solid #ddd', padding: '6px', textAlign: 'center', color: row.basic === '✓' ? '#4caf50' : '#f44336', fontWeight: 'bold' }}>{row.basic}</td>
                <td style={{ border: '1px solid #ddd', padding: '6px', textAlign: 'center', color: row.advanced === '✓' ? '#4caf50' : '#f44336', fontWeight: 'bold' }}>{row.advanced}</td>
                <td style={{ border: '1px solid #ddd', padding: '6px', textAlign: 'center', color: row.premium === '✓' ? '#4caf50' : '#f44336', fontWeight: 'bold' }}>{row.premium}</td>
              </tr>
            ))}

            {/* 價格資訊 */}
            <tr>
              <td colSpan="4" style={{
                border: '1px solid #ddd',
                padding: '8px',
                background: '#f0f0f0',
                fontWeight: 'bold'
              }}>
                年度價格 (新台幣)
              </td>
            </tr>
            <tr>
              <td style={{ border: '1px solid #ddd', padding: '6px' }}>平台與應用層</td>
              <td style={{ border: '1px solid #ddd', padding: '6px', textAlign: 'center', fontWeight: 'bold', color: '#d32f2f' }}>
                {formatPrice(serviceDetails.platform.basic.price)}
              </td>
              <td style={{ border: '1px solid #ddd', padding: '6px', textAlign: 'center', fontWeight: 'bold', color: '#f57c00' }}>
                {formatPrice(serviceDetails.platform.advanced.price)}
              </td>
              <td style={{ border: '1px solid #ddd', padding: '6px', textAlign: 'center', fontWeight: 'bold', color: '#2e7d32' }}>
                {formatPrice(serviceDetails.platform.premium.price)}
              </td>
            </tr>
            <tr>
              <td style={{ border: '1px solid #ddd', padding: '6px' }}>硬體基礎層</td>
              <td style={{ border: '1px solid #ddd', padding: '6px', textAlign: 'center', fontWeight: 'bold', color: '#d32f2f' }}>
                {formatPrice(serviceDetails.hardware.basic.price)}
              </td>
              <td style={{ border: '1px solid #ddd', padding: '6px', textAlign: 'center', fontWeight: 'bold', color: '#f57c00' }}>
                {formatPrice(serviceDetails.hardware.advanced.price)}
              </td>
              <td style={{ border: '1px solid #ddd', padding: '6px', textAlign: 'center', fontWeight: 'bold', color: '#2e7d32' }}>
                {formatPrice(serviceDetails.hardware.premium.price)}
              </td>
            </tr>
            <tr style={{ background: '#fff3e0' }}>
              <td style={{ border: '1px solid #ddd', padding: '8px', fontWeight: 'bold' }}>組合總價</td>
              <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center', fontSize: '14px', fontWeight: 'bold', color: '#d32f2f' }}>
                {formatPrice(getCombinedPrice('basic', 'basic'))}
              </td>
              <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center', fontSize: '14px', fontWeight: 'bold', color: '#f57c00' }}>
                {formatPrice(getCombinedPrice('advanced', 'advanced'))}
              </td>
              <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center', fontSize: '14px', fontWeight: 'bold', color: '#2e7d32' }}>
                {formatPrice(getCombinedPrice('premium', 'premium'))}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* 成本效益分析 */}
      <div style={{ marginBottom: '25px' }}>
        <h3 style={{
          fontSize: '16px',
          color: '#1976d2',
          margin: '0 0 15px 0',
          borderBottom: '1px solid #e0e0e0',
          paddingBottom: '8px'
        }}>
          💰 成本效益分析
        </h3>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: '15px',
          marginBottom: '20px'
        }}>
          <div style={{
            border: '2px solid #2196f3',
            padding: '12px',
            borderRadius: '6px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '11px', color: '#666', marginBottom: '5px' }}>年營業額</div>
            <div style={{ fontSize: '18px', color: '#2196f3', fontWeight: 'bold' }}>
              {(companyInfo.annualRevenue / 10000).toFixed(1)}億
            </div>
          </div>
          <div style={{
            border: '2px solid #ff9800',
            padding: '12px',
            borderRadius: '6px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '11px', color: '#666', marginBottom: '5px' }}>日營業額</div>
            <div style={{ fontSize: '18px', color: '#ff9800', fontWeight: 'bold' }}>
              {calculateDailyRevenue()}萬
            </div>
          </div>
          <div style={{
            border: '2px solid #f44336',
            padding: '12px',
            borderRadius: '6px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '11px', color: '#666', marginBottom: '5px' }}>時營業額</div>
            <div style={{ fontSize: '18px', color: '#f44336', fontWeight: 'bold' }}>
              {calculateHourlyRevenue()}萬
            </div>
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: '12px',
          fontSize: '11px'
        }}>
          <div style={{
            border: '2px solid #f44336',
            borderRadius: '6px',
            padding: '12px'
          }}>
            <h4 style={{ margin: '0 0 8px 0', color: '#f44336', fontSize: '12px' }}>Basic MA 方案</h4>
            <div style={{ fontWeight: '600', marginBottom: '6px' }}>
              年成本：{formatPrice(getCombinedPrice('basic', 'basic'))}
            </div>
            <div style={{ color: '#f44336', fontWeight: 'bold', marginBottom: '6px' }}>❌ 高風險</div>
            <div style={{ color: '#666', lineHeight: '1.3' }}>
              一次{((getCombinedPrice('premium', 'premium') - getCombinedPrice('basic', 'basic')) / (calculateHourlyRevenue() * 10000)).toFixed(1)}小時停機損失就超過與Premium的差額。
            </div>
          </div>

          <div style={{
            border: '2px solid #ff9800',
            borderRadius: '6px',
            padding: '12px'
          }}>
            <h4 style={{ margin: '0 0 8px 0', color: '#ff9800', fontSize: '12px' }}>Advanced MA 方案</h4>
            <div style={{ fontWeight: '600', marginBottom: '6px' }}>
              年成本：{formatPrice(getCombinedPrice('advanced', 'advanced'))}
            </div>
            <div style={{ color: '#ff9800', fontWeight: 'bold', marginBottom: '6px' }}>⚠️ 中等風險</div>
            <div style={{ color: '#666', lineHeight: '1.3' }}>
              有預防維護但夜班故障風險仍存在，需評估風險承受度。
            </div>
          </div>

          <div style={{
            border: '2px solid #4caf50',
            borderRadius: '6px',
            padding: '12px'
          }}>
            <h4 style={{ margin: '0 0 8px 0', color: '#4caf50', fontSize: '12px' }}>Premium MA 方案</h4>
            <div style={{ fontWeight: '600', marginBottom: '6px' }}>
              年成本：{formatPrice(getCombinedPrice('premium', 'premium'))}
            </div>
            <div style={{ color: '#4caf50', fontWeight: 'bold', marginBottom: '6px' }}>✅ 最佳投資</div>
            <div style={{ color: '#666', lineHeight: '1.3' }}>
              7*24支援，成本僅佔年營業額{(((getCombinedPrice('premium', 'premium') / (companyInfo.annualRevenue * 10000)) * 100)).toFixed(3)}%。
            </div>
          </div>
        </div>
      </div>

      {/* 投資建議 */}
      <div style={{
        border: '2px solid #4caf50',
        borderRadius: '8px',
        padding: '20px',
        background: '#f8fff8'
      }}>
        <h3 style={{
          fontSize: '16px',
          color: '#4caf50',
          margin: '0 0 15px 0',
          textAlign: 'center'
        }}>
          🎯 專業建議
        </h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '15px',
          fontSize: '11px'
        }}>
          <div>
            <h4 style={{ color: '#4caf50', margin: '0 0 8px 0', fontSize: '12px' }}>🎯 成本效益分析</h4>
            <div style={{ margin: '4px 0' }}>
              • 避免{((getCombinedPrice('premium', 'premium') / (calculateHourlyRevenue() * 10000))).toFixed(1)}小時停機即可回本
            </div>
            <div style={{ margin: '4px 0' }}>
              • 每日投資僅{Math.round(getCombinedPrice('premium', 'premium') / 365).toLocaleString()}元
            </div>
            <div style={{ margin: '4px 0' }}>
              • 全年保障價值遠超投資成本
            </div>
          </div>
          <div>
            <h4 style={{ color: '#4caf50', margin: '0 0 8px 0', fontSize: '12px' }}>⚡ Premium方案優勢</h4>
            <div style={{ margin: '4px 0' }}>✓ 平台層：原廠專家諮詢</div>
            <div style={{ margin: '4px 0' }}>✓ 硬體層：7*24全時段支援</div>
            <div style={{ margin: '4px 0' }}>✓ 7*8到場服務優先等級</div>
            <div style={{ margin: '4px 0' }}>✓ 預防性維護最大化</div>
          </div>
        </div>
      </div>

      {/* 頁尾 */}
      <div style={{
        marginTop: '30px',
        paddingTop: '20px',
        borderTop: '1px solid #e0e0e0',
        textAlign: 'center',
        fontSize: '10px',
        color: '#666'
      }}>
        <div style={{ marginBottom: '10px' }}>
          本報價書由 WISE-IoT SRP 維運服務智能評估系統生成
        </div>
        <div>
          如有任何疑問，請聯繫研華科技客服團隊
        </div>
      </div>
    </div>
  )
}

export default PDFQuote