import React, { useState } from 'react'
import { queryCompanyInfo, validateTaxId, formatTaxId } from '../utils/taxIdService'

const TaxIdLookup = ({ onCompanyInfoFound }) => {
  const [taxId, setTaxId] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('') // 'success', 'error', 'info'

  const handleTaxIdChange = (e) => {
    const value = e.target.value
    setTaxId(value)
    setMessage('')
    
    // 即時驗證格式
    if (value.length > 0) {
      const validation = validateTaxId(value)
      if (!validation.valid && value.replace(/\D/g, '').length >= 8) {
        setMessage(validation.error)
        setMessageType('error')
      }
    }
  }

  const handleSearch = async () => {
    if (!taxId.trim()) {
      setMessage('請輸入統一編號')
      setMessageType('error')
      return
    }

    setIsLoading(true)
    setMessage('正在查詢公司資訊...')
    setMessageType('info')

    try {
      const result = await queryCompanyInfo(taxId)
      
      if (result.success && result.data) {
        setMessage(`✅ 成功查詢到公司資訊 (來源: ${result.data.apiSource})`)
        setMessageType('success')
        
        // 回調父組件，自動填入公司資訊
        onCompanyInfoFound({
          companyName: result.data.companyName || '',
          address: result.data.address || '',
          contact: result.data.representative || '',
          taxId: result.data.taxId || taxId,
          phone: result.data.phone || ''
        })
        
        // 格式化統編顯示
        setTaxId(formatTaxId(result.data.taxId || taxId))
      } else {
        setMessage(`❌ ${result.error || '查無此統編資料，請手動輸入相關資訊'}`)
        setMessageType('error')
        // 查詢失敗時不自動填入任何資訊
      }
    } catch (error) {
      console.error('統編查詢錯誤:', error)
      setMessage(`❌ 查詢失敗: 網路連線問題或服務異常，請手動輸入公司資訊`)
      setMessageType('error')
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  const getMessageStyle = () => {
    const baseStyle = {
      marginTop: '8px',
      padding: '8px 12px',
      borderRadius: '4px',
      fontSize: '13px',
      fontWeight: '500'
    }

    switch (messageType) {
      case 'success':
        return {
          ...baseStyle,
          background: '#e8f5e8',
          color: '#2e7d32',
          border: '1px solid #4caf50'
        }
      case 'error':
        return {
          ...baseStyle,
          background: '#ffebee',
          color: '#d32f2f',
          border: '1px solid #f44336'
        }
      case 'info':
        return {
          ...baseStyle,
          background: '#e3f2fd',
          color: '#1976d2',
          border: '1px solid #2196f3'
        }
      default:
        return { display: 'none' }
    }
  }

  return (
    <div style={{
      background: '#f8f9fa',
      padding: '15px',
      borderRadius: '8px',
      border: '1px solid #e0e0e0',
      marginBottom: '20px'
    }}>
      <h4 style={{
        margin: '0 0 12px 0',
        color: '#333',
        fontSize: '14px',
        fontWeight: '600',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        🔍 統編查詢 
        <span style={{
          fontSize: '12px',
          fontWeight: 'normal',
          color: '#666'
        }}>
          (自動帶入公司資訊)
        </span>
      </h4>
      
      <div style={{
        display: 'flex',
        gap: '10px',
        alignItems: 'flex-start'
      }}>
        <div style={{ flex: 1 }}>
          <input
            type="text"
            value={taxId}
            onChange={handleTaxIdChange}
            onKeyPress={handleKeyPress}
            placeholder="請輸入8位數統一編號，例如：22356500"
            maxLength="10"
            style={{
              width: '100%',
              padding: '8px 12px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              fontSize: '14px',
              boxSizing: 'border-box'
            }}
          />
        </div>
        
        <button
          onClick={handleSearch}
          disabled={isLoading}
          style={{
            padding: '8px 16px',
            background: isLoading ? '#ccc' : 'linear-gradient(135deg, #1976d2, #1565c0)',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            whiteSpace: 'nowrap',
            minWidth: '80px',
            transition: 'all 0.3s ease'
          }}
        >
          {isLoading ? '查詢中...' : '查詢'}
        </button>
      </div>

      {message && (
        <div style={getMessageStyle()}>
          {message}
        </div>
      )}

      <div style={{
        marginTop: '12px',
        fontSize: '12px',
        color: '#666',
        lineHeight: '1.4'
      }}>
        💡 <strong>提示：</strong>
        <br />• 輸入統編後點擊查詢，系統會自動填入公司名稱、地址等資訊
        <br />• 支援多個查詢來源，確保資料準確性
        <br />• 查無資料時請手動輸入相關資訊
        <br /><strong>🔍 可查詢統編：</strong> 22099131(台積電)、22466564(鈺祥企業)、22356500(研華)、23526740(鴻海)
      </div>
    </div>
  )
}

export default TaxIdLookup