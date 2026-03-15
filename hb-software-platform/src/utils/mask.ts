/**
 * 数据脱敏工具函数
 * 用于敏感数据的脱敏展示
 */

/**
 * 手机号脱敏
 * @param phone 手机号
 * @returns 脱敏后的手机号，如：138****8888
 */
export function maskPhone(phone: string): string {
  if (!phone || phone.length < 7) return phone
  return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
}

/**
 * 身份证号脱敏
 * @param idCard 身份证号
 * @returns 脱敏后的身份证号，如：420**********1234
 */
export function maskIdCard(idCard: string): string {
  if (!idCard || idCard.length < 8) return idCard
  if (idCard.length === 18) {
    return idCard.replace(/(\d{6})\d{10}(\d{2})/, '$1**********$2')
  }
  return idCard.replace(/(\d{6})\d{6}(\d{2})/, '$1******$2')
}

/**
 * 邮箱脱敏
 * @param email 邮箱地址
 * @returns 脱敏后的邮箱，如：a***@example.com
 */
export function maskEmail(email: string): string {
  if (!email || !email.includes('@')) return email
  const [name, domain] = email.split('@')
  if (name.length <= 1) return email
  const maskedName = name.charAt(0) + '*'.repeat(name.length - 1)
  return `${maskedName}@${domain}`
}

/**
 * 企业名称脱敏
 * @param name 企业名称
 * @returns 脱敏后的企业名称，如：湖北***科技
 */
export function maskEnterpriseName(name: string): string {
  if (!name || name.length <= 4) return name
  const prefix = name.slice(0, 2)
  const suffix = name.slice(-2)
  return `${prefix}***${suffix}`
}

/**
 * 姓名脱敏
 * @param name 姓名
 * @returns 脱敏后的姓名，如：张**
 */
export function maskName(name: string): string {
  if (!name || name.length <= 1) return name
  if (name.length === 2) {
    return name.charAt(0) + '*'
  }
  return name.charAt(0) + '*'.repeat(name.length - 1)
}

/**
 * 银行卡号脱敏
 * @param cardNo 银行卡号
 * @returns 脱敏后的银行卡号，如：**** **** **** 1234
 */
export function maskBankCard(cardNo: string): string {
  if (!cardNo || cardNo.length < 8) return cardNo
  const last4 = cardNo.slice(-4)
  return '**** **** **** ' + last4
}

/**
 * 地址脱敏
 * @param address 地址
 * @returns 脱敏后的地址
 */
export function maskAddress(address: string): string {
  if (!address || address.length <= 10) return address
  const prefix = address.slice(0, 6)
  const suffix = address.slice(-4)
  return `${prefix}****${suffix}`
}

/**
 * 通用脱敏 - 保留前n位和后m位
 * @param str 原始字符串
 * @param prefixLen 保留前几位
 * @param suffixLen 保留后几位
 * @returns 脱敏后的字符串
 */
export function maskGeneral(str: string, prefixLen: number = 2, suffixLen: number = 2): string {
  if (!str || str.length <= prefixLen + suffixLen) return str
  const prefix = str.slice(0, prefixLen)
  const suffix = str.slice(-suffixLen)
  const maskLen = str.length - prefixLen - suffixLen
  return `${prefix}${'*'.repeat(maskLen)}${suffix}`
}
