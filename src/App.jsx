import { useState } from 'react'
import './App.css'
import ComparisonTable from './components/ComparisonTable'
import ConfigPanel from './components/ConfigPanel'
import ExportButtons from './components/ExportButtons'

function App() {
  const [companyInfo, setCompanyInfo] = useState({
    companyName: '鈺祥企業股份有限公司',
    quoteDate: '2025/08/12',
    validDate: '2025/09/12',
    annualRevenue: 1500000000,
    specialRequirements: '24小時四班二輪制生產環境'
  })

  const [services, setServices] = useState({
    platform: {
      basic: {
        price: 210000,
        weight: 1,
        enabled: true
      },
      advanced: {
        price: 272000,
        weight: 1,
        enabled: true
      },
      premium: {
        price: 458000,
        weight: 1,
        enabled: true
      }
    },
    hardware: {
      basic: {
        price: 230000,
        weight: 1,
        enabled: true
      },
      advanced: {
        price: 310000,
        weight: 1,
        enabled: true
      },
      premium: {
        price: 500000,
        weight: 1,
        enabled: true
      }
    }
  })

  return (
    <div className="App">
      <div className="container">
        <ConfigPanel 
          companyInfo={companyInfo}
          setCompanyInfo={setCompanyInfo}
          services={services}
          setServices={setServices}
        />
        <ComparisonTable 
          companyInfo={companyInfo}
          services={services}
        />
        <ExportButtons 
          companyInfo={companyInfo}
          services={services}
        />
      </div>
    </div>
  )
}

export default App
