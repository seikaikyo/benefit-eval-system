// Vercel API 路由 - 統編查詢代理服務
export default async function handler(req, res) {
  // 設置CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true)
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version')

  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: '僅支援GET請求' })
  }

  const { taxid } = req.query

  if (!taxid) {
    return res.status(400).json({ error: '缺少統編參數' })
  }

  // 驗證統編格式
  const cleanTaxId = taxid.replace(/\D/g, '')
  if (cleanTaxId.length !== 8) {
    return res.status(400).json({ error: '統編必須為8位數字' })
  }

  try {
    console.log(`API代理查詢統編: ${cleanTaxId}`)

    // 嘗試 OpenData VIP API
    const opendataUrl = `https://opendata.vip/data/company?keyword=${cleanTaxId}`
    const opendataResponse = await fetch(opendataUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; Vercel-API/1.0)',
        'Accept': 'application/json'
      }
    })

    if (opendataResponse.ok) {
      const data = await opendataResponse.json()
      console.log('OpenData VIP API回應:', data)

      if (data && data.output && Array.isArray(data.output) && data.output.length > 0) {
        const company = data.output.find(c => c.Business_Accounting_NO === cleanTaxId) || data.output[0]
        
        if (company) {
          // 格式化資本額
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

          return res.status(200).json({
            success: true,
            data: {
              companyName: company.Company_Name || '',
              address: company.Company_Location || '',
              representative: company.Responsible_Name || '',
              capital: capital,
              status: company.Company_Status_Desc || company.Company_Status || '',
              establishDate: formatDate(company.Company_Setup_Date) || '',
              registerOrg: company.Register_Organization_Desc || '',
              taxId: cleanTaxId,
              apiSource: 'OpenData VIP (via Vercel Proxy)'
            }
          })
        }
      }
    }

    // 如果OpenData VIP失敗，嘗試G0V API
    const g0vUrl = `https://company.g0v.ronny.tw/api/search?q=${cleanTaxId}`
    const g0vResponse = await fetch(g0vUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; Vercel-API/1.0)',
        'Accept': 'application/json'
      }
    })

    if (g0vResponse.ok) {
      const data = await g0vResponse.json()
      console.log('G0V API回應:', data)

      if (data && data.data && data.data.length > 0) {
        const company = data.data.find(c => c['統一編號'] === cleanTaxId) || data.data[0]
        
        return res.status(200).json({
          success: true,
          data: {
            companyName: company['公司名稱'] || company.name || '',
            address: company['公司地址'] || company.address || '',
            representative: company['代表人姓名'] || company.representative || '',
            capital: company['資本額'] || '',
            status: company['公司狀況'] || company.status || '',
            establishDate: company['設立日期'] || '',
            taxId: cleanTaxId,
            apiSource: 'G0V (via Vercel Proxy)'
          }
        })
      }
    }

    // 都失敗的話返回錯誤
    return res.status(404).json({
      success: false,
      error: `統編 ${cleanTaxId} 查無資料，請檢查統編號碼或手動輸入公司資訊`
    })

  } catch (error) {
    console.error('API代理錯誤:', error)
    return res.status(500).json({
      success: false,
      error: '統編查詢服務暫時無法使用，請稍後重試或手動輸入公司資訊'
    })
  }
}