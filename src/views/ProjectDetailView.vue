<script setup lang="ts">
import { computed, ref, watch, onMounted, onBeforeUnmount } from 'vue'
import type { CSSProperties } from 'vue'
import { useRouter } from 'vue-router'
import { projects, getProject } from '@/data/portfolio'
import { SHOT_LABELS } from '@/data/shotLabels'
import ProjectCover from '@/components/ProjectCover.vue'

/*
 * ⚠️ 模板必须是「单一根元素」，且根层级不能有任何注释、文本节点。
 *
 * App.vue 用 <Transition mode="out-in"> 包住了 router-view，Transition 要求切换的
 * 组件根节点是「单个可动画元素」。只要根是 Fragment（多节点），out-in 就会卡死：
 * 从本页返回首页时新页面永远不挂载，<router-view> 停在占位注释上 ——
 * 表现为整页内容消失、只剩 header / footer。
 *
 * 坑点：开发模式下 Vue 会保留模板注释，所以「模板顶层写一段 <!-- 注释 -->」也会
 * 让根节点变成 Fragment。说明性注释一律写在这里（script 里不产生任何节点）。
 * 同理：模板根层级的换行文本会被编译器丢弃，但注释不会。
 */

const props = defineProps<{ id: string }>()
const router = useRouter()

const project = computed(() => getProject(props.id))

/**
 * 作品截图：自动收集 src/assets/shots/<作品id>/ 下的所有图片。
 * 上传截图 = 把图片丢进对应 id 的文件夹再重新构建，本文件不用动。
 */
const shotModules = import.meta.glob('../assets/shots/**/*.{png,jpg,jpeg,webp,gif,avif}', {
  eager: true,
  import: 'default'
}) as Record<string, string>

const shots = computed(() => {
  const prefix = `../assets/shots/${props.id}/`
  const idLabels = SHOT_LABELS[props.id] ?? {}
  return Object.keys(shotModules)
    .filter((k) => k.startsWith(prefix))
    .sort((a, b) => a.localeCompare(b, 'en', { numeric: true }))
    .map((k) => {
      /* 图注优先取 shotLabels.ts 里的映射；没配的回退用文件名去序号 */
      const file = k.slice(prefix.length).replace(/\.[^.]+$/, '')
      const ext = k.slice(k.lastIndexOf('.'))
      const label = idLabels[file + ext] || file.replace(/^\d+[-_\s]*/, '')
      return { src: shotModules[k], label }
    })
})

/* ---- 卡牌堆叠轮播 ---- */
const activeIdx = ref(0)

/** 可见层数：主卡 1 张 + 后面叠 3 张 */
const STACK_DEPTH = 4

function step(d: number) {
  const n = shots.value.length
  if (!n) return
  activeIdx.value = (activeIdx.value + d + n) % n
}

/** 点击卡片：点最前面那张才放大，点后面的是把它翻到前面 */
function onCardClick(i: number) {
  if (i === activeIdx.value) openLightbox(i)
  else activeIdx.value = i
}

function cardStyle(i: number): CSSProperties {
  const n = shots.value.length
  if (n <= 1) return {}
  let rel = i - activeIdx.value
  rel = ((rel % n) + n) % n
  if (rel >= STACK_DEPTH) {
    /* 更靠后的卡片藏在最底层并淡出，避免一次渲染太多图 */
    return {
      zIndex: 0,
      opacity: 0,
      pointerEvents: 'none',
      '--rel': 0
    } as CSSProperties
  }
  return {
    zIndex: 40 - rel,
    opacity: rel === 0 ? 1 : rel === 1 ? 0.92 : rel === 2 ? 0.72 : 0.42,
    '--rel': rel
  } as CSSProperties
}

/** 触摸 / 鼠标横向滑动切卡 */
let dragX = 0
function onDragStart(e: PointerEvent) {
  dragX = e.clientX
}
function onDragEnd(e: PointerEvent) {
  const dx = e.clientX - dragX
  if (Math.abs(dx) > 40) step(dx < 0 ? 1 : -1)
}
function onCardKey(e: KeyboardEvent) {
  if (e.key === 'ArrowLeft') {
    e.preventDefault()
    step(-1)
  } else if (e.key === 'ArrowRight') {
    e.preventDefault()
    step(1)
  } else if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault()
    openLightbox(activeIdx.value)
  }
}

