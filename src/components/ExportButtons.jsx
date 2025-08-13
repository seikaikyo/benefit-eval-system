import React from 'react'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import * as XLSX from 'xlsx'

const ExportButtons = ({ companyInfo, serviceDetails, shiftPatterns }) => {
  // 智能分析服務適用性 (從 ComparisonTable 複製過來)
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
    const breakEvenHours = servicePrice / hourlyRevenue
    
    // 根據班別和服務特性評估
    let level, recommendation, color, items = []
    
    if (currentShift.workingHours >= 24) {
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
  const exportToPDF = async () => {
    try {
      const element = document.getElementById('comparison-table-container')
      
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      })

      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF('l', 'mm', 'a4')
      
      const imgWidth = 297
      const pageHeight = 210
      const imgHeight = (canvas.height * imgWidth) / canvas.width
      let heightLeft = imgHeight

      let position = 0

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight
        pdf.addPage()
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
        heightLeft -= pageHeight
      }

      const fileName = `${companyInfo.companyName}_效益評估_${companyInfo.quoteDate.replace(/\//g, '')}.pdf`
      pdf.save(fileName)
    } catch (error) {
      console.error('PDF export failed:', error)
      alert('PDF匯出失敗，請稍後再試')
    }
  }

  const exportToExcel = () => {
    try {
      const workbook = XLSX.utils.book_new()
      
      // 公司資訊工作表
      const companyData = [
        ['項目', '內容'],
        ['公司名稱', companyInfo.companyName],
        ['聯絡地址', companyInfo.address],
        ['聯絡人', companyInfo.contact],
        ['統一編號', companyInfo.taxId],
        ['電話', companyInfo.phone],
        ['傳真', companyInfo.fax],
        ['報價日期', companyInfo.quoteDate],
        ['有效期限', companyInfo.validDate],
        ['年營業額 (萬元)', companyInfo.annualRevenue],
        ['年營業額 (新台幣)', `NT$ ${(companyInfo.annualRevenue * 10000).toLocaleString()}`],
        ['特殊需求', companyInfo.specialRequirements],
        ['生產班別', shiftPatterns[companyInfo.shiftPattern].name],
        ['班別描述', shiftPatterns[companyInfo.shiftPattern].description]
      ]
      const companyWS = XLSX.utils.aoa_to_sheet(companyData)
      XLSX.utils.book_append_sheet(workbook, companyWS, '公司資訊')

      // 服務詳細工作表
      const servicesData = [
        ['服務類型', '方案', '產品編號', '服務標題', '價格', '啟用狀態', '服務項目']
      ]
      
      Object.entries(serviceDetails.platform).forEach(([type, config]) => {
        servicesData.push([
          '平台與應用層',
          `${type.charAt(0).toUpperCase() + type.slice(1)} MA`,
          config.productCode,
          config.title,
          config.price,
          config.enabled ? '是' : '否',
          config.features.join('; ')
        ])
      })
      
      Object.entries(serviceDetails.hardware).forEach(([type, config]) => {
        servicesData.push([
          '硬體基礎層',
          `${type.charAt(0).toUpperCase() + type.slice(1)} MA`,
          config.productCode,
          config.title,
          config.price,
          config.enabled ? '是' : '否',
          config.features.join('; ')
        ])
      })
      
      const servicesWS = XLSX.utils.aoa_to_sheet(servicesData)
      XLSX.utils.book_append_sheet(workbook, servicesWS, '服務詳細')

      // 成本效益分析工作表
      const annualRevenueNT = companyInfo.annualRevenue * 10000
      const dailyRevenue = Math.floor(annualRevenueNT / 365)
      const hourlyRevenue = Math.floor(annualRevenueNT / 365 / 24)
      
      const costBenefitData = [
        ['項目', '數值'],
        ['年營業額 (萬元)', companyInfo.annualRevenue],
        ['年營業額 (新台幣)', annualRevenueNT],
        ['日營業額', dailyRevenue],
        ['時營業額', hourlyRevenue],
        ['生產班別', shiftPatterns[companyInfo.shiftPattern].name],
        ['班別描述', shiftPatterns[companyInfo.shiftPattern].description],
        ['', ''],
        ['停機時間', '損失金額'],
        ['2小時', hourlyRevenue * 2],
        ['4小時', hourlyRevenue * 4],
        ['8小時', hourlyRevenue * 8],
        ['', ''],
        ['方案組合', '年度成本'],
        ['Basic + Basic', (serviceDetails.platform.basic.enabled ? serviceDetails.platform.basic.price : 0) + (serviceDetails.hardware.basic.enabled ? serviceDetails.hardware.basic.price : 0)],
        ['Advanced + Advanced', (serviceDetails.platform.advanced.enabled ? serviceDetails.platform.advanced.price : 0) + (serviceDetails.hardware.advanced.enabled ? serviceDetails.hardware.advanced.price : 0)],
        ['Premium + Premium', (serviceDetails.platform.premium.enabled ? serviceDetails.platform.premium.price : 0) + (serviceDetails.hardware.premium.enabled ? serviceDetails.hardware.premium.price : 0)]
      ]
      const costBenefitWS = XLSX.utils.aoa_to_sheet(costBenefitData)
      XLSX.utils.book_append_sheet(workbook, costBenefitWS, '成本效益分析')

      // 智能適用性分析工作表
      const suitabilityData = [
        ['服務類型', '方案', '適用性評級', '推薦狀態', '分析要點']
      ]
      
      // 平台服務分析
      ['basic', 'advanced', 'premium'].forEach(type => {
        const analysis = analyzeServiceSuitability('platform', type)
        suitabilityData.push([
          '平台與應用層',
          `${type.charAt(0).toUpperCase() + type.slice(1)} MA`,
          analysis.level,
          analysis.recommendation,
          analysis.items.join(' | ')
        ])
      })
      
      // 硬體服務分析
      ['basic', 'advanced', 'premium'].forEach(type => {
        const analysis = analyzeServiceSuitability('hardware', type)
        suitabilityData.push([
          '硬體基礎層',
          `${type.charAt(0).toUpperCase() + type.slice(1)} MA`,
          analysis.level,
          analysis.recommendation,
          analysis.items.join(' | ')
        ])
      })
      
      const suitabilityWS = XLSX.utils.aoa_to_sheet(suitabilityData)
      XLSX.utils.book_append_sheet(workbook, suitabilityWS, '智能適用性分析')

      // 綜合建議工作表
      const recommendationData = [
        ['建議類型', '內容'],
        ['', ''],
        ['基於您的營運模式分析', ''],
        ['公司名稱', companyInfo.companyName],
        ['年營業額', `${(companyInfo.annualRevenue / 10000).toFixed(1)}億台幣`],
        ['生產模式', shiftPatterns[companyInfo.shiftPattern].name],
        ['特殊需求', companyInfo.specialRequirements],
        ['', ''],
        ['成本效益計算', ''],
        ['每小時營業額', `${hourlyRevenue.toLocaleString()}元`],
        ['服務投資回報時間', ''],
      ]

      // 為每個組合計算回報時間
      const combinations = [
        { name: 'Basic組合', platform: 'basic', hardware: 'basic' },
        { name: 'Advanced組合', platform: 'advanced', hardware: 'advanced' },
        { name: 'Premium組合', platform: 'premium', hardware: 'premium' }
      ]

      combinations.forEach(combo => {
        const totalCost = (serviceDetails.platform[combo.platform].enabled ? serviceDetails.platform[combo.platform].price : 0) + 
                         (serviceDetails.hardware[combo.hardware].enabled ? serviceDetails.hardware[combo.hardware].price : 0)
        const breakEvenHours = totalCost / hourlyRevenue
        recommendationData.push([
          combo.name,
          `避免${breakEvenHours.toFixed(1)}小時停機即可回本 (年成本${totalCost.toLocaleString()}元)`
        ])
      })

      recommendationData.push(['', ''])
      recommendationData.push(['最終建議', ''])
      
      // 根據班別給出具體建議
      if (shiftPatterns[companyInfo.shiftPattern].workingHours >= 24) {
        recommendationData.push(['建議方案', 'Premium組合 - 24小時生產環境的最佳選擇'])
        recommendationData.push(['理由', '7*24技術支援+預防性維護，確保連續生產不中斷'])
      } else if (shiftPatterns[companyInfo.shiftPattern].workingHours >= 12) {
        recommendationData.push(['建議方案', 'Advanced組合 - 兩班制生產的平衡選擇'])
        recommendationData.push(['理由', '充足技術支援+預防性維護，成本效益佳'])
      } else {
        recommendationData.push(['建議方案', 'Advanced組合 - 標準班制的推薦選擇'])
        recommendationData.push(['理由', '服務等級匹配，預防性維護降低風險'])
      }

      const recommendationWS = XLSX.utils.aoa_to_sheet(recommendationData)
      XLSX.utils.book_append_sheet(workbook, recommendationWS, '綜合建議')

      const fileName = `${companyInfo.companyName}_效益評估數據_${companyInfo.quoteDate.replace(/\//g, '')}.xlsx`
      XLSX.writeFile(workbook, fileName)
    } catch (error) {
      console.error('Excel export failed:', error)
      alert('Excel匯出失敗，請稍後再試')
    }
  }

  return (
    <div className="export-buttons">
      <h3>📤 匯出選項</h3>
      <div className="button-group">
        <button 
          className="export-btn pdf-btn" 
          onClick={exportToPDF}
          title="匯出完整比較表為PDF格式"
        >
          📄 匯出 PDF
        </button>
        <button 
          className="export-btn excel-btn" 
          onClick={exportToExcel}
          title="匯出詳細數據為Excel格式，便於後續編輯"
        >
          📊 匯出 Excel
        </button>
      </div>
      <div className="export-info">
        <p>• PDF格式：適合簡報和客戶展示</p>
        <p>• Excel格式：便於數據編輯和進一步分析</p>
      </div>
    </div>
  )
}

export default ExportButtons