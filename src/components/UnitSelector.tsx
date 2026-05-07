import { useState, useMemo, useEffect } from 'react'
import type { Unit, UnitConversion } from '../types/unit'
import { unitService } from '../services/unitService'

const convertUnit = (
  value: number,
  fromUnitId: string,
  toUnitId: string,
  allUnits: Unit[],
  customConversion?: UnitConversion
): number => {
  if (fromUnitId === toUnitId) return value
  const fromUnit = allUnits.find(u => u.id === fromUnitId)
  const toUnit = allUnits.find(u => u.id === toUnitId)
  if (!fromUnit || !toUnit) return value
  if (customConversion) {
    if (customConversion.fromUnit === fromUnitId && customConversion.toUnit === toUnitId) return value * customConversion.rate
    if (customConversion.fromUnit === toUnitId && customConversion.toUnit === fromUnitId) return value / customConversion.rate
  }
  if (fromUnit.category !== toUnit.category) return value
  const fromRate = fromUnit.conversionRate || 1
  const toRate = toUnit.conversionRate || 1
  return (value * fromRate) / toRate
}

interface UnitSelectorProps {
  productId: string
  selectedUnitId: string
  quantity: number
  conversions: UnitConversion[]
  baseUnitId: string
  onChange: (unitId: string, baseQuantity: number) => void
  className?: string
}

export const UnitSelector = ({
  productId: _productId,
  selectedUnitId,
  quantity,
  conversions,
  baseUnitId,
  onChange,
  className = '',
}: UnitSelectorProps) => {
  const [localUnitId, setLocalUnitId] = useState(selectedUnitId)
  const [allUnits, setAllUnits] = useState<Unit[]>([])
  
  void _productId // retained in interface for parent components, but unused here

  useEffect(() => {
    unitService.getAll().then(data => setAllUnits(data as unknown as Unit[])).catch(err => console.error('Failed to load units:', err))
  }, [])

  // Get available units for this product
  const availableUnits = allUnits.filter((unit: Unit) => {
    if (unit.id === baseUnitId) return true
    return conversions.some((c) => c.fromUnit === unit.id || c.toUnit === unit.id)
  })

  // Calculate base quantity when unit or quantity changes
  const baseQuantity = useMemo(() => {
    if (!quantity || quantity <= 0) {
      return 0
    }

    if (localUnitId === baseUnitId) {
      return quantity
    } else {
      const customConv = conversions.find((c) => (c.fromUnit === localUnitId && c.toUnit === baseUnitId) || (c.fromUnit === baseUnitId && c.toUnit === localUnitId))
      const converted = convertUnit(quantity, localUnitId, baseUnitId, allUnits, customConv)
      return converted || 0
    }
  }, [quantity, localUnitId, baseUnitId, conversions, allUnits])

  const handleUnitChange = (newUnitId: string) => {
    setLocalUnitId(newUnitId)
    
    // Calculate base quantity with new unit
    let newBaseQuantity = quantity
    if (newUnitId !== baseUnitId) {
      const customConv = conversions.find((c) => (c.fromUnit === newUnitId && c.toUnit === baseUnitId) || (c.fromUnit === baseUnitId && c.toUnit === newUnitId))
      const converted = convertUnit(quantity, newUnitId, baseUnitId, allUnits, customConv)
      newBaseQuantity = converted || quantity
    }
    
    onChange(newUnitId, newBaseQuantity)
  }

  const getUnitName = (unitId: string) => {
    return allUnits.find((u) => u.id === unitId)?.name || ''
  }

  const getConversionInfo = () => {
    if (localUnitId === baseUnitId || !quantity) return null

    const conversion = conversions.find(
      (c) => c.fromUnit === localUnitId && c.toUnit === baseUnitId
    )

    if (!conversion) return null

    return {
      rate: conversion.rate,
      fromUnit: getUnitName(localUnitId),
      toUnit: getUnitName(baseUnitId),
    }
  }

  const conversionInfo = getConversionInfo()

  return (
    <div className={className}>
      <select
        value={localUnitId}
        onChange={(e) => handleUnitChange(e.target.value)}
        className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm font-bold focus:ring-2 focus:ring-primary/20 focus:outline-none"
      >
        {availableUnits.map((unit) => (
          <option key={unit.id} value={unit.id}>
            {unit.name}
          </option>
        ))}
      </select>

      {/* Conversion Info */}
      {conversionInfo && baseQuantity > 0 && (
        <div className="mt-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="flex items-center gap-2 text-xs">
            <span className="material-symbols-outlined text-blue-600 text-sm">info</span>
            <div className="flex-1">
              <p className="font-bold text-blue-900 dark:text-blue-100">
                {quantity} {conversionInfo.fromUnit} = {baseQuantity} {conversionInfo.toUnit}
              </p>
              <p className="text-blue-600 dark:text-blue-400 text-[10px] mt-0.5">
                (1 {conversionInfo.fromUnit} = {conversionInfo.rate} {conversionInfo.toUnit})
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
