/**
 * 用户数据迁移工具
 * 用于更新旧版本注册的用户数据，添加缺失的字段
 */

export interface EnterpriseInfo {
  enterpriseName: string
  creditCode: string
  contactName: string
  contactEmail: string
}

export interface UserInfo {
  password: string
  enterpriseType: string
  enterpriseInfo?: EnterpriseInfo
  applyStatus?: 'pending' | 'approved' | 'rejected'
  registerTime: string
  applyTime?: string
}

/**
 * 迁移所有用户数据
 * 为旧数据添加缺失的字段
 */
export function migrateUserData(): void {
  const registeredUsersStr = localStorage.getItem('registeredUsers')
  if (!registeredUsersStr) {
    console.log('没有用户数据需要迁移')
    return
  }

  try {
    const registeredUsers: Record<string, UserInfo> = JSON.parse(registeredUsersStr)
    let hasChanges = false

    Object.keys(registeredUsers).forEach((phone) => {
      const user = registeredUsers[phone]

      // 检查并添加缺失的字段
      if (!user.applyStatus) {
        user.applyStatus = 'approved'
        hasChanges = true
        console.log(`用户 ${phone}: 添加 applyStatus = approved`)
      }

      if (!user.applyTime) {
        user.applyTime = user.registerTime || new Date().toISOString()
        hasChanges = true
        console.log(`用户 ${phone}: 添加 applyTime`)
      }

      if (!user.enterpriseInfo) {
        user.enterpriseInfo = {
          enterpriseName: '',
          creditCode: '',
          contactName: '',
          contactEmail: '',
        }
        hasChanges = true
        console.log(`用户 ${phone}: 添加 enterpriseInfo`)
      }
    })

    if (hasChanges) {
      localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers))
      console.log('用户数据迁移完成')
    } else {
      console.log('所有用户数据已是最新版本')
    }
  } catch (error) {
    console.error('迁移用户数据失败:', error)
  }
}

/**
 * 更新指定用户的企业信息
 */
export function updateUserEnterpriseInfo(
  phone: string,
  enterpriseInfo: EnterpriseInfo
): boolean {
  const registeredUsersStr = localStorage.getItem('registeredUsers')
  if (!registeredUsersStr) {
    console.error('没有用户数据')
    return false
  }

  try {
    const registeredUsers: Record<string, UserInfo> = JSON.parse(registeredUsersStr)
    const user = registeredUsers[phone]

    if (!user) {
      console.error(`用户 ${phone} 不存在`)
      return false
    }

    user.enterpriseInfo = enterpriseInfo
    user.applyStatus = 'approved'
    user.applyTime = new Date().toISOString()

    localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers))
    console.log(`用户 ${phone} 的企业信息已更新`)
    return true
  } catch (error) {
    console.error('更新用户企业信息失败:', error)
    return false
  }
}

/**
 * 获取所有用户数据（用于调试）
 */
export function getAllUsers(): Record<string, UserInfo> | null {
  const registeredUsersStr = localStorage.getItem('registeredUsers')
  if (!registeredUsersStr) {
    return null
  }

  try {
    return JSON.parse(registeredUsersStr)
  } catch (error) {
    console.error('获取用户数据失败:', error)
    return null
  }
}

/**
 * 清除所有用户数据（谨慎使用）
 */
export function clearAllUsers(): void {
  localStorage.removeItem('registeredUsers')
  localStorage.removeItem('currentUser')
  console.log('所有用户数据已清除')
}
