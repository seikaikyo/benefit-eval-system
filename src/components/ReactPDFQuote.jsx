import React from 'react'
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'
import { calculateRevenue, formatPrice, getCombinedPrice } from '../utils/taxIdService'

// 定義PDF樣式 - 移除fontFamily讓react-pdf使用預設字體
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 20,
    fontSize: 10
  },
  header: {
    backgroundColor: '#667eea',
    padding: 15,
    marginBottom: 20,
    borderRadius: 5
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 5
  },
  headerSubtitle: {
    fontSize: 10,
    color: '#FFFFFF',
    textAlign: 'center'
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1976d2',
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    paddingBottom: 5
  },
  table: {
    width: '100%',
    marginBottom: 20
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    minHeight: 25
  },
  tableHeader: {
    backgroundColor: '#f8f9fa',
    fontWeight: 'bold',
    borderBottomWidth: 2,
    borderBottomColor: '#dee2e6'
  },
  tableColHeader: {
    width: '40%',
    padding: 8,
    backgroundColor: '#f5f5f5',
    borderRightWidth: 1,
    borderRightColor: '#e0e0e0'
  },
  tableColContent: {
    width: '20%',
    padding: 8,
    borderRightWidth: 1,
    borderRightColor: '#e0e0e0',
    textAlign: 'center'
  },
  tableCell: {
    fontSize: 9
  },
  tableCellLeft: {
    fontSize: 9
  },
  checkmark: {
    color: '#4caf50'
  },
  cross: {
    color: '#f44336'
  },
  priceHighlight: {
    fontSize: 11,
    color: '#d32f2f'
  },
  categoryHeader: {
    backgroundColor: '#e3f2fd',
    fontWeight: 'bold',
    color: '#1976d2',
    textAlign: 'center',
    padding: 10
  },
  platformCategory: {
    backgroundColor: '#fff3e0',
    borderLeftWidth: 4,
    borderLeftColor: '#ff9800'
  },
  hardwareCategory: {
    backgroundColor: '#f3e5f5',
    borderLeftWidth: 4,
    borderLeftColor: '#9c27b0'
  },
  riskAnalysisBox: {
    backgroundColor: '#4caf50',
    padding: 15,
    marginBottom: 15,
    borderRadius: 5
  },
  riskTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 10,
    textAlign: 'center'
  },
  riskGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15
  },
  riskCard: {
    width: '30%',
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 5,
    border: '2px solid #e0e0e0'
  },
  riskCardTitle: {
    fontSize: 8,
    color: '#666',
    marginBottom: 3
  },
  riskCardValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2196f3'
  },
  downtimeGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15
  },
  downtimeCard: {
    width: '30%',
    backgroundColor: '#FFFFFF',
    padding: 10,
    borderRadius: 5,
    textAlign: 'center'
  },
  downtimeTitle: {
    fontSize: 10,
    color: '#666',
    marginBottom: 5
  },
  downtimeValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#f57c00'
  },
  downtimeSubtext: {
    fontSize: 8,
    color: '#999',
    marginTop: 3
  }
})

