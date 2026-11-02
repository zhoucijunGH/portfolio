import { ref } from 'vue'

/**
 * 咨询面板的全局开关。
 * 悬浮按钮、Hero、CTA 横幅等多处都要能打开同一个面板，
 * 所以把「是否打开」提到模块级，避免层层传 props / emit。
 */
const open = ref(false)
/** 打开来源，留给统计用（例如 hero / cta / float） */
const source = ref('float')

export function useConsult() {
  const openConsult = (from = 'float') => {
    source.value = from
    open.value = true
  }
  const closeConsult = () => {
    open.value = false
  }
  return { open, source, openConsult, closeConsult }
}
