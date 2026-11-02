<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import { profile } from '@/data/portfolio'
import { useConsult } from '@/composables/useConsult'
import { trackEvent } from '@/utils/analytics'

const { open, source, openConsult, closeConsult } = useConsult()

/** 咨询接口：云函数 HTTP 地址，未配置时退化为「只展示联系方式」 */
const API = import.meta.env.VITE_CONSULT_API || ''

type Msg = { id: number; from: 'bot' | 'me'; text: string }
let seq = 0
const mk = (from: Msg['from'], text: string): Msg => ({ id: ++seq, from, text })

const messages = ref<Msg[]>([
  mk('bot', '你好，我是周赐骏的小助手 👋\n先聊聊你想做什么系统？常见问题我能直接答，需要细聊的留个联系方式，我看到就回。')
])

const QUICK = ['怎么收费？', '能驻场吗？', '做过哪些项目？', '多久能上线？', '涉密项目能做吗？']

/**
 * 机器人知识库：关键词命中即回复。
 * 想改口径直接改这里，不需要动逻辑。
 */
const FAQ: { keys: string[]; reply: string }[] = [
  {
    keys: ['报价', '多少钱', '价格', '预算', '费用', '收费', '贵'],
    reply:
      '报价按工作量算，给你个区间先心里有数：\n· 小工具 / 单页应用：3 千 ~ 8 千\n· 后台管理系统（10~20 个功能页）：2 万 ~ 5 万\n· 数据可视化大屏：1.5 万起\n· 长期驻场 / 人月：1.5 万 ~ 2.5 万/月\n\n需求说个大概（几个角色、几个模块、有没有现成接口），我半小时内能给出靠谱估价。'
  },
  {
    keys: ['周期', '多久', '工期', '时间', '什么时候', '上线'],
    reply:
      '常规节奏：\n· 小工具：1~2 周\n· 中等管理系统：4~6 周\n· 大屏 / 一张图：3~5 周\n\n我习惯两周一版可演示的进度给你看，不搞"最后一个月才见东西"。急活可以排优先级，先上核心流程。'
  },
  {
    keys: ['驻场', '现场', '上门', '南宁', '广西', '本地', '出差'],
    reply:
      `我常驻${profile.contact.location}，广西区内（南宁、柳州、桂林、玉林等）都可以驻场，区内出差当天可达。\n驻场这几年是常态——省级政务平台、大藤峡水利工程都是长期在现场，需求沟通、进度汇报、现场排查一条龙。`
  },
  {
    keys: ['远程', '异地', '线上', '外地'],
    reply:
      '远程完全没问题。日常用企业微信 / 腾讯会议同步，代码走 Git 每日提交，每周一份进度说明。\n需要集中沟通的关键节点（需求评审、上线保障）可以飞过去几天。'
  },
  {
    keys: ['涉密', '保密', '安全', '合规', '内网'],
    reply:
      '省级涉密政务系统交付过多个，保密流程熟：\n· 可签保密协议，资料不出内网\n· 内网 / 离线环境开发部署有经验（国产数据库、信创环境适配）\n· 需要驻场或指定场所办公都可以配合'
  },
  {
    keys: ['技术', '框架', 'vue', 'react', 'angular', '前端', '栈', 'uni-app', '小程序'],
    reply:
      '主力技术栈：\n· 前端：Vue2 / Vue3 + TypeScript、Element Plus、ECharts、OpenLayers\n· 移动端：uni-app 一套代码多端（小程序 / H5 / App）\n· 后端协作：Spring Boot、若依 RuoYi 生态深度二次开发\n· 数据库：MySQL、达梦 / 人大金仓等国产库适配\n\n老系统改造也接：AngularJS → Vue、SAPUI5 → Vue 都做过完整迁移。'
  },
  {
    keys: ['案例', '作品', '做过', '经验', '项目', '业绩'],
    reply:
      `作品集里能看到对外可展示的部分（部分涉密项目只放了脱敏说明）。\n典型几类：省级政务一体化平台与「智桂通」H5、大藤峡水利枢纽智慧园区、银行内控系统、高标准农田上图核查一张图、果账通收购结算系统。\n\n点「浏览作品集」可以看完整列表，也可以直接问我"有没有做过××类系统"。`
  },
  {
    keys: ['维护', '售后', '运维', '保障', '稳定'],
    reply:
      '上线不是终点。默认交付含 1~3 个月免费质保期（bug 随叫随到），之后可以签年度运维：\n· 月度巡检 + 小需求迭代\n· 紧急问题 2 小时内响应\n· 服务器 / 域名 / 证书到期提醒'
  },
  {
    keys: ['合同', '发票', '公司', '个人', '资质', '结算'],
    reply:
      '目前以个人身份承接，可以签技术服务合同、走对公转账；发票可由合作单位代开或在税务窗口代开。\n如果你们要求必须是公司主体签，我也有长期合作的测绘 / 软件公司可以一起报，不影响交付质量。'
  },
  {
    keys: ['大屏', '可视化', 'echarts', '图表', 'gis', '地图', '一张图'],
    reply:
      '这块是强项：数据大屏、GIS 一张图都做过上线项目。\n· ECharts / OpenLayers 可视化（图斑、管网、船舶轨迹、指标看板）\n· 支持天地图、ArcGIS、自建瓦片等多种底图\n· 大屏适配 1920 起，也能做移动端自适应\n\n需要的话我可以先出个静态 demo 给你确认风格，再谈正式开发。'
  },
  {
    keys: ['联系', '电话', '微信', '怎么找', '联系方式', '号码', '邮件', '邮箱'],
    reply: `最直接的联系方式：\n· 手机 / 微信：${profile.contact.phone}\n· 邮箱：${profile.contact.email}\n\n也可以直接在下面留个联系方式，我看到就回（半夜的留言第二天一早处理）。`
  }
]

