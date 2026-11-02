<script setup lang="ts">
import { onMounted, ref } from 'vue'

/**
 * 留言管理页（手机浏览器直接打开即可）。
 * 口令不写进代码，输对后存本地，下次免输入；接口在云函数里二次校验。
 */
const API = import.meta.env.VITE_CONSULT_API || ''
const KEY_STORE = 'consult-admin-key'

type Row = {
  id: number
  name: string
  org: string
  contact: string
  need_type: string
  budget: string
  message: string
  page: string
  handled: boolean
  created_at: string
}

const key = ref(localStorage.getItem(KEY_STORE) || '')
const rows = ref<Row[]>([])
const loading = ref(false)
const authed = ref(false)
const error = ref('')
const keyword = ref('')
const onlyNew = ref(false)

async function call<T = any>(payload: Record<string, unknown>) {
  if (!API) throw new Error('未配置 VITE_CONSULT_API')
  const res = await fetch(`${API}/admin`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ key: key.value, ...payload })
  })
  const data = await res.json()
  if (!res.ok || !data.ok) throw new Error(data.error || '请求失败')
  return data as T
}

async function load() {
  loading.value = true
  error.value = ''
  try {
    const data = await call<{ rows: Row[] }>({ action: 'list', limit: 200 })
    rows.value = data.rows || []
    authed.value = true
    localStorage.setItem(KEY_STORE, key.value)
  } catch (e: any) {
    authed.value = false
    error.value = e.message || '加载失败'
    localStorage.removeItem(KEY_STORE)
  } finally {
    loading.value = false
  }
}

async function toggle(row: Row) {
  try {
    await call({ action: 'handled', id: row.id, value: !row.handled })
    row.handled = !row.handled
  } catch (e: any) {
    error.value = e.message
  }
}

async function remove(row: Row) {
  if (!confirm(`删除 ${row.contact} 的这条留言？`)) return
  try {
    await call({ action: 'delete', id: row.id })
    rows.value = rows.value.filter((r) => r.id !== row.id)
  } catch (e: any) {
    error.value = e.message
  }
}

function logout() {
  localStorage.removeItem(KEY_STORE)
  authed.value = false
  key.value = ''
  rows.value = []
}

const visible = () => {
  const k = keyword.value.trim().toLowerCase()
  return rows.value.filter((r) => {
    if (onlyNew.value && r.handled) return false
    if (!k) return true
    return [r.name, r.org, r.contact, r.message, r.need_type].join(' ').toLowerCase().includes(k)
  })
}

function fmt(iso: string) {
  const d = new Date(iso)
  const p = (n: number) => String(n).padStart(2, '0')
  return `${d.getMonth() + 1}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`
}

onMounted(() => {
  if (key.value) load()
})
</script>

<template>
  <main class="wrap">
    <header class="top">
      <h1>留言管理</h1>
      <button v-if="authed" class="link" @click="logout">退出</button>
    </header>

    <form v-if="!authed" class="gate" @submit.prevent="load">
      <input v-model="key" type="password" placeholder="管理口令" autocomplete="current-password" />
      <button type="submit" :disabled="loading">{{ loading ? '校验中…' : '进入' }}</button>
      <p v-if="error" class="err">{{ error }}</p>
    </form>

    <template v-else>
      <div class="bar">
        <input v-model="keyword" placeholder="搜索姓名 / 单位 / 联系方式 / 内容" />
        <label class="chk"><input v-model="onlyNew" type="checkbox" /> 只看未处理</label>
        <button class="link" @click="load">刷新</button>
      </div>

      <p class="count">共 {{ visible().length }} 条 · 未处理 {{ rows.filter((r) => !r.handled).length }} 条</p>

      <ul class="list">
        <li v-for="r in visible()" :key="r.id" :class="{ done: r.handled }">
          <div class="r-head">
            <div>
              <b>{{ r.name || '未留姓名' }}</b>
              <span v-if="r.org" class="org">{{ r.org }}</span>
            </div>
            <span class="time">{{ fmt(r.created_at) }}</span>
          </div>
          <p class="contact">
            <a :href="`tel:${r.contact.replace(/\D/g, '')}`" v-if="/^\d{6,}$/.test(r.contact.replace(/\D/g, ''))">
              {{ r.contact }}
            </a>
            <span v-else>{{ r.contact }}</span>
            <em v-if="r.need_type">{{ r.need_type }}</em>
            <em v-if="r.budget">{{ r.budget }}</em>
          </p>
          <p class="msg">{{ r.message }}</p>
          <div class="ops">
            <button @click="toggle(r)">{{ r.handled ? '标为未处理' : '已联系' }}</button>
            <button class="del" @click="remove(r)">删除</button>
          </div>
        </li>
      </ul>

      <p v-if="!visible().length" class="empty">还没有留言</p>
    </template>
  </main>
