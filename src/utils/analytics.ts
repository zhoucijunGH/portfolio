/**
 * 访问统计（百度统计 hm.js）
 *
 * 用法：把站点 ID 写进项目根目录的 .env（不进 git，不会被打包成明文常量以外的东西）：
 *   VITE_HM_ID=你的百度统计 siteId
 * 没配 ID 时整套逻辑静默跳过，本地开发 / 未配置环境不会报错。
 *
 * 为什么要在 router 里手动上报：本站是 hash 路由的 SPA，
 * 地址栏变化时百度统计的脚本不会自动识别，必须手动 push _trackPageview。
 */

declare global {
  interface Window {
    _hmt?: unknown[]
  }
}

const HM_ID = (import.meta.env.VITE_HM_ID as string | undefined)?.trim()

let inited = false

/** 注入百度统计脚本（只执行一次） */
export function initAnalytics(): void {
  if (!HM_ID || inited) return
  inited = true

  window._hmt = window._hmt || []
  const hm = document.createElement('script')
  hm.async = true
  hm.src = `https://hm.baidu.com/hm.js?${HM_ID}`
  const first = document.getElementsByTagName('script')[0]
  first?.parentNode?.insertBefore(hm, first)
}

/**
 * 上报一次页面浏览。
 * hash 模式下百度统计默认只认首个页面，所以每个路由都要手动推一次，
 * 路径统一补成 `/xxx` 形式，后台看起来才像正常页面路径。
 */
export function trackPageview(path: string): void {
  if (!HM_ID) return
  initAnalytics()
  if (!window._hmt) return
  window._hmt.push(['_trackPageview', path])
}

/** 上报自定义事件，例如「点击联系我」「复制邮箱」「查看某作品」 */
export function trackEvent(category: string, action: string, label?: string): void {
  if (!HM_ID) return
  initAnalytics()
  if (!window._hmt) return
  const payload: unknown[] = ['_trackEvent', category, action]
  if (label) payload.push(label)
  window._hmt.push(payload)
}
