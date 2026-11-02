<script setup lang="ts">
import { computed } from 'vue'
import { projects, profile } from '@/data/portfolio'
import ProjectCard from '@/components/ProjectCard.vue'
import { useConsult } from '@/composables/useConsult'

const { openConsult } = useConsult()

/* 精选案例：取前 6 个 */
const featured = computed(() => projects.slice(0, 6))

/* 数字背书（口径可随实际调整） */
const stats = [
  { num: '7 年+', label: '行业信息化交付经验' },
  { num: '10+', label: '省级 / 央企级项目' },
  { num: '7 大', label: '行业领域覆盖' },
  { num: '5 年+', label: '同类框架二次开发经验' }
]

/* 三大核心能力 */
const capabilities = [
  {
    icon: '研',
    title: '研发能力',
    desc: '从 0 到 1 的产品化研发经验，主导过前端框架级技术选型与整体重构，不只是执行页面，更会做技术决策。',
    points: ['SaaS 薪酬产品研发（SAP App Center 上架）', '前端框架迁移重构（SAPUI5 → Vue2）', '小程序 / H5 产品孵化']
  },
  {
    icon: '术',
    title: '技术能力',
    desc: '全栈技术矩阵覆盖前端主流框架、后端联调与信创环境适配，政企场景下的复杂表单、权限体系、工作流都是熟路。',
    points: ['Vue2 / Vue3 · TypeScript · ECharts', '若依 RuoYi 生态深度二次开发', 'Spring Boot 后端协作与国产数据库适配']
  },
  {
    icon: '交',
    title: '交付能力',
    desc: '6 年以上驻场交付经验，独立承接甲方现场：需求沟通、进度汇报、现场排查、上线保障一个人扛得动。',
    points: ['政务 / 水利现场驻场交付', '涉密项目合规经验', '上线保障与长期运维']
  }
]

/* 技术矩阵 */
const techCols = [
  {
    title: '前端研发',
    items: [
      'Vue2 / Vue3',
      'TypeScript',
      'AngularJS / Angular 21',
      'React',
      'Element Plus / Element UI',
      'ECharts 可视化',
      'uni-app 多端 / App 混合开发',
      'SAPUI5'
    ]
  },
  {
    title: '后端 / 数据',
    items: ['Spring Boot', '若依 RuoYi', 'MySQL', 'Redis', '达梦 / 人大金仓适配']
  },
  {
    title: '工程与交付',
    items: ['Vite / Webpack', 'Git 协作', 'CI/CD', 'Nginx 部署', 'AI 辅助研发']
  }
]

/* 交付流程 */
const steps = [
  { no: '1', title: '需求调研', desc: '现场沟通 · 需求评审' },
  { no: '2', title: '方案设计', desc: '架构设计 · 原型确认' },
  { no: '3', title: '迭代研发', desc: '敏捷迭代 · 周报同步' },
  { no: '4', title: '测试上线', desc: '联调测试 · 部署保障' },
  { no: '5', title: '运维支持', desc: '驻场支持 · 长期维护' }
]

const industries = ['🏛 政务', '💧 水利', '🌱 农业', '🏦 金融', '📶 运营商', '🏭 国企', '🛰 涉密单位']

/* 「为什么选我」四张卡（icon 用 emoji，与行业标签风格一致） */
const aboutItems = [
  {
    icon: '🏛',
    t: '行业纵深',
    d: '7 年政企信息化一线交付，横跨运营商、银行、水利工程、省级政务四类甲方，业务语言不用现学，上手即进入状态。',
    tags: ['运营商', '银行', '水利工程', '省级政务']
  },
  {
    icon: '🛡',
    t: '涉密合规',
    d: '多个省级涉密系统交付经验，保密流程熟、审查过关快，敏感场景可直接驻场，资料不出内网。',
    tags: ['保密流程', '审查过关快', '可驻场']
  },
  {
    icon: '🧩',
    t: '独立闭环',
    d: '一个人扛完整条链：需求分析 → 界面交互 → 前后端实现 → 打包部署 → 上线保障，中间不用等资源、不用来回传话。',
    tags: ['需求分析', '前后端', '部署运维']
  },
  {
    icon: '📍',
    t: '本地响应',
    d: '常驻南宁，广西本地项目可驻场、可远程，响应快、沟通成本低，来了就能干活。',
    tags: ['常驻南宁', '可驻场', '可远程']
  }
]

