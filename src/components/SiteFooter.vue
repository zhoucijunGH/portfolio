<script setup lang="ts">
import { ref } from 'vue'
import { profile } from '@/data/portfolio'
import { useRouter } from 'vue-router'

const year = new Date().getFullYear()

/** ICP 备案号：备案通过后填进来（如「桂ICP备2026xxxxxx号」），没备案时留空即不显示 */
const ICP_NO = ''
const router = useRouter()
const copied = ref('')

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
  window.setTimeout(() => (copied.value = ''), 1600)
}

const nav = [
  { label: '首页', to: '/' },
  { label: '技术服务', to: '/#services' },
  { label: '作品集', to: '/portfolio' },
  { label: '关于我', to: '/#about' }
]

function go(to: string) {
  const [path, hash] = to.split('#')
  if (hash) {
    router.push('/').then(() =>
      window.setTimeout(() => {
        document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth' })
      }, 120)
    )
  } else {
    router.push(path)
  }
}
</script>

<template>
  <footer class="footer">
    <div class="container">
      <div class="cols">
        <div class="col brand-col">
          <div class="brand">
            <span class="brand-mark">周</span>
            <div class="brand-text">
              <strong>周赐骏</strong>
              <em>ZHOU CIJUN · 前端 / 全栈</em>
            </div>
          </div>
          <p class="slogan">深耕政务 / 水利 / 金融 / 运营商行业信息化 7 年+，提供需求分析、系统设计、全栈研发、驻场交付与长期运维的全周期技术服务。</p>
        </div>

        <div class="col">
          <h4>快捷导航</h4>
          <ul>
            <li v-for="n in nav" :key="n.label">
              <a href="javascript:void(0)" @click="go(n.to)">{{ n.label }}</a>
            </li>
          </ul>
        </div>

        <div class="col">
          <h4>核心服务</h4>
          <ul>
            <li>Web 应用研发</li>
            <li>数据可视化大屏</li>
            <li>框架迁移与重构</li>
            <li>驻场交付与运维</li>
          </ul>
        </div>

        <div class="col">
          <h4>联系方式</h4>
          <ul>
            <li>
              <a href="javascript:void(0)" @click="copy(profile.contact.phone.replace(/-/g, ''), 'phone')">
                {{ profile.contact.phone }}
                <span class="copy-tip">{{ copied === 'phone' ? '已复制' : '复制' }}</span>
              </a>
            </li>
            <li>
              <a href="javascript:void(0)" @click="copy(profile.contact.email, 'email')">
                {{ profile.contact.email }}
                <span class="copy-tip">{{ copied === 'email' ? '已复制' : '复制' }}</span>
              </a>
            </li>
            <li>{{ profile.contact.location }}</li>
          </ul>
        </div>
      </div>

      <div class="bottom">
        <span>© {{ year }} 周赐骏 · 保留所有权利</span>
        <span>支持远程协作 · 南宁本地可驻场</span>
        <!-- TODO: 备案通过后把下面的备案号换成真实号，并加上链接 -->
        <a
          v-if="ICP_NO"
          class="icp"
          href="https://beian.miit.gov.cn/"
          target="_blank"
          rel="noopener"
          >{{ ICP_NO }}</a
        >
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  background: #101a30;
  color: #94a0b8;
  padding: 56px 0 0;
  margin-top: 0;
}

.cols {
  display: grid;
  grid-template-columns: 1.6fr 0.8fr 1fr 1.1fr;
  gap: 36px;
  padding-bottom: 44px;
}

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
  color: #fff;
  font-size: 14px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
}

.brand-text strong {
  display: block;
  color: #e9edf7;
  font-size: 16px;
}

.brand-text em {
  display: block;
  font-style: normal;
  font-size: 10.5px;
  letter-spacing: 0.18em;
  color: #6b7793;
}

.slogan {
  margin-top: 16px;
  font-size: 13px;
  line-height: 1.9;
  max-width: 340px;
}

.col h4 {
  color: #e9edf7;
  font-size: 14px;
  margin-bottom: 14px;
}

.col ul li {
  padding: 5px 0;
  font-size: 13.5px;
}

.col ul a {
  color: #94a0b8;
  transition: color 0.2s ease;
}

.col ul a:hover {
  color: #fff;
}

.copy-tip {
  margin-left: 8px;
  font-size: 11px;
  color: var(--accent-2);
}

.bottom {
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  padding: 18px 0 22px;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 8px;
  font-size: 12.5px;
  color: #6b7793;
}

@media (max-width: 860px) {
  .cols {
    grid-template-columns: 1fr 1fr;
  }
}
</style>
