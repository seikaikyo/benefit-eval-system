import React from 'react'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import * as XLSX from 'xlsx'

const ExportButtons = ({ companyInfo, serviceDetails, shiftPatterns }) => {
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