/* ---- 灯箱（点击截图放大查看） ---- */
const lightboxIdx = ref(-1)
const lightboxOpen = computed(() => lightboxIdx.value >= 0 && lightboxIdx.value < shots.value.length)

function openLightbox(i: number) {
  lightboxIdx.value = i
}
function closeLightbox() {
  lightboxIdx.value = -1
}
function stepLightbox(d: number) {
  if (!lightboxOpen.value) return
  const n = lightboxIdx.value + d
  lightboxIdx.value = (n + shots.value.length) % shots.value.length
}
function onKey(e: KeyboardEvent) {
  if (!lightboxOpen.value) return
  if (e.key === 'Escape') closeLightbox()
  else if (e.key === 'ArrowLeft') stepLightbox(-1)
  else if (e.key === 'ArrowRight') stepLightbox(1)
}
onMounted(() => window.addEventListener('keydown', onKey))
onBeforeUnmount(() => window.removeEventListener('keydown', onKey))

/* 切换到别的作品详情时，关闭灯箱并从第一张开始 */
watch(
  () => props.id,
  () => {
    closeLightbox()
    activeIdx.value = 0
  }
)

const index = computed(() => projects.findIndex((p) => p.id === props.id))
const prev = computed(() => (index.value > 0 ? projects[index.value - 1] : null))
const next = computed(() =>
  index.value >= 0 && index.value < projects.length - 1 ? projects[index.value + 1] : null
)

const outLinks = computed(() => (project.value?.links ?? []).filter((l) => l.kind !== 'detail' && !!l.url))

/**
 * 返回首页并定位到「精选作品集」。
 *
 * 这里只负责改 URL —— 具体滚动交给 router 的 scrollBehavior 统一处理：
 * 它会等 #projects 真正渲染出来再滚（router-view 的 out-in 切换动画约 320ms）。
 * 之前在这里写 setTimeout(..., 120) 是无效的：120ms 时首页还没挂载，找不到元素。
 */
function back() {
  router.push({ path: '/', hash: '#projects' })
}

/** 上一个 / 下一个作品：回到顶部由 scrollBehavior 处理 */
function go(id: string) {
  router.push(`/project/${id}`)
}
</script>

