import React from 'react'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'

const ExportButtons = ({ companyInfo, services }) => {
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
        ['報價日期', companyInfo.quoteDate],
        ['有效期限', companyInfo.validDate],
        ['年營業額', `NT$ ${companyInfo.annualRevenue.toLocaleString()}`],
        ['特殊需求', companyInfo.specialRequirements]
      ]
      const companyWS = XLSX.utils.aoa_to_sheet(companyData)
      XLSX.utils.book_append_sheet(workbook, companyWS, '公司資訊')

      // 服務價格工作表
      const servicesData = [
        ['服務類型', '方案', '基礎價格', '權重係數', '調整後價格', '啟用狀態'],
        ...Object.entries(services.platform).map(([type, config]) => [
          '平台與應用層',
          `${type.charAt(0).toUpperCase() + type.slice(1)} MA`,
          config.price,
          config.weight,
          config.price * config.weight,
          config.enabled ? '是' : '否'
        ]),
        ...Object.entries(services.hardware).map(([type, config]) => [
          '硬體基礎層',
          `${type.charAt(0).toUpperCase() + type.slice(1)} MA`,
          config.price,
          config.weight,
          config.price * config.weight,
          config.enabled ? '是' : '否'
        ])
      ]
      const servicesWS = XLSX.utils.aoa_to_sheet(servicesData)
      XLSX.utils.book_append_sheet(workbook, servicesWS, '服務價格')

      // 成本效益分析工作表
      const dailyRevenue = Math.floor(companyInfo.annualRevenue / 365)
      const hourlyRevenue = Math.floor(companyInfo.annualRevenue / 365 / 24)
      
      const costBenefitData = [
        ['項目', '數值'],
        ['年營業額', companyInfo.annualRevenue],
        ['日營業額', dailyRevenue],
        ['時營業額', hourlyRevenue],
        ['', ''],
        ['停機時間', '損失金額'],
        ['2小時', hourlyRevenue * 2],
        ['4小時', hourlyRevenue * 4],
        ['8小時', hourlyRevenue * 8],
        ['', ''],
        ['方案組合', '年度成本'],
        ['Basic + Basic', (services.platform.basic.enabled ? services.platform.basic.price * services.platform.basic.weight : 0) + (services.hardware.basic.enabled ? services.hardware.basic.price * services.hardware.basic.weight : 0)],
        ['Advanced + Advanced', (services.platform.advanced.enabled ? services.platform.advanced.price * services.platform.advanced.weight : 0) + (services.hardware.advanced.enabled ? services.hardware.advanced.price * services.hardware.advanced.weight : 0)],
        ['Premium + Premium', (services.platform.premium.enabled ? services.platform.premium.price * services.platform.premium.weight : 0) + (services.hardware.premium.enabled ? services.hardware.premium.price * services.hardware.premium.weight : 0)]
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