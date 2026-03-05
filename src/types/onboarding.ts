export type BusinessTimeOption = 'ALL_DAY' | 'FIXED_SHIFT'

export interface SalesChannel {
  id: string
  label: string
  description: string
  icon: string
}

export interface OnboardingState {
  currentStep: number
  businessTime: BusinessTimeOption
  selectedChannels: string[]
  sampleDataGenerated: boolean
}
