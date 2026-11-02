import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import ProjectDetailView from '@/views/ProjectDetailView.vue'
import PortfolioView from '@/views/PortfolioView.vue'
import { projects } from '@/data/portfolio'
import { trackPageview } from '@/utils/analytics'

/**
 * 每个路由对应的页面标题 / 描述（SEO）。
 * SPA 无法像多页站那样每页一套 HTML，但切换路由时同步更新
 * document.title 和 meta description，能让浏览器历史、分享卡
 * 和支持 JS 的爬虫抓到「当前页」的准确信息。
 */
const SITE_NAME = '周赐骏 · 前端/全栈工程师'

const META: Record<string, { title: string; desc: string }> = {
  home: {
    title: `${SITE_NAME} - 南宁 Web 应用研发与交付 | 政务·水利·金融信息化`,
    desc: '周赐骏：8 年+ 政企信息化交付经验，提供 Web 应用研发、数据可视化大屏、框架迁移重构、驻场交付与长期运维，覆盖政务、水利、金融、运营商、出行等行业。'
  },
  portfolio: {
    title: `项目案例 - ${SITE_NAME}`,
    desc: '周赐骏真实交付案例：政务 / 水利 / 金融 / 运营商 / 出行等行业，含 SAP App Center 上架产品易薪资、大藤峡智慧园区、省级政务一体化平台、网约车司机出车管家小程序等，涉密项目提供脱敏详情页。'
  }
}

function setMeta(title: string, desc: string) {
  document.title = title
  const tag = document.querySelector('meta[name="description"]')
  if (tag) tag.setAttribute('content', desc)
}

/** 内部页面（留言管理）不允许搜索引擎收录 */
function setRobots(noindex: boolean) {
  let tag = document.querySelector('meta[name="robots"]')
  if (!tag) {
    tag = document.createElement('meta')
    tag.setAttribute('name', 'robots')
    document.head.appendChild(tag)
  }
  tag.setAttribute('content', noindex ? 'noindex,nofollow' : 'index,follow')
}

function setProjectMeta(id: string) {
  const p = projects.find((x) => x.id === id)
  if (!p) return
  setMeta(
    `${p.name} - 项目案例 - ${SITE_NAME}`,
    `${p.summary} 技术栈：${p.techStack.join('、')}。行业：${p.industry}。`
  )
}

/**
 * 轮询等待选择器出现（最多约 1.5s）。
 *
 * 为什么要等：App.vue 的 router-view 用了 <Transition mode="out-in">，
 * 新页面要等旧页面淡出（约 320ms）之后才挂载。若在导航回调里立刻去滚动，
 * 目标元素还不在 DOM 里，滚动会静默失效。
 */
function waitForElement(selector: string, timeout = 1500) {
  return new Promise<Element | null>((resolve) => {
    const start = Date.now()
    const tick = () => {
      const el = document.querySelector(selector)
      if (el || Date.now() - start > timeout) {
        resolve(el)
      } else {
        requestAnimationFrame(tick)
      }
    }
    tick()
  })
}

const router = createRouter({
  // 使用 hash 模式，方便直接部署到 GitHub Pages / Vercel 等静态托管
  history: createWebHashHistory(),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    {
      path: '/portfolio',
      name: 'portfolio',
      component: PortfolioView
    },
    {
      path: '/project/:id',
      name: 'project',
      component: ProjectDetailView,
      props: true
    },
    {
      // 留言管理后台：不对外暴露入口，靠口令进，同时标记 noindex
      path: '/consult-admin',
      name: 'consult-admin',
      component: () => import('@/views/ConsultAdminView.vue')
    },
    { path: '/:pathMatch(.*)*', redirect: '/' }
  ],
  /**
   * 滚动策略：
   *  - 带锚点（例如作品详情页点「返回作品集」跳 #projects）：等目标元素渲染出来，
   *    再平滑滚过去，并留出固定头部的 72px 高度。
   *  - 其余情况回到顶部。
   */
  async scrollBehavior(to) {
    if (to.hash) {
      const el = await waitForElement(to.hash)
      return el ? { el: to.hash, top: 72, behavior: 'smooth' } : { top: 0 }
    }
    return { top: 0 }
  }
})

export default router

// 导航完成后同步页面标题与描述（SEO），并向百度统计上报一次 PV
router.afterEach((to) => {
  if (to.name === 'project') {
    setProjectMeta(String(to.params.id))
  } else if (to.name === 'consult-admin') {
    setMeta('留言管理', '')
  } else {
    const m = META[String(to.name)]
    if (m) setMeta(m.title, m.desc)
  }

  // 留言管理页对搜索引擎隐藏
  setRobots(to.name === 'consult-admin')

  // hash 路由不会被统计脚本自动识别，这里手动推一次页面路径
  trackPageview(to.fullPath || '/')
})