const ReactPDFQuote = ({ companyInfo, serviceDetails, shiftPatterns }) => {
  // 計算函數
  const calculateHourlyRevenue = () => {
    return calculateRevenue.hourly(companyInfo.annualRevenue)
  }

  const calculateDailyRevenue = () => {
    return calculateRevenue.daily(companyInfo.annualRevenue)
  }

  const calculateDowntimeRisk = (hours) => {
    const riskMultiplier = shiftPatterns[companyInfo.shiftPattern].riskMultiplier || 1
    return calculateRevenue.downtimeRisk(companyInfo.annualRevenue, hours, riskMultiplier)
  }

  const getCombinedPriceLocal = (platformType, hardwareType) => {
    return getCombinedPrice(serviceDetails, platformType, hardwareType)
  }

  // 動態生成服務功能對照表數據
  const generateFeatureRows = () => {
    const rows = []
    
    // 平台服務項目
    const allPlatformFeatures = new Set([
      ...serviceDetails.platform.basic.features,
      ...serviceDetails.platform.advanced.features,
      ...serviceDetails.platform.premium.features
    ])

    allPlatformFeatures.forEach(featureName => {
      if (featureName && featureName.trim()) {
        rows.push({
          type: 'platform',
          name: featureName,
          basic: serviceDetails.platform.basic.features.includes(featureName) ? '✓' : '✗',
          advanced: serviceDetails.platform.advanced.features.includes(featureName) ? '✓' : '✗',
          premium: serviceDetails.platform.premium.features.includes(featureName) ? '✓' : '✗'
        })
      }
    })

    // 硬體服務項目
    const allHardwareFeatures = new Set([
      ...serviceDetails.hardware.basic.features,
      ...serviceDetails.hardware.advanced.features,
      ...serviceDetails.hardware.premium.features
    ])

    allHardwareFeatures.forEach(featureName => {
      if (featureName && featureName.trim()) {
        rows.push({
          type: 'hardware',
          name: featureName,
          basic: serviceDetails.hardware.basic.features.includes(featureName) ? '✓' : '✗',
          advanced: serviceDetails.hardware.advanced.features.includes(featureName) ? '✓' : '✗',
          premium: serviceDetails.hardware.premium.features.includes(featureName) ? '✓' : '✗'
        })
      }
    })

    return rows
  }

  const featureRows = generateFeatureRows()
  const platformRows = featureRows.filter(row => row.type === 'platform')
  const hardwareRows = featureRows.filter(row => row.type === 'hardware')

  return (
    <Document>
      {/* 第一頁：平台與應用層服務對照表 */}
      <Page size="A4" style={styles.page}>
        {/* 頁面標題 */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>研華 WISE-IoT SRP 維運服務方案比較表</Text>
          <Text style={styles.headerSubtitle}>
            客戶：{companyInfo.companyName} | 報價日期：{companyInfo.quoteDate} | 有效期限：{companyInfo.validDate}
          </Text>
        </View>

        {/* 平台與應用層服務對照表 */}
        <Text style={styles.sectionTitle}>平台與應用層服務對照表</Text>
        
        <View style={styles.table}>
          {/* 表格標題行 */}
          <View style={[styles.tableRow, styles.tableHeader]}>
            <View style={styles.tableColHeader}>
              <Text style={styles.tableCellLeft}>維運功能項目</Text>
            </View>
            <View style={styles.tableColContent}>
              <Text style={styles.tableCell}>Basic</Text>
            </View>
            <View style={styles.tableColContent}>
              <Text style={styles.tableCell}>Advanced</Text>
            </View>
            <View style={styles.tableColContent}>
              <Text style={styles.tableCell}>Premium</Text>
            </View>
          </View>

          {/* 平台功能項目 */}
          {platformRows.map((row, index) => (
            <View key={`platform-${index}`} style={styles.tableRow}>
              <View style={styles.tableColHeader}>
                <Text style={styles.tableCellLeft}>{row.name}</Text>
              </View>
              <View style={styles.tableColContent}>
                <Text style={[styles.tableCell, row.basic === '✓' ? styles.checkmark : styles.cross]}>
                  {row.basic}
                </Text>
              </View>
              <View style={styles.tableColContent}>
                <Text style={[styles.tableCell, row.advanced === '✓' ? styles.checkmark : styles.cross]}>
                  {row.advanced}
                </Text>
              </View>
              <View style={styles.tableColContent}>
                <Text style={[styles.tableCell, row.premium === '✓' ? styles.checkmark : styles.cross]}>
                  {row.premium}
                </Text>
              </View>
            </View>
          ))}

          {/* 年度價格行 */}
          <View style={[styles.tableRow, styles.categoryHeader]}>
            <View style={styles.tableColHeader}>
              <Text style={styles.tableCellLeft}>年度價格 (新台幣)</Text>
            </View>
            <View style={styles.tableColContent}>
              <Text style={styles.priceHighlight}>{formatPrice(serviceDetails.platform.basic.price)}</Text>
            </View>
            <View style={styles.tableColContent}>
              <Text style={styles.priceHighlight}>{formatPrice(serviceDetails.platform.advanced.price)}</Text>
            </View>
            <View style={styles.tableColContent}>
              <Text style={styles.priceHighlight}>{formatPrice(serviceDetails.platform.premium.price)}</Text>
            </View>
          </View>
        </View>
      </Page>

      {/* 第二頁：硬體基礎層服務對照表 */}
      <Page size="A4" style={styles.page}>
        {/* 硬體基礎層服務對照表 */}
        <Text style={styles.sectionTitle}>硬體基礎層服務對照表</Text>
        
        <View style={styles.table}>
          {/* 表格標題行 */}
          <View style={[styles.tableRow, styles.tableHeader]}>
            <View style={styles.tableColHeader}>
              <Text style={styles.tableCellLeft}>維運功能項目</Text>
            </View>
            <View style={styles.tableColContent}>
              <Text style={styles.tableCell}>Basic</Text>
            </View>
            <View style={styles.tableColContent}>
              <Text style={styles.tableCell}>Advanced</Text>
            </View>
            <View style={styles.tableColContent}>
              <Text style={styles.tableCell}>Premium</Text>
            </View>
          </View>

          {/* 硬體功能項目 */}
          {hardwareRows.map((row, index) => (
            <View key={`hardware-${index}`} style={styles.tableRow}>
              <View style={styles.tableColHeader}>
                <Text style={styles.tableCellLeft}>{row.name}</Text>
              </View>
              <View style={styles.tableColContent}>
                <Text style={[styles.tableCell, row.basic === '✓' ? styles.checkmark : styles.cross]}>
                  {row.basic}
                </Text>
              </View>
              <View style={styles.tableColContent}>
                <Text style={[styles.tableCell, row.advanced === '✓' ? styles.checkmark : styles.cross]}>
                  {row.advanced}
                </Text>
              </View>
              <View style={styles.tableColContent}>
                <Text style={[styles.tableCell, row.premium === '✓' ? styles.checkmark : styles.cross]}>
                  {row.premium}
                </Text>
              </View>
            </View>
          ))}

          {/* 年度價格行 */}
          <View style={[styles.tableRow, styles.categoryHeader]}>
            <View style={styles.tableColHeader}>
              <Text style={styles.tableCellLeft}>年度價格 (新台幣)</Text>
            </View>
            <View style={styles.tableColContent}>
              <Text style={styles.priceHighlight}>{formatPrice(serviceDetails.hardware.basic.price)}</Text>
            </View>
            <View style={styles.tableColContent}>
              <Text style={styles.priceHighlight}>{formatPrice(serviceDetails.hardware.advanced.price)}</Text>
            </View>
            <View style={styles.tableColContent}>
              <Text style={styles.priceHighlight}>{formatPrice(serviceDetails.hardware.premium.price)}</Text>
            </View>
          </View>

          {/* 組合總價行 */}
          <View style={[styles.tableRow, { backgroundColor: '#fff3e0' }]}>
            <View style={styles.tableColHeader}>
              <Text style={[styles.tableCellLeft, { fontWeight: 'bold' }]}>組合總價</Text>
            </View>
            <View style={styles.tableColContent}>
              <Text style={[styles.priceHighlight, { fontSize: 14 }]}>
                {formatPrice(getCombinedPriceLocal('basic', 'basic'))}
              </Text>
            </View>
            <View style={styles.tableColContent}>
              <Text style={[styles.priceHighlight, { fontSize: 14 }]}>
                {formatPrice(getCombinedPriceLocal('advanced', 'advanced'))}
              </Text>
            </View>
            <View style={styles.tableColContent}>
              <Text style={[styles.priceHighlight, { fontSize: 14 }]}>
                {formatPrice(getCombinedPriceLocal('premium', 'premium'))}
              </Text>
            </View>
          </View>
        </View>
      </Page>

      {/* 第三頁：班別風險分析與成本效益評估 */}
      <Page size="A4" style={styles.page}>
        {/* 停機風險成本分析 */}
        <View style={styles.riskAnalysisBox}>
          <Text style={styles.riskTitle}>💰 停機風險成本分析</Text>
          
          {/* 班別資訊和基礎營收數據 */}
          <View style={styles.riskGrid}>
            <View style={styles.riskCard}>
              <Text style={styles.riskCardTitle}>年營業額</Text>
              <Text style={[styles.riskCardValue, { color: '#2196f3' }]}>
                {(companyInfo.annualRevenue / 10000).toFixed(1)}億
              </Text>
            </View>
            <View style={styles.riskCard}>
              <Text style={styles.riskCardTitle}>日營業額</Text>
              <Text style={[styles.riskCardValue, { color: '#ff9800' }]}>
                {calculateDailyRevenue()}萬
              </Text>
            </View>
            <View style={styles.riskCard}>
              <Text style={styles.riskCardTitle}>時營業額</Text>
              <Text style={[styles.riskCardValue, { color: '#f44336' }]}>
                {calculateHourlyRevenue()}萬
              </Text>
            </View>
          </View>

          {/* 班別資訊 */}
          <View style={{ backgroundColor: '#FFFFFF', padding: 10, borderRadius: 5, marginBottom: 10 }}>
            <Text style={{ fontSize: 10, fontWeight: 'bold', textAlign: 'center', marginBottom: 5 }}>
              🏭 {shiftPatterns[companyInfo.shiftPattern].name}
            </Text>
            <Text style={{ fontSize: 8, textAlign: 'center' }}>
              工作時間：{shiftPatterns[companyInfo.shiftPattern].workingHours}小時/天 | 
              風險係數：{(shiftPatterns[companyInfo.shiftPattern].riskMultiplier).toFixed(1)}x
            </Text>
          </View>
        </View>

        {/* 停機時間損失計算 */}
        <Text style={[styles.sectionTitle, { marginTop: 20 }]}>
          ⚠️ 停機風險成本分析（已含班別風險係數）
        </Text>
        
        <View style={styles.downtimeGrid}>
          <View style={styles.downtimeCard}>
            <Text style={styles.downtimeTitle}>2小時停機</Text>
            <Text style={styles.downtimeValue}>
              損失{Math.round(calculateHourlyRevenue() * 2 * shiftPatterns[companyInfo.shiftPattern].riskMultiplier)}萬
            </Text>
            <Text style={styles.downtimeSubtext}>
              基本損失{calculateHourlyRevenue() * 2}萬 × {(shiftPatterns[companyInfo.shiftPattern].riskMultiplier).toFixed(1)}x風險係數
            </Text>
          </View>
          <View style={styles.downtimeCard}>
            <Text style={styles.downtimeTitle}>4小時停機</Text>
            <Text style={styles.downtimeValue}>
              損失{Math.round(calculateHourlyRevenue() * 4 * shiftPatterns[companyInfo.shiftPattern].riskMultiplier)}萬
            </Text>
            <Text style={styles.downtimeSubtext}>
              基本損失{calculateHourlyRevenue() * 4}萬 × {(shiftPatterns[companyInfo.shiftPattern].riskMultiplier).toFixed(1)}x風險係數
            </Text>
          </View>
          <View style={styles.downtimeCard}>
            <Text style={styles.downtimeTitle}>8小時停機</Text>
            <Text style={styles.downtimeValue}>
              損失{Math.round(calculateHourlyRevenue() * 8 * shiftPatterns[companyInfo.shiftPattern].riskMultiplier)}萬
            </Text>
            <Text style={styles.downtimeSubtext}>
              基本損失{calculateHourlyRevenue() * 8}萬 × {(shiftPatterns[companyInfo.shiftPattern].riskMultiplier).toFixed(1)}x風險係數
            </Text>
          </View>
        </View>

        {/* Premium方案推薦 */}
        <View style={{ backgroundColor: '#4caf50', padding: 15, marginTop: 20, borderRadius: 5 }}>
          <Text style={[styles.riskTitle, { fontSize: 14 }]}>
            🌟 Premium方案：最明智的投資決策
          </Text>
          <View style={{ backgroundColor: '#FFFFFF', padding: 10, borderRadius: 5 }}>
            <Text style={{ fontSize: 10, textAlign: 'center', marginBottom: 5 }}>
              <Text style={{ fontWeight: 'bold', color: '#4caf50' }}>
                {(getCombinedPriceLocal('premium', 'premium') / 10000).toFixed(1)}萬年成本
              </Text>
              <Text style={{ color: '#666' }}> ＜ </Text>
              <Text style={{ fontWeight: 'bold', color: '#f44336' }}>
                {(getCombinedPriceLocal('premium', 'premium') / (calculateHourlyRevenue() * 10000)).toFixed(1)}小時停機損失
                ({(getCombinedPriceLocal('premium', 'premium') / 10000).toFixed(1)}萬)
              </Text>
            </Text>
            <Text style={{ fontSize: 8, textAlign: 'center', color: '#666' }}>
              避免{(getCombinedPriceLocal('premium', 'premium') / (calculateHourlyRevenue() * 10000)).toFixed(1)}小時停機即可回本
            </Text>
          </View>
        </View>
      </Page>
    </Document>
  )
}

export default ReactPDFQuote