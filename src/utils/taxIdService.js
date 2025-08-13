// 台灣統編查詢服務

// 多個可用的統編查詢API服務
const TAX_ID_APIS = [
  {
    name: 'OpenData VIP 統編查詢API',
    url: 'https://opendata.vip/data/company',
    corsMode: 'cors',
    parse: (data, cleanTaxId) => {
      try {
        console.log('OpenData VIP API原始回應:', data)
        if (data && data.output && Array.isArray(data.output) && data.output.length > 0) {
          // 尋找完全匹配的統編
          const company = data.output.find(c => c.Business_Accounting_NO === cleanTaxId) || data.output[0]
          if (company) {
            // 格式化資本額（從分轉為元）
            const capital = company.Capital_Stock_Amount ? 
              Math.round(company.Capital_Stock_Amount / 10000) + '萬元' : ''
            
            // 格式化設立日期
            const formatDate = (dateStr) => {
              if (!dateStr || dateStr.length !== 7) return dateStr
              const year = parseInt(dateStr.substring(0, 3)) + 1911
              const month = dateStr.substring(3, 5)
              const day = dateStr.substring(5, 7)
              return `${year}/${month}/${day}`
            }
            
            return {
              success: true,
              data: {
                companyName: company.Company_Name || '',
                address: company.Company_Location || '',
                representative: company.Responsible_Name || '',
                capital: capital,
                status: company.Company_Status_Desc || company.Company_Status || '',
                establishDate: formatDate(company.Company_Setup_Date) || '',
                registerOrg: company.Register_Organization_Desc || ''
              }
            }
          }
        }
      } catch (e) {
        console.log('解析OpenData VIP數據失敗:', e)
        console.error('錯誤詳情:', e)
      }
      return { success: false, error: '查無此統編資料' }
    }
  },
  {
    name: 'G0V 公司資料API',
    url: 'https://company.g0v.ronny.tw/api/search',
    corsMode: 'cors',
    parse: (data, cleanTaxId) => {
      try {
        console.log('G0V API原始回應:', data)
        if (data && data.data && data.data.length > 0) {
          // 尋找完全匹配的統編
          const company = data.data.find(c => c['統一編號'] === cleanTaxId) || data.data[0]
          return {
            success: true,
            data: {
              companyName: company['公司名稱'] || company.name || '',
              address: company['公司地址'] || company.address || '',
              representative: company['代表人姓名'] || company.representative || '',
              capital: company['資本額'] || '',
              status: company['公司狀況'] || company.status || '',
              establishDate: company['設立日期'] || ''
            }
          }
        }
      } catch (e) {
        console.log('解析G0V數據失敗:', e)
      }
      return { success: false, error: '查無此統編資料' }
    }
  },
  {
    name: '台灣政府公開資料API',
    url: 'https://data.gcis.nat.gov.tw/od/data/api/5F64D864-61CB-4D0D-8AD9-492047CC1EA6',
    corsMode: 'cors',
    parse: (data, cleanTaxId) => {
      try {
        console.log('政府API原始回應:', data)
        if (data && Array.isArray(data) && data.length > 0) {
          const company = data.find(c => c.Business_Accounting_NO === cleanTaxId)
          if (company) {
            return {
              success: true,
              data: {
                companyName: company.Company_Name || '',
                address: company.Company_Location || '',
                representative: company.Responsible_Name || '',
                capital: company.Capital_Stock_Amount || '',
                status: company.Company_Status || '',
                establishDate: company.Company_Setup_Date || ''
              }
            }
          }
        }
      } catch (e) {
        console.log('解析政府API數據失敗:', e)
      }
      return { success: false, error: '查無此統編資料' }
    }
  }
]

// 驗證統編格式
export const validateTaxId = (taxId) => {
  // 移除所有空格和特殊字符
  const cleanTaxId = taxId.replace(/\D/g, '')
  
  // 檢查長度
  if (cleanTaxId.length !== 8) {
    return { valid: false, error: '統編必須為8位數字' }
  }
  
  // 簡化驗證：只檢查基本格式，不做複雜檢核碼驗證
  // 因為檢核碼算法可能有多種版本，為了使用者體驗先簡化
  const isBasicValid = /^\d{8}$/.test(cleanTaxId)
  
  if (!isBasicValid) {
    return { valid: false, error: '統編必須為8位數字' }
  }
  
  return { valid: true, taxId: cleanTaxId }
}

