import { onBeforeUnmount, onMounted } from 'vue'

/**
 * 滚动入场动画。
 *
 * 背景：`.fade-up` 的初始状态是 opacity: 0，只有加上 `.in-view` 才会显示。
 * 因此「元素该显示时一定会被标记」是硬要求 —— 一旦漏标，内容就永久隐身
 * （表现为整页空白，只剩 header / footer）。
 *
 * 早期实现靠「路由变化后扫描 + 定时重试」来覆盖 router-view 的切换动画，
 * 时机非常脆弱：新页面要等旧页面淡出约 320ms 才挂载，扫描窗口和重试次数
 * 都是靠猜的。现在改成主动监听 DOM：
 *
 *   1. 挂载 / 每次 DOM 新增节点后扫描一遍：视口内的元素立即显示（不等回调）
 *   2. 视口外的元素交给 IntersectionObserver，滚入时淡入（性能友好）
 *   3. scroll / resize 兜底扫描：IO 不可用或异常时依然能显示
 *
 * MutationObserver 让「新页面一出现就被接管」成为事件驱动的事实，不再依赖时刻。
 */
export function useReveal(selector = '.fade-up') {
  let observer: IntersectionObserver | null = null
  let mutation: MutationObserver | null = null
  let rafId = 0
  /** 已经登记过的元素（含已显示的），避免重复 observe */
  let tracked = new WeakSet<Element>()

  /** 元素是否已进入视口（含已滚过视口上方的情况，此时也应显示） */
  function isInView(el: Element) {
    const rect = el.getBoundingClientRect()
    const vh = window.innerHeight || document.documentElement.clientHeight
    return rect.top < vh - 40 && rect.bottom > 0
  }

  function reveal(el: Element) {
    tracked.add(el)
    el.classList.add('in-view')
    observer?.unobserve(el)
  }

  function ensureObserver() {
    if (!observer && typeof IntersectionObserver !== 'undefined') {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) reveal(entry.target)
          })
        },
        { threshold: 0.12, rootMargin: '0px 0px -40px' }
      )
    }
    return observer
  }

  /** 登记单个元素：已显示的跳过，视口内的立即显示，其余交给 IO */
  function track(el: Element) {
    if (el.classList.contains('in-view')) {
      tracked.add(el)
      return
    }
    if (isInView(el)) {
      reveal(el)
      return
    }
    if (tracked.has(el)) return
    tracked.add(el)

    const io = ensureObserver()
    if (io) io.observe(el)
    // IO 不可用：宁可没有动画，也不能让内容隐身
    else reveal(el)
  }

  function markAll() {
    document.querySelectorAll(selector).forEach(track)
  }

  /** 把扫描合并到下一帧，避免连续 DOM 变更时重复计算 */
  function scheduleScan() {
    if (rafId) return
    rafId = requestAnimationFrame(() => {
      rafId = 0
      markAll()
    })
  }

  onMounted(() => {
    // 首屏：App 的 onMounted 早于 router-view 渲染时这里会扫不到，
    // 但下面注册的 MutationObserver 会在首页挂载的那一刻补上。
    markAll()

    window.addEventListener('scroll', scheduleScan, { passive: true })
    window.addEventListener('resize', scheduleScan, { passive: true })

    if (typeof MutationObserver !== 'undefined') {
      mutation = new MutationObserver(scheduleScan)
      mutation.observe(document.body, { childList: true, subtree: true })
    }
  })

  onBeforeUnmount(() => {
    observer?.disconnect()
    observer = null
    mutation?.disconnect()
    mutation = null
    window.removeEventListener('scroll', scheduleScan)
    window.removeEventListener('resize', scheduleScan)
    if (rafId) {
      cancelAnimationFrame(rafId)
      rafId = 0
    }
  })

  /**
   * 路由切换后重新扫描。
   *
   * 注意这里【不】清掉旧元素的 .in-view —— 新页面的 DOM 是全新的，本来就没有
   * .in-view，会自然重播一次入场动画；而去清除类名反而会让正在离场的旧页面闪一下。
   */
  function refresh() {
    tracked = new WeakSet()
    observer?.disconnect()
    observer = null
    markAll()
  }

  return { refresh, sweep: markAll }
}
