import { useState } from 'react'
import './App.css'
import ComparisonTable from './components/ComparisonTable'
import ConfigPanel from './components/ConfigPanel'
import ExportButtons from './components/ExportButtons'
import UserGuide from './components/UserGuide'

function App() {
  const [companyInfo, setCompanyInfo] = useState({
    companyName: '',
    address: '',
    contact: '',
    taxId: '',
    phone: '',
    email: '',
    quoteDate: new Date().toISOString().slice(0, 10),
    validDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
    annualRevenue: 150000, // 改為萬元
    specialRequirements: '24小時四班二輪制生產環境',
    shiftPattern: '24hours' // 新增班別模式
  })

  const [shiftPatterns] = useState({
    '8hours': {
      name: '標準8小時單班制',
      workingHours: 8,
      riskMultiplier: 0.3, // 風險係數較低
      description: '週一到週五，正常上班時間，適合辦公型業務'
    },
    '12hours': {
      name: '12小時兩班制', 
      workingHours: 12,
      riskMultiplier: 0.6,
      description: '白班夜班輪替，有一定連續性需求'
    },
    '24hours': {
      name: '24小時四班二輪制',
      workingHours: 24,
      riskMultiplier: 1.0, // 風險係數最高
      description: '連續生產，系統停機影響重大'
    },
    'custom': {
      name: '自訂班別',
      workingHours: 16,
      riskMultiplier: 0.8,
      description: '客製化生產時間'
    }
  })

  const [serviceDetails, setServiceDetails] = useState({
    platform: {
      basic: {
        price: 210000,
        enabled: true,
        productCode: '32WSISPIT1EP01',
        title: 'WISE-IoT SRP 維運 平台與應用層 Basic MA',
        features: [
          '5*8 WISE-PaaS 遠端技術支持',
          '軟體、韌體更新服務',
          '平台遠端異常排除',
          '軟體正常功能維持'
        ]
      },
      advanced: {
        price: 272000,
        enabled: true,
        productCode: '32WSISPIT1EP01',
        title: 'WISE-IoT SRP 維運 平台與應用層 Advanced MA',
        features: [
          '5*8 WISE-PaaS 遠端技術支持',
          '軟體、韌體更新服務',
          '平台遠端異常排除',
          '軟體正常功能維持',
          '協助平台應用軟體升級 × 1次',
          '協助網路憑證更新 × 1次',
          '協助執行資料庫備份 × 2次',
          '遠端歲修開關機作業 × 1次',
          '平台健康狀態巡檢 × 4次',
          '系統穩定度審查報告',
          '資料庫使用情況檢視',
          '依使用率最佳化調整',
          '重大風險主動通知',
          '一般軟體配置及架構操作指引',
          '平台層線上基本維運培訓 × 4小時',
          '應用層線上基本維運培訓 × 8小時'
        ]
      },
      premium: {
        price: 458000,
        enabled: true,
        productCode: '32WSISPIT1EP01',
        title: 'WISE-IoT SRP 維運 平台與應用層 Premium MA',
        features: [
          '5*8 WISE-PaaS 遠端技術支持',
          '軟體、韌體更新服務',
          '平台遠端異常排除',
          '軟體正常功能維持',
          '協助平台應用軟體升級 × 1次',
          '協助網路憑證更新 × 1次',
          '協助執行資料庫備份 × 2次',
          '遠端歲修開關機作業 × 1次',
          '平台健康狀態巡檢 × 4次',
          '系統穩定度審查報告',
          '資料庫使用情況檢視',
          '依使用率最佳化調整',
          '重大風險主動通知',
          '一般軟體配置及架構操作指引',
          '原廠專家開發技術諮詢',
          '視覺化看板開發、架構規劃擴充',
          '平台層線上基本維運培訓 × 4小時',
          '應用層線上基本維運培訓 × 8小時'
        ]
      }
    },
    hardware: {
      basic: {
        price: 230000,
        enabled: true,
        productCode: 'HPC-8208-WS01-C*3, 968AC00100*2, UN0-2372G-BTO*1',
        title: 'WISE-IoT SRP 維運 硬體基礎層 Basic MA',
        features: [
          '5*8 技術支持',
          '工單系統/郵件/免付費電話',
          '軟體、韌體更新服務',
          '到場服務（隔日到府維修）× 2次'
        ]
      },
      advanced: {
        price: 310000,
        enabled: true,
        productCode: 'HPC-8208-WS01-C*3, 968AC00100*2, UN0-2372G-BTO*1',
        title: 'WISE-IoT SRP 維運 硬體基礎層 Advanced MA',
        features: [
          '5*8 技術支持',
          '工單系統/郵件/免付費電話',
          '專屬Line報修管道',
          '軟體、韌體更新服務',
          '重大風險主動通知',
          '硬體層監控軟體與告警配置 × 1次',
          '到場服務（隔日到府維修）× 2次',
          '5*8 基礎層設備巡檢 × 2次',
          '硬體狀態確認及維護報告',
          '預防性料件更換',
          '基礎層線上基本運維培訓 × 2小時'
        ]
      },
      premium: {
        price: 500000,
        enabled: true,
        productCode: 'HPC-8208-WS01-C*3, 968AC00100*2, UN0-2372G-BTO*1',
        title: 'WISE-IoT SRP 維運 硬體基礎層 Premium MA',
        features: [
          '7*24 全時段技術支持',
          '工單系統/郵件/免付費電話',
          '專屬Line報修管道',
          '專線電話',
          '軟體、韌體更新服務',
          '重大風險主動通知',
          '硬體層監控軟體與告警配置 × 1次',
          '7*8到場服務（隔日到府維修）× 2次',
          '5*8 基礎層設備巡檢 × 2次',
          '硬體狀態確認及維護報告',
          '預防性料件更換',
          '基礎層線上基本運維培訓 × 2小時'
        ]
      }
    }
  })

  return (
    <div className="App">
      <div className="main-layout">
        {/* 左側使用指南 */}
        <div className="sidebar">
          <UserGuide />
        </div>
        
        {/* 主要內容區域 */}
        <div className="main-content">
          <div className="container">
            <ConfigPanel 
              companyInfo={companyInfo}
              setCompanyInfo={setCompanyInfo}
              serviceDetails={serviceDetails}
              setServiceDetails={setServiceDetails}
              shiftPatterns={shiftPatterns}
            />
            <ComparisonTable 
              companyInfo={companyInfo}
              serviceDetails={serviceDetails}
              shiftPatterns={shiftPatterns}
            />
            <ExportButtons 
              companyInfo={companyInfo}
              serviceDetails={serviceDetails}
              shiftPatterns={shiftPatterns}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
