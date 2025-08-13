import React, { useState } from 'react'

const UserGuide = () => {
  const [activeSection, setActiveSection] = useState('basic')
  const [isCollapsed, setIsCollapsed] = useState(true) // 預設為摺疊狀態

  const sections = {
    basic: {
      title: '🔰 基本操作指南',
      content: [
        {
          step: '1. 統編查詢',
          description: '在公司資訊區塊的統編查詢框中輸入8位數統編號碼',
          tips: ['可輸入研華(22356500)、示範(12345678)、智能(87654321)等測試統編', '系統會自動驗證格式並查詢公司資訊'],
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
          tips: ['檢查統編是否為8位數字', '嘗試重新查詢或手動輸入', '使用測試統編：22356500, 12345678, 87654321'],
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
          tips: ['22356500 - 研華股份有限公司（真實數據）', '12345678 - 示範科技（測試數據）', '87654321 - 智能製造（測試數據）'],
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
      padding: isCollapsed ? '15px' : '25px',
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
          fontSize: isCollapsed ? '16px' : '20px',
          fontWeight: 'bold',
          transition: 'all 0.3s ease'
        }}>
          {isCollapsed ? '📚 使用指南' : '📚 WISE-IoT SRP 維運服務評估系統使用指南'}
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
          title={isCollapsed ? '展開使用指南' : '收起使用指南'}
        >
          {isCollapsed ? '▶️' : '◀️'}
        </button>
      </div>

      {/* 導航選項卡 */}
      {!isCollapsed && (
        <div style={{
          display: 'flex',
          gap: '8px',
          marginBottom: '20px',
          borderBottom: '2px solid #f0f0f0',
          paddingBottom: '10px',
          flexWrap: 'wrap'
        }}>
        {Object.entries(sections).map(([key, section]) => (
          <button
            key={key}
            onClick={() => setActiveSection(key)}
            style={{
              padding: '6px 12px',
              border: 'none',
              borderRadius: '4px',
              fontSize: '12px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              background: activeSection === key ? '#1976d2' : '#f5f5f5',
              color: activeSection === key ? 'white' : '#666'
            }}
          >
            {section.title}
          </button>
        ))}
        </div>
      )}

      {/* 內容區域 */}
      {!isCollapsed && (
        <div style={{
          padding: '15px',
          background: '#fafafa',
          borderRadius: '8px',
          border: '1px solid #e0e0e0'
        }}>
        <h3 style={{
          margin: '0 0 20px 0',
          color: '#1976d2',
          fontSize: '18px'
        }}>
          {sections[activeSection].title}
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {sections[activeSection].content.map((item, index) => (
            <div key={index} style={{
              background: 'white',
              padding: '20px',
              borderRadius: '8px',
              border: '1px solid #e0e0e0',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '15px'
              }}>
                <div style={{
                  fontSize: '24px',
                  lineHeight: '1',
                  minWidth: '30px'
                }}>
                  {item.image}
                </div>
                
                <div style={{ flex: 1 }}>
                  <h4 style={{
                    margin: '0 0 10px 0',
                    color: '#333',
                    fontSize: '16px',
                    fontWeight: '600'
                  }}>
                    {item.step}
                  </h4>
                  
                  <p style={{
                    margin: '0 0 15px 0',
                    color: '#666',
                    fontSize: '14px',
                    lineHeight: '1.5'
                  }}>
                    {item.description}
                  </p>
                  
                  <div style={{
                    background: '#f8f9fa',
                    padding: '12px',
                    borderRadius: '6px',
                    border: '1px solid #e9ecef'
                  }}>
                    <div style={{
                      fontSize: '12px',
                      fontWeight: '600',
                      color: '#495057',
                      marginBottom: '8px'
                    }}>
                      💡 小提示：
                    </div>
                    {item.tips.map((tip, tipIndex) => (
                      <div key={tipIndex} style={{
                        fontSize: '12px',
                        color: '#6c757d',
                        marginBottom: '4px',
                        paddingLeft: '12px',
                        position: 'relative'
                      }}>
                        <span style={{
                          position: 'absolute',
                          left: '0',
                          color: '#28a745'
                        }}>•</span>
                        {tip}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      )}

      {/* 快速聯絡資訊 */}
      {!isCollapsed && (
      <div style={{
        marginTop: '25px',
        padding: '15px',
        background: 'linear-gradient(135deg, #e3f2fd, #bbdefb)',
        borderRadius: '8px',
        textAlign: 'center'
      }}>
        <h4 style={{
          margin: '0 0 10px 0',
          color: '#1976d2',
          fontSize: '16px'
        }}>
          📞 需要協助？
        </h4>
        <p style={{
          margin: '0',
          fontSize: '14px',
          color: '#1565c0'
        }}>
          如有任何使用問題，歡迎聯繫研華科技客服團隊<br />
          或參考系統右上角的操作提示
        </p>
        </div>
      )}
    </div>
  )
}

export default UserGuide