<!--
  广西铜鼓纹样装饰组件
  参考广西出土铜鼓（冷水冲型 / 北流型）的鼓面构成，由外到内：
    边缘蛙塑 → 弦纹（同心凹槽）→ 乳钉纹 → 栉纹 → 云雷纹 → 太阳纹（十二芒）
  作为页面角标装饰使用，运行时缓慢自转。
-->
<script lang="ts">
// 模块级计数器：同页面渲染多个铜鼓时保证渐变 id 唯一
let seq = 0
</script>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    /** 自转一圈的秒数，传 0 表示不旋转 */
    spin?: number
    /** 反向旋转 */
    reverse?: boolean
  }>(),
  { spin: 72, reverse: false }
)

seq += 1
const gid = `drum${seq}`

const FROGS = 12 // 边缘蛙塑
const DOTS = 60 // 乳钉纹 / 栉纹单元数
const MOTIFS = 20 // 云雷纹单元
const RAYS = 12 // 太阳纹光芒数

const ring = (n: number) => Array.from({ length: n }, (_, i) => (i * 360) / n)
const frogAngles = computed(() => ring(FROGS))
const dotAngles = computed(() => ring(DOTS))
const motifAngles = computed(() => ring(MOTIFS))
const rayAngles = computed(() => ring(RAYS))

const spinStyle = computed(() =>
  props.spin > 0
    ? {
        animationDuration: `${props.spin}s`,
        animationDirection: props.reverse ? 'reverse' : 'normal'
      }
    : {}
)
</script>

