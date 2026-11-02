<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { profile } from '@/data/portfolio'
import { useTheme, THEMES } from '@/composables/useTheme'
import { trackEvent } from '@/utils/analytics'

const route = useRoute()
const router = useRouter()
const { theme, setTheme } = useTheme()

const scrolled = ref(false)
const contactOpen = ref(false)
const themeOpen = ref(false)
const copied = ref('')

const navItems = [
  { label: '首页', to: '/' },
  { label: '技术服务', to: '/#services' },
  { label: '作品集', to: '/portfolio' },
  { label: '关于我', to: '/#about' }
]

const isHome = computed(() => route.path === '/')

function onScroll() {
  scrolled.value = window.scrollY > 24
}

function scrollToId(id: string) {
  const el = document.getElementById(id)
  if (!el) return
  el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

function go(item: { label: string; to: string }) {
  contactOpen.value = false
  const [path, hash] = item.to.split('#')
  if (hash) {
    // 锚点：先回首页，等渲染后再滚到目标板块
    if (!isHome.value) {
      router.push('/').then(() => window.setTimeout(() => scrollToId(hash), 120))
    } else {
      scrollToId(hash)
    }
  } else {
    router.push(path || '/')
  }
}

async function copy(value: string, key: string) {
  try {
    await navigator.clipboard.writeText(value)
  } catch {
    const ta = document.createElement('textarea')
    ta.value = value
    document.body.appendChild(ta)
    ta.select()
    document.execCommand('copy')
    document.body.removeChild(ta)
  }
  copied.value = key
  // 有人复制联系方式 = 强意向信号，单独记一个事件方便统计后台看转化
  trackEvent('contact', 'copy', key)
  window.setTimeout(() => (copied.value = ''), 1600)
}

function onDocClick(e: MouseEvent) {
  const target = e.target as HTMLElement
  if (!target.closest('.contact-wrap')) contactOpen.value = false
  if (!target.closest('.theme-wrap')) themeOpen.value = false
}

onMounted(() => {
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
  document.addEventListener('click', onDocClick)
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
  document.removeEventListener('click', onDocClick)
})

const qrSrc = computed(() => `${import.meta.env.BASE_URL}${profile.contact.wechatQr}`)
</script>

<template>
  <header class="site-header" :class="{ scrolled }">
    <div class="container header-inner">
      <button class="brand" @click="go({ label: '首页', to: '/' })">
        <span class="brand-mark">周</span>
        <span class="brand-text">
          <strong>周赐骏</strong>
          <em>ZHOU CIJUN · 前端 / 全栈</em>
        </span>
      </button>

      <nav class="nav">
        <button
          v-for="item in navItems"
          :key="item.label"
          class="nav-link"
          :class="{ active: item.to === '/portfolio' ? route.path === '/portfolio' : false }"
          @click="go(item)"
        >
          {{ item.label }}
        </button>

        <!-- 主题色切换 -->
        <div class="theme-wrap">
          <button
            class="nav-link theme-btn"
            :class="{ active: themeOpen }"
            title="切换主题色"
            @click="themeOpen = !themeOpen"
          >
            <span class="theme-dot" :style="{ background: THEMES.find((t) => t.name === theme)!.color }"></span>
            主题色
          </button>
          <transition name="drop">
            <div v-if="themeOpen" class="theme-card glass">
              <p class="theme-title">选择主题色</p>
              <div class="theme-list">
                <button
                  v-for="t in THEMES"
                  :key="t.name"
                  class="theme-option"
                  :class="{ on: theme === t.name }"
                  @click="setTheme(t.name); themeOpen = false"
                >
                  <i :style="{ background: t.color }"></i>
                  <span>{{ t.label }}</span>
                  <em v-if="theme === t.name">✓</em>
                </button>
              </div>
            </div>
          </transition>
        </div>

        <div class="contact-wrap">
          <button
            class="nav-link contact"
            :class="{ active: contactOpen }"
            @mouseenter="contactOpen = true"
            @click="contactOpen = !contactOpen"
          >
            联系我
            <span class="dot"></span>
          </button>

          <transition name="drop">
            <div v-if="contactOpen" class="contact-card glass" @mouseleave="contactOpen = false">
              <div class="qr-box">
                <img :src="qrSrc" alt="微信二维码" />
                <p>扫一扫 · 微信同号</p>
              </div>
              <div class="contact-list">
                <button class="contact-item" @click="copy(profile.contact.phone.replace(/-/g, ''), 'phone')">
                  <div>
                    <span class="label">电话 / 微信</span>
                    <span class="value">{{ profile.contact.phone }}</span>
                  </div>
                  <span class="copy">{{ copied === 'phone' ? '已复制' : '复制' }}</span>
                </button>
                <button class="contact-item" @click="copy(profile.contact.email, 'email')">
                  <div>
                    <span class="label">邮箱</span>
                    <span class="value">{{ profile.contact.email }}</span>
                  </div>
                  <span class="copy">{{ copied === 'email' ? '已复制' : '复制' }}</span>
                </button>
                <div class="contact-item static">
                  <div>
                    <span class="label">所在地</span>
                    <span class="value">{{ profile.contact.location }}</span>
                  </div>
                </div>
              </div>
            </div>
          </transition>
        </div>
      </nav>
    </div>
  </header>
</template>

<style scoped>
.site-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  height: 68px;
  display: flex;
  align-items: center;
  background: var(--header-bg);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  box-shadow: var(--header-shadow);
  transition: box-shadow 0.3s ease, background 0.3s ease;
}

