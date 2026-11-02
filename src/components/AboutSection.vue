<script setup lang="ts">
import { computed } from 'vue'
import { profile } from '@/data/portfolio'

const avatarUrl = computed(() => `${import.meta.env.BASE_URL}${profile.avatar}`)

const timeline = [
  {
    period: '2017 - 2019',
    title: '广州 · 运营商与银行',
    desc: '初入职场的驻场起点：外派中国移动广州分公司做智能门禁，同期参与某银行内控系统与 ECharts 数据看板。第一次理解甲方现场的工作方式。'
  },
  {
    period: '2018 - 2020',
    title: '产品级研发：易薪资',
    desc: '在中数通（SAP 在华唯一合资公司）做薪酬 SaaS 产品，参与从内部自用到对外产品化的全过程，并主导前端由 SAPUI5 迁移至 Vue2 上线。'
  },
  {
    period: '2019 - 2021',
    title: '大藤峡 · 水利工程信息化',
    desc: '国务院 172 项重大水利工程现场驻场两年半，负责智慧园区板块与砂石方管理系统，同时兼顾南宁办事处日常运营与甲方汇报。'
  },
  {
    period: '2021 - 2023',
    title: '省级政务平台',
    desc: '驻场广西大数据发展局，参与政务一体化平台与智桂通 / 广西政务 App 的 H5 混合开发，做前端负责人并负责混合开发调优。'
  },
  {
    period: '2023 - 2024',
    title: '省级涉密政务系统',
    desc: '驻场自治区自然资源厅，基于若依 RuoYi-Vue 开发省级涉密政务系统，负责多个业务模块的完整实现。'
  }
]
</script>

<template>
  <section id="about" class="section about">
    <div class="container">
      <div class="head fade-up">
        <span class="eyebrow">About me</span>
        <h2 class="section-title">关于我</h2>
        <p class="section-sub">
          7 年多职业主线没有偏过——一直在做政企、数字政府与工程信息化系统的前端交付。
        </p>
      </div>

      <div class="layout fade-up">
        <ol class="timeline">
          <li v-for="(t, i) in timeline" :key="t.period" :style="{ animationDelay: `${i * 110}ms` }">
            <span class="node"></span>
            <span class="period">{{ t.period }}</span>
            <h3>{{ t.title }}</h3>
            <p>{{ t.desc }}</p>
          </li>
        </ol>

        <aside class="side glass">
          <div class="idcard">
            <div class="avatar-wrap">
              <span class="avatar-glow" aria-hidden="true"></span>
              <span class="avatar-ring" aria-hidden="true"></span>
              <img
                class="avatar"
                :src="avatarUrl"
                :alt="`${profile.name} · ${profile.title}`"
                width="640"
                height="640"
                loading="lazy"
                decoding="async"
              />
              <span class="avatar-shade" aria-hidden="true"></span>
            </div>
            <h3 class="idname">
              {{ profile.name }}
              <span class="en">{{ profile.enName }}</span>
            </h3>
            <p class="idtitle">{{ profile.title }}</p>
            <span class="idstatus"><i class="dot" aria-hidden="true"></i>求职中 · 可到岗</span>
          </div>

          <dl>
            <div><dt>方向</dt><dd>{{ profile.badge }}</dd></div>
            <div><dt>城市</dt><dd>{{ profile.contact.location }}（不接受异地）</dd></div>
            <div><dt>手机 / 微信</dt><dd class="mono">{{ profile.contact.phone }}</dd></div>
            <div><dt>邮箱</dt><dd class="mono">{{ profile.contact.email }}</dd></div>
          </dl>
          <p class="note">
            项目经历多在涉密或内部环境，对外演示受限。面试时可就架构取舍、框架二开细节与现场交付经验做深入交流。
          </p>
        </aside>
      </div>
    </div>
  </section>
</template>

<style scoped>
.about {
  scroll-margin-top: 68px;
}

.layout {
  margin-top: 44px;
  display: grid;
  grid-template-columns: 1.25fr 0.75fr;
  gap: 40px;
  align-items: start;
}

.timeline {
  position: relative;
  padding-left: 30px;
}

.timeline::before {
  content: '';
  position: absolute;
  left: 5px;
  top: 6px;
  bottom: 6px;
  width: 1px;
  background: linear-gradient(to bottom, rgba(34, 211, 238, 0.6), rgba(139, 124, 240, 0.25), transparent);
}

.timeline li {
  position: relative;
  padding-bottom: 30px;
  animation: itemIn 0.6s cubic-bezier(0.22, 1, 0.36, 1) backwards;
}

@keyframes itemIn {
  from {
    opacity: 0;
    transform: translateX(-12px);
  }
  to {
    opacity: 1;
    transform: none;
  }
}

