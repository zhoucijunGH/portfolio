import { ref, watchEffect } from 'vue'

/**
 * 全站主题色切换。
 * - 持久化到 localStorage（key: yl-theme），默认「科技蓝」。
 * - 通过在 <html> 上设置 data-theme 属性驱动 global.css 里的 CSS 变量。
 */
export type ThemeName = 'blue' | 'teal' | 'ink' | 'wine' | 'orange'

export const THEMES: { name: ThemeName; label: string; color: string }[] = [
  { name: 'blue', label: '科技蓝', color: '#1652f0' },
  { name: 'teal', label: '商务青', color: '#0e8f7e' },
  { name: 'ink', label: '稳重藏青', color: '#23324d' },
  { name: 'wine', label: '酒红', color: '#9d2f4e' },
  { name: 'orange', label: '活力橙', color: '#d96a1e' }
]

const STORAGE_KEY = 'yl-theme'

function readInitial(): ThemeName {
  try {
    const saved = localStorage.getItem(STORAGE_KEY) as ThemeName | null
    if (saved && THEMES.some((t) => t.name === saved)) return saved
  } catch {
    /* 隐私模式等场景下 localStorage 不可用，走默认值 */
  }
  return 'blue'
}

const theme = ref<ThemeName>(readInitial())

// 把当前主题同步到 <html data-theme="...">，并持久化
watchEffect(() => {
  document.documentElement.setAttribute('data-theme', theme.value)
  try {
    localStorage.setItem(STORAGE_KEY, theme.value)
  } catch {
    /* 忽略写入失败 */
  }
})

export function useTheme() {
  const setTheme = (name: ThemeName) => {
    theme.value = name
  }
  return { theme, setTheme, THEMES }
}