const FALLBACK =
  '这个得再问细一点才敢给你结论。\n你把联系方式留下、简单说两句需求，我一般 1 小时内回复；急的话直接打电话更快。'

const input = ref('')
const showForm = ref(false)
const submitting = ref(false)
const submitted = ref(false)
const unmatched = ref(0)

const form = ref({
  name: '',
  org: '',
  contact: '',
  needType: '新系统开发',
  budget: '还没定',
  message: '',
  website: '' // 蜜罐字段：正常用户看不到，机器人填了就静默丢弃
})

const NEED_TYPES = ['新系统开发', '系统二开 / 改造', '前端外包', '数据大屏 / 一张图', '小程序 / App', '驻场人力', '其他']
const BUDGETS = ['1 万以内', '1-3 万', '3-5 万', '5-10 万', '10 万以上', '还没定']

const scroller = ref<HTMLElement | null>(null)
const canSend = computed(() => input.value.trim().length > 0)

async function scrollToBottom() {
  await nextTick()
  if (scroller.value) scroller.value.scrollTop = scroller.value.scrollHeight
}

/** 关键词匹配：命中返回预设答案，不命中返回空 */
function match(text: string) {
  const q = text.toLowerCase()
  for (const item of FAQ) {
    if (item.keys.some((k) => q.includes(k))) return item.reply
  }
  return ''
}

function replyOf(text: string) {
  const hit = match(text)
  if (hit) {
    unmatched.value = 0
    return hit
  }
  unmatched.value += 1
  // 连续两次没答上来就直接给留资入口，别让人觉得在跟机器人绕圈子
  const tail = unmatched.value >= 1 ? '\n\n也可以直接在下面填一下，我看到了就联系你。' : ''
  return FALLBACK + tail
}

function ask(question: string) {
  if (!question.trim()) return
  messages.value.push(mk('me', question))
  input.value = ''
  const answer = replyOf(question)
  messages.value.push(mk('bot', answer))
  if (unmatched.value >= 1) showForm.value = true
  scrollToBottom()
}

function onEnter(e: KeyboardEvent) {
  if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') return send()
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    send()
  }
}

function send() {
  if (!canSend.value) return
  ask(input.value)
}

