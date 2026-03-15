import { Button, Tooltip, type ButtonProps } from 'antd'
import { SunOutlined, MoonOutlined } from '@ant-design/icons'
import { useTheme } from '../../contexts/ThemeContext'

interface ThemeToggleProps extends Omit<ButtonProps, 'onClick' | 'icon'> {
  size?: 'small' | 'middle' | 'large'
  showTooltip?: boolean
  tooltipPlacement?: 'top' | 'bottom' | 'left' | 'right'
}

export function ThemeToggle({
  size = 'middle',
  showTooltip = true,
  tooltipPlacement = 'bottom',
  ...buttonProps
}: ThemeToggleProps) {
  const { theme, toggleTheme, isDark } = useTheme()

  const button = (
    <Button
      type="text"
      size={size}
      onClick={toggleTheme}
      icon={isDark ? <SunOutlined /> : <MoonOutlined />}
      style={{
        color: isDark ? '#fbbf24' : '#f59e0b',
        transition: 'all 0.3s ease',
        ...buttonProps.style,
      }}
      {...buttonProps}
    />
  )

  if (showTooltip) {
    return (
      <Tooltip
        title={isDark ? '切换到浅色模式' : '切换到深色模式'}
        placement={tooltipPlacement}
      >
        {button}
      </Tooltip>
    )
  }

  return button
}

// 带文字的版本
export function ThemeToggleWithText({
  size = 'middle',
  ...buttonProps
}: ThemeToggleProps) {
  const { theme, toggleTheme, isDark } = useTheme()

  return (
    <Button
      type="text"
      size={size}
      onClick={toggleTheme}
      icon={isDark ? <SunOutlined /> : <MoonOutlined />}
      style={{
        color: isDark ? '#fbbf24' : '#f59e0b',
        transition: 'all 0.3s ease',
        ...buttonProps.style,
      }}
      {...buttonProps}
    >
      {isDark ? '浅色模式' : '深色模式'}
    </Button>
  )
}

export default ThemeToggle