/* 主题色浅色化：行业标签图标在浅底上更醒目的配色 */
const industryColors = ['#1652f0', '#0e8f7e', '#3E9B4F', '#9d2f4e', '#d96a1e', '#23324d', '#6a3fd0']

function scrollToServices() {
  document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })
}
</script>

<template>
  <main>
    <!-- ============ ① 能力横幅 ============ -->
    <section id="hero" class="hero">
      <!-- Hero 背景：网格 + 流动光斑 + 扫光，纯 CSS 动画 -->
      <div class="hero-bg" aria-hidden="true">
        <span class="grid"></span>
        <span class="orb orb-1"></span>
        <span class="orb orb-2"></span>
        <span class="orb orb-3"></span>
      </div>

      <div class="container hero-inner">
        <div class="hero-copy">
          <span class="hero-tag">GOV · WATER · FINANCE · TELECOM 行业信息化</span>
          <h1>
            从需求到上线<br />
            一站式 <em>Web 应用研发与交付</em>
          </h1>
          <p>
            深耕政务、水利、农业、金融、运营商信息化领域，提供从需求分析、系统设计、前后端研发、驻场交付到长期运维的全周期技术服务。
          </p>
          <ul class="hero-skills">
            <li>
              <span class="k">前端</span>
              <span class="v"
                >Vue2 / Vue3 · Angular · React · TypeScript · ECharts 可视化 · OpenLayers WebGIS「一张图」</span
              >
            </li>
            <li>
              <span class="k">移动端</span>
              <span class="v">uni-app 一套代码多端：微信小程序 / H5 / App 混合开发</span>
            </li>
            <li>
              <span class="k">后端</span>
              <span class="v">Spring Boot · 若依 RuoYi 框架 · Node.js 接口设计与业务开发</span>
            </li>
            <li>
              <span class="k">数据部署</span>
              <span class="v">MySQL 库表设计 · Docker 打包部署 · 国产化环境适配</span>
            </li>
          </ul>
          <div class="hero-btns">
            <router-link to="/portfolio" class="btn btn-primary">查看作品集</router-link>
            <button class="btn hero-ghost" @click="scrollToServices">
              了解服务
            </button>
          </div>
        </div>
        <div class="hero-visual" aria-hidden="true">
          <!-- 简化系统架构示意：三层堆叠卡片 -->
          <div class="arch">
            <div class="arch-layer top">前端 · Vue3 / Angular / React / ECharts / GIS</div>
            <div class="arch-layer mid">移动端 · uni-app 多端（小程序 / H5 / App 混合）</div>
            <div class="arch-layer mid2">后端 · Spring Boot / 若依 / Node.js</div>
            <div class="arch-layer base">数据 · MySQL / 国产数据库 / Docker</div>
            <span class="arch-line l1"></span>
            <span class="arch-line l2"></span>
          </div>
        </div>
      </div>
    </section>

    <!-- ============ ② 数字背书 ============ -->
    <section class="stats">
      <div class="container stats-grid">
        <div v-for="s in stats" :key="s.label" class="stat fade-up">
          <b>{{ s.num }}</b>
          <span>{{ s.label }}</span>
        </div>
      </div>
    </section>

    <!-- ============ ③ 三大核心能力 ============ -->
    <section id="services" class="section">
      <div class="container">
        <div class="sec-head fade-up">
          <span class="eyebrow">Core Capabilities</span>
          <h2 class="section-title">三大核心能力</h2>
          <p class="section-sub">研发做深度，技术做广度，交付做保障</p>
        </div>
        <div class="caps">
          <article v-for="c in capabilities" :key="c.title" class="cap fade-up">
            <span class="cap-icon">{{ c.icon }}</span>
            <h3>{{ c.title }}</h3>
            <p>{{ c.desc }}</p>
            <ul>
              <li v-for="pt in c.points" :key="pt">{{ pt }}</li>
            </ul>
          </article>
        </div>
      </div>
    </section>

    <!-- ============ ④ 技术矩阵 ============ -->
    <section class="section alt" id="stack">
      <div class="container">
        <div class="sec-head fade-up">
          <span class="eyebrow">Tech Stack</span>
          <h2 class="section-title">技术矩阵</h2>
          <p class="section-sub">主流技术栈 + 信创环境适配，选型以稳定交付为先</p>
        </div>
        <div class="tech-grid">
          <div v-for="col in techCols" :key="col.title" class="tech-col fade-up">
            <h4>{{ col.title }}</h4>
            <div class="chips">
              <span v-for="t in col.items" :key="t" class="tag">{{ t }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ============ ⑤ 交付流程 ============ -->
    <section class="section">
      <div class="container">
        <div class="sec-head fade-up">
          <span class="eyebrow">Delivery Process</span>
          <h2 class="section-title">标准化交付流程</h2>
        </div>
        <div class="flow">
          <div v-for="s in steps" :key="s.no" class="step fade-up">
            <span class="step-no">{{ s.no }}</span>
            <h4>{{ s.title }}</h4>
            <p>{{ s.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ============ ⑥ 精选案例 ============ -->
    <section class="section alt" id="projects">
      <div class="container">
        <div class="sec-head fade-up">
          <span class="eyebrow">Selected Works</span>
          <h2 class="section-title">精选案例</h2>
          <p class="section-sub">涉密项目不做公开演示，提供站内脱敏案例详情</p>
        </div>
        <div class="works-grid">
          <div v-for="(p, i) in featured" :key="p.id" class="work-item fade-up" :style="{ transitionDelay: `${i * 70}ms` }">
            <ProjectCard :project="p" />
          </div>
        </div>
        <div class="center-btn fade-up">
          <router-link to="/portfolio" class="btn">进入作品集（{{ projects.length }}+ 案例）</router-link>
        </div>
      </div>
    </section>

    <!-- ============ ⑦ 服务行业 ============ -->
    <section class="section">
      <div class="container">
        <div class="sec-head fade-up">
          <span class="eyebrow">Industries</span>
          <h2 class="section-title">服务行业</h2>
        </div>
        <div class="cust fade-up">
          <span v-for="(ind, i) in industries" :key="ind" class="cust-item" :style="{ '--c': industryColors[i] }">
            {{ ind }}
          </span>
        </div>
      </div>
    </section>

    <!-- ============ ⑧ 关于我 ============ -->
    <section class="section alt" id="about">
      <div class="container about-grid">
        <div class="about-intro fade-up">
          <span class="eyebrow">About Me</span>
          <h2 class="section-title">为什么选我</h2>
          <p class="about-desc">
            不做"人来填坑"式的外包交付：从需求梳理、界面交互、前后端实现到部署运维，
            我按「能独立扛完一个系统」的标准要求自己。常年驻扎甲方现场，更懂政企项目怎么把事落地——
            汇报讲得清，审查过得快，出了问题人在现场。
          </p>
          <div class="about-stats">
            <div class="astat">
              <b>7<i>年+</i></b>
              <span>政企信息化<br />一线交付</span>
            </div>
            <div class="astat">
              <b>4<i>类</i></b>
              <span>行业甲方<br />业务语言现成</span>
            </div>
            <div class="astat">
              <b>{{ projects.length }}<i>个</i></b>
              <span>对外展示案例<br />（涉密项目未列）</span>
            </div>
          </div>
          <p class="about-foot">
            <span class="chip">常驻南宁</span>
            <span class="chip">可驻场 · 可远程</span>
            <span class="chip">长期合作优先</span>
          </p>
        </div>
        <div class="about-list">
          <div v-for="(r, i) in aboutItems" :key="r.t" class="about-item fade-up"
            :style="{ transitionDelay: `${i * 90}ms` }">
            <div class="it-head">
              <span class="it-icon" aria-hidden="true">{{ r.icon }}</span>
              <h4>{{ r.t }}</h4>
            </div>
            <p>{{ r.d }}</p>
            <div class="it-tags">
              <span v-for="tag in r.tags" :key="tag" class="tag">{{ tag }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ============ ⑨ 询价横幅 ============ -->
    <section class="cta-band">
      <div class="container">
        <h2>有系统要建？有项目要人？聊聊就知道行不行</h2>
        <p>支持远程协作 / 南宁本地驻场 · {{ profile.contact.location }}</p>
        <button class="cta-btn" type="button" @click="openConsult('cta')">立即咨询</button>
        <p class="cta-tip">
          在线聊两句，或直接拨 {{ profile.contact.phone }}（微信同号）· 留言会直接推到我手机
        </p>
      </div>
    </section>
  </main>
</template>

<style scoped>
main {
  padding-top: 68px; /* 固定头部高度 */
}

/* ---- ① Hero ---- */
/* Hero 渐变跟随全站主题色（变量定义见 global.css 各 data-theme 块） */
.hero {
  position: relative;
  color: #fff;
  overflow: hidden;
  background:
    radial-gradient(900px 460px at 12% -10%, var(--hero-g1) 0%, transparent 62%),
    radial-gradient(700px 420px at 88% 8%, var(--hero-g2) 0%, transparent 64%),
    linear-gradient(120deg, var(--hero-b1) 0%, var(--hero-b2) 48%, var(--hero-b3) 100%);
}

/* 背景容器：不拦截交互，避免挡住按钮点击 */
.hero-bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 0;
}

/* 细网格：中心亮、四周淡出，避免整片都是格子显得脏 */
.hero-bg .grid {
  position: absolute;
  inset: -1px;
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.055) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.055) 1px, transparent 1px);
  background-size: 48px 48px;
  -webkit-mask-image: radial-gradient(ellipse 70% 60% at 30% 25%, #000 0%, transparent 72%);
  mask-image: radial-gradient(ellipse 70% 60% at 30% 25%, #000 0%, transparent 72%);
}

/* 流动光斑 */
.hero-bg .orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(64px);
  opacity: 0.55;
  will-change: transform;
}

.hero-bg .orb-1 {
  width: 560px;
  height: 560px;
  left: -120px;
  top: -180px;
  background: radial-gradient(circle at 35% 35%, var(--hero-g1) 0%, rgba(255, 255, 255, 0) 70%);
}

.hero-bg .orb-2 {
  width: 480px;
  height: 480px;
  right: -60px;
  top: -120px;
  background: radial-gradient(circle at 60% 40%, var(--hero-g2) 0%, rgba(255, 255, 255, 0) 70%);
}

.hero-bg .orb-3 {
  width: 620px;
  height: 620px;
  left: 34%;
  bottom: -320px;
  background: radial-gradient(circle at 50% 50%, var(--hero-g3) 0%, rgba(255, 255, 255, 0) 68%);
  opacity: 0.38;
}

.hero-inner {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: 48px;
  padding-top: 84px;
  padding-bottom: 84px;
}

.hero-copy {
  flex: 1.35;
  min-width: 0;
}

.hero-tag {
  display: inline-block;
  font-size: 12px;
  letter-spacing: 0.14em;
  border: 1px solid rgba(255, 255, 255, 0.45);
  padding: 5px 14px;
  border-radius: 99px;
  margin-bottom: 22px;
}

.hero h1 {
  color: #fff;
  font-size: clamp(30px, 4.4vw, 44px);
  font-weight: 800;
  line-height: 1.3;
}

.hero h1 em {
  font-style: normal;
  color: rgba(255, 255, 255, 0.82);
  text-decoration: underline;
  text-decoration-color: rgba(255, 255, 255, 0.4);
  text-underline-offset: 8px;
}

.hero p {
  margin-top: 18px;
  font-size: 15px;
  color: rgba(255, 255, 255, 0.85);
  max-width: 640px;
  line-height: 1.9;
}

/* 技能清单：标签 + 内容两列，桌面端单行不折行 */
.hero-skills {
  margin-top: 16px;
  max-width: 760px;
  display: flex;
  flex-direction: column;
  gap: 7px;
  list-style: none;
  padding: 0;
}

.hero-skills li {
  display: flex;
  align-items: center;
  gap: 10px;
  white-space: nowrap;
}

.hero-skills .k {
  flex: none;
  min-width: 62px;
  text-align: center;
  font-size: 11.5px;
  color: rgba(255, 255, 255, 0.95);
  border: 1px solid rgba(255, 255, 255, 0.4);
  border-radius: 99px;
  padding: 2px 9px;
}

.hero-skills .v {
  font-size: 12.5px;
  color: rgba(255, 255, 255, 0.75);
  letter-spacing: 0.01em;
}

@media (max-width: 1240px) {
  /* 中等屏放不下单行，允许折行 */
  .hero-skills li {
    white-space: normal;
    align-items: flex-start;
  }
  .hero-skills .v {
    line-height: 1.8;
  }
}

.hero-btns {
  margin-top: 30px;
  display: flex;
  gap: 14px;
  flex-wrap: wrap;
}

.hero .btn-primary {
  background: #fff;
  color: var(--accent);
  border-color: #fff;
}

.hero .btn-primary:hover {
  background: #f0f4ff;
}

.hero-ghost {
  background: transparent;
  border-color: rgba(255, 255, 255, 0.55);
  color: #fff;
}

.hero-ghost:hover {
  background: rgba(255, 255, 255, 0.12);
  border-color: #fff;
  color: #fff;
}

/* 架构示意 */
.hero-visual {
  flex: 0.75;
  display: flex;
  justify-content: center;
  min-width: 0;
}

.arch {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 26px;
  width: 100%;
  max-width: 340px;
}

.arch-layer {
  background: rgba(255, 255, 255, 0.14);
  border: 1px solid rgba(255, 255, 255, 0.32);
  border-radius: 10px;
  padding: 13px 14px;
  font-size: 12.5px;
  text-align: center;
  backdrop-filter: blur(6px);
  white-space: nowrap;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
}

.arch-layer.top {
  transform: translateX(18px);
}

.arch-layer.mid {
  transform: translateX(-14px);
}

.arch-layer.mid2 {
  transform: translateX(-2px);
}

.arch-layer.base {
  transform: translateX(8px);
}

.arch-line {
  position: absolute;
  left: 50%;
  width: 1.5px;
  height: 26px;
  background: rgba(255, 255, 255, 0.5);
}

.arch-line.l1 {
  top: 58px;
}

.arch-line.l2 {
  top: 128px;
}

/* ---- ② 数字背书 ---- */
.stats {
  background: var(--bg-soft);
  border-bottom: 1px solid var(--border);
  padding: 30px 0;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
}

.stat {
  text-align: center;
  border-right: 1px solid var(--border);
}

.stat:last-child {
  border-right: none;
}

.stat b {
  font-size: 26px;
  color: var(--accent);
  font-weight: 700;
}

.stat span {
  display: block;
  font-size: 12.5px;
  color: var(--text-dim);
  margin-top: 4px;
}

/* ---- 区块标题 ---- */
.sec-head {
  text-align: center;
  margin-bottom: 40px;
}

.sec-head .eyebrow::before {
  display: none;
}

.sec-head .section-sub {
  margin-left: auto;
  margin-right: auto;
}

/* ---- ③ 三大能力 ---- */
.caps {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 22px;
}

.cap {
  background: var(--panel);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 30px 26px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.cap:hover {
  transform: translateY(-6px);
  box-shadow: 0 18px 40px -18px var(--accent-shadow);
}

.cap-icon {
  width: 46px;
  height: 46px;
  border-radius: 12px;
  background: var(--accent-soft);
  color: var(--accent);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: 800;
}

.cap h3 {
  font-size: 17px;
  margin: 16px 0 10px;
}

.cap p {
  font-size: 13.5px;
  color: var(--text-dim);
  line-height: 1.85;
}

.cap ul {
  margin-top: 14px;
}

.cap ul li {
  font-size: 13px;
  color: var(--text-dim);
  padding: 7px 0;
  border-top: 1px dashed var(--border);
}

.cap ul li::before {
  content: '· ';
  color: var(--accent);
  font-weight: 800;
}

/* ---- ④ 技术矩阵 ---- */
.tech-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 22px;
}

.tech-col {
  background: var(--panel);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 24px;
}

.tech-col h4 {
  font-size: 14.5px;
  color: var(--accent);
  margin-bottom: 14px;
}

.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

/* ---- ⑤ 交付流程 ---- */
.flow {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 12px;
}

.step {
  text-align: center;
  position: relative;
}

.step-no {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--accent);
  color: var(--accent-contrast);
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 14px;
  box-shadow: 0 6px 16px -6px var(--accent-shadow);
}

