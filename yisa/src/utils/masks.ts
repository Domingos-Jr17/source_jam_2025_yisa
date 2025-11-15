/**
 * Input masks for form validation
 * Máscaras para validação de formulários
 */

export const biMask = (value: string): string => {
  // Remove all non-alphanumeric characters
  const cleaned = value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase()

  // Format: 12 numbers + 1 letter (13 characters total)
  if (cleaned.length <= 13) {
    return cleaned
  } else {
    return cleaned.slice(0, 13)
  }
}

export const phoneMask = (value: string): string => {
  // Remove all non-numeric characters
  const cleaned = value.replace(/\D/g, '')

  // Format: +258 84 XXX XXXX
  if (cleaned.length <= 2) {
    return cleaned
  } else if (cleaned.length <= 4) {
    return `+258 ${cleaned.slice(0, 2)}`
  } else if (cleaned.length <= 7) {
    return `+258 ${cleaned.slice(0, 2)} ${cleaned.slice(2, 4)}`
  } else {
    return `+258 ${cleaned.slice(0, 2)} ${cleaned.slice(2, 4)} ${cleaned.slice(4, 9)}`
  }
}

export const nameMask = (value: string): string => {
  // Allow only letters, spaces, and common Portuguese name characters
  return value.replace(/[^a-zA-ZÀ-ÿ\s'-]/g, '')
}

export const turmaMask = (value: string): string => {
  // Allow alphanumeric characters, spaces, and hyphens
  return value.replace(/[^a-zA-Z0-9\s-]/g, '').toUpperCase()
}

export const processNumberMask = (value: string): string => {
  // Allow only alphanumeric characters
  return value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase()
}

export const validateBI = (bi: string): boolean => {
  // Check format: 12 numbers + 1 letter (13 characters total)
  const biPattern = /^[0-9]{12}[A-Z]{1}$/
  return biPattern.test(bi.replace(/\s/g, ''))
}

export const validatePhone = (phone: string): boolean => {
  // Check Mozambique phone format: +258 84/85/86/87 XXX XXXX
  const phonePattern = /^\+258[84|85|86|87][0-9]{7}$/
  return phonePattern.test(phone.replace(/\s/g, ''))
}

export const formatBI = (value: string): string => {
  const bi = value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase()
  // For Mozambique BI format: 12 numbers + 1 letter
  // No special formatting needed, just return clean value
  return bi
}