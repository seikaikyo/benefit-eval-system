import React from 'react'
import { calculateRevenue, formatPrice, getCombinedPrice } from '../utils/taxIdService'

const ComparisonTable = ({ companyInfo, serviceDetails, shiftPatterns }) => {
  const calculateDailyRevenue = () => {
    return calculateRevenue.daily(companyInfo.annualRevenue)
  }

  const calculateHourlyRevenue = () => {
    return calculateRevenue.hourly(companyInfo.annualRevenue)
  }

  const getCombinedPriceLocal = (platformType, hardwareType) => {
    return getCombinedPrice(serviceDetails, platformType, hardwareType)
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
    const breakEvenHours = calculateRevenue.breakEvenHours(servicePrice, companyInfo.annualRevenue) // 多少小時停機損失等於服務費用
    
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
              <th style={{width: '40%', textAlign: 'left', background: '#f5f5f5'}}>維運功能項目</th>
              <th style={{width: '20%', textAlign: 'center', background: '#ffebee'}}>Basic</th>
              <th style={{width: '20%', textAlign: 'center', background: '#fff8e1'}}>Advanced</th>
              <th style={{width: '20%', textAlign: 'center', background: '#e8f5e8'}}>Premium</th>
            </tr>
          </thead>
          <tbody>
            {/* 動態生成服務功能對照表 */}
            {(() => {
              const featureRows = generateFeatureRows()
              const platformRows = featureRows.filter(row => row.type === 'platform')
              const hardwareRows = featureRows.filter(row => row.type === 'hardware')
              
              return (
                <>
                  {/* 平台與應用層分組 */}
                  {platformRows.length > 0 && (
                    <>
                      <tr style={{background: '#e3f2fd'}}>
                        <td colSpan="4" style={{fontWeight: 'bold', color: '#1976d2', padding: '10px'}}>
                          平台與應用層
                        </td>
                      </tr>
                      {platformRows.map((row, index) => (
                        <tr key={`platform-${index}`}>
                          <td>{row.name}</td>
                          <td style={{textAlign: 'center', color: row.basic === '✓' ? '#4caf50' : '#f44336'}}>{row.basic}</td>
                          <td style={{textAlign: 'center', color: row.advanced === '✓' ? '#4caf50' : '#f44336'}}>{row.advanced}</td>
                          <td style={{textAlign: 'center', color: row.premium === '✓' ? '#4caf50' : '#f44336'}}>{row.premium}</td>
                        </tr>
                      ))}
                    </>
                  )}
                  
                  {/* 硬體基礎層分組 */}
                  {hardwareRows.length > 0 && (
                    <>
                      <tr style={{background: '#f3e5f5'}}>
                        <td colSpan="4" style={{fontWeight: 'bold', color: '#9c27b0', padding: '10px'}}>
                          硬體基礎層
                        </td>
                      </tr>
                      {hardwareRows.map((row, index) => (
                        <tr key={`hardware-${index}`}>
                          <td>{row.name}</td>
                          <td style={{textAlign: 'center', color: row.basic === '✓' ? '#4caf50' : '#f44336'}}>{row.basic}</td>
                          <td style={{textAlign: 'center', color: row.advanced === '✓' ? '#4caf50' : '#f44336'}}>{row.advanced}</td>
                          <td style={{textAlign: 'center', color: row.premium === '✓' ? '#4caf50' : '#f44336'}}>{row.premium}</td>
                        </tr>
                      ))}
                    </>
                  )}
                </>
              )
            })()}

            {/* 年度價格 */}
            <tr style={{background: '#f0f0f0'}}>
              <td colSpan="4" style={{fontWeight: 'bold', color: '#333', padding: '10px'}}>
                年度價格 (新台幣)
              </td>
            </tr>
            <tr>
              <td>平台與應用層</td>
              <td style={{textAlign: 'center', fontWeight: 'bold', color: '#d32f2f'}}>{formatPrice(serviceDetails.platform.basic.price)}</td>
              <td style={{textAlign: 'center', fontWeight: 'bold', color: '#f57c00'}}>{formatPrice(serviceDetails.platform.advanced.price)}</td>
              <td style={{textAlign: 'center', fontWeight: 'bold', color: '#2e7d32'}}>{formatPrice(serviceDetails.platform.premium.price)}</td>
            </tr>
            <tr>
              <td>硬體基礎層</td>
              <td style={{textAlign: 'center', fontWeight: 'bold', color: '#d32f2f'}}>{formatPrice(serviceDetails.hardware.basic.price)}</td>
              <td style={{textAlign: 'center', fontWeight: 'bold', color: '#f57c00'}}>{formatPrice(serviceDetails.hardware.advanced.price)}</td>
              <td style={{textAlign: 'center', fontWeight: 'bold', color: '#2e7d32'}}>{formatPrice(serviceDetails.hardware.premium.price)}</td>
            </tr>
            <tr style={{background: '#fff3e0', fontWeight: 'bold'}}>
              <td>組合總價</td>
              <td style={{textAlign: 'center', fontSize: '18px', color: '#d32f2f'}}>{formatPrice(getCombinedPriceLocal('basic', 'basic'))}</td>
              <td style={{textAlign: 'center', fontSize: '18px', color: '#f57c00'}}>{formatPrice(getCombinedPriceLocal('advanced', 'advanced'))}</td>
              <td style={{textAlign: 'center', fontSize: '18px', color: '#2e7d32'}}>{formatPrice(getCombinedPriceLocal('premium', 'premium'))}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div id="cost-analysis" className="summary-box">
        <h3>💰 停機風險成本分析</h3>
        
        {/* 班別資訊和基礎營收數據 */}
        <div style={{
          border: '2px solid #e0e0e0', 
          borderRadius: '10px', 
          padding: '25px', 
          marginBottom: '25px',
          background: 'white',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
        }}>
          {/* 班別資訊顯示 */}
          <div style={{
            textAlign: 'center',
            marginBottom: '20px',
            padding: '15px',
            background: `linear-gradient(135deg, ${
              shiftPatterns[companyInfo.shiftPattern].workingHours >= 24 ? '#ff5722, #d84315' :
              shiftPatterns[companyInfo.shiftPattern].workingHours >= 12 ? '#ff9800, #f57c00' :
              '#4caf50, #388e3c'
            })`,
            borderRadius: '10px',
            color: 'white'
          }}>
            <h4 style={{margin: '0 0 8px 0', fontWeight: '600'}}>
              🏭 {shiftPatterns[companyInfo.shiftPattern].name}
            </h4>
            <p style={{margin: '0', fontSize: '14px', opacity: 0.9}}>
              工作時間：{shiftPatterns[companyInfo.shiftPattern].workingHours}小時/天 | 
              風險係數：{(shiftPatterns[companyInfo.shiftPattern].riskMultiplier).toFixed(1)}x
            </p>
          </div>
          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', textAlign: 'center'}}>
            <div style={{border: '2px solid #2196f3', padding: '18px', borderRadius: '8px', background: 'white'}}>
              <p style={{margin: '5px 0', fontSize: '14px', color: '#666', fontWeight: '500'}}>年營業額</p>
              <p style={{margin: '0', fontSize: '24px', color: '#2196f3', fontWeight: 'bold'}}>{(companyInfo.annualRevenue / 10000).toFixed(1)}億</p>
            </div>
            <div style={{border: '2px solid #ff9800', padding: '18px', borderRadius: '8px', background: 'white'}}>
              <p style={{margin: '5px 0', fontSize: '14px', color: '#666', fontWeight: '500'}}>日營業額</p>
              <p style={{margin: '0', fontSize: '24px', color: '#ff9800', fontWeight: 'bold'}}>{calculateDailyRevenue()}萬</p>
            </div>
            <div style={{border: '2px solid #f44336', padding: '18px', borderRadius: '8px', background: 'white'}}>
              <p style={{margin: '5px 0', fontSize: '14px', color: '#666', fontWeight: '500'}}>時營業額</p>
              <p style={{margin: '0', fontSize: '24px', color: '#f44336', fontWeight: 'bold'}}>{calculateHourlyRevenue()}萬</p>
            </div>
          </div>
          <div style={{textAlign: 'center', marginTop: '20px', padding: '12px', border: '2px dashed #ff9800', borderRadius: '8px', background: 'white'}}>
            <span style={{color: '#ef6c00', fontWeight: '600'}}>
              ⚠️ {shiftPatterns[companyInfo.shiftPattern].name}：
              {shiftPatterns[companyInfo.shiftPattern].workingHours >= 24 
                ? '連續生產，系統停機影響重大，建議7*24全時段支援' 
                : shiftPatterns[companyInfo.shiftPattern].workingHours >= 12
                ? '兩班制生產，夜間故障風險需考慮，建議至少5*8+預防維護'
                : '標準班制，工作時間外故障延誤風險可控，5*8支援已足夠'
              }
            </span>
          </div>
        </div>

        {/* 停機時間損失計算 - 考慮班別風險係數 */}
        <div style={{
          border: '2px solid #e0e0e0',
          borderRadius: '10px',
          padding: '25px',
          marginBottom: '25px',
          background: 'white',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
        }}>
          <h4 style={{margin: '0 0 20px 0', color: '#444', fontWeight: '600'}}>⚠️ 停機風險成本分析（已含班別風險係數）</h4>
          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px'}}>
            <div style={{textAlign: 'center', padding: '20px', border: '2px solid #ffc107', borderRadius: '10px', background: 'white'}}>
              <p style={{margin: '8px 0', fontSize: '16px', color: '#666', fontWeight: '500'}}>2小時停機</p>
              <p style={{margin: '0', fontSize: '20px', color: '#f57c00', fontWeight: 'bold'}}>
                損失{calculateRevenue.downtimeRisk(companyInfo.annualRevenue, 2, shiftPatterns[companyInfo.shiftPattern].riskMultiplier)}萬
              </p>
              <p style={{margin: '5px 0 0 0', fontSize: '12px', color: '#999'}}>
                基本損失{(calculateHourlyRevenue() * 2).toFixed(1)}萬 × {(shiftPatterns[companyInfo.shiftPattern].riskMultiplier).toFixed(1)}x風險係數
              </p>
            </div>
            <div style={{textAlign: 'center', padding: '20px', border: '2px solid #ff9800', borderRadius: '10px', background: 'white'}}>
              <p style={{margin: '8px 0', fontSize: '16px', color: '#666', fontWeight: '500'}}>4小時停機</p>
              <p style={{margin: '0', fontSize: '20px', color: '#f57c00', fontWeight: 'bold'}}>
                損失{calculateRevenue.downtimeRisk(companyInfo.annualRevenue, 4, shiftPatterns[companyInfo.shiftPattern].riskMultiplier)}萬
              </p>
              <p style={{margin: '5px 0 0 0', fontSize: '12px', color: '#999'}}>
                基本損失{(calculateHourlyRevenue() * 4).toFixed(1)}萬 × {(shiftPatterns[companyInfo.shiftPattern].riskMultiplier).toFixed(1)}x風險係數
              </p>
            </div>
            <div style={{textAlign: 'center', padding: '20px', border: '2px solid #f44336', borderRadius: '10px', background: 'white'}}>
              <p style={{margin: '8px 0', fontSize: '16px', color: '#666', fontWeight: '500'}}>8小時停機</p>
              <p style={{margin: '0', fontSize: '20px', color: '#f44336', fontWeight: 'bold'}}>
                損失{calculateRevenue.downtimeRisk(companyInfo.annualRevenue, 8, shiftPatterns[companyInfo.shiftPattern].riskMultiplier)}萬
              </p>
              <p style={{margin: '5px 0 0 0', fontSize: '12px', color: '#999'}}>
                基本損失{(calculateHourlyRevenue() * 8).toFixed(1)}萬 × {(shiftPatterns[companyInfo.shiftPattern].riskMultiplier).toFixed(1)}x風險係數
              </p>
            </div>
          </div>
          <div style={{textAlign: 'center', marginTop: '15px', padding: '10px', background: '#f8f9fa', borderRadius: '8px'}}>
            <small style={{color: '#666'}}>
              💡 {shiftPatterns[companyInfo.shiftPattern].name}的風險係數會影響實際損失計算，連續生產環境風險係數更高
            </small>
          </div>
        </div>

        {/* 智慧方案效益分析 */}
        {(() => {
          // 營業額區間判斷，決定每個方案的分析內容
          const revenue = companyInfo.annualRevenue
          
          // Basic方案分析
          const basicAnalysis = (() => {
            if (revenue < 2000) {
              return {
                status: '✅ 推薦',
                color: '#4caf50',
                reason: '小型企業最佳選擇，成本效益平衡',
                detail: `年維護成本${(getCombinedPriceLocal('basic', 'basic') / 10000).toFixed(1)}萬，佔營業額${((getCombinedPriceLocal('basic', 'basic') / (revenue * 10000)) * 100).toFixed(2)}%，基礎保障已足夠`
              }
            } else if (revenue < 5000) {
              return {
                status: '⚠️ 風險偏高',
                color: '#ff9800',
                reason: '中型企業建議升級方案',
                detail: `雖然成本較低，但對${(revenue / 10000).toFixed(1)}億營業額企業而言，缺乏預防維護風險較高`
              }
            } else {
              return {
                status: '❌ 不建議',
                color: '#f44336',
                reason: '大型企業風險過高',
                detail: `一次${calculateRevenue.breakEvenHours(getCombinedPriceLocal('premium', 'premium') - getCombinedPriceLocal('basic', 'basic'), revenue).toFixed(1)}小時停機損失就超過與Premium差額，風險太高`
              }
            }
          })()
          
          // Advanced方案分析
          const advancedAnalysis = (() => {
            if (revenue < 2000) {
              return {
                status: '⚠️ 過度規格',
                color: '#ff9800',
                reason: '小型企業可能過度投資',
                detail: `成本${(getCombinedPriceLocal('advanced', 'advanced') / 10000).toFixed(1)}萬對小型企業負擔較重，Basic方案已能滿足基本需求`
              }
            } else if (revenue < 5000) {
              return {
                status: '✅ 推薦',
                color: '#4caf50',
                reason: '中型企業最佳平衡',
                detail: `有預防維護，成本${(getCombinedPriceLocal('advanced', 'advanced') / 10000).toFixed(1)}萬佔營業額${((getCombinedPriceLocal('advanced', 'advanced') / (revenue * 10000)) * 100).toFixed(2)}%，合理投資`
              }
            } else {
              return {
                status: '⚠️ 風險存在',
                color: '#ff9800',
                reason: '大型企業仍有夜班風險',
                detail: `雖有預防維護，但夜班故障風險對${(revenue / 10000).toFixed(1)}億營業額企業影響重大`
              }
            }
          })()
          
          // Premium方案分析
          const premiumAnalysis = (() => {
            if (revenue < 2000) {
              return {
                status: '⚠️ 投資過大',
                color: '#ff9800',
                reason: '小型企業投資回報期較長',
                detail: `成本${(getCombinedPriceLocal('premium', 'premium') / 10000).toFixed(1)}萬佔營業額${((getCombinedPriceLocal('premium', 'premium') / (revenue * 10000)) * 100).toFixed(2)}%，投資比例偏高`
              }
            } else if (revenue < 5000) {
              return {
                status: '✅ 可考慮',
                color: '#4caf50',
                reason: '中型企業頂級保障',
                detail: `7*24支援提供最高保障，成本${(getCombinedPriceLocal('premium', 'premium') / 10000).toFixed(1)}萬對中型企業負擔合理`
              }
            } else {
              return {
                status: '✅ 強烈推薦',
                color: '#4caf50',
                reason: '大型企業必備保障',
                detail: `成本僅佔營業額${((getCombinedPriceLocal('premium', 'premium') / (revenue * 10000)) * 100).toFixed(3)}%，ROI極高，風險最小化`
              }
            }
          })()
          
          return (
            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginBottom: '25px'}}>
              {/* Basic方案智慧分析 */}
              <div style={{
                border: `2px solid ${basicAnalysis.color}`,
                borderRadius: '10px',
                padding: '20px',
                background: 'white',
                boxShadow: `0 2px 8px ${basicAnalysis.color}20`
              }}>
                <h4 style={{margin: '0 0 12px 0', color: basicAnalysis.color, fontWeight: '600'}}>Basic MA 方案</h4>
                <p style={{margin: '8px 0', fontWeight: '600', color: '#333'}}>年成本：{formatPrice(getCombinedPriceLocal('basic', 'basic'))}</p>
                <p style={{color: basicAnalysis.color, fontWeight: 'bold', margin: '8px 0', fontSize: '16px'}}>{basicAnalysis.status}</p>
                <p style={{margin: '8px 0', fontSize: '14px', color: '#666', lineHeight: '1.5'}}>
                  <strong>{basicAnalysis.reason}</strong><br/>
                  {basicAnalysis.detail}
                </p>
              </div>

              {/* Advanced方案智慧分析 */}
              <div style={{
                border: `2px solid ${advancedAnalysis.color}`,
                borderRadius: '10px',
                padding: '20px',
                background: 'white',
                boxShadow: `0 2px 8px ${advancedAnalysis.color}20`
              }}>
                <h4 style={{margin: '0 0 12px 0', color: advancedAnalysis.color, fontWeight: '600'}}>Advanced MA 方案</h4>
                <p style={{margin: '8px 0', fontWeight: '600', color: '#333'}}>年成本：{formatPrice(getCombinedPriceLocal('advanced', 'advanced'))}</p>
                <p style={{color: advancedAnalysis.color, fontWeight: 'bold', margin: '8px 0', fontSize: '16px'}}>{advancedAnalysis.status}</p>
                <p style={{margin: '8px 0', fontSize: '14px', color: '#666', lineHeight: '1.5'}}>
                  <strong>{advancedAnalysis.reason}</strong><br/>
                  {advancedAnalysis.detail}
                </p>
              </div>

              {/* Premium方案智慧分析 */}
              <div style={{
                border: `2px solid ${premiumAnalysis.color}`,
                borderRadius: '10px',
                padding: '20px',
                background: 'white',
                boxShadow: `0 2px 8px ${premiumAnalysis.color}20`
              }}>
                <h4 style={{margin: '0 0 12px 0', color: premiumAnalysis.color, fontWeight: '600'}}>Premium MA 方案</h4>
                <p style={{margin: '8px 0', fontWeight: '600', color: '#333'}}>年成本：{formatPrice(getCombinedPriceLocal('premium', 'premium'))}</p>
                <p style={{color: premiumAnalysis.color, fontWeight: 'bold', margin: '8px 0', fontSize: '16px'}}>{premiumAnalysis.status}</p>
                <p style={{margin: '8px 0', fontSize: '14px', color: '#666', lineHeight: '1.5'}}>
                  <strong>{premiumAnalysis.reason}</strong><br/>
                  {premiumAnalysis.detail}
                </p>
              </div>
            </div>
          )
        })()}

        {/* 智慧方案推薦系統 */}
        {(() => {
          // 營業額區間判斷
          const revenue = companyInfo.annualRevenue
          let recommendedPlan = ''
          let planColor = ''
          let planIcon = ''
          let analysisContent = null
          
          if (revenue < 2000) {
            recommendedPlan = 'Basic方案最適合'
            planColor = '#2196f3'
            planIcon = '💙'
            analysisContent = {
              title: '小型企業推薦：Basic方案',
              reason: '營業額較小，基礎保障已足夠',
              benefits: [
                `年維護成本僅${(getCombinedPriceLocal('basic', 'basic') / 10000).toFixed(1)}萬，佔營業額${((getCombinedPriceLocal('basic', 'basic') / (revenue * 10000)) * 100).toFixed(2)}%`,
                `避免${Math.ceil(calculateRevenue.breakEvenHours(getCombinedPriceLocal('basic', 'basic'), revenue) / 24)}天停機即可回本`,
                '基礎遠端支援已能處理大部分問題'
              ]
            }
          } else if (revenue < 5000) {
            recommendedPlan = 'Advanced方案最適合'
            planColor = '#ff9800'
            planIcon = '🧡'
            analysisContent = {
              title: '中型企業推薦：Advanced方案',
              reason: '營業額中等，需要更好的預防維護',
              benefits: [
                `年維護成本${(getCombinedPriceLocal('advanced', 'advanced') / 10000).toFixed(1)}萬，佔營業額${((getCombinedPriceLocal('advanced', 'advanced') / (revenue * 10000)) * 100).toFixed(2)}%`,
                `避免${Math.ceil(calculateRevenue.breakEvenHours(getCombinedPriceLocal('advanced', 'advanced'), revenue) / 24)}天停機即可回本`,
                '包含預防性巡檢，大幅降低故障風險'
              ]
            }
          } else {
            recommendedPlan = 'Premium方案最適合'
            planColor = '#4caf50'
            planIcon = '💚'
            analysisContent = {
              title: '大型企業推薦：Premium方案',
              reason: '營業額龐大，停機損失巨大，需要最高等級保障',
              benefits: [
                `年維護成本${(getCombinedPriceLocal('premium', 'premium') / 10000).toFixed(1)}萬，佔營業額僅${((getCombinedPriceLocal('premium', 'premium') / (revenue * 10000)) * 100).toFixed(3)}%`,
                `避免${Math.ceil(calculateRevenue.breakEvenHours(getCombinedPriceLocal('premium', 'premium'), revenue) / 24)}天停機即可回本`,
                '7*24全時段支援，專家諮詢服務'
              ]
            }
          }
          
          return (
            <div style={{
              border: `2px solid ${planColor}`,
              borderRadius: '10px',
              padding: '25px',
              background: 'white',
              marginBottom: '25px',
              boxShadow: `0 2px 8px ${planColor}20`
            }}>
              <h4 style={{
                margin: '0 0 20px 0', 
                color: planColor, 
                textAlign: 'center', 
                fontWeight: '600'
              }}>
                {planIcon} {analysisContent.title}
              </h4>
              
              <div style={{
                background: `${planColor}10`,
                border: `1px solid ${planColor}30`,
                borderRadius: '8px',
                padding: '15px',
                marginBottom: '20px',
                textAlign: 'center'
              }}>
                <p style={{margin: '0', color: planColor, fontWeight: '600'}}>
                  🎯 智慧推薦理由：{analysisContent.reason}
                </p>
              </div>
              
              <div style={{display: 'grid', gridTemplateColumns: '1fr', gap: '15px'}}>
                {analysisContent.benefits.map((benefit, index) => (
                  <div key={index} style={{
                    padding: '12px',
                    border: '1px solid #e0e0e0',
                    borderRadius: '6px',
                    background: '#fafafa'
                  }}>
                    <p style={{margin: '0', fontSize: '14px', color: '#666'}}>✓ {benefit}</p>
                  </div>
                ))}
              </div>
            </div>
          )
        })()}

        {/* 智慧投資效益分析 */}
        {(() => {
          const revenue = companyInfo.annualRevenue
          const recommendedPlan = revenue < 2000 ? 'basic' : revenue < 5000 ? 'advanced' : 'premium'
          const recommendedPrice = getCombinedPriceLocal(recommendedPlan, recommendedPlan)
          const recommendedName = recommendedPlan === 'basic' ? 'Basic' : recommendedPlan === 'advanced' ? 'Advanced' : 'Premium'
          const breakEvenHours = calculateRevenue.breakEvenHours(recommendedPrice, revenue)
          const breakEvenDays = Math.ceil(breakEvenHours / 24)
          
          let analysisContent = null
          let borderColor = ''
          
          if (revenue < 2000) {
            borderColor = '#2196f3'
            analysisContent = {
              title: '💙 小型企業投資效益分析',
              mainText: `${recommendedName}方案年成本 ${(recommendedPrice / 10000).toFixed(1)}萬`,
              comparison: `避免 ${breakEvenDays} 天停機即可回本`,
              detail: `對小型企業而言，Basic方案提供基礎保障，投資回報期短，風險可控`
            }
          } else if (revenue < 5000) {
            borderColor = '#ff9800'
            analysisContent = {
              title: '🧡 中型企業投資效益分析',
              mainText: `${recommendedName}方案年成本 ${(recommendedPrice / 10000).toFixed(1)}萬`,
              comparison: `避免 ${breakEvenDays} 天停機即可回本`,
              detail: `Advanced方案包含預防維護，成本佔營業額${((recommendedPrice / (revenue * 10000)) * 100).toFixed(2)}%，投資合理`
            }
          } else {
            borderColor = '#4caf50'
            analysisContent = {
              title: '💚 大型企業投資效益分析',
              mainText: `${recommendedName}方案年成本 ${(recommendedPrice / 10000).toFixed(1)}萬`,
              comparison: `避免 ${breakEvenDays} 天停機即可回本`,
              detail: `Premium方案成本僅佔營業額${((recommendedPrice / (revenue * 10000)) * 100).toFixed(3)}%，7*24支援ROI極高`
            }
          }
          
          return (
            <div style={{
              border: `2px solid ${borderColor}`,
              borderRadius: '10px',
              padding: '25px',
              background: 'white',
              boxShadow: `0 2px 8px ${borderColor}20`
            }}>
              <h4 style={{margin: '0 0 20px 0', color: borderColor, textAlign: 'center', fontWeight: '600'}}>{analysisContent.title}</h4>
              <div style={{
                textAlign: 'center',
                padding: '20px',
                border: '2px solid #e0e0e0',
                borderRadius: '10px',
                background: 'white',
                fontSize: '18px',
                fontWeight: '600'
              }}>
                <div style={{color: borderColor, marginBottom: '10px'}}>
                  {analysisContent.mainText}
                </div>
                <div style={{color: '#666', fontSize: '16px'}}>
                  {analysisContent.comparison}
                </div>
              </div>
              <div style={{textAlign: 'center', marginTop: '15px', fontSize: '14px', color: '#666'}}>
                {analysisContent.detail}
              </div>
            </div>
          )
        })()}

      </div>
    </div>
  )
}

export default ComparisonTable