async function submit() {
  if (submitting.value) return
  const contact = form.value.contact.trim()
  const message = form.value.message.trim()
  if (contact.length < 5) {
    messages.value.push(mk('bot', '联系方式还差点意思，手机号或微信号留一个吧 😄'))
    scrollToBottom()
    return
  }
  if (message.length < 5) {
    messages.value.push(mk('bot', '需求再写两句，我好判断能不能接、怎么报价。'))
    scrollToBottom()
    return
  }

  submitting.value = true
  try {
    if (!API) throw new Error('no-api')
    const res = await fetch(`${API}/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: form.value.name.trim(),
        org: form.value.org.trim(),
        contact,
        need_type: form.value.needType,
        budget: form.value.budget,
        message,
        page: location.href,
        website: form.value.website
      })
    })
    const data = await res.json()
    if (!res.ok || !data.ok) throw new Error(data.error || 'failed')
    trackEvent('consult', 'submit', source.value)
    submitted.value = true
    showForm.value = false
    messages.value.push(
      mk(
        'bot',
        `收到了，谢谢！我看到了会尽快回复你（一般 1 小时内，半夜的留言第二天一早处理）。\n急的话直接打 ${profile.contact.phone}，微信同号。`
      )
    )
  } catch (e) {
    messages.value.push(
      mk(
        'bot',
        `提交没成功（可能是网络问题）。你可以直接联系我，更快：\n· 手机 / 微信：${profile.contact.phone}\n· 邮箱：${profile.contact.email}`
      )
    )
  } finally {
    submitting.value = false
    scrollToBottom()
  }
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') closeConsult()
}

watch(open, (v) => {
  if (v) {
    document.body.style.overflow = 'hidden'
    scrollToBottom()
  } else {
    document.body.style.overflow = ''
  }
})
</script>

<template>
  <!-- 悬浮入口 -->
  <button class="fab" :class="{ hide: open }" @click="openConsult('float')">
    <span class="fab-dot"></span>
    <span class="fab-text">聊聊需求</span>
  </button>

  <Teleport to="body">
    <div v-if="open" class="mask" @click.self="closeConsult" @keydown="onKeydown">
      <section class="panel" role="dialog" aria-label="咨询对话框" tabindex="-1">
        <header class="p-head">
          <div class="who">
            <span class="who-av">{{ profile.name.slice(0, 1) }}</span>
            <div>
              <p class="who-name">周赐骏的小助手</p>
              <p class="who-state"><i class="dot"></i>在线 · 通常 1 小时内回复</p>
            </div>
          </div>
          <button class="close" aria-label="关闭" @click="closeConsult">×</button>
        </header>

        <div ref="scroller" class="p-body">
          <div v-for="m in messages" :key="m.id" class="msg" :class="m.from">
            <span class="ava">{{ m.from === 'bot' ? profile.name.slice(0, 1) : '你' }}</span>
            <p class="bubble">{{ m.text }}</p>
          </div>

          <div v-if="!showForm && !submitted" class="quick">
            <button v-for="q in QUICK" :key="q" class="q" @click="ask(q)">{{ q }}</button>
          </div>

          <form v-if="showForm && !submitted" class="cform" @submit.prevent="submit">
            <p class="form-tip">留个联系方式，我直接联系你</p>
            <div class="row">
              <input v-model="form.name" placeholder="怎么称呼（选填）" maxlength="40" />
              <input v-model="form.org" placeholder="单位（选填）" maxlength="80" />
            </div>
            <input v-model="form.contact" class="req" placeholder="手机号 / 微信号 *" maxlength="60" />
            <div class="row">
              <select v-model="form.needType">
                <option v-for="t in NEED_TYPES" :key="t" :value="t">{{ t }}</option>
              </select>
              <select v-model="form.budget">
                <option v-for="b in BUDGETS" :key="b" :value="b">{{ b }}</option>
              </select>
            </div>
            <textarea
              v-model="form.message"
              rows="3"
              maxlength="1500"
              placeholder="简单说下想做什么：几个角色、主要功能、有没有现成接口或老系统 *"
            ></textarea>
            <!-- 蜜罐：真人看不到，机器人填了后台直接丢弃 -->
            <input v-model="form.website" class="hp" tabindex="-1" autocomplete="off" placeholder="website" />
            <button class="submit" type="submit" :disabled="submitting">
              {{ submitting ? '发送中…' : '发送，等我联系你' }}
            </button>
            <p class="priv">只用于本次沟通，不会外传</p>
          </form>
        </div>

        <footer v-if="!showForm || submitted" class="p-foot">
          <input
            v-model="input"
            :placeholder="submitted ? '还有想问的可以继续问…' : '说说你的需求，或直接问报价 / 周期'"
            @keydown="onEnter"
          />
          <button class="send" :disabled="!canSend" @click="send">发送</button>
        </footer>
      </section>
    </div>
  </Teleport>
</template>

<style scoped>
.fab {
  position: fixed;
  right: 22px;
  bottom: 22px;
  z-index: 60;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 11px 18px;
  border: 1px solid transparent;
  border-radius: 999px;
  background: var(--accent);
  color: var(--accent-contrast, #fff);
  font-size: 13.5px;
  cursor: pointer;
  box-shadow: 0 12px 28px -12px var(--accent-shadow);
  transition: transform 0.25s ease, opacity 0.2s ease;
}
.fab:hover {
  transform: translateY(-2px);
}
.fab.hide {
  opacity: 0;
  pointer-events: none;
}
.fab-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: currentColor;
  animation: fabPing 2.2s ease-out infinite;
}
@keyframes fabPing {
  0% { box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.55); }
  70% { box-shadow: 0 0 0 8px rgba(255, 255, 255, 0); }
  100% { box-shadow: 0 0 0 0 rgba(255, 255, 255, 0); }
}

.mask {
  position: fixed;
  inset: 0;
  z-index: 70;
  background: rgba(12, 18, 32, 0.42);
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
  padding: 22px;
  animation: fadeIn 0.2s ease;
}
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.panel {
  width: 392px;
  max-width: 100%;
  height: min(620px, calc(100vh - 44px));
  display: flex;
  flex-direction: column;
  background: var(--panel, #fff);
  border: 1px solid var(--border, #e6eaf2);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 28px 60px -24px rgba(12, 18, 32, 0.4);
  animation: rise 0.24s cubic-bezier(0.22, 1, 0.36, 1);
}
@keyframes rise {
  from { opacity: 0; transform: translateY(18px); }
  to { opacity: 1; transform: none; }
}

.p-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px;
  border-bottom: 1px solid var(--border, #e6eaf2);
  background: var(--panel-soft, #f8fafd);
}
.who {
  display: flex;
  align-items: center;
  gap: 10px;
}
.who-av {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  font-size: 14px;
  font-weight: 500;
  color: var(--accent-contrast, #fff);
  background: linear-gradient(135deg, var(--accent), var(--accent-2));
}
.who-name {
  margin: 0;
  font-size: 14px;
  font-weight: 500;
}
.who-state {
  margin: 2px 0 0;
  font-size: 11.5px;
  color: var(--text-mute, #8a93a8);
  display: flex;
  align-items: center;
  gap: 5px;
}
.who-state .dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #22c55e;
}
.close {
  border: none;
  background: transparent;
  font-size: 22px;
  line-height: 1;
  color: var(--text-mute, #8a93a8);
  cursor: pointer;
}

.p-body {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.msg {
  display: flex;
  gap: 8px;
  align-items: flex-start;
}
.msg.me {
  flex-direction: row-reverse;
}
.ava {
  flex-shrink: 0;
  width: 26px;
  height: 26px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  font-size: 11.5px;
  background: var(--accent-soft, #e8efff);
  color: var(--accent);
}
.bubble {
  margin: 0;
  max-width: 82%;
  padding: 10px 13px;
  border-radius: 12px;
  font-size: 13px;
  line-height: 1.75;
  white-space: pre-line;
  background: var(--bg-soft, #f5f7fb);
  color: var(--text, #1a2333);
}
.msg.me .bubble {
  background: var(--accent);
  color: var(--accent-contrast, #fff);
}

.quick {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 2px;
}
.q {
  border: 1px solid var(--border, #e6eaf2);
  background: var(--panel, #fff);
  color: var(--text-dim, #5a6478);
  border-radius: 999px;
  padding: 5px 11px;
  font-size: 12px;
  cursor: pointer;
  transition: border-color 0.2s ease, color 0.2s ease;
}
.q:hover {
  border-color: var(--accent);
  color: var(--accent);
}

.cform {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 12px;
  border: 1px solid var(--border, #e6eaf2);
  border-radius: 12px;
  background: var(--panel-soft, #f8fafd);
}
.form-tip {
  margin: 0;
  font-size: 12px;
  color: var(--accent);
}
.cform .row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}
.cform input,
.cform select,
.cform textarea {
  width: 100%;
  font: inherit;
  font-size: 12.5px;
  padding: 8px 10px;
  border: 1px solid var(--border, #e6eaf2);
  border-radius: 8px;
  background: var(--panel, #fff);
  color: var(--text, #1a2333);
}
.cform textarea {
  resize: vertical;
  line-height: 1.6;
}
.cform .req {
  border-color: var(--accent);
}
.cform .hp {
  position: absolute;
  left: -9999px;
  width: 1px;
  height: 1px;
  opacity: 0;
}
.submit {
  border: none;
  border-radius: 8px;
  padding: 10px;
  font-size: 13px;
  cursor: pointer;
  color: var(--accent-contrast, #fff);
  background: var(--accent);
  transition: opacity 0.2s ease;
}
.submit:disabled {
  opacity: 0.6;
  cursor: progress;
}
.priv {
  margin: 0;
  font-size: 11px;
  color: var(--text-mute, #8a93a8);
  text-align: center;
}

.p-foot {
  display: flex;
  gap: 8px;
  padding: 12px;
  border-top: 1px solid var(--border, #e6eaf2);
}
.p-foot input {
  flex: 1;
  font: inherit;
  font-size: 13px;
  padding: 9px 12px;
  border: 1px solid var(--border, #e6eaf2);
  border-radius: 999px;
  background: var(--bg-soft, #f5f7fb);
  color: var(--text, #1a2333);
}
.send {
  border: none;
  border-radius: 999px;
  padding: 0 16px;
  font-size: 13px;
  cursor: pointer;
  color: var(--accent-contrast, #fff);
  background: var(--accent);
}
.send:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

@media (max-width: 560px) {
  .mask {
    padding: 0;
  }
  .panel {
    width: 100%;
    height: 100%;
    border-radius: 0;
    border: none;
  }
  .fab-text {
    display: none;
  }
  .fab {
    right: 16px;
    bottom: 16px;
    padding: 12px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .fab-dot,
  .mask,
  .panel {
    animation: none;
  }
}
</style>
