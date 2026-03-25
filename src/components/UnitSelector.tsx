import { useState, useEffect } from 'react'
import type { Unit, UnitConversion } from '../types/unit'
import { units, convertQuantity } from '../mock/units'

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
  productId,
  selectedUnitId,
  quantity,
  conversions,
  baseUnitId,
  onChange,
  className = '',
}: UnitSelectorProps) => {
  const [localUnitId, setLocalUnitId] = useState(selectedUnitId)
  const [baseQuantity, setBaseQuantity] = useState(0)

  // Get available units for this product
  const availableUnits = units.filter((unit) => {
    // Always include base unit
    if (unit.id === baseUnitId) return true
    // Include units that have conversions
    return conversions.some((c) => c.fromUnitId === unit.id || c.toUnitId === unit.id)
  })

  // Calculate base quantity when unit or quantity changes
  useEffect(() => {
    if (!quantity || quantity <= 0) {
      setBaseQuantity(0)
      return
    }

    if (localUnitId === baseUnitId) {
      setBaseQuantity(quantity)
    } else {
      const converted = convertQuantity(quantity, localUnitId, baseUnitId, productId)
      setBaseQuantity(converted || 0)
    }
  }, [quantity, localUnitId, baseUnitId, productId])

  const handleUnitChange = (newUnitId: string) => {
    setLocalUnitId(newUnitId)
    
    // Calculate base quantity with new unit
    let newBaseQuantity = quantity
    if (newUnitId !== baseUnitId) {
      const converted = convertQuantity(quantity, newUnitId, baseUnitId, productId)
      newBaseQuantity = converted || quantity
    }
    
    onChange(newUnitId, newBaseQuantity)
  }

  const getUnitName = (unitId: string) => {
    return units.find((u) => u.id === unitId)?.shortName || ''
  }

  const getConversionInfo = () => {
    if (localUnitId === baseUnitId || !quantity) return null

    const conversion = conversions.find(
      (c) => c.fromUnitId === localUnitId && c.toUnitId === baseUnitId
    )

    if (!conversion) return null

    return {
      rate: conversion.conversionRate,
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
            {unit.name} ({unit.shortName})
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