.step h4 {
  font-size: 14.5px;
}

.step p {
  font-size: 12.5px;
  color: var(--text-dim);
  margin-top: 6px;
  padding: 0 10px;
  line-height: 1.7;
}

.step:not(:last-child)::after {
  content: '';
  position: absolute;
  top: 19px;
  right: -14px;
  width: 30px;
  height: 2px;
  background: var(--border-hover);
}

/* ---- ⑥ 精选案例 ---- */
.works-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 22px;
}

.center-btn {
  margin-top: 36px;
  text-align: center;
}

/* ---- ⑦ 服务行业 ---- */
.cust {
  display: flex;
  gap: 14px;
  flex-wrap: wrap;
  justify-content: center;
}

.cust-item {
  background: var(--panel);
  border: 1px solid var(--border);
  color: var(--text);
  font-size: 14px;
  padding: 12px 26px;
  border-radius: 10px;
  transition: all 0.25s ease;
}

.cust-item:hover {
  border-color: var(--c);
  color: var(--c);
  transform: translateY(-3px);
  box-shadow: 0 10px 24px -14px var(--c);
}

/* ---- ⑧ 关于我 ---- */
.about-grid {
  display: grid;
  grid-template-columns: 0.9fr 1.4fr;
  gap: 48px;
  align-items: start;
}

