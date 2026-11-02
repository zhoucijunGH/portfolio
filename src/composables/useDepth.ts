/**
 * 背景深浅（星野浓度）控制
 *
 * 三档：deep 深空 / normal 标准 / bright 明亮
 * 通过在 <html data-depth="..."> 上切换，配合 global.css 里的变量
 * 改变底色、星云浓度、星野亮度与铜鼓透明度。
 * 状态写入 localStorage，index.html 里有同步脚本避免首屏闪烁。
 */
import { ref, watch } from 'vue'

export type DepthLevel = 'deep' | 'normal' | 'bright'

export const DEPTH_ORDER: DepthLevel[] = ['deep', 'normal', 'bright']

export const DEPTH_LABEL: Record<DepthLevel, string> = {
  deep: '深空',
  normal: '标准',
  bright: '明亮'
}

export const DEPTH_HINT: Record<DepthLevel, string> = {
  deep: '最深沉的底色，星野若隐若现',
  normal: '默认观感，星空与算力节点完整',
  bright: '底色更亮，星野与铜鼓纹样更清晰'
}

const KEY = 'zcj:bg-depth'

function readStored(): DepthLevel {
  try {
    const v = localStorage.getItem(KEY)
    if (v && (DEPTH_ORDER as string[]).includes(v)) return v as DepthLevel
  } catch {
    /* localStorage 不可用（隐私模式等）时忽略 */
  }
  return 'normal'
}

function apply(level: DepthLevel) {
  if (typeof document !== 'undefined') {
    document.documentElement.setAttribute('data-depth', level)
  }
}

export const depth = ref<DepthLevel>(readStored())
apply(depth.value)

watch(depth, (level) => {
  apply(level)
  try {
    localStorage.setItem(KEY, level)
  } catch {
    /* 忽略写入失败 */
  }
})

/** 设置到指定档位 */
export function setDepth(level: DepthLevel) {
  depth.value = level
}

/** 按顺序切换到下一档 */
export function nextDepth() {
  const i = DEPTH_ORDER.indexOf(depth.value)
  depth.value = DEPTH_ORDER[(i + 1) % DEPTH_ORDER.length]
}

export function useDepth() {
  return { depth, nextDepth, setDepth }
}
