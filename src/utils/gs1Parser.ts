import type { GS1BarcodeData, GS1ApplicationIdentifier } from '../types/batch'

/**
 * GS1 Application Identifiers
 * Reference: https://www.gs1.org/standards/barcodes/application-identifiers
 */
const GS1_AI_DEFINITIONS: Record<string, { name: string; format: string; length?: number }> = {
  '01': { name: 'GTIN', format: 'N14', length: 14 },
  '10': { name: 'Batch/Lot Number', format: 'X..20' },
  '11': { name: 'Production Date', format: 'N6', length: 6 },
  '13': { name: 'Packaging Date', format: 'N6', length: 6 },
  '15': { name: 'Best Before Date', format: 'N6', length: 6 },
  '17': { name: 'Expiry Date', format: 'N6', length: 6 },
  '21': { name: 'Serial Number', format: 'X..20' },
  '310': { name: 'Net Weight (kg)', format: 'N6' },
  '37': { name: 'Count of Items', format: 'N..8' },
}

/**
 * Parse GS1-128 barcode
 * Format: (01)12345678901234(10)LOT123(17)250630
 */
export const parseGS1Barcode = (barcode: string): GS1BarcodeData | null => {
  try {
    // Remove any whitespace
    const cleaned = barcode.trim()
    
    // Check if it looks like a GS1 barcode (contains parentheses or starts with known AI)
    if (!cleaned.includes('(') && !cleaned.match(/^(01|10|11|17|21)/)) {
      return null
    }

    const identifiers: GS1ApplicationIdentifier[] = []
    let remaining = cleaned

    // Remove parentheses if present (human-readable format)
    if (cleaned.includes('(')) {
      remaining = cleaned.replace(/[()]/g, '')
    }

    // Parse Application Identifiers
    while (remaining.length > 0) {
      let found = false

      // Try to match known AIs (sorted by length, longest first)
      const aiKeys = Object.keys(GS1_AI_DEFINITIONS).sort((a, b) => b.length - a.length)
      
      for (const ai of aiKeys) {
        if (remaining.startsWith(ai)) {
          const def = GS1_AI_DEFINITIONS[ai]
          let value = ''

          if (def.length) {
            // Fixed length
            value = remaining.substring(ai.length, ai.length + def.length)
            remaining = remaining.substring(ai.length + def.length)
          } else {
            // Variable length - read until next AI or end
            const nextAiMatch = remaining.substring(ai.length).match(/^(.+?)(?=(01|10|11|13|15|17|21|310|37)|$)/)
            if (nextAiMatch) {
              value = nextAiMatch[1]
              remaining = remaining.substring(ai.length + value.length)
            }
          }

          identifiers.push({
            ai,
            name: def.name,
            format: def.format,
            value: value.trim(),
          })

          found = true
          break
        }
      }

      if (!found) {
        // Unknown AI or end of string
        break
      }
    }

    // Extract common fields
    const gtin = identifiers.find(id => id.ai === '01')?.value
    const batchNumber = identifiers.find(id => id.ai === '10')?.value
    const expiryDateRaw = identifiers.find(id => id.ai === '17')?.value
    const serialNumber = identifiers.find(id => id.ai === '21')?.value
    const productionDateRaw = identifiers.find(id => id.ai === '11')?.value

    // Parse dates (YYMMDD format)
    const expiryDate = expiryDateRaw ? parseGS1Date(expiryDateRaw) : undefined
    const productionDate = productionDateRaw ? parseGS1Date(productionDateRaw) : undefined

    return {
      raw: barcode,
      identifiers,
      gtin,
      batchNumber,
      expiryDate,
      serialNumber,
      productionDate,
    }
  } catch (error) {
    console.error('Error parsing GS1 barcode:', error)
    return null
  }
}

/**
 * Parse GS1 date format (YYMMDD) to ISO date string
 */
export const parseGS1Date = (yymmdd: string): string | undefined => {
  if (yymmdd.length !== 6) return undefined

  const yy = parseInt(yymmdd.substring(0, 2))
  const mm = parseInt(yymmdd.substring(2, 4))
  const dd = parseInt(yymmdd.substring(4, 6))

  // Determine century (assume 2000-2099 for now)
  const year = 2000 + yy

  // Validate
  if (mm < 1 || mm > 12 || dd < 1 || dd > 31) {
    return undefined
  }

  // Create ISO date string
  const date = new Date(year, mm - 1, dd)
  return date.toISOString().split('T')[0]
}

/**
 * Format date to GS1 format (YYMMDD)
 */
export const formatToGS1Date = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date
  const yy = d.getFullYear().toString().substring(2)
  const mm = (d.getMonth() + 1).toString().padStart(2, '0')
  const dd = d.getDate().toString().padStart(2, '0')
  return `${yy}${mm}${dd}`
}

/**
 * Generate GS1-128 barcode string
 */
export const generateGS1Barcode = (data: {
  gtin?: string
  batchNumber?: string
  expiryDate?: string
  serialNumber?: string
}): string => {
  let barcode = ''

  if (data.gtin) {
    barcode += `(01)${data.gtin.padStart(14, '0')}`
  }

  if (data.batchNumber) {
    barcode += `(10)${data.batchNumber}`
  }

  if (data.expiryDate) {
    const gs1Date = formatToGS1Date(data.expiryDate)
    barcode += `(17)${gs1Date}`
  }

  if (data.serialNumber) {
    barcode += `(21)${data.serialNumber}`
  }

  return barcode
}

/**
 * Validate GS1 barcode
 */
export const validateGS1Barcode = (barcode: string): { valid: boolean; errors: string[] } => {
  const errors: string[] = []

  if (!barcode || barcode.trim().length === 0) {
    errors.push('Mã vạch không được để trống')
    return { valid: false, errors }
  }

  const parsed = parseGS1Barcode(barcode)
  
  if (!parsed) {
    errors.push('Không thể phân tích mã vạch GS1')
    return { valid: false, errors }
  }

  if (!parsed.gtin) {
    errors.push('Thiếu GTIN (AI 01)')
  }

  if (parsed.expiryDate) {
    const expiry = new Date(parsed.expiryDate)
    if (isNaN(expiry.getTime())) {
      errors.push('Ngày hết hạn không hợp lệ')
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}

/**
 * Check if barcode is GS1 format
 */
export const isGS1Barcode = (barcode: string): boolean => {
  if (!barcode) return false
  
  // Check for parentheses (human-readable format)
  if (barcode.includes('(')) return true
  
  // Check if starts with known AI
  return /^(01|10|11|17|21)/.test(barcode)
}
