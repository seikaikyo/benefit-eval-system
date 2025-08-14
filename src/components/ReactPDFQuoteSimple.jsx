import React from 'react'
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'
import { calculateRevenue, formatPrice, getCombinedPrice } from '../utils/taxIdService'

// 簡化的PDF樣式 - 專門處理中文顯示問題
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 30,
    fontSize: 12
  },
  title: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
    color: '#1976d2'
  },
  section: {
    marginBottom: 20
  },
  sectionTitle: {
    fontSize: 14,
    marginBottom: 10,
    color: '#333',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingBottom: 5
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingVertical: 8
  },
  col1: {
    width: '40%',
    paddingRight: 10
  },
  col2: {
    width: '20%',
    textAlign: 'center'
  },
  col3: {
    width: '20%',
    textAlign: 'center'
  },
  col4: {
    width: '20%',
    textAlign: 'center'
  },
  headerRow: {
    backgroundColor: '#f5f5f5',
    fontWeight: 'bold'
  },
  text: {
    fontSize: 10
  },
  priceText: {
    fontSize: 11,
    color: '#d32f2f'
  }
})

const ReactPDFQuoteSimple = ({ companyInfo, serviceDetails, shiftPatterns }) => {
  // 計算函數
  const calculateHourlyRevenue = () => {
    return calculateRevenue.hourly(companyInfo.annualRevenue)
  }

  const calculateDailyRevenue = () => {
    return calculateRevenue.daily(companyInfo.annualRevenue)
  }

  const getCombinedPriceLocal = (platformType, hardwareType) => {
    return getCombinedPrice(serviceDetails, platformType, hardwareType)
  }

  // 動態生成真實的服務功能對照表
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
      {/* 第一頁：服務對照表 */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>WISE-IoT SRP Service Comparison</Text>
        
        <Text style={{ fontSize: 10, textAlign: 'center', marginBottom: 20 }}>
          Company: {companyInfo.companyName} | Date: {companyInfo.quoteDate}
        </Text>

        {/* 平台服務 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Platform Services</Text>
          
          {/* 表格標題 */}
          <View style={[styles.row, styles.headerRow]}>
            <View style={styles.col1}>
              <Text style={styles.text}>Service Items</Text>
            </View>
            <View style={styles.col2}>
              <Text style={styles.text}>Basic</Text>
            </View>
            <View style={styles.col3}>
              <Text style={styles.text}>Advanced</Text>
            </View>
            <View style={styles.col4}>
              <Text style={styles.text}>Premium</Text>
            </View>
          </View>

          {/* 平台服務項目 */}
          {platformRows.map((row, index) => (
            <View key={index} style={styles.row}>
              <View style={styles.col1}>
                <Text style={styles.text}>{row.name}</Text>
              </View>
              <View style={styles.col2}>
                <Text style={[styles.text, { color: row.basic === '✓' ? '#4caf50' : '#f44336' }]}>{row.basic}</Text>
              </View>
              <View style={styles.col3}>
                <Text style={[styles.text, { color: row.advanced === '✓' ? '#4caf50' : '#f44336' }]}>{row.advanced}</Text>
              </View>
              <View style={styles.col4}>
                <Text style={[styles.text, { color: row.premium === '✓' ? '#4caf50' : '#f44336' }]}>{row.premium}</Text>
              </View>
            </View>
          ))}

          {/* 價格行 */}
          <View style={[styles.row, { backgroundColor: '#fff3e0' }]}>
            <View style={styles.col1}>
              <Text style={styles.priceText}>Annual Price (NTD)</Text>
            </View>
            <View style={styles.col2}>
              <Text style={styles.priceText}>{formatPrice(serviceDetails.platform.basic.price)}</Text>
            </View>
            <View style={styles.col3}>
              <Text style={styles.priceText}>{formatPrice(serviceDetails.platform.advanced.price)}</Text>
            </View>
            <View style={styles.col4}>
              <Text style={styles.priceText}>{formatPrice(serviceDetails.platform.premium.price)}</Text>
            </View>
          </View>
        </View>

        {/* 硬體服務 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Hardware Services</Text>
          
          {/* 表格標題 */}
          <View style={[styles.row, styles.headerRow]}>
            <View style={styles.col1}>
              <Text style={styles.text}>Service Items</Text>
            </View>
            <View style={styles.col2}>
              <Text style={styles.text}>Basic</Text>
            </View>
            <View style={styles.col3}>
              <Text style={styles.text}>Advanced</Text>
            </View>
            <View style={styles.col4}>
              <Text style={styles.text}>Premium</Text>
            </View>
          </View>

          {/* 硬體服務項目 */}
          {hardwareRows.map((row, index) => (
            <View key={index} style={styles.row}>
              <View style={styles.col1}>
                <Text style={styles.text}>{row.name}</Text>
              </View>
              <View style={styles.col2}>
                <Text style={[styles.text, { color: row.basic === '✓' ? '#4caf50' : '#f44336' }]}>{row.basic}</Text>
              </View>
              <View style={styles.col3}>
                <Text style={[styles.text, { color: row.advanced === '✓' ? '#4caf50' : '#f44336' }]}>{row.advanced}</Text>
              </View>
              <View style={styles.col4}>
                <Text style={[styles.text, { color: row.premium === '✓' ? '#4caf50' : '#f44336' }]}>{row.premium}</Text>
              </View>
            </View>
          ))}

          {/* 價格行 */}
          <View style={[styles.row, { backgroundColor: '#fff3e0' }]}>
            <View style={styles.col1}>
              <Text style={styles.priceText}>Annual Price (NTD)</Text>
            </View>
            <View style={styles.col2}>
              <Text style={styles.priceText}>{formatPrice(serviceDetails.hardware.basic.price)}</Text>
            </View>
            <View style={styles.col3}>
              <Text style={styles.priceText}>{formatPrice(serviceDetails.hardware.advanced.price)}</Text>
            </View>
            <View style={styles.col4}>
              <Text style={styles.priceText}>{formatPrice(serviceDetails.hardware.premium.price)}</Text>
            </View>
          </View>

          {/* 組合總價 */}
          <View style={[styles.row, { backgroundColor: '#e8f5e8' }]}>
            <View style={styles.col1}>
              <Text style={[styles.priceText, { fontSize: 12 }]}>Total Combined Price</Text>
            </View>
            <View style={styles.col2}>
              <Text style={[styles.priceText, { fontSize: 12 }]}>
                {formatPrice(getCombinedPriceLocal('basic', 'basic'))}
              </Text>
            </View>
            <View style={styles.col3}>
              <Text style={[styles.priceText, { fontSize: 12 }]}>
                {formatPrice(getCombinedPriceLocal('advanced', 'advanced'))}
              </Text>
            </View>
            <View style={styles.col4}>
              <Text style={[styles.priceText, { fontSize: 12 }]}>
                {formatPrice(getCombinedPriceLocal('premium', 'premium'))}
              </Text>
            </View>
          </View>
        </View>
      </Page>

      {/* 第二頁：成本分析 */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>Cost-Benefit Analysis</Text>

        {/* 營業數據 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Revenue Data</Text>
          
          <View style={styles.row}>
            <View style={styles.col1}>
              <Text style={styles.text}>Annual Revenue</Text>
            </View>
            <View style={{ width: '60%' }}>
              <Text style={styles.text}>{(companyInfo.annualRevenue / 10000).toFixed(1)} Billion NTD</Text>
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.col1}>
              <Text style={styles.text}>Daily Revenue</Text>
            </View>
            <View style={{ width: '60%' }}>
              <Text style={styles.text}>{calculateDailyRevenue()} Million NTD</Text>
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.col1}>
              <Text style={styles.text}>Hourly Revenue</Text>
            </View>
            <View style={{ width: '60%' }}>
              <Text style={styles.text}>{calculateHourlyRevenue()} Million NTD</Text>
            </View>
          </View>
        </View>

        {/* 班別信息 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Shift Pattern Analysis</Text>
          
          <View style={styles.row}>
            <View style={styles.col1}>
              <Text style={styles.text}>Shift Pattern</Text>
            </View>
            <View style={{ width: '60%' }}>
              <Text style={styles.text}>{shiftPatterns[companyInfo.shiftPattern].name}</Text>
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.col1}>
              <Text style={styles.text}>Working Hours</Text>
            </View>
            <View style={{ width: '60%' }}>
              <Text style={styles.text}>{shiftPatterns[companyInfo.shiftPattern].workingHours} hours/day</Text>
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.col1}>
              <Text style={styles.text}>Risk Multiplier</Text>
            </View>
            <View style={{ width: '60%' }}>
              <Text style={styles.text}>{(shiftPatterns[companyInfo.shiftPattern].riskMultiplier).toFixed(1)}x</Text>
            </View>
          </View>
        </View>

        {/* 停機損失分析 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Downtime Risk Analysis</Text>
          
          <View style={styles.row}>
            <View style={styles.col1}>
              <Text style={styles.text}>2-hour Downtime Loss</Text>
            </View>
            <View style={{ width: '60%' }}>
              <Text style={styles.text}>
                {Math.round(calculateHourlyRevenue() * 2 * shiftPatterns[companyInfo.shiftPattern].riskMultiplier)} Million NTD
              </Text>
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.col1}>
              <Text style={styles.text}>4-hour Downtime Loss</Text>
            </View>
            <View style={{ width: '60%' }}>
              <Text style={styles.text}>
                {Math.round(calculateHourlyRevenue() * 4 * shiftPatterns[companyInfo.shiftPattern].riskMultiplier)} Million NTD
              </Text>
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.col1}>
              <Text style={styles.text}>8-hour Downtime Loss</Text>
            </View>
            <View style={{ width: '60%' }}>
              <Text style={styles.text}>
                {Math.round(calculateHourlyRevenue() * 8 * shiftPatterns[companyInfo.shiftPattern].riskMultiplier)} Million NTD
              </Text>
            </View>
          </View>
        </View>

        {/* 投資建議 */}
        <View style={[styles.section, { backgroundColor: '#e8f5e8', padding: 15, borderRadius: 5 }]}>
          <Text style={[styles.sectionTitle, { borderBottomWidth: 0, color: '#2e7d32' }]}>
            Premium Plan Investment Analysis
          </Text>
          
          <View style={styles.row}>
            <View style={styles.col1}>
              <Text style={styles.text}>Annual Cost</Text>
            </View>
            <View style={{ width: '60%' }}>
              <Text style={styles.text}>
                {(getCombinedPriceLocal('premium', 'premium') / 10000).toFixed(1)} Million NTD
              </Text>
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.col1}>
              <Text style={styles.text}>Break-even Hours</Text>
            </View>
            <View style={{ width: '60%' }}>
              <Text style={styles.text}>
                {(getCombinedPriceLocal('premium', 'premium') / (calculateHourlyRevenue() * 10000)).toFixed(1)} hours downtime
              </Text>
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.col1}>
              <Text style={styles.text}>Cost vs Revenue</Text>
            </View>
            <View style={{ width: '60%' }}>
              <Text style={styles.text}>
                {(((getCombinedPriceLocal('premium', 'premium')) / (companyInfo.annualRevenue * 10000)) * 100).toFixed(3)}% of annual revenue
              </Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  )
}

export default ReactPDFQuoteSimple