/* 左栏：标题 + 介绍 + 数字点 */
.about-intro {
  position: sticky;
  top: 92px;
}

.about-desc {
  margin-top: 18px;
  font-size: 14px;
  line-height: 1.95;
  color: var(--text-dim);
}

.about-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-top: 26px;
}

.about-stats .astat {
  background: var(--panel);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 14px 12px;
  transition: border-color 0.3s ease, box-shadow 0.3s ease, transform 0.3s ease;
}

.about-stats .astat:hover {
  transform: translateY(-3px);
  border-color: var(--accent);
  box-shadow: 0 12px 26px -16px var(--accent-shadow);
}

.about-stats .astat b {
  display: block;
  font-size: 26px;
  font-weight: 600;
  color: var(--accent);
  font-family: var(--mono);
  letter-spacing: -0.02em;
}

.about-stats .astat b i {
  font-style: normal;
  font-size: 13px;
  margin-left: 1px;
}

.about-stats .astat span {
  display: block;
  margin-top: 6px;
  font-size: 11.5px;
  line-height: 1.55;
  color: var(--text-mute);
}

.about-foot {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 22px;
}

.about-foot .chip {
  font-size: 12px;
  padding: 5px 12px;
  border-radius: 99px;
  color: var(--accent);
  background: var(--accent-soft);
  border: 1px solid color-mix(in srgb, var(--accent) 22%, transparent);
}

