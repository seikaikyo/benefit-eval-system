# WISE-IoT SRP 維護服務效益評估系統 V2.0

[![Deploy Status](https://img.shields.io/badge/deploy-automated-brightgreen)](https://benefit-eval-system.vercel.app/)
[![Version](https://img.shields.io/badge/version-2.0.0-blue)](#版本歷程)
[![React](https://img.shields.io/badge/React-18+-61dafb)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5+-646cff)](https://vitejs.dev/)

> 🎯 **智能報價系統**: 專為 WISE-IoT SRP 維護服務設計的成本效益評估與報價生成平台

## 📋 系統概述

WISE-IoT SRP 維護服務效益評估系統是一個專業的報價生成平台，幫助業務團隊快速評估客戶的維護服務需求，並生成專業的報價文件。系統整合了台灣公司統編查詢、智能成本分析、動態服務配置等功能，提供完整的報價解決方案。

### 🌟 核心特色

- **🔍 智能統編查詢**: 自動查詢台灣公司統編，快速填入公司基本資訊
- **🏭 班別風險分析**: 根據不同生產班別自動調整風險係數和成本評估
- **⚙️ 動態服務配置**: 彈性配置平台與硬體服務項目和價格
- **📊 即時成本分析**: 智能計算停機損失、投資回報期與風險評估
- **🧭 導航錨點系統**: 一鍵快速定位到各個編輯區域
- **📄 多格式匯出**: 支援 PDF 和 Excel 格式的專業報價書

## 🚀 系統功能

### 1. 公司資訊管理
- **統編查詢**: 支援台灣公司統編 API 查詢，自動填入公司資訊
- **基本資訊**: 公司名稱、地址、聯絡人、電話等
- **營收數據**: 年營業額設定，用於成本效益計算

### 2. 生產模式配置
- **8小時制**: 標準工作時間，風險係數 1.0
- **12小時制**: 輪班作業，風險係數 1.3  
- **24小時制**: 連續生產，風險係數 1.8

### 3. 服務項目管理
#### 平台與應用層服務
- **Basic MA**: 基礎監控與警報
- **Premium MA**: 進階分析與預測維護
- **Advanced MA**: 完整智能維護解決方案

#### 硬體基礎服務  
- **Basic HA**: 基礎硬體監控
- **Premium HA**: 完整硬體維護
- **Advanced HA**: 智能硬體管理

### 4. 智能分析引擎
- **停機成本計算**: 依據營業額與班別風險自動計算
- **投資回報分析**: ROI 計算與建議
- **服務適用性評估**: 智能推薦最適合的服務方案

### 5. 專業報價匯出
- **PDF報價書**: A4 格式，適合客戶展示
- **Excel分析表**: 詳細數據，便於內部評估

## 🛠️ 技術架構

### 前端技術棧
- **React 18+**: 現代化前端框架
- **Vite 5+**: 高性能構建工具
- **ES6+ JavaScript**: 現代 JavaScript 語法
- **CSS3**: 響應式設計與動畫效果

### API 整合
- **Vercel Serverless**: API 代理解決 CORS 問題
- **台灣公司統編查詢**: OpenData VIP & G0V API
- **jsPDF**: PDF 生成與匯出
- **SheetJS**: Excel 文件處理

### 部署平台
- **Vercel**: 自動化部署與 CDN 加速
- **GitHub**: 版本控制與持續整合

## 📱 使用指南

### 快速開始
1. **統編查詢**: 輸入 8 位統編號碼（如：22099131）
2. **選擇班別**: 根據實際生產模式選擇適當班別
3. **配置服務**: 調整服務項目與價格
4. **查看分析**: 檢視成本效益分析結果
5. **匯出報價**: 選擇 PDF 或 Excel 格式匯出

### 導航功能
系統左側提供快速導航功能：
- 🏢 **公司資訊**: 統編查詢與基本資料
- 🏭 **生產班別**: 選擇生產模式  
- 📝 **特殊需求**: 填寫客製化需求
- ⚙️ **服務配置**: 調整服務方案與價格
- 📊 **方案比較**: 查看詳細對照表
- 💰 **成本分析**: 檢視停機風險評估
- 📄 **匯出報價**: 生成PDF或Excel報價書

### 測試統編
系統支援以下測試統編：
- `22099131`: 台灣積體電路製造股份有限公司
- `22356500`: 研華股份有限公司  
- `23526740`: 鴻海精密工業股份有限公司

## 🔧 本地開發

### 環境需求
- Node.js 18+
- npm 或 yarn

### 安裝與啟動
```bash
# 複製專案
git clone <repository-url>
cd benefit-evaluation-analysis

# 安裝依賴
npm install

# 啟動開發服務器
npm run dev

# 構建生產版本
npm run build
```

### 專案結構
```
src/
├── components/          # React 組件
│   ├── ConfigPanel.jsx     # 配置面板
│   ├── ComparisonTable.jsx # 比較表格
│   ├── ExportButtons.jsx   # 匯出功能
│   ├── TaxIdLookup.jsx     # 統編查詢
│   ├── UserGuide.jsx       # 導航指南
│   └── PDFQuote.jsx        # PDF報價模板
├── utils/              # 工具函式
│   └── taxIdService.js     # 統編查詢服務
└── App.jsx             # 主應用程式

api/
└── taxid.js            # Vercel API 代理
```

## 📈 版本歷程

### V2.0 (2025-08-13) - 智能導航與CORS解決方案
**🎯 主要更新**:
- ✨ **導航錨點系統**: 左側面板改為互動式快速定位導航
- 🔧 **CORS問題解決**: 實作Vercel API代理，完全解決統編查詢CORS限制  
- 🗑️ **代碼優化**: 移除本地端統編查詢，完全依賴線上API服務
- 🎨 **用戶體驗**: 平滑滾動與視覺反饋效果

**🚀 技術改進**:
- 新增 `/api/taxid.js` Vercel Serverless Function
- 重構 `UserGuide.jsx` 為導航錨點系統
- 優化 `taxIdService.js` API查詢邏輯
- 新增所有關鍵區域的錨點ID支援

### V1.8 (2025-08-13) - 班別風險分析強化
- 🏭 **智能班別分析**: 完善生產班別風險係數計算
- 📊 **成本分析優化**: 改善停機損失與投資回報計算邏輯
- 🎨 **UI/UX改善**: 優化版面配置與使用者互動體驗

### V1.5 - 服務比較系統
- 📋 **動態服務對照**: 實作智能服務功能比較表
- 💰 **價格計算引擎**: 完善服務價格與成本分析
- 📄 **匯出功能**: PDF與Excel雙格式報價書生成

### V1.0 - 基礎系統
- 🏢 **統編查詢**: 基礎台灣公司統編查詢功能
- ⚙️ **服務配置**: 平台與硬體服務項目管理
- 📊 **報價生成**: 基礎報價單生成功能

## 🌐 線上展示

**正式網站**: [https://benefit-eval-system.vercel.app/](https://benefit-eval-system.vercel.app/)

## 🤝 開發團隊

- **主要開發**: WISE-IoT Team
- **技術支援**: Claude AI Assistant
- **部署平台**: Vercel
- **版本控制**: GitHub

## 📞 支援與回饋

如有任何問題或建議，請透過以下方式聯繫：
- 📧 Email: [聯絡信箱]
- 🐛 Issue Tracking: GitHub Issues
- 💬 即時支援: [支援管道]

---

<div align="center">

**🤖 Generated with [Claude Code](https://claude.ai/code)**

*Last Updated: 2025-08-13*

</div>