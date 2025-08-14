import React, { useState } from 'react'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import * as XLSX from 'xlsx'
import { pdf } from '@react-pdf/renderer'
import PDFQuote from './PDFQuote'
import ReactPDFQuote from './ReactPDFQuote'
import { calculateRevenue, formatPrice, getCombinedPrice } from '../utils/taxIdService'

const ExportButtons = ({ companyInfo, serviceDetails, shiftPatterns }) => {
  const [showPDFPreview, setShowPDFPreview] = useState(false)
  const [pdfProgress, setPdfProgress] = useState(0)
  const [isGenerating, setIsGenerating] = useState(false)
  const [currentStep, setCurrentStep] = useState('')
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
    const hourlyRevenue = calculateRevenue.hourly(companyInfo.annualRevenue)
    const breakEvenHours = calculateRevenue.breakEvenHours(servicePrice, companyInfo.annualRevenue)
    
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

  const exportPDFQuote = async () => {
    try {
      // 驗證必要資料
      if (!companyInfo.companyName.trim()) {
        alert('請先填寫公司名稱')
        return
      }
      
      // 開始生成流程
      setIsGenerating(true)
      setPdfProgress(0)
      setCurrentStep('正在準備PDF預覽...')
      setShowPDFPreview(true)
      
      // 步驟1: DOM載入檢查
      setCurrentStep('正在載入頁面內容...')
      setPdfProgress(20)
      
      await new Promise(resolve => {
        const checkElement = () => {
          const element = document.getElementById('pdf-quote-container')
          if (element && element.offsetHeight > 0) {
            setTimeout(resolve, 200)
          } else {
            setTimeout(checkElement, 50)
          }
        }
        checkElement()
      })
      
      const element = document.getElementById('pdf-quote-container')
      if (!element) {
        throw new Error('PDF容器元素未找到')
      }
      
      // 步驟2: 開始生成Canvas
      setCurrentStep('正在渲染PDF內容...')
      setPdfProgress(40)
      
      const canvas = await html2canvas(element, {
        scale: window.devicePixelRatio || 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        width: 794,
        height: element.scrollHeight,
        logging: false,
        removeContainer: true,
        imageTimeout: 30000,
        onclone: (clonedDoc) => {
          const clonedElement = clonedDoc.getElementById('pdf-quote-container')
          if (clonedElement) {
            clonedElement.style.visibility = 'visible'
            clonedElement.style.position = 'static'
          }
        }
      })

      if (!canvas || canvas.width === 0 || canvas.height === 0) {
        throw new Error('PDF內容生成失敗，請檢查數據完整性')
      }

      // 步驟3: 生成PDF
      setCurrentStep('正在生成PDF文件...')
      setPdfProgress(70)
      
      const imgData = canvas.toDataURL('image/png', 0.95)
      const pdf = new jsPDF('p', 'mm', 'a4')
      
      const imgWidth = 210
      const pageHeight = 297
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

      // 步驟4: 保存文件
      setCurrentStep('正在保存文件...')
      setPdfProgress(90)
      
      const safeCompanyName = companyInfo.companyName.replace(/[<>:"/\\|?*]/g, '_').trim()
      const safeDate = companyInfo.quoteDate.replace(/\//g, '')
      const fileName = `${safeCompanyName}_WISE-IoT_SRP維運服務報價書_${safeDate}.pdf`
      
      pdf.save(fileName)
      
      // 完成
      setCurrentStep('PDF生成完成！')
      setPdfProgress(100)
      
      setTimeout(() => {
        setShowPDFPreview(false)
        setIsGenerating(false)
        setPdfProgress(0)
        setCurrentStep('')
      }, 1000)
      
    } catch (error) {
      console.error('PDF報價書匯出失敗:', error)
      
      let errorMessage = 'PDF報價書匯出失敗：\n'
      if (error.message.includes('容器元素')) {
        errorMessage += '• 頁面元素載入異常，請重新整理頁面後再試'
      } else if (error.message.includes('生成失敗')) {
        errorMessage += '• 內容渲染失敗，請檢查所有必要資料是否已填寫完整'
      } else if (error.name === 'NetworkError') {
        errorMessage += '• 網路連線問題，請檢查網路狀態後再試'
      } else {
        errorMessage += '• 系統暫時無法處理請求，請稍後再試\n• 如問題持續發生，請聯繫技術支援'
      }
      
      alert(errorMessage)
      setShowPDFPreview(false)
      setIsGenerating(false)
      setPdfProgress(0)
      setCurrentStep('')
    }
  }

  // 新的react-pdf匯出函數
  const exportToReactPDF = async () => {
    try {
      setIsGenerating(true)
      setPdfProgress(20)
      setCurrentStep('正在生成React PDF文件...')

      // 生成PDF文檔
      const doc = <ReactPDFQuote 
        companyInfo={companyInfo} 
        serviceDetails={serviceDetails} 
        shiftPatterns={shiftPatterns} 
      />
      
      setPdfProgress(60)
      setCurrentStep('正在渲染PDF內容...')
      
      // 渲染為blob
      const asPdf = pdf(doc)
      const blob = await asPdf.toBlob()
      
      setPdfProgress(90)
      setCurrentStep('正在準備下載...')
      
      // 創建下載鏈接
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      
      // 生成安全的檔案名稱
      const safeName = companyInfo.companyName.replace(/[^\w\s-]/g, '').trim() || '公司'
      const timestamp = new Date().toISOString().slice(0, 10)
      link.download = `${safeName}_WISE-IoT SRP維護服務報價_${timestamp}.pdf`
      
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      URL.revokeObjectURL(url)
      
      setPdfProgress(100)
      setCurrentStep('PDF匯出完成！')
      
      setTimeout(() => {
        setIsGenerating(false)
        setPdfProgress(0)
        setCurrentStep('')
      }, 1000)
      
    } catch (error) {
      console.error('React PDF匯出失敗:', error)
      alert('PDF匯出失敗，請稍後再試。錯誤訊息：' + error.message)
      setIsGenerating(false)
      setPdfProgress(0)
      setCurrentStep('')
    }
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

      const fileName = `${companyInfo.companyName}_智能效益評估報告_V2.0_${companyInfo.quoteDate.replace(/\//g, '')}.pdf`
      pdf.save(fileName)
    } catch (error) {
      console.error('PDF export failed:', error)
      alert('PDF匯出失敗，請稍後再試')
    }
  }

  const exportToExcel = () => {
    try {
      // 驗證必要資料
      if (!companyInfo.companyName.trim()) {
        alert('請先填寫公司名稱')
        return
      }
      const workbook = XLSX.utils.book_new()
      
      // 第一個工作表：公司資訊
      const companyData = [
        ['研華 WISE-IoT SRP 維運服務報價書'],
        [''],
        ['客戶資訊', ''],
        ['公司名稱', companyInfo.companyName],
        ['聯絡地址', companyInfo.address],
        ['聯絡人', companyInfo.contact],
        ['統一編號', companyInfo.taxId],
        ['電話', companyInfo.phone],
        ['Email', companyInfo.email],
        ['報價日期', companyInfo.quoteDate],
        ['有效期限', companyInfo.validDate],
        [''],
        ['營運資訊', ''],
        ['年營業額', `${(companyInfo.annualRevenue / 10000).toFixed(1)}億台幣`],
        ['生產模式', shiftPatterns[companyInfo.shiftPattern].name],
        ['特殊需求', companyInfo.specialRequirements],
        ['班別描述', shiftPatterns[companyInfo.shiftPattern].description]
      ]
      const companyWS = XLSX.utils.aoa_to_sheet(companyData)
      XLSX.utils.book_append_sheet(workbook, companyWS, '客戶資訊')

      // 第二個工作表：標準服務功能對照表 (動態生成，與系統預覽完全一致)
      const serviceComparisonData = [
        ['維運功能項目', 'Basic', 'Advanced', 'Premium'],
        [''],
        ['平台與應用層', '', '', '']
      ]

      // 動態生成平台服務項目 - 按名稱匹配
      const allPlatformFeatures = new Set([
        ...serviceDetails.platform.basic.features,
        ...serviceDetails.platform.advanced.features,
        ...serviceDetails.platform.premium.features
      ])

      allPlatformFeatures.forEach(featureName => {
        if (featureName && featureName.trim()) {
          serviceComparisonData.push([
            featureName,
            serviceDetails.platform.basic.features.includes(featureName) ? '✓' : '✗',
            serviceDetails.platform.advanced.features.includes(featureName) ? '✓' : '✗',
            serviceDetails.platform.premium.features.includes(featureName) ? '✓' : '✗'
          ])
        }
      })

      serviceComparisonData.push([''])
      serviceComparisonData.push(['硬體基礎層', '', '', ''])

      // 動態生成硬體服務項目 - 按名稱匹配
      const allHardwareFeatures = new Set([
        ...serviceDetails.hardware.basic.features,
        ...serviceDetails.hardware.advanced.features,
        ...serviceDetails.hardware.premium.features
      ])

      allHardwareFeatures.forEach(featureName => {
        if (featureName && featureName.trim()) {
          serviceComparisonData.push([
            featureName,
            serviceDetails.hardware.basic.features.includes(featureName) ? '✓' : '✗',
            serviceDetails.hardware.advanced.features.includes(featureName) ? '✓' : '✗',
            serviceDetails.hardware.premium.features.includes(featureName) ? '✓' : '✗'
          ])
        }
      })

      serviceComparisonData.push([''])
      serviceComparisonData.push(['年度價格 (新台幣)', '', '', ''])
      serviceComparisonData.push(['平台與應用層', `NT$ ${serviceDetails.platform.basic.price.toLocaleString()}`, `NT$ ${serviceDetails.platform.advanced.price.toLocaleString()}`, `NT$ ${serviceDetails.platform.premium.price.toLocaleString()}`])
      serviceComparisonData.push(['硬體基礎層', `NT$ ${serviceDetails.hardware.basic.price.toLocaleString()}`, `NT$ ${serviceDetails.hardware.advanced.price.toLocaleString()}`, `NT$ ${serviceDetails.hardware.premium.price.toLocaleString()}`])
      serviceComparisonData.push(['組合總價', `NT$ ${getCombinedPrice(serviceDetails, 'basic', 'basic').toLocaleString()}`, `NT$ ${getCombinedPrice(serviceDetails, 'advanced', 'advanced').toLocaleString()}`, `NT$ ${getCombinedPrice(serviceDetails, 'premium', 'premium').toLocaleString()}`])
      const serviceComparisonWS = XLSX.utils.aoa_to_sheet(serviceComparisonData)
      XLSX.utils.book_append_sheet(workbook, serviceComparisonWS, '服務功能對照表')

      // 第三個工作表：成本效益分析
      const annualRevenueNT = companyInfo.annualRevenue * 10000
      const hourlyRevenue = calculateRevenue.hourly(companyInfo.annualRevenue)
      
      const costBenefitData = [
        ['成本效益分析'],
        [''],
        ['營業數據', ''],
        ['年營業額', `${(companyInfo.annualRevenue / 10000).toFixed(1)}億台幣`],
        ['日營業額', `${Math.floor(annualRevenueNT / 365).toLocaleString()}元`],
        ['時營業額', `${hourlyRevenue.toLocaleString()}元`],
        [''],
        ['停機風險分析', ''],
        ['2小時停機損失', `${(hourlyRevenue * 2).toLocaleString()}元`],
        ['4小時停機損失', `${(hourlyRevenue * 4).toLocaleString()}元`],
        ['8小時停機損失', `${(hourlyRevenue * 8).toLocaleString()}元`],
        [''],
        ['投資回報分析', ''],
        ['Basic方案年成本', `${getCombinedPrice(serviceDetails, 'basic', 'basic').toLocaleString()}元`],
        ['Basic方案回本時間', `${calculateRevenue.breakEvenHours(getCombinedPrice(serviceDetails, 'basic', 'basic'), companyInfo.annualRevenue)}小時停機`],
        [''],
        ['Advanced方案年成本', `${getCombinedPrice(serviceDetails, 'advanced', 'advanced').toLocaleString()}元`],
        ['Advanced方案回本時間', `${calculateRevenue.breakEvenHours(getCombinedPrice(serviceDetails, 'advanced', 'advanced'), companyInfo.annualRevenue)}小時停機`],
        [''],
        ['Premium方案年成本', `${getCombinedPrice(serviceDetails, 'premium', 'premium').toLocaleString()}元`],
        ['Premium方案回本時間', `${calculateRevenue.breakEvenHours(getCombinedPrice(serviceDetails, 'premium', 'premium'), companyInfo.annualRevenue)}小時停機`],
        ['Premium成本占營業額比例', `${(((getCombinedPrice(serviceDetails, 'premium', 'premium')) / annualRevenueNT) * 100).toFixed(3)}%`]
      ]
      const costBenefitWS = XLSX.utils.aoa_to_sheet(costBenefitData)
      XLSX.utils.book_append_sheet(workbook, costBenefitWS, '成本效益分析')

      // 第四個工作表：適用性建議
      const currentShift = shiftPatterns[companyInfo.shiftPattern]
      let recommendedPlan = 'Advanced'
      let reason = '充足技術支援+預防性維護，成本效益佳'
      
      if (currentShift.workingHours >= 24) {
        recommendedPlan = 'Premium'
        reason = '7*24技術支援+預防性維護，確保連續生產不中斷'
      }

      const recommendationData = [
        ['適用性評估與建議'],
        [''],
        ['客戶營運狀況', ''],
        ['生產模式', currentShift.name],
        ['工作時數', `${currentShift.workingHours}小時`],
        ['風險係數', currentShift.riskMultiplier],
        ['特殊需求', companyInfo.specialRequirements],
        [''],
        ['方案適用性評估', ''],
        ['Basic方案', '❌ 高風險 - 僅5*8支援，對24小時生產環境風險過高'],
        ['Advanced方案', currentShift.workingHours >= 24 ? '⚠️ 中等風險 - 夜班故障風險仍存在' : '✅ 推薦 - 適合一般生產環境'],
        ['Premium方案', '✅ 最佳選擇 - 7*24支援，最適合關鍵生產環境'],
        [''],
        ['最終建議', ''],
        ['推薦方案', `${recommendedPlan}組合`],
        ['建議理由', reason],
        ['投資效益', `避免${calculateRevenue.breakEvenHours(getCombinedPrice(serviceDetails, 'premium', 'premium'), companyInfo.annualRevenue)}小時停機即可回本`],
        ['年度保障價值', `成本僅占營業額${(((getCombinedPrice(serviceDetails, 'premium', 'premium')) / annualRevenueNT) * 100).toFixed(3)}%，獲得全方位保障`]
      ]
      const recommendationWS = XLSX.utils.aoa_to_sheet(recommendationData)
      XLSX.utils.book_append_sheet(workbook, recommendationWS, '適用性建議')

      // 安全的檔名生成
      const safeCompanyName = companyInfo.companyName.replace(/[<>:"/\\|?*]/g, '_').trim()
      const safeDate = companyInfo.quoteDate.replace(/\//g, '')
      const fileName = `${safeCompanyName}_維運服務報價書_${safeDate}.xlsx`
      
      XLSX.writeFile(workbook, fileName)
    } catch (error) {
      console.error('Excel匯出失敗:', error)
      
      let errorMessage = 'Excel匯出失敗：\n'
      if (error.message.includes('write')) {
        errorMessage += '• 檔案寫入失敗，請檢查瀏覽器下載權限'
      } else if (error.message.includes('memory')) {
        errorMessage += '• 記憶體不足，請關閉其他分頁後再試'
      } else {
        errorMessage += '• 系統暫時無法處理請求，請稍後再試'
      }
      
      alert(errorMessage)
    }
  }

  return (
    <>
      <div id="export-section" className="export-buttons">
        <h3>📤 匯出報價書</h3>
        <div className="button-group">
          <button 
            className="export-btn pdf-btn" 
            onClick={exportPDFQuote}
            title="匯出A4格式的完整PDF報價書"
            style={{
              background: 'linear-gradient(135deg, #e53935, #c62828)',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              marginRight: '15px',
              boxShadow: '0 4px 12px rgba(229, 57, 53, 0.3)',
              transition: 'all 0.3s ease'
            }}
          >
            📄 匯出 PDF 報價書 (HTML)
          </button>

          <button 
            className="export-btn pdf-btn" 
            onClick={exportToReactPDF}
            title="匯出高品質向量PDF報價書 (推薦)"
            style={{
              background: 'linear-gradient(135deg, #1976d2, #1565c0)',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              marginRight: '15px',
              boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)',
              transition: 'all 0.3s ease'
            }}
          >
            🚀 匯出 PDF 報價書 (React)
          </button>
          
          <button 
            className="export-btn excel-btn" 
            onClick={exportToExcel}
            title="匯出標準服務對照表格式的維運服務報價書"
            style={{
              background: 'linear-gradient(135deg, #2e7d32, #1b5e20)',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(46, 125, 50, 0.3)',
              transition: 'all 0.3s ease'
            }}
          >
            📊 匯出 Excel 報價書
          </button>
        </div>
        <div className="export-info">
          <div style={{ marginBottom: '10px' }}>
            <strong>📄 PDF報價書：</strong>
            <p style={{ margin: '5px 0', fontSize: '13px', color: '#666' }}>• A4格式完整報價書，直接傳給客戶</p>
            <p style={{ margin: '5px 0', fontSize: '13px', color: '#666' }}>• 包含服務對照、成本分析和專業建議</p>
          </div>
          <div>
            <strong>📊 Excel報價書：</strong>
            <p style={{ margin: '5px 0', fontSize: '13px', color: '#666' }}>• 分頁詳細資料，便於編輯分析</p>
            <p style={{ margin: '5px 0', fontSize: '13px', color: '#666' }}>• 包含客戶資訊、服務對照、成本效益分析和適用性建議</p>
          </div>
        </div>
      </div>
      
      {/* PDF預覽模式 */}
      {showPDFPreview && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'rgba(0,0,0,0.8)',
          zIndex: 9999,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          overflow: 'auto'
        }}>
          <div style={{
            background: 'white',
            padding: '20px',
            borderRadius: '10px',
            maxWidth: '90%',
            maxHeight: '90%',
            overflow: 'auto',
            position: 'relative'
          }}>
            <button 
              onClick={() => {
                setShowPDFPreview(false)
                setIsGenerating(false)
                setPdfProgress(0)
                setCurrentStep('')
              }}
              style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                background: '#f44336',
                color: 'white',
                border: 'none',
                borderRadius: '50%',
                width: '30px',
                height: '30px',
                cursor: 'pointer',
                fontSize: '16px',
                zIndex: 10000
              }}
              disabled={isGenerating}
            >
              ×
            </button>
            
            {/* 進度條和狀態顯示 */}
            {isGenerating && (
              <div style={{
                textAlign: 'center',
                marginBottom: '15px',
                padding: '15px',
                background: '#f5f5f5',
                borderRadius: '8px',
                border: '1px solid #ddd'
              }}>
                <div style={{
                  fontSize: '14px',
                  color: '#333',
                  marginBottom: '10px',
                  fontWeight: '500'
                }}>
                  {currentStep}
                </div>
                
                {/* 進度條 */}
                <div style={{
                  width: '100%',
                  height: '8px',
                  background: '#e0e0e0',
                  borderRadius: '4px',
                  overflow: 'hidden',
                  marginBottom: '8px'
                }}>
                  <div style={{
                    width: `${pdfProgress}%`,
                    height: '100%',
                    background: 'linear-gradient(90deg, #4caf50, #66bb6a)',
                    borderRadius: '4px',
                    transition: 'width 0.3s ease'
                  }}></div>
                </div>
                
                <div style={{
                  fontSize: '12px',
                  color: '#666'
                }}>
                  {pdfProgress}% 完成
                </div>
              </div>
            )}
            
            {!isGenerating && (
              <div style={{
                textAlign: 'center',
                marginBottom: '15px',
                color: '#666',
                fontSize: '14px'
              }}>
                PDF預覽
              </div>
            )}
            <PDFQuote 
              companyInfo={companyInfo}
              serviceDetails={serviceDetails}
              shiftPatterns={shiftPatterns}
            />
          </div>
        </div>
      )}
    </>
  )
}

export default ExportButtons