/* 右栏：四张卡片 */
.about-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 14px;
}

.about-item {
  background: var(--panel);
  border: 1px solid var(--border);
  border-left: 3px solid var(--accent);
  border-radius: var(--radius);
  padding: 18px 20px;
  transition: transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
}

.about-item:hover {
  transform: translateY(-3px);
  border-color: var(--accent);
  border-left-width: 3px;
  box-shadow: 0 14px 30px -18px var(--accent-shadow);
}

.it-head {
  display: flex;
  align-items: center;
  gap: 10px;
}

.it-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  flex-shrink: 0;
  font-size: 17px;
  border-radius: 10px;
  background: var(--accent-soft);
}

.about-item h4 {
  font-size: 15px;
}

.about-item p {
  font-size: 13px;
  color: var(--text-dim);
  margin-top: 10px;
  line-height: 1.8;
}

.it-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 12px;
}

.it-tags .tag {
  font-size: 11.5px;
  padding: 3px 10px;
  border-radius: 99px;
  color: var(--text-dim);
  background: var(--bg-soft);
  border: 1px solid var(--border);
}

/* ---- ⑨ 询价横幅 ---- */
.cta-band {
  background: linear-gradient(100deg, var(--accent), var(--accent-2));
  color: #fff;
  text-align: center;
  padding: 64px 24px;
}