.node {
  position: absolute;
  left: -30px;
  top: 7px;
  width: 11px;
  height: 11px;
  border-radius: 50%;
  background: var(--bg);
  border: 2px solid var(--accent);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.timeline li:hover .node {
  transform: scale(1.25);
  box-shadow: 0 0 0 5px rgba(34, 211, 238, 0.14);
}

.period {
  font-size: 12px;
  letter-spacing: 0.06em;
  color: var(--accent);
  font-family: var(--mono);
}

.timeline h3 {
  margin-top: 4px;
  font-size: 16.5px;
}

.timeline p {
  margin-top: 6px;
  font-size: 13.5px;
  line-height: 1.75;
  color: var(--text-mute);
}

.side {
  padding: 24px;
  position: sticky;
  top: 92px;
}

/* ---- 头像区（档案卡顶部） ---- */
.idcard {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding-bottom: 20px;
  border-bottom: 1px solid var(--border);
}

.avatar-wrap {
  position: relative;
  width: 150px;
  height: 150px;
}

/* 头像下的青色光晕，让白底证件照与暗色卡片之间有过渡 */
.avatar-glow {
  position: absolute;
  inset: 8px;
  border-radius: 50%;
  background: radial-gradient(
    circle at 50% 64%,
    rgba(34, 211, 238, 0.42),
    rgba(139, 124, 240, 0.18) 56%,
    transparent 74%
  );
  filter: blur(13px);
  opacity: 0.85;
  transition: opacity 0.4s ease;
}

/* 缓慢旋转的渐变光圈 */
.avatar-ring {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: conic-gradient(
    from 0deg,
    transparent 0deg,
    var(--accent) 80deg,
    var(--accent-2) 165deg,
    transparent 255deg,
    transparent 360deg
  );
  -webkit-mask: radial-gradient(farthest-side, transparent calc(100% - 3px), #000 calc(100% - 2px));
  mask: radial-gradient(farthest-side, transparent calc(100% - 3px), #000 calc(100% - 2px));
  animation: spinRing 9s linear infinite;
}

@keyframes spinRing {
  to {
    transform: rotate(1turn);
  }
}

.avatar {
  position: absolute;
  inset: 5px;
  width: calc(100% - 10px);
  height: calc(100% - 10px);
  border-radius: 50%;
  object-fit: cover;
  background: #0b1020;
  box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.14), 0 14px 32px rgba(0, 0, 0, 0.45);
  transition: transform 0.45s cubic-bezier(0.22, 1, 0.36, 1);
}

/* 极轻的暗角，压一下白底亮度，避免头像在暗色卡片里过于突兀 */
.avatar-shade {
  position: absolute;
  inset: 5px;
  border-radius: 50%;
  pointer-events: none;
  background: radial-gradient(
    circle at 50% 36%,
    rgba(5, 8, 16, 0) 48%,
    rgba(5, 8, 16, 0.24) 100%
  );
}

.avatar-wrap:hover .avatar {
  transform: scale(1.035);
}

.avatar-wrap:hover .avatar-glow {
  opacity: 1;
}

.idname {
  margin-top: 20px;
  padding: 0;
  border: 0;
  font-size: 19px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
}

.idname .en {
  font-family: var(--mono);
  font-size: 10.5px;
  font-weight: 400;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--text-mute);
}

.idtitle {
  margin-top: 10px;
  font-size: 13.5px;
  color: var(--text-dim);
}

.idstatus {
  margin-top: 13px;
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 5px 12px;
  border-radius: 999px;
  font-size: 12px;
  color: var(--accent);
  background: rgba(34, 211, 238, 0.08);
  border: 1px solid rgba(34, 211, 238, 0.22);
}

.idstatus .dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--accent);
  animation: pingDot 2.4s ease-out infinite;
}

@keyframes pingDot {
  0% {
    box-shadow: 0 0 0 0 rgba(34, 211, 238, 0.55);
  }
  70% {
    box-shadow: 0 0 0 7px rgba(34, 211, 238, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(34, 211, 238, 0);
  }
}

dl {
  margin: 0;
}

dl div {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px dashed rgba(255, 255, 255, 0.07);
}

dt {
  font-size: 12.5px;
  color: var(--text-mute);
  flex-shrink: 0;
}

dd {
  margin: 0;
  font-size: 13px;
  text-align: right;
}

.mono {
  font-family: var(--mono);
  font-size: 12.5px;
}

.note {
  margin-top: 16px;
  font-size: 12.5px;
  line-height: 1.7;
  color: var(--text-mute);
  padding: 12px 14px;
  border-radius: 10px;
  background: rgba(34, 211, 238, 0.06);
  border: 1px solid rgba(34, 211, 238, 0.18);
}

@media (prefers-reduced-motion: reduce) {
  .avatar-ring,
  .idstatus .dot {
    animation: none;
  }
}

@media (max-width: 900px) {
  .layout {
    grid-template-columns: 1fr;
  }
  .side {
    position: static;
  }
}
</style>
