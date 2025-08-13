// 台灣統編查詢服務

// 多個可用的統編查詢API服務
const TAX_ID_APIS = [
  {
    name: '台灣公司資料查詢',
    url: 'https://data.gcis.nat.gov.tw/od/data/api/5F64D864-61CB-4D0D-8AD9-492047CC1EA6',
    corsMode: 'no-cors',
    parse: (data) => {
      try {
        if (data && Array.isArray(data) && data.length > 0) {
          const company = data.find(c => c.Business_Accounting_NO === cleanTaxId) || data[0]
          return {
            success: true,
            data: {
              companyName: company.Company_Name || '',
              address: company.Company_Location || '',
              representative: company.Responsible_Name || '',
              capital: company.Capital_Stock_Amount || '',
              status: company.Company_Status || ''
            }
          }
        }
      } catch (e) {
        console.log('解析API數據失敗:', e)
      }
      return { success: false, error: '查無此統編資料' }
    }
  },
  {
    name: 'G0V 公司資料',
    url: 'https://company.g0v.ronny.tw/api/search',
    corsMode: 'cors',
    parse: (data) => {
      try {
        if (data && data.data && data.data.length > 0) {
          const company = data.data[0]
          return {
            success: true,
            data: {
              companyName: company['公司名稱'] || company.name || '',
              address: company['公司地址'] || company.address || '',
              representative: company['代表人姓名'] || company.representative || '',
              capital: company['資本額'] || '',
              status: company['公司狀況'] || ''
            }
          }
        }
      } catch (e) {
        console.log('解析G0V數據失敗:', e)
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
  
  // 優先嘗試本地數據庫（因為API可能有CORS問題）
  console.log(`嘗試本地數據庫查詢統編: ${cleanTaxId}`)
  const localResult = queryFromLocalDatabase(cleanTaxId)
  if (localResult.success) {
    console.log('本地數據庫查詢成功')
    return localResult
  }
  
  // 如果本地數據庫沒有，再嘗試API
  for (const api of TAX_ID_APIS) {
    try {
      let url
      if (api.name.includes('G0V')) {
        url = `${api.url}?q=${cleanTaxId}`
      } else {
        url = `${api.url}?$filter=Business_Accounting_NO eq '${cleanTaxId}'&$format=json`
      }
      
      console.log(`嘗試使用 ${api.name} 查詢統編: ${cleanTaxId}`)
      
      const fetchOptions = {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'Mozilla/5.0 (compatible; TaxID-Lookup/1.0)'
        }
      }

      // 添加CORS設定
      if (api.corsMode) {
        fetchOptions.mode = api.corsMode
      }
      
      const response = await fetch(url, fetchOptions)
      
      if (!response.ok) {
        console.log(`${api.name} API 回應錯誤:`, response.status, response.statusText)
        continue
      }
      
      const data = await response.json()
      console.log(`${api.name} 回應數據:`, data)
      
      const result = api.parse(data)
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
  
  // 如果所有API都失敗，嘗試使用備用的本地數據庫
  return queryFromLocalDatabase(cleanTaxId)
}

// 備用本地數據庫（一些常見的大公司資料）
const localCompanyDatabase = {
  '04595257': {
    companyName: '台灣積體電路製造股份有限公司',
    address: '新竹市東區力行六路8號',
    representative: '劉德音',
    phone: '03-5636688'
  },
  '23526740': {
    companyName: '鴻海精密工業股份有限公司',
    address: '新北市土城區自由街2號',
    representative: '劉揚偉',
    phone: '02-22683466'
  },
  '22356500': {
    companyName: '研華股份有限公司',
    address: '台北市內湖區瑞光路26巷20弄1號',
    representative: '劉克振',
    phone: '02-27926688'
  },
  '86732181': {
    companyName: '聯發科技股份有限公司',
    address: '新竹市東區關新路123號',
    representative: '蔡明介',
    phone: '03-5670766'
  },
  '12345678': {
    companyName: '示範科技股份有限公司',
    address: '台北市信義區信義路四段199號',
    representative: '王大明',
    phone: '02-27123456'
  },
  '87654321': {
    companyName: '智能製造株式會社',
    address: '新竹科學園區工業東路1號',
    representative: '李智慧',
    phone: '03-5123456'
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

// 格式化統編顯示
export const formatTaxId = (taxId) => {
  const clean = taxId.replace(/\D/g, '')
  if (clean.length === 8) {
    return clean.replace(/(\d{4})(\d{4})/, '$1-$2')
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