.cta-band h2 {
  color: #fff;
  font-size: clamp(20px, 2.6vw, 26px);
}

.cta-band p {
  font-size: 13.5px;
  color: rgba(255, 255, 255, 0.85);
  margin: 12px 0 24px;
}

.cta-btn {
  display: inline-block;
  background: #fff;
  color: var(--accent);
  padding: 12px 34px;
  border-radius: var(--radius);
  font-size: 14.5px;
  font-family: inherit;
  font-weight: 700;
  border: 1px solid transparent;
  cursor: pointer;
  transition: transform 0.25s ease;
}

.cta-btn:hover {
  transform: translateY(-3px);
}

.cta-tip {
  margin: 16px 0 0;
  font-size: 12.5px;
  color: rgba(255, 255, 255, 0.8);
}

/* ---- 响应式 ---- */
@media (max-width: 960px) {
  .hero-inner {
    flex-direction: column;
    padding-top: 56px;
    padding-bottom: 56px;
  }
  .hero-visual {
    display: none;
  }
  .caps,
  .tech-grid {
    grid-template-columns: 1fr;
  }
  .flow {
    grid-template-columns: repeat(2, 1fr);
    gap: 24px;
  }
  .step::after {
    display: none;
  }
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 18px 0;
  }
  .stat:nth-child(2) {
    border-right: none;
  }
  .about-grid {
    grid-template-columns: 1fr;
  }
  .about-intro {
    position: static;
  }
  .about-list {
    grid-template-columns: 1fr;
  }
}
</style>
