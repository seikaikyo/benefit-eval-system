// 台灣統編查詢服務

// 使用Vercel API代理解決CORS問題
const queryWithVercelProxy = async (cleanTaxId) => {
  try {
    // 檢查是否在生產環境或開發環境
    const baseUrl = window.location.origin
    const apiUrl = `${baseUrl}/api/taxid?taxid=${cleanTaxId}`
    
    console.log(`使用Vercel API代理查詢統編: ${cleanTaxId}`)
    console.log(`API URL: ${apiUrl}`)
    
    const response = await fetch(apiUrl)
    const result = await response.json()
    
    console.log('Vercel API代理回應:', result)
    
    if (result.success) {
      return {
        success: true,
        data: {
          ...result.data,
          taxId: cleanTaxId
        }
      }
    } else {
      return {
        success: false,
        error: result.error || '查無此統編資料'
      }
    }
  } catch (error) {
    console.error('Vercel API代理查詢失敗:', error)
    return {
      success: false,
      error: 'API服務暫時無法使用'
    }
  }
}

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
  
  console.log(`開始查詢統編: ${cleanTaxId}`)
  
  // 優先使用Vercel API代理（解決CORS問題）
  const proxyResult = await queryWithVercelProxy(cleanTaxId)
  if (proxyResult.success) {
    console.log('Vercel API代理查詢成功:', proxyResult)
    return proxyResult
  }
  
  // 如果API代理失敗，回退到本地數據庫
  console.log('API代理失敗，嘗試本地數據庫')
  const localResult = queryFromLocalDatabase(cleanTaxId)
  if (localResult.success) {
    console.log('本地數據庫查詢成功:', localResult)
    return localResult
  }
  
  // 如果所有API都失敗，最後再嘗試本地數據庫
  console.log('所有API查詢失敗，最終嘗試本地數據庫')
  const finalLocalResult = queryFromLocalDatabase(cleanTaxId)
  if (finalLocalResult.success) {
    return finalLocalResult
  }

  // 所有查詢都失敗，提供詳細的錯誤資訊
  return { 
    success: false, 
    error: `統編 ${cleanTaxId} 查無資料。可能原因：\n1. 統編號碼有誤\n2. 該統編尚未設立或已解散\n3. API服務暫時無法使用\n\n請檢查統編號碼或手動輸入公司資訊。` 
  }
}

// 備用本地數據庫（由於CORS限制，暫時擴展本地數據庫作為主要查詢來源）
const localCompanyDatabase = {
  '22099131': {
    companyName: '台灣積體電路製造股份有限公司',
    address: '新竹科學園區新竹市力行六路8號',
    representative: '魏哲家',
    phone: '03-5636688',
    capital: '28,050萬元',
    status: '核准設立',
    establishDate: '1987/02/21',
    note: 'TSMC - 全球最大晶圓代工廠'
  },
  '22466564': {
    companyName: '鈺祥企業股份有限公司',
    address: '新北市中和區中正路866之7號17樓',
    representative: '莊士杰',
    phone: '02-22466564',
    capital: '1,200萬元',
    status: '核准設立',
    establishDate: '1987/06/16',
    note: '確認正確資料'
  },
  '22356500': {
    companyName: '研華股份有限公司',
    address: '台北市內湖區瑞光路26巷20弄1號',
    representative: '劉克振',
    phone: '02-27926688',
    capital: '4,560萬元',
    status: '核准設立',
    establishDate: '1983/06/15',
    note: 'Advantech - 工業電腦領導廠商'
  },
  '04595257': {
    companyName: '台灣積體電路製造股份有限公司',
    address: '新竹市東區力行六路8號',
    representative: '劉德音',
    phone: '03-5636688',
    capital: '28,050萬元',
    status: '核准設立',
    note: 'TSMC另一統編'
  },
  '23526740': {
    companyName: '鴻海精密工業股份有限公司',
    address: '新北市土城區自由街2號',
    representative: '劉揚偉',
    phone: '02-22683466',
    capital: '1,386億元',
    status: '核准設立',
    note: 'Foxconn - 全球最大電子製造服務商'
  },
  '12345678': {
    companyName: '示範科技股份有限公司',
    address: '台北市信義區信義路四段199號',
    representative: '王大明',
    phone: '02-27123456',
    capital: '1,000萬元',
    status: '核准設立',
    note: '測試用範例資料'
  },
  '87654321': {
    companyName: '智能製造株式會社',
    address: '新竹科學園區工業東路1號',
    representative: '李智慧',
    phone: '03-5123456',
    capital: '5,000萬元',
    status: '核准設立',
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