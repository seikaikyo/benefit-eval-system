import React, { useState } from 'react'

const UserGuide = () => {
  const [isCollapsed, setIsCollapsed] = useState(false) // 預設為展開狀態
  
  // 導航錨點配置
  const navigationItems = [
    { id: 'company-info', label: '🏢 公司資訊', description: '統編查詢與基本資料' },
    { id: 'shift-pattern', label: '🏭 生產班別', description: '選擇生產模式' },
    { id: 'special-requirements', label: '📝 特殊需求', description: '填寫客製化需求' },
    { id: 'service-config', label: '⚙️ 服務配置', description: '調整服務方案與價格' },
    { id: 'comparison-table-container', label: '📊 方案比較', description: '查看詳細對照表' },
    { id: 'cost-analysis', label: '💰 成本分析', description: '檢視停機風險評估' },
    { id: 'export-section', label: '📄 匯出報價', description: '生成PDF或Excel報價書' }
  ]
  
  // 平滑滾動到指定區域
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start',
        inline: 'nearest'
      })
      // 高亮顯示目標元素
      element.style.boxShadow = '0 0 20px rgba(25, 118, 210, 0.3)'
      setTimeout(() => {
        element.style.boxShadow = ''
      }, 2000)
    }
  }

  const sections = {
    basic: {
      title: '🔰 基本操作指南',
      content: [
        {
          step: '1. 統編查詢',
          description: '在公司資訊區塊的統編查詢框中輸入8位數統編號碼',
          tips: ['輸入8位數統編號碼進行查詢', '系統會自動驗證格式並查詢公司資訊'],
          image: '🔍'
        },
        {
          step: '2. 資訊確認',
          description: '查詢成功後，系統會自動填入公司名稱、地址、聯絡人等資訊',
          tips: ['填入的欄位會呈現綠色邊框提示', '可手動修改任何自動填入的資訊'],
          image: '✅'
        },
        {
          step: '3. 設定生產模式',
          description: '選擇符合實際情況的生產班別模式',
          tips: ['標準8小時制：一般上班時間', '12小時制：輪班或延長工時', '24小時制：連續生產環境'],
          image: '🏭'
        },
        {
          step: '4. 配置服務方案',
          description: '根據需求調整平台與硬體服務的價格和功能項目',
          tips: ['可自由新增或刪除服務功能項目', '價格調整會即時反映在報價表中'],
          image: '⚙️'
        },
        {
          step: '5. 匯出報價書',
          description: '選擇PDF或Excel格式匯出專業報價書',
          tips: ['PDF適合直接給客戶，A4格式專業呈現', 'Excel適合內部分析，包含詳細數據'],
          image: '📄'
        }
      ]
    },
    advanced: {
      title: '🎛️ 進階功能說明',
      content: [
        {
          step: '智能成本分析',
          description: '系統會根據公司營業額和生產模式自動計算成本效益',
          tips: ['停機損失自動計算', '投資回報期智能分析', '風險評估動態調整'],
          image: '💡'
        },
        {
          step: '動態服務對照',
          description: '服務功能對照表會根據實際配置動態生成',
          tips: ['只顯示已配置的服務項目', '✓/✗標記精確匹配功能', '自動分組平台與硬體服務'],
          image: '📊'
        },
        {
          step: '多重匯出格式',
          description: '支援多種匯出格式滿足不同需求',
          tips: ['PDF報價書：客戶展示用', 'Excel分析表：內部評估用', '兩種格式數據完全一致'],
          image: '📋'
        }
      ]
    },
    troubleshooting: {
      title: '🔧 常見問題解決',
      content: [
        {
          step: '統編查詢失敗',
          description: '如果統編查詢顯示失敗，可能的原因和解決方案',
          tips: ['檢查統編是否為8位數字', '嘗試重新查詢或手動輸入', '如查無資料請直接手動填寫公司資訊'],
          image: '❌'
        },
        {
          step: 'PDF匯出問題',
          description: 'PDF匯出可能需要較長時間，請耐心等待',
          tips: ['大型報價書可能需要10-30秒', '匯出過程中不要關閉瀏覽器', '如果失敗可嘗試重新匯出'],
          image: '⏳'
        },
        {
          step: '功能項目管理',
          description: '新增或修改服務功能項目的注意事項',
          tips: ['相同名稱的功能會自動合併', '空白項目會被自動過濾', '修改後會即時更新對照表'],
          image: '🔄'
        },
        {
          step: '資料保存',
          description: '系統會自動保存您的配置，但建議定期手動備份',
          tips: ['瀏覽器會暫存配置資料', '重新整理頁面不會丟失數據', '清除瀏覽器資料會重置所有設定'],
          image: '💾'
        }
      ]
    },
    tips: {
      title: '💡 使用技巧',
      content: [
        {
          step: '快速配置',
          description: '使用預設統編快速開始',
          tips: ['支援台灣公司統編查詢', '自動填入公司基本資訊', '查無資料時請手動輸入'],
          image: '⚡'
        },
        {
          step: '最佳實踐',
          description: '獲得最佳使用體驗的建議',
          tips: ['先完成統編查詢自動填入基本資訊', '根據實際生產情況選擇班別', '仔細檢查成本分析的合理性'],
          image: '🎯'
        },
        {
          step: '數據準確性',
          description: '確保報價書數據的準確性',
          tips: ['營業額直接影響成本效益分析', '班別選擇影響風險評估', '服務項目影響價格計算'],
          image: '📈'
        }
      ]
    }
  }

  return (
    <div style={{
      background: 'white',
      borderRadius: '10px',
      padding: '20px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
      transition: 'all 0.3s ease',
      height: 'fit-content'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: isCollapsed ? '0' : '20px'
      }}>
        <h2 style={{
          margin: '0',
          color: '#333',
          fontSize: isCollapsed ? '16px' : '18px',
          fontWeight: 'bold',
          transition: 'all 0.3s ease'
        }}>
          {isCollapsed ? '🧭 快速導航' : '🧭 報價單快速導航'}
        </h2>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          style={{
            background: 'transparent',
            border: 'none',
            fontSize: '18px',
            cursor: 'pointer',
            padding: '5px',
            borderRadius: '4px',
            transition: 'all 0.3s ease',
            color: '#666'
          }}
          onMouseEnter={(e) => e.target.style.background = '#f0f0f0'}
          onMouseLeave={(e) => e.target.style.background = 'transparent'}
          title={isCollapsed ? '展開導航面板' : '收起導航面板'}
        >
          {isCollapsed ? '▶️' : '◀️'}
        </button>
      </div>

      {/* 導航錨點列表 */}
      {!isCollapsed && (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}>
          {navigationItems.map((item, index) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-start',
                gap: '12px',
                padding: '12px 16px',
                border: '1px solid #e0e0e0',
                borderRadius: '8px',
                background: 'white',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                textAlign: 'left',
                fontSize: '14px'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = '#f8fcff'
                e.target.style.borderColor = '#1976d2'
                e.target.style.transform = 'translateX(5px)'
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'white'
                e.target.style.borderColor = '#e0e0e0'
                e.target.style.transform = 'translateX(0)'
              }}
            >
              <span style={{
                fontSize: '16px',
                minWidth: '20px',
                textAlign: 'center'
              }}>
                {item.label.split(' ')[0]}
              </span>
              <div style={{ flex: 1 }}>
                <div style={{
                  fontWeight: '600',
                  color: '#333',
                  marginBottom: '2px'
                }}>
                  {item.label.substring(2)}
                </div>
                <div style={{
                  fontSize: '12px',
                  color: '#666'
                }}>
                  {item.description}
                </div>
              </div>
              <span style={{
                fontSize: '12px',
                color: '#1976d2',
                opacity: 0.7
              }}>
                ›
              </span>
            </button>
          ))}
        </div>
      )}

      {/* 快速提示 */}
      {!isCollapsed && (
        <div style={{
          marginTop: '20px',
          padding: '15px',
          background: 'linear-gradient(135deg, #e8f5e8, #c8e6c9)',
          borderRadius: '8px',
          border: '1px solid #4caf50'
        }}>
          <h4 style={{
            margin: '0 0 10px 0',
            color: '#2e7d32',
            fontSize: '14px',
            fontWeight: '600'
          }}>
            💡 快速操作提示
          </h4>
          <div style={{
            fontSize: '12px',
            color: '#388e3c',
            lineHeight: '1.4'
          }}>
            • 點擊上方項目可快速跳轉到對應區域<br />
            • 調整服務配置後會即時更新成本分析
          </div>
        </div>
      )}
    </div>
  )
}

export default UserGuide