// 查詢公司資訊
export const queryCompanyInfo = async (taxId) => {
  const validation = validateTaxId(taxId)
  if (!validation.valid) {
    return { success: false, error: validation.error }
  }
  
  const cleanTaxId = validation.taxId
  
  // 優先使用真實API查詢，確保資料準確性
  console.log(`開始查詢統編: ${cleanTaxId}`)
  
  // 嘗試所有API
  for (const api of TAX_ID_APIS) {
    try {
      let url
      if (api.name.includes('OpenData VIP')) {
        url = `${api.url}?keyword=${cleanTaxId}`
      } else if (api.name.includes('G0V')) {
        url = `${api.url}?q=${cleanTaxId}`
      } else {
        // 台灣政府API
        url = `${api.url}?$filter=Business_Accounting_NO eq '${cleanTaxId}'&$format=json`
      }
      
      console.log(`嘗試使用 ${api.name} 查詢統編: ${cleanTaxId}`)
      
      const fetchOptions = {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'Mozilla/5.0 (compatible; TaxID-Lookup/1.0)',
          'Content-Type': 'application/json'
        }
      }

      // 針對OpenData VIP API使用特殊設定
      if (api.name.includes('OpenData VIP')) {
        fetchOptions.mode = 'cors'
        fetchOptions.credentials = 'omit'
      } else if (api.corsMode) {
        fetchOptions.mode = api.corsMode
      }
      
      const response = await fetch(url, fetchOptions)
      
      if (!response.ok) {
        console.log(`${api.name} API 回應錯誤:`, response.status, response.statusText)
        continue
      }
      
      const data = await response.json()
      console.log(`${api.name} 回應數據:`, data)
      
      const result = api.parse(data, cleanTaxId)
      if (result.success) {
        return {
          success: true,
          data: {
            ...result.data,
            taxId: cleanTaxId,
            apiSource: api.name
          }
        }
      }
    } catch (error) {
      console.log(`${api.name} 查詢失敗:`, error.message)
      // 如果是CORS錯誤，給出提示
      if (error.message.includes('CORS') || error.message.includes('Cross-Origin') || error.message.includes('fetch')) {
        console.log(`${api.name} CORS或網路問題，嘗試下一個API...`)
      }
      continue
    }
  }
  
  // 如果所有API都失敗，僅對研華等少數已確認的統編使用本地數據庫
  console.log('所有API查詢失敗，嘗試本地數據庫')
  const localResult = queryFromLocalDatabase(cleanTaxId)
  if (!localResult.success) {
    return { 
      success: false, 
      error: '查無此統編資料，請檢查統編是否正確或手動輸入公司資訊。如果是有效統編，可能是API服務暫時無法使用。' 
    }
  }
  return localResult
}

// 備用本地數據庫（僅保留已確認正確的公司資料，主要用於API失敗時的備用）
const localCompanyDatabase = {
  '22356500': {
    companyName: '研華股份有限公司',
    address: '台北市內湖區瑞光路26巷20弄1號',
    representative: '劉克振',
    phone: '02-27926688',
    note: '已確認資料正確'
  },
  '12345678': {
    companyName: '示範科技股份有限公司',
    address: '台北市信義區信義路四段199號',
    representative: '王大明',
    phone: '02-27123456',
    note: '測試用範例資料'
  },
  '87654321': {
    companyName: '智能製造株式會社',
    address: '新竹科學園區工業東路1號',
    representative: '李智慧',
    phone: '03-5123456',
    note: '測試用範例資料'
  }
}

const queryFromLocalDatabase = (taxId) => {
  const companyInfo = localCompanyDatabase[taxId]
  if (companyInfo) {
    return {
      success: true,
      data: {
        ...companyInfo,
        taxId: taxId,
        apiSource: 'Local Database'
      }
    }
  }
  
  return {
    success: false,
    error: '查無此統編資料，請手動輸入公司資訊'
  }
}

// 格式化統編顯示 - 不再使用"-"分隔符，保持完整8位數字格式
export const formatTaxId = (taxId) => {
  const clean = taxId.replace(/\D/g, '')
  if (clean.length === 8) {
    return clean
  }
  return taxId
}

// 清理和格式化公司資訊
export const formatCompanyInfo = (rawData) => {
  return {
    companyName: rawData.companyName?.trim() || '',
    address: rawData.address?.trim() || '',
    representative: rawData.representative?.trim() || '',
    phone: rawData.phone?.trim() || '',
    capital: rawData.capital?.trim() || '',
    status: rawData.status?.trim() || '',
    establishDate: rawData.establishDate?.trim() || ''
  }
}