</template>

<style scoped>
.wrap {
  max-width: 760px;
  margin: 0 auto;
  padding: 84px 18px 60px;
}
.top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 18px;
}
h1 {
  margin: 0;
  font-size: 19px;
  font-weight: 500;
}
.link {
  border: none;
  background: transparent;
  color: var(--accent);
  font-size: 13px;
  cursor: pointer;
}

.gate {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 20px;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  background: var(--panel);
}
.gate input,
.bar input {
  font: inherit;
  font-size: 13.5px;
  padding: 10px 12px;
  border: 1px solid var(--border);
  border-radius: 10px;
  background: var(--bg-soft);
  color: var(--text);
}
.gate button {
  border: none;
  border-radius: 10px;
  padding: 10px;
  font-size: 13.5px;
  color: var(--accent-contrast, #fff);
  background: var(--accent);
  cursor: pointer;
}
.err {
  margin: 0;
  font-size: 12.5px;
  color: #d33;
}

.bar {
  display: flex;
  gap: 10px;
  align-items: center;
  flex-wrap: wrap;
}
.bar input {
  flex: 1;
  min-width: 200px;
}
.chk {
  font-size: 12.5px;
  color: var(--text-dim);
  display: inline-flex;
  align-items: center;
  gap: 5px;
}
.count {
  margin: 14px 0 10px;
  font-size: 12.5px;
  color: var(--text-mute);
}

.list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.list li {
  border: 1px solid var(--border);
  border-left: 3px solid var(--accent);
  border-radius: var(--radius);
  padding: 14px 16px;
  background: var(--panel);
}
.list li.done {
  border-left-color: var(--border-hover);
  opacity: 0.72;
}
.r-head {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  align-items: baseline;
}
.r-head b {
  font-size: 14.5px;
  font-weight: 500;
}
.org {
  margin-left: 8px;
  font-size: 12.5px;
  color: var(--text-mute);
}
.time {
  font-size: 11.5px;
  color: var(--text-mute);
  font-family: var(--mono);
}
.contact {
  margin: 6px 0 0;
  font-size: 13px;
  color: var(--accent);
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: center;
}
.contact a {
  color: var(--accent);
  text-decoration: none;
  font-family: var(--mono);
}
.contact em {
  font-style: normal;
  font-size: 11.5px;
  color: var(--text-dim);
  background: var(--bg-soft);
  border: 1px solid var(--border);
  border-radius: 999px;
  padding: 2px 9px;
}
.msg {
  margin: 8px 0 0;
  font-size: 13px;
  line-height: 1.75;
  white-space: pre-line;
  color: var(--text-dim);
}
.ops {
  margin-top: 10px;
  display: flex;
  gap: 8px;
}
.ops button {
  border: 1px solid var(--border);
  background: var(--bg-soft);
  color: var(--text-dim);
  border-radius: 8px;
  padding: 5px 12px;
  font-size: 12px;
  cursor: pointer;
}
.ops .del:hover {
  border-color: #d33;
  color: #d33;
}
.empty {
  margin-top: 30px;
  text-align: center;
  font-size: 13px;
  color: var(--text-mute);
}
</style>