.site-header.scrolled {
  box-shadow: 0 6px 24px rgba(30, 50, 100, 0.1);
}

.header-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

/* ---- 品牌 ---- */
.brand {
  display: flex;
  align-items: center;
  gap: 10px;
}

.brand-mark {
  width: 38px;
  height: 38px;
  border-radius: 10px;
  background: linear-gradient(135deg, var(--accent), var(--accent-2));
  color: var(--accent-contrast);
  font-size: 14px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  letter-spacing: 1px;
}

.brand-text {
  text-align: left;
  line-height: 1.2;
}

.brand-text strong {
  display: block;
  font-size: 16px;
  font-weight: 700;
  color: var(--text);
}

.brand-text em {
  display: block;
  font-style: normal;
  font-size: 10.5px;
  letter-spacing: 0.18em;
  color: var(--text-mute);
}

/* ---- 导航 ---- */
.nav {
  display: flex;
  align-items: center;
  gap: 4px;
}

.nav-link {
  padding: 9px 14px;
  border-radius: var(--radius-sm);
  font-size: 14px;
  color: var(--text-dim);
  display: inline-flex;
  align-items: center;
  gap: 7px;
  transition: all 0.25s ease;
}

.nav-link:hover {
  color: var(--accent);
  background: var(--accent-soft);
}

.nav-link.active {
  color: var(--accent);
  font-weight: 600;
}

.nav-link.contact {
  background: var(--accent);
  color: var(--accent-contrast);
  font-weight: 600;
  margin-left: 8px;
  box-shadow: 0 6px 16px -6px var(--accent-shadow);
}

.nav-link.contact:hover {
  background: var(--accent-2);
  color: var(--accent-contrast);
}

.nav-link.contact .dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #2fe3a0;
  animation: pulse 1.8s ease infinite;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.35;
  }
}

/* ---- 主题色 ---- */
.theme-wrap,
.contact-wrap {
  position: relative;
}

.theme-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.7);
  box-shadow: 0 0 0 1px var(--border);
}

.theme-card {
  position: absolute;
  right: 0;
  top: calc(100% + 10px);
  width: 190px;
  padding: 14px;
}

.theme-title {
  font-size: 12px;
  color: var(--text-mute);
  margin-bottom: 10px;
}

.theme-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.theme-option {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 10px;
  border-radius: var(--radius-sm);
  font-size: 13.5px;
  color: var(--text-dim);
  transition: background 0.2s ease;
}

.theme-option:hover {
  background: var(--panel-hover);
}

.theme-option i {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  flex: none;
}

.theme-option.on {
  color: var(--accent);
  font-weight: 600;
}

.theme-option em {
  margin-left: auto;
  font-style: normal;
  font-size: 12px;
}

/* ---- 联系下拉 ---- */
.contact-card {
  position: absolute;
  right: 0;
  top: calc(100% + 10px);
  width: 380px;
  padding: 18px;
  display: flex;
  gap: 16px;
}

.qr-box {
  flex: none;
  text-align: center;
}

.qr-box img {
  width: 108px;
  height: 108px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--border);
}

.qr-box p {
  font-size: 11.5px;
  color: var(--text-mute);
  margin-top: 6px;
}

.contact-list {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}

.contact-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  width: 100%;
  text-align: left;
  padding: 9px 10px;
  border-radius: var(--radius-sm);
  transition: background 0.2s ease;
}

.contact-item:not(.static):hover {
  background: var(--panel-hover);
}

.contact-item .label {
  display: block;
  font-size: 11.5px;
  color: var(--text-mute);
}

.contact-item .value {
  display: block;
  font-size: 13.5px;
  color: var(--text);
  font-family: var(--mono);
}

.contact-item .copy {
  font-size: 11.5px;
  color: var(--accent);
  flex: none;
}

/* ---- 下拉动画 ---- */
.drop-enter-active,
.drop-leave-active {
  transition: opacity 0.22s ease, transform 0.22s ease;
}

.drop-enter-from,
.drop-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

@media (max-width: 860px) {
  .nav {
    display: none;
  }
}
</style>
