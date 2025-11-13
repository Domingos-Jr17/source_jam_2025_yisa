/**
 * Input masks for form validation
 * Máscaras para validação de formulários
 */

export const biMask = (value: string): string => {
  // Remove all non-alphanumeric characters
  const cleaned = value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase()

  // Format: 9 numbers + 2 letters + 3 numbers
  if (cleaned.length <= 9) {
    return cleaned
  } else if (cleaned.length <= 11) {
    return cleaned.slice(0, 9) + cleaned.slice(9)
  } else {
    return cleaned.slice(0, 12)
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
  // Check format: 9 numbers + 2 letters + 3 numbers
  const biPattern = /^[0-9]{9}[A-Z]{2}[0-9]{3}$/
  return biPattern.test(bi)
}

export const validatePhone = (phone: string): boolean => {
  // Check Mozambique phone format: +258 84/85/86/87 XXX XXXX
  const phonePattern = /^\+258[84|85|86|87][0-9]{7}$/
  return phonePattern.test(phone.replace(/\s/g, ''))
}

export const formatBI = (value: string): string => {
  const bi = value.replace(/\D/g, '').toUpperCase()
  if (bi.length <= 9) {
    return bi
  } else if (bi.length <= 11) {
    return bi.slice(0, 9) + '/' + bi.slice(9)
  } else {
    return bi.slice(0, 9) + '/' + bi.slice(9, 11) + '/' + bi.slice(11, 14)
  }
}