<template>
  <svg
    class="drum-face"
    :class="{ spinning: spin > 0 }"
    :style="spinStyle"
    viewBox="0 0 200 200"
    role="presentation"
    aria-hidden="true"
  >
    <defs>
      <radialGradient :id="`${gid}-face`" cx="38%" cy="30%" r="82%">
        <stop offset="0%" stop-color="#e6c98e" />
        <stop offset="34%" stop-color="#bb8a3d" />
        <stop offset="68%" stop-color="#855923" />
        <stop offset="100%" stop-color="#4a3113" />
      </radialGradient>
      <linearGradient :id="`${gid}-rim`" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#f6e3b4" />
        <stop offset="45%" stop-color="#bb8a3d" />
        <stop offset="100%" stop-color="#6a4718" />
      </linearGradient>
    </defs>

    <!-- 鼓面基体 -->
    <circle cx="100" cy="100" r="99" :fill="`url(#${gid}-face)`" />

    <!-- 高光弧：模拟金属反光 -->
    <path
      d="M 32 58 A 84 84 0 0 1 170 80"
      fill="none"
      stroke="#fff3d0"
      stroke-opacity="0.15"
      stroke-width="7"
      stroke-linecap="round"
    />
    <path
      d="M 44 158 A 84 84 0 0 0 168 128"
      fill="none"
      stroke="#2b1b06"
      stroke-opacity="0.32"
      stroke-width="9"
      stroke-linecap="round"
    />

    <!-- 边缘一圈蛙塑（广西铜鼓标志） -->
    <g class="frogs">
      <g
        v-for="(a, i) in frogAngles"
        :key="`frog-${i}`"
        :transform="`rotate(${a} 100 100) translate(100 10)`"
      >
        <!-- 前肢（短、朝前） -->
        <path
          d="M-4.2,-2.4 C-6.6,-3.4 -7.4,-5.4 -6.8,-7.2"
          fill="none"
          stroke="#8d5f24"
          stroke-width="1.5"
          stroke-linecap="round"
        />
        <path
          d="M4.2,-2.4 C6.6,-3.4 7.4,-5.4 6.8,-7.2"
          fill="none"
          stroke="#8d5f24"
          stroke-width="1.5"
          stroke-linecap="round"
        />
        <!-- 后肢（长、蹬开） -->
        <path
          d="M-3.8,3.4 C-6.4,4.6 -7.4,7 -6,9.2"
          fill="none"
          stroke="#7d521d"
          stroke-width="1.5"
          stroke-linecap="round"
        />
        <path
          d="M3.8,3.4 C6.4,4.6 7.4,7 6,9.2"
          fill="none"
          stroke="#7d521d"
          stroke-width="1.5"
          stroke-linecap="round"
        />
        <!-- 身体 + 头 + 双眼 -->
        <ellipse cx="0" cy="0.5" rx="5" ry="6.4" fill="#a3702b" />
        <ellipse cx="0" cy="0.9" rx="2.6" ry="3.8" fill="#b98336" fill-opacity="0.65" />
        <circle cx="0" cy="-4.7" r="3.3" fill="#af7a2e" />
        <circle cx="-1.9" cy="-5.5" r="0.85" fill="#3d2a0d" />
        <circle cx="1.9" cy="-5.5" r="0.85" fill="#3d2a0d" />
      </g>
    </g>

    <!-- 弦纹：同心凹槽 -->
    <circle cx="100" cy="100" r="77" fill="none" stroke="#3f2a0d" stroke-opacity="0.42" stroke-width="1.3" />
    <circle cx="100" cy="100" r="74" fill="none" stroke="#f0d49a" stroke-opacity="0.2" stroke-width="0.8" />

    <!-- 乳钉纹 -->
    <g class="dots">
      <circle
        v-for="(a, i) in dotAngles"
        :key="`dot-${i}`"
        :transform="`rotate(${a} 100 100)`"
        cx="100"
        cy="30"
        r="1.4"
        fill="#f0d49a"
        fill-opacity="0.38"
      />
    </g>

    <!-- 栉纹 -->
    <g class="comb">
      <line
        v-for="(a, i) in dotAngles"
        :key="`comb-${i}`"
        :transform="`rotate(${a} 100 100)`"
        x1="100"
        y1="39"
        x2="100"
        y2="32"
        stroke="#432c0e"
        stroke-opacity="0.5"
        stroke-width="1.1"
      />
    </g>

    <circle cx="100" cy="100" r="58" fill="none" stroke="#3f2a0d" stroke-opacity="0.36" stroke-width="1.2" />
    <circle cx="100" cy="100" r="55.5" fill="none" stroke="#f0d49a" stroke-opacity="0.16" stroke-width="0.7" />

    <!-- 云雷纹 -->
    <g class="motifs">
      <g
        v-for="(a, i) in motifAngles"
        :key="`motif-${i}`"
        :transform="`rotate(${a} 100 100) translate(100 45) scale(1.35)`"
      >
        <path
          d="M-4,4 h8 v-8 h-6 v5 h3 v-2.5"
          fill="none"
          stroke="#4a310f"
          stroke-opacity="0.55"
          stroke-width="1"
          stroke-linejoin="miter"
        />
      </g>
    </g>

    <circle cx="100" cy="100" r="37" fill="none" stroke="#3f2a0d" stroke-opacity="0.4" stroke-width="1.2" />

    <!-- 太阳纹 -->
    <g class="sun">
      <g v-for="(a, i) in rayAngles" :key="`ray-${i}`" :transform="`rotate(${a} 100 100)`">
        <polygon points="100,85 102.8,64 97.2,64" fill="#2f1f08" fill-opacity="0.5" />
        <polygon points="100,85 102.2,65 98.6,65" fill="#f3d68f" fill-opacity="0.55" />
      </g>
      <circle cx="100" cy="100" r="15" fill="#b98336" fill-opacity="0.55" />
      <circle cx="100" cy="100" r="15" fill="none" stroke="#3f2a0d" stroke-opacity="0.45" stroke-width="1.1" />
      <circle cx="100" cy="100" r="7.5" fill="#f3d68f" fill-opacity="0.6" />
      <circle cx="100" cy="100" r="3" fill="#3f2a0d" fill-opacity="0.55" />
    </g>
  </svg>
</template>

<style scoped>
.drum-face {
  width: 100%;
  height: 100%;
  display: block;
  overflow: visible;
}

.drum-face.spinning {
  animation-name: drumSpin;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
  transform-origin: 50% 50%;
  will-change: transform;
}

@keyframes drumSpin {
  to {
    transform: rotate(360deg);
  }
}

@media (prefers-reduced-motion: reduce) {
  .drum-face.spinning {
    animation: none;
  }
}
</style>
