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
  
  // 使用Vercel API代理查詢（解決CORS問題）
  const proxyResult = await queryWithVercelProxy(cleanTaxId)
  if (proxyResult.success) {
    console.log('統編查詢成功:', proxyResult)
    return proxyResult
  }

  // API查詢失敗，提供詳細的錯誤資訊
  return { 
    success: false, 
    error: `統編 ${cleanTaxId} 查無資料。可能原因：\n1. 統編號碼有誤\n2. 該統編尚未設立或已解散\n3. API服務暫時無法使用\n\n請檢查統編號碼或手動輸入公司資訊。` 
  }
}

// 本地數據庫已移除 - 統編查詢完全依賴線上API服務

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

// 共用計算函數 - 統一所有組件的計算邏輯
export const calculateRevenue = {
  // 計算日營業額（萬元）
  daily: (annualRevenueWan) => {
    return Math.round(annualRevenueWan * 10000 / 365 / 10000)
  },
  
  // 計算時營業額（萬元）
  hourly: (annualRevenueWan) => {
    return parseFloat((annualRevenueWan / 365 / 24).toFixed(1))
  },
  
  // 計算停機風險成本（含風險係數）- 返回萬元
  downtimeRisk: (annualRevenueWan, hours, riskMultiplier = 1) => {
    const hourlyRevenue = parseFloat((annualRevenueWan / 365 / 24).toFixed(1))
    return parseFloat((hourlyRevenue * hours * riskMultiplier).toFixed(1))
  },
  
  // 計算投資回本時間（小時）
  breakEvenHours: (serviceCost, annualRevenueWan) => {
    const hourlyRevenue = Math.round(annualRevenueWan * 10000 / 365 / 24) // 保持元為單位進行回本計算
    return parseFloat((serviceCost / hourlyRevenue).toFixed(1))
  }
}

// 價格格式化
export const formatPrice = (price) => {
  return `NT$ ${price.toLocaleString()}`
}

// 組合服務價格計算
export const getCombinedPrice = (serviceDetails, platformType, hardwareType) => {
  const platformPrice = serviceDetails.platform[platformType].enabled ? 
    serviceDetails.platform[platformType].price : 0
  const hardwarePrice = serviceDetails.hardware[hardwareType].enabled ? 
    serviceDetails.hardware[hardwareType].price : 0
  return platformPrice + hardwarePrice
}