<template>
  <main class="detail" :class="{ 'empty-page': !project }">
    <div v-if="project" class="container">
      <button class="back" @click="back">← 返回作品集</button>

      <header class="d-head">
        <span class="meta">
          <span class="industry" :style="{ color: project.accent, borderColor: project.accent }">
            {{ project.industry }}
          </span>
          <span class="period">{{ project.period }}</span>
          <span v-if="project.confidential" class="secret">涉密 · 已脱敏</span>
        </span>

        <h1 class="d-title">{{ project.name }}</h1>
        <p class="d-sub">{{ project.summary }}</p>

        <div class="actions">
          <a
            v-for="l in outLinks"
            :key="l.kind"
            :href="l.url"
            target="_blank"
            rel="noopener"
            class="btn"
          >
            {{ l.label || (l.kind === 'demo' ? '在线演示' : l.kind === 'repo' ? '源码仓库' : '外部链接') }}
            <span>↗</span>
          </a>
          <span v-if="project.confidential && !outLinks.length" class="notice">
            该项目受保密约束，不提供源码与在线演示
          </span>
        </div>
      </header>

      <div class="hero-cover">
        <ProjectCover :type="project.coverType" :accent="project.accent" :label="project.coverLabel" />
      </div>

      <section v-if="shots.length" class="shots block">
        <h2>作品截图</h2>
        <p class="shots-tip">共 {{ shots.length }} 张 · 点卡片查看大图，可左右翻</p>

        <div class="stack" :class="{ single: shots.length === 1 }">
          <div
            class="stack-stage"
            :style="{ '--pa': project.accent }"
            tabindex="0"
            role="group"
            aria-label="作品截图轮播"
            @keydown="onCardKey"
            @pointerdown="onDragStart"
            @pointerup="onDragEnd"
          >
            <button
              v-for="(s, i) in shots"
              :key="s.src"
              class="stack-card"
              :class="{ active: i === activeIdx }"
              :style="cardStyle(i)"
              :aria-label="`${project.name} 截图 ${i + 1}${s.label ? ' · ' + s.label : ''}`"
              @click="onCardClick(i)"
              @contextmenu.prevent
              @dragstart.prevent
            >
              <img
                :src="s.src"
                :alt="`${project.name} 截图 ${i + 1}`"
                :loading="i < 3 ? 'eager' : 'lazy'"
                draggable="false"
              />
              <span v-if="i === activeIdx" class="stack-zoom">⤢</span>
            </button>

            <template v-if="shots.length > 1">
              <button class="stack-nav prev" aria-label="上一张" @click.stop="step(-1)">‹</button>
              <button class="stack-nav next" aria-label="下一张" @click.stop="step(1)">›</button>
            </template>
          </div>

          <div class="stack-bar">
            <span class="stack-count">{{ activeIdx + 1 }} / {{ shots.length }}</span>
            <span class="stack-label">{{ shots[activeIdx].label }}</span>
            <div class="stack-dots">
              <button
                v-for="(s, i) in shots"
                :key="'d' + s.src"
                class="dot"
                :class="{ on: i === activeIdx }"
                :aria-label="`第 ${i + 1} 张`"
                @click="activeIdx = i"
              ></button>
            </div>
          </div>
        </div>
      </section>

      <div class="layout">
        <div class="content">
          <section class="block">
            <h2>主要功能</h2>
            <ul class="feature-list">
              <li v-for="(f, i) in project.features" :key="i">
                <span class="idx">{{ String(i + 1).padStart(2, '0') }}</span>
                <p>{{ f }}</p>
              </li>
            </ul>
          </section>

          <section class="block">
            <h2>项目背景</h2>
            <p class="para">{{ project.caseStudy.background }}</p>
          </section>

          <section class="block">
            <h2>我的职责</h2>
            <ul class="dot-list">
              <li v-for="(c, i) in project.caseStudy.contributions" :key="i">{{ c }}</li>
            </ul>
          </section>

          <section class="block">
            <h2>技术实现要点</h2>
            <ul class="dot-list alt">
              <li v-for="(t, i) in project.caseStudy.techNotes" :key="i">{{ t }}</li>
            </ul>
          </section>

          <section v-if="project.caseStudy.results?.length" class="block">
            <h2>成果</h2>
            <ul class="result-list">
              <li v-for="(r, i) in project.caseStudy.results" :key="i">
                <i></i>
                {{ r }}
              </li>
            </ul>
          </section>
        </div>

        <aside class="sidebar">
          <div class="card glass">
            <h3>角色与时间</h3>
            <p class="role-line">{{ project.role }}</p>
            <p class="period-line">{{ project.period }}</p>
          </div>

          <div class="card glass">
            <h3>使用技术栈</h3>
            <div class="tags">
              <span v-for="t in project.techStack" :key="t" class="tag">{{ t }}</span>
            </div>
          </div>

          <div class="card glass note-card">
            <h3>关于演示</h3>
            <p v-if="project.confidential">
              项目涉及保密或仅在内网环境运行，此处不提供源码与在线演示。面谈时可讲解架构取舍与实现细节。
            </p>
            <p v-else>
              如需查看实际效果，可联系我获取演示环境；源码在沟通后可开放部分仓库。
            </p>
          </div>
        </aside>
      </div>

      <nav class="switcher">
        <button v-if="prev" class="sw prev" @click="go(prev.id)">
          <span class="sw-label">上一个作品</span>
          <span class="sw-name">{{ prev.name }}</span>
        </button>
        <span v-else class="sw empty"></span>
        <button v-if="next" class="sw next" @click="go(next.id)">
          <span class="sw-label">下一个作品</span>
          <span class="sw-name">{{ next.name }}</span>
        </button>
        <span v-else class="sw empty"></span>
      </nav>
    </div>

    <div v-else class="container">
      <h1>没有找到这个作品</h1>
      <p>可能链接已经调整，回到首页看看其它作品吧。</p>
      <button class="btn btn-primary" @click="router.push('/')">回到首页</button>
    </div>

    <!-- 截图灯箱：放在 <main> 内部，根节点才能保持唯一；Teleport 的内容仍会挂到 body -->
    <Teleport to="body">
      <Transition name="lb">
        <div v-if="lightboxOpen" class="lightbox" @click.self="closeLightbox">
          <button class="lb-close" aria-label="关闭" @click="closeLightbox">×</button>
          <button v-if="shots.length > 1" class="lb-nav prev" aria-label="上一张" @click="stepLightbox(-1)">‹</button>
          <div class="lb-figure" @contextmenu.prevent @dragstart.prevent>
            <img class="lb-img" :src="shots[lightboxIdx].src" :alt="`截图 ${lightboxIdx + 1}`" draggable="false" />
          </div>
          <button v-if="shots.length > 1" class="lb-nav next" aria-label="下一张" @click="stepLightbox(1)">›</button>
          <span class="lb-count">{{ lightboxIdx + 1 }} / {{ shots.length }}</span>
        </div>
      </Transition>
    </Teleport>
  </main>
</template>

<style scoped>
.detail {
  padding: 44px 0 90px;
  scroll-margin-top: 68px;
}

.back {
  display: inline-flex;
  align-items: center;
  font-size: 13.5px;
  color: var(--text-dim);
  transition: color 0.25s ease, transform 0.25s ease;
}

.back:hover {
  color: var(--accent);
  transform: translateX(-3px);
}

.d-head {
  margin-top: 26px;
  max-width: 820px;
}

.meta {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  font-size: 12.5px;
  color: var(--text-mute);
}

.industry {
  padding: 3px 11px;
  border-radius: 99px;
  border: 1px solid;
  font-size: 12px;
}

.secret {
  padding: 3px 11px;
  border-radius: 99px;
  border: 1px dashed var(--border-hover);
  color: var(--text-dim);
}

.d-title {
  margin-top: 16px;
  font-size: clamp(28px, 4vw, 42px);
}

.d-sub {
  margin-top: 14px;
  color: var(--text-dim);
  font-size: 15.5px;
}

.actions {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 24px;
  flex-wrap: wrap;
}

.notice {
  font-size: 12.5px;
  color: var(--text-mute);
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px dashed var(--border);
}

.hero-cover {
  margin-top: 34px;
  border-radius: var(--radius-lg);
  overflow: hidden;
  border: 1px solid var(--border);
  height: 210px;
}

.hero-cover :deep(.cover) {
  height: 210px;
}

/* ---- 作品截图 ---- */
.shots {
  margin-top: 50px;
}

.shots-tip {
  margin-top: 10px;
  font-size: 12.5px;
  color: var(--text-mute);
  font-family: var(--mono);
}

/* 卡牌堆叠轮播：只占一张卡的高度，后面几张叠出层次感 */
.stack {
  margin-top: 20px;
}

.stack-stage {
  position: relative;
  height: clamp(240px, 34vw, 430px);
  outline: none;
}

/* 右侧留出 90px 给后面叠着的卡片露边 */
.stack-card {
  position: absolute;
  left: 0;
  top: 0;
  width: calc(100% - 90px);
  height: 100%;
  padding: 0;
  overflow: hidden;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  background: var(--panel);
  cursor: pointer;
  transform-origin: left top;
  transform: translate3d(calc(var(--rel, 0) * 54px), calc(var(--rel, 0) * 10px), 0)
    scale(calc(1 - var(--rel, 0) * 0.04));
  transition:
    transform 0.45s cubic-bezier(0.22, 0.85, 0.3, 1),
    opacity 0.45s ease,
    border-color 0.3s ease,
    box-shadow 0.35s ease;
  box-shadow: 0 12px 34px rgba(0, 0, 0, 0.32);
  -webkit-user-select: none;
  user-select: none;
  touch-action: pan-y;
}

.stack.single .stack-card {
  width: 100%;
}

.stack-card img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: top center;
  pointer-events: none;
  -webkit-user-drag: none;
  -webkit-touch-callout: none;
}

/* 卡片本身也禁选中，避免右键菜单与拖拽另存 */
.stack-card {
  -webkit-touch-callout: none;
}

.stack-card.active {
  cursor: zoom-in;
  border-color: color-mix(in srgb, var(--pa, var(--accent)) 45%, transparent);
  box-shadow: 0 18px 48px rgba(0, 0, 0, 0.42);
}

.stack-card.active:hover {
  border-color: var(--pa, var(--accent));
}

.stack-stage:focus-visible .stack-card.active {
  border-color: var(--pa, var(--accent));
}

.stack-zoom {
  position: absolute;
  right: 12px;
  bottom: 12px;
  width: 30px;
  height: 30px;
  display: grid;
  place-items: center;
  border-radius: 8px;
  font-size: 13px;
  color: var(--pa, var(--accent));
  background: var(--accent-soft);
  border: 1px solid var(--border);
  opacity: 0;
  transition: opacity 0.25s ease;
}

.stack-card.active:hover .stack-zoom,
.stack-stage:focus-visible .stack-zoom {
  opacity: 1;
}

.stack-nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 60;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 1px solid var(--border);
  background: color-mix(in srgb, var(--panel) 88%, transparent);
  color: var(--text);
  font-size: 22px;
  line-height: 1;
  cursor: pointer;
  backdrop-filter: blur(6px);
  transition:
    background 0.25s ease,
    color 0.25s ease,
    border-color 0.25s ease;
}

.stack-nav:hover {
  background: var(--accent-soft);
  border-color: var(--pa, var(--accent));
  color: var(--pa, var(--accent));
}

.stack-nav.prev {
  left: 12px;
}

.stack-nav.next {
  left: calc(100% - 130px);
}

.stack-bar {
  margin-top: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.stack-count {
  font-family: var(--mono);
  font-size: 12.5px;
  color: var(--accent);
}

.stack-label {
  font-size: 13px;
  color: var(--text-mute);
}

.stack-dots {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}

.stack-dots .dot {
  width: 7px;
  height: 7px;
  padding: 0;
  border-radius: 50%;
  border: 1px solid var(--border-hover);
  background: transparent;
  cursor: pointer;
  transition: all 0.25s ease;
}

.stack-dots .dot:hover {
  border-color: var(--pa, var(--accent));
}

.stack-dots .dot.on {
  width: 18px;
  border-radius: 99px;
  border-color: transparent;
  background: var(--pa, var(--accent));
}

/* ---- 灯箱 ---- */
.lightbox {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: grid;
  place-items: center;
  background: rgba(2, 4, 10, 0.9);
  backdrop-filter: blur(10px);
}

.lb-figure {
  position: relative;
  max-width: min(92vw, 1280px);
  line-height: 0;
}

.lb-img {
  max-width: min(92vw, 1280px);
  max-height: 86vh;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.14);
  box-shadow: 0 24px 80px rgba(0, 0, 0, 0.6);
  -webkit-user-drag: none;
  -webkit-touch-callout: none;
}

.lb-close {
  position: absolute;
  top: 18px;
  right: 22px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.08);
  color: #fff;
  font-size: 22px;
  line-height: 1;
  cursor: pointer;
  transition: background 0.25s ease;
}

.lb-close:hover {
  background: rgba(255, 255, 255, 0.18);
}

.lb-nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 46px;
  height: 46px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.08);
  color: #fff;
  font-size: 26px;
  line-height: 1;
  cursor: pointer;
  transition: background 0.25s ease;
}

.lb-nav:hover {
  background: rgba(255, 255, 255, 0.18);
}

.lb-nav.prev {
  left: 22px;
}

.lb-nav.next {
  right: 22px;
}

.lb-count {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  font-family: var(--mono);
  font-size: 12.5px;
  color: rgba(255, 255, 255, 0.75);
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.14);
  padding: 5px 14px;
  border-radius: 99px;
}

.lb-enter-active,
.lb-leave-active {
  transition: opacity 0.25s ease;
}

.lb-enter-from,
.lb-leave-to {
  opacity: 0;
}

.layout {
  margin-top: 50px;
  display: grid;
  grid-template-columns: 1.3fr 0.7fr;
  gap: 46px;
  align-items: start;
}

.block + .block {
  margin-top: 40px;
}

.block h2 {
  font-size: 19px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--border);
}

.feature-list {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.feature-list li {
  display: flex;
  gap: 14px;
}

.idx {
  flex-shrink: 0;
  font-family: var(--mono);
  font-size: 12.5px;
  color: var(--accent);
  padding-top: 3px;
}

.feature-list p,
.para {
  font-size: 14.5px;
  line-height: 1.85;
  color: var(--text-dim);
}

.para {
  margin-top: 16px;
}

.dot-list {
  margin-top: 18px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.dot-list li {
  position: relative;
  padding-left: 18px;
  font-size: 14.5px;
  line-height: 1.8;
  color: var(--text-dim);
}

.dot-list li::before {
  content: '';
  position: absolute;
  left: 0;
  top: 11px;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--accent);
}

.dot-list.alt li::before {
  background: transparent;
  border: 1px solid var(--accent-2);
}

.result-list {
  margin-top: 18px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.result-list li {
  display: flex;
  gap: 10px;
  font-size: 14.5px;
  color: var(--text);
}

.result-list i {
  flex-shrink: 0;
  width: 18px;
  height: 18px;
  margin-top: 4px;
  border-radius: 50%;
  border: 1px solid var(--accent);
  position: relative;
}

.result-list i::after {
  content: '';
  position: absolute;
  left: 5px;
  top: 4px;
  width: 6px;
  height: 3px;
  border-left: 1.5px solid var(--accent);
  border-bottom: 1.5px solid var(--accent);
  transform: rotate(-45deg);
}

.sidebar {
  position: sticky;
  top: 92px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.card {
  padding: 20px;
}

.card h3 {
  font-size: 13.5px;
  color: var(--text-mute);
  letter-spacing: 0.04em;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--border);
}

.role-line {
  margin-top: 14px;
  font-size: 14.5px;
  font-weight: 500;
}

.period-line {
  margin-top: 4px;
  font-size: 12.5px;
  color: var(--text-mute);
  font-family: var(--mono);
}

.tags {
  margin-top: 14px;
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
}

.note-card p {
  margin-top: 14px;
  font-size: 13px;
  line-height: 1.75;
  color: var(--text-mute);
}

.switcher {
  margin-top: 66px;
  padding-top: 30px;
  border-top: 1px solid var(--border);
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.sw {
  display: flex;
  flex-direction: column;
  gap: 5px;
  padding: 18px 20px;
  border-radius: var(--radius);
  border: 1px solid var(--border);
  background: var(--panel);
  transition: all 0.3s ease;
}

.sw.next {
  text-align: right;
  align-items: flex-end;
}

.sw:hover {
  border-color: var(--accent);
  background: var(--accent-soft);
  transform: translateY(-3px);
}

.sw.empty {
  border-color: transparent;
  background: transparent;
}

.sw-label {
  font-size: 12px;
  color: var(--text-mute);
}

.sw-name {
  font-size: 15px;
  font-weight: 500;
}

.empty-page {
  min-height: 60vh;
  display: grid;
  place-items: center;
  text-align: center;
}

.empty-page h1 {
  font-size: 26px;
}

.empty-page p {
  margin: 12px 0 22px;
  color: var(--text-dim);
}

@media (max-width: 900px) {
  .layout {
    grid-template-columns: 1fr;
  }
  .sidebar {
    position: static;
  }
  .hero-cover {
    height: 160px;
  }
  .hero-cover :deep(.cover) {
    height: 160px;
  }
}

@media (max-width: 560px) {
  .switcher {
    grid-template-columns: 1fr;
  }
  .sw.next {
    text-align: left;
    align-items: flex-start;
  }
  .stack-stage {
    height: clamp(200px, 46vw, 300px);
  }
  .stack-card {
    width: calc(100% - 56px);
    transform: translate3d(calc(var(--rel, 0) * 22px), calc(var(--rel, 0) * 8px), 0)
      scale(calc(1 - var(--rel, 0) * 0.045));
  }
  .stack-nav.prev {
    left: 6px;
  }
  .stack-nav.next {
    left: calc(100% - 66px);
  }
  .stack-nav {
    width: 34px;
    height: 34px;
    font-size: 18px;
  }
  .lb-nav.prev {
    left: 10px;
  }
  .lb-nav.next {
    right: 10px;
  }
}
</style>
