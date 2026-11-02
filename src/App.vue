<script setup lang="ts">
import { onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import SiteHeader from '@/components/SiteHeader.vue'
import SiteFooter from '@/components/SiteFooter.vue'
import ConsultPanel from '@/components/ConsultPanel.vue'
import { useReveal } from '@/composables/useReveal'

const route = useRoute()
const router = useRouter()
const { refresh } = useReveal()

// 首次导航完成后再扫描一次。
// 关键：App 的 onMounted 早于 router-view 渲染出内容，
// 那时 DOM 里还没有 .fade-up 元素，扫不到就永远不会显示。
onMounted(async () => {
  await router.isReady()
  refresh()
})

watch(
  () => route.fullPath,
  () => {
    // 滚动位置统一交给 router 的 scrollBehavior 处理（含「返回作品集」的锚点定位），
    // 这里只需要重扫一次入场动画。
    refresh()
  }
)
</script>

<template>
  <SiteHeader />

  <!--
    ⚠️ mode="out-in" 要求被切换的组件根节点是「单个元素」。
    各 view 的模板必须保证根层级只有一个元素、且不能有顶层注释
    （开发模式下 Vue 会保留模板注释，会把根节点变成 Fragment，直接导致返回时白屏）。
  -->
  <router-view v-slot="{ Component }">
    <transition name="page" mode="out-in">
      <component :is="Component" />
    </transition>
  </router-view>

  <SiteFooter />

  <!-- 全站悬浮咨询面板（留言写进云函数，推送到微信） -->
  <ConsultPanel />
</template>

<style scoped>
.page-enter-active,
.page-leave-active {
  transition: opacity 0.32s ease, transform 0.32s ease;
}

.page-enter-from {
  opacity: 0;
  transform: translateY(14px);
}

.page-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
