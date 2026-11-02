<script setup lang="ts">
const props = defineProps<{
  type:
    | 'saas'
    | 'gov'
    | 'water'
    | 'finance'
    | 'telecom'
    | 'infra'
    | 'miniapp'
    | 'retail'
    | 'supply'
    | 'ai'
    | 'query'
  accent: string
  label: string
}>()
</script>

<template>
  <div class="cover" :style="{ '--accent': props.accent }">
    <svg viewBox="0 0 400 150" preserveAspectRatio="xMidYMid slice" role="img" :aria-label="props.label">
      <defs>
        <linearGradient :id="`g-${props.type}`" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" :stop-color="props.accent" stop-opacity="0.34" />
          <stop offset="100%" :stop-color="props.accent" stop-opacity="0.04" />
        </linearGradient>
        <pattern id="grid" width="26" height="26" patternUnits="userSpaceOnUse">
          <path d="M26 0H0V26" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="1" />
        </pattern>
      </defs>

      <rect width="400" height="150" fill="url(#grid)" />

      <template v-if="props.type === 'saas'">
        <path d="M0 118 L60 96 L110 104 L165 72 L220 84 L280 52 L340 62 L400 34" class="line" fill="none" :stroke="props.accent" stroke-width="2" stroke-linecap="round" />
        <path d="M0 118 L60 96 L110 104 L165 72 L220 84 L280 52 L340 62 L400 34 L400 150 L0 150 Z" :fill="`url(#g-${props.type})`" opacity="0.5" />
        <g class="float-a" :fill="props.accent">
          <circle cx="60" cy="96" r="3.4" />
          <circle cx="165" cy="72" r="3.4" />
          <circle cx="280" cy="52" r="3.4" />
          <circle cx="400" cy="34" r="3.4" />
        </g>
        <g class="bars" :fill="props.accent" opacity="0.55">
          <rect x="238" y="96" width="12" height="34" rx="3" />
          <rect x="262" y="82" width="12" height="48" rx="3" />
          <rect x="286" y="104" width="12" height="26" rx="3" />
        </g>
      </template>

      <template v-else-if="props.type === 'gov'">
        <rect x="42" y="30" width="316" height="92" rx="10" fill="none" :stroke="props.accent" stroke-opacity="0.5" stroke-width="1.5" />
        <path d="M42 54 H358" :stroke="props.accent" stroke-opacity="0.35" stroke-width="1.5" />
        <g :fill="props.accent" opacity="0.75">
          <circle cx="58" cy="42" r="3" />
          <circle cx="70" cy="42" r="3" opacity="0.6" />
          <circle cx="82" cy="42" r="3" opacity="0.4" />
        </g>
        <g class="rows" :fill="props.accent">
          <rect class="row" x="62" y="70" width="150" height="9" rx="4.5" opacity="0.7" />
          <rect class="row" x="62" y="88" width="110" height="9" rx="4.5" opacity="0.5" />
          <rect class="row" x="62" y="106" width="132" height="9" rx="4.5" opacity="0.35" />
        </g>
        <g class="float-b" :stroke="props.accent" stroke-opacity="0.7" stroke-width="1.5" fill="none">
          <rect x="238" y="66" width="94" height="34" rx="8" />
          <path d="M252 83 h66" />
        </g>
      </template>

      <template v-else-if="props.type === 'water'">
        <path class="wave" d="M0 96 Q50 74 100 96 T200 96 T300 96 T400 96 V150 H0 Z" :fill="`url(#g-${props.type})`" />
        <path class="wave2" d="M0 106 Q50 86 100 106 T200 106 T300 106 T400 106 V150 H0 Z" :fill="props.accent" opacity="0.22" />
        <path d="M0 96 Q50 74 100 96 T200 96 T300 96 T400 96" fill="none" :stroke="props.accent" stroke-width="2" stroke-opacity="0.85" />
        <path d="M0 114 Q50 94 100 114 T200 114 T300 114 T400 114" fill="none" :stroke="props.accent" stroke-width="1.6" stroke-opacity="0.45" />
        <g class="float-a" :stroke="props.accent" stroke-width="1.6" fill="none" stroke-opacity="0.75">
          <path d="M132 34 h136 v26 h-136 z" />
          <path d="M160 34 v26 M200 34 v26 M240 34 v26" stroke-opacity="0.4" />
        </g>
        <circle class="pulse" cx="322" cy="47" r="5" :fill="props.accent" />
      </template>

      <template v-else-if="props.type === 'finance'">
        <g class="ring" transform="translate(96 76)">
          <circle r="42" fill="none" :stroke="props.accent" stroke-opacity="0.2" stroke-width="10" />
          <circle class="dash" r="42" fill="none" :stroke="props.accent" stroke-width="10" stroke-linecap="round" stroke-dasharray="200 264" />
        </g>
        <g class="bars2" :fill="props.accent">
          <rect x="196" y="86" width="14" height="44" rx="4" opacity="0.75" />
          <rect x="222" y="66" width="14" height="64" rx="4" opacity="0.6" />
          <rect x="248" y="100" width="14" height="30" rx="4" opacity="0.85" />
          <rect x="274" y="52" width="14" height="78" rx="4" opacity="0.45" />
        </g>
        <path class="line2" d="M196 62 L222 44 L248 74 L274 34" fill="none" :stroke="props.accent" stroke-width="2" stroke-linecap="round" stroke-opacity="0.9" />
      </template>

      <template v-else-if="props.type === 'telecom'">
        <g class="float-b" :stroke="props.accent" stroke-width="1.6" fill="none" stroke-opacity="0.8">
          <rect x="56" y="42" width="112" height="72" rx="10" />
          <path d="M56 66 H168" stroke-opacity="0.45" />
          <circle cx="86" cy="88" r="10" stroke-opacity="0.55" />
        </g>
        <g class="ripple" :stroke="props.accent" fill="none" stroke-opacity="0.6">
          <circle cx="286" cy="78" r="14" stroke-width="1.6" />
          <circle cx="286" cy="78" r="26" stroke-width="1.2" stroke-opacity="0.4" />
          <circle cx="286" cy="78" r="40" stroke-width="1" stroke-opacity="0.22" />
        </g>
        <circle cx="286" cy="78" r="5" :fill="props.accent" />
      </template>

      <template v-else-if="props.type === 'ai'">
        <path
          d="M46 112 L92 100 L138 104 L184 78 L214 82 L214 150 L46 150 Z"
          :fill="`url(#g-${props.type})`"
          opacity="0.4"
        />
        <path
          class="ai-line"
          d="M46 112 L92 100 L138 104 L184 78 L214 82"
          fill="none"
          :stroke="props.accent"
          stroke-width="2.2"
          stroke-linecap="round"
        />
        <path
          class="ai-future"
          d="M214 82 L262 64 L310 70 L358 46"
          fill="none"
          :stroke="props.accent"
          stroke-width="2"
          stroke-dasharray="6 7"
          stroke-opacity="0.7"
          stroke-linecap="round"
        />
        <path
          d="M214 32 V128"
          :stroke="props.accent"
          stroke-opacity="0.35"
          stroke-width="1.2"
          stroke-dasharray="4 6"
        />
        <text class="ai-tag" x="222" y="42" :fill="props.accent">预测区间</text>
        <g :fill="props.accent">
          <circle cx="92" cy="100" r="3.2" opacity="0.85" />
          <circle cx="184" cy="78" r="3.2" opacity="0.85" />
          <circle class="ai-pulse" cx="262" cy="64" r="4" />
          <circle class="ai-pulse2" cx="310" cy="70" r="3.4" />
          <circle class="ai-pulse" cx="358" cy="46" r="4" />
        </g>
      </template>

      <template v-else-if="props.type === 'miniapp'">
        <g class="float-b" :stroke="props.accent" stroke-width="1.6" fill="none" stroke-opacity="0.8">
          <rect x="150" y="24" width="100" height="112" rx="14" />
          <path d="M182 32 h36" stroke-opacity="0.4" />
        </g>
        <g :fill="props.accent" opacity="0.65">
          <rect x="164" y="48" width="52" height="12" rx="6" />
          <rect x="164" y="70" width="38" height="12" rx="6" opacity="0.55" />
          <rect x="164" y="92" width="46" height="12" rx="6" opacity="0.4" />
        </g>
        <g class="ripple2" :stroke="props.accent" fill="none">
          <circle cx="196" cy="126" r="10" stroke-width="1.6" stroke-opacity="0.7" />
          <circle cx="196" cy="126" r="18" stroke-width="1.2" stroke-opacity="0.35" />
          <circle cx="196" cy="126" r="28" stroke-width="1" stroke-opacity="0.18" />
        </g>
        <g class="bubble" :fill="props.accent">
          <rect x="292" y="46" width="70" height="30" rx="10" opacity="0.85" />
        </g>
        <path class="bubble-line" d="M292 61 h48" stroke="#050810" stroke-width="3" stroke-linecap="round" opacity="0.55" fill="none" />
        <path class="push" d="M252 61 L286 61" :stroke="props.accent" stroke-width="1.6" stroke-linecap="round" stroke-opacity="0.75" fill="none" />
        <circle cx="252" cy="61" r="3" :fill="props.accent" />
      </template>

      <template v-else-if="props.type === 'query'">
        <!-- 搜索栏 -->
        <rect x="72" y="24" width="256" height="28" rx="14" :fill="props.accent" fill-opacity="0.1" :stroke="props.accent" stroke-opacity="0.5" stroke-width="1.4" />
        <circle cx="95" cy="38" r="6" fill="none" :stroke="props.accent" stroke-opacity="0.85" stroke-width="1.6" />
        <path d="M99.5 42.5 L105 48" :stroke="props.accent" stroke-opacity="0.85" stroke-width="1.6" stroke-linecap="round" fill="none" />
        <rect x="116" y="34" width="78" height="8" rx="4" :fill="props.accent" opacity="0.55" />
        <rect class="q-cursor" x="198" y="31" width="2" height="14" :fill="props.accent" />
        <rect x="292" y="33" width="26" height="11" rx="5.5" :fill="props.accent" opacity="0.8" />
        <!-- 筛选条件 -->
        <g :fill="props.accent">
          <rect x="72" y="62" width="62" height="16" rx="8" opacity="0.3" />
          <rect x="142" y="62" width="76" height="16" rx="8" opacity="0.18" />
          <rect x="226" y="62" width="52" height="16" rx="8" opacity="0.12" />
        </g>
        <!-- 结果行 1 -->
        <g class="q-row q-row1">
          <rect x="72" y="88" width="256" height="24" rx="7" :fill="props.accent" fill-opacity="0.12" :stroke="props.accent" stroke-opacity="0.38" stroke-width="1.2" />
          <rect x="82" y="95" width="10" height="10" rx="3" :fill="props.accent" opacity="0.9" />
          <rect x="100" y="97" width="68" height="7" rx="3.5" :fill="props.accent" opacity="0.6" />
          <rect x="176" y="97" width="38" height="7" rx="3.5" :fill="props.accent" opacity="0.28" />
          <rect x="242" y="96" width="76" height="9" rx="4.5" :fill="props.accent" opacity="0.2" />
          <rect x="242" y="96" width="54" height="9" rx="4.5" :fill="props.accent" opacity="0.62" />
        </g>
        <!-- 结果行 2 -->
        <g class="q-row q-row2">
          <rect x="72" y="118" width="256" height="24" rx="7" :fill="props.accent" fill-opacity="0.09" :stroke="props.accent" stroke-opacity="0.28" stroke-width="1.2" />
          <rect x="82" y="125" width="10" height="10" rx="3" :fill="props.accent" opacity="0.7" />
          <rect x="100" y="127" width="54" height="7" rx="3.5" :fill="props.accent" opacity="0.45" />
          <rect x="162" y="127" width="34" height="7" rx="3.5" :fill="props.accent" opacity="0.22" />
          <rect x="242" y="126" width="76" height="9" rx="4.5" :fill="props.accent" opacity="0.18" />
          <rect x="242" y="126" width="38" height="9" rx="4.5" :fill="props.accent" opacity="0.5" />
        </g>
      </template>

      <template v-else-if="props.type === 'retail'">
        <g :stroke="props.accent" stroke-opacity="0.5" fill="none" stroke-width="1.4">
          <rect x="60" y="36" width="86" height="82" rx="10" />
          <rect x="157" y="36" width="86" height="82" rx="10" stroke-opacity="0.35" />
          <rect x="254" y="36" width="86" height="82" rx="10" stroke-opacity="0.22" />
        </g>
        <g :fill="props.accent" opacity="0.45">
          <rect x="70" y="46" width="66" height="34" rx="6" />
          <rect x="167" y="46" width="66" height="34" rx="6" opacity="0.7" />
          <rect x="264" y="46" width="66" height="34" rx="6" opacity="0.5" />
        </g>
        <g :fill="props.accent" opacity="0.8">
          <rect x="70" y="90" width="42" height="8" rx="4" />
          <rect x="167" y="90" width="34" height="8" rx="4" opacity="0.65" />
          <rect x="264" y="90" width="46" height="8" rx="4" opacity="0.5" />
        </g>
        <g class="cart" :stroke="props.accent" stroke-width="1.8" fill="none" stroke-opacity="0.9">
          <path d="M300 108 h26 l-6 14 h-14 z" />
          <path d="M300 122 h26" stroke-opacity="0.5" />
        </g>
      </template>

      <template v-else-if="props.type === 'supply'">
        <g :stroke="props.accent" stroke-opacity="0.5" fill="none" stroke-width="1.4">
          <rect x="46" y="52" width="72" height="52" rx="8" />
          <rect x="164" y="52" width="72" height="52" rx="8" stroke-opacity="0.35" />
          <rect x="282" y="52" width="72" height="52" rx="8" stroke-opacity="0.22" />
        </g>
        <g :fill="props.accent" opacity="0.5">
          <rect x="56" y="64" width="52" height="9" rx="4.5" />
          <rect x="56" y="80" width="38" height="9" rx="4.5" opacity="0.6" />
          <rect x="174" y="64" width="52" height="9" rx="4.5" opacity="0.7" />
          <rect x="174" y="80" width="44" height="9" rx="4.5" opacity="0.5" />
          <rect x="292" y="64" width="52" height="9" rx="4.5" opacity="0.6" />
          <rect x="292" y="80" width="34" height="9" rx="4.5" opacity="0.4" />
        </g>
        <g class="flow2" :stroke="props.accent" stroke-width="1.8" stroke-opacity="0.85" fill="none">
          <path d="M118 78 H164" />
          <path d="M236 78 H282" />
        </g>
        <circle class="dot1" cx="118" cy="78" r="3.5" :fill="props.accent" />
        <circle class="dot2" cx="236" cy="78" r="3.5" :fill="props.accent" />
      </template>

      <template v-else>
        <g :stroke="props.accent" stroke-opacity="0.45" fill="none" stroke-width="1.4">
          <rect x="70" y="34" width="80" height="28" rx="6" />
          <rect x="70" y="72" width="80" height="28" rx="6" stroke-opacity="0.32" />
          <rect x="70" y="110" width="80" height="28" rx="6" stroke-opacity="0.22" />
          <rect x="250" y="34" width="80" height="28" rx="6" stroke-opacity="0.32" />
          <rect x="250" y="72" width="80" height="28" rx="6" stroke-opacity="0.22" />
          <rect x="250" y="110" width="80" height="28" rx="6" stroke-opacity="0.15" />
        </g>
        <g class="flow" :stroke="props.accent" stroke-width="1.6" stroke-opacity="0.8" fill="none">
          <path d="M150 48 H200 V76 H214" />
          <path d="M150 86 H200 V76" />
          <path d="M250 86 H206 V76" />
        </g>
        <circle class="pulse" cx="214" cy="76" r="4.5" :fill="props.accent" />
        <circle class="pulse2" cx="150" cy="86" r="3.5" :fill="props.accent" />
      </template>
    </svg>
    <span class="cover-label">{{ props.label }}</span>
  </div>
</template>

<style scoped>
.cover {
  position: relative;
  height: 148px;
  overflow: hidden;
  background: linear-gradient(160deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.01));
  border-bottom: 1px solid var(--border);
}

svg {
  width: 100%;
  height: 100%;
  display: block;
  transition: transform 0.6s cubic-bezier(0.22, 1, 0.36, 1);
}

.cover-label {
  position: absolute;
  left: 16px;
  bottom: 12px;
  font-size: 12px;
  letter-spacing: 0.04em;
  color: var(--text-dim);
  padding: 3px 10px;
  border-radius: 99px;
  /* 浅色玻璃质感：白底半透明 + 淡边框，深色文字清晰可读 */
  background: rgba(255, 255, 255, 0.78);
  border: 1px solid var(--border);
  box-shadow: 0 2px 8px rgba(30, 50, 100, 0.08);
  backdrop-filter: blur(6px);
  transition: color 0.3s ease, border-color 0.3s ease;
}

.line,
.line2 {
  stroke-dasharray: 600;
  stroke-dashoffset: 600;
  animation: draw 3.4s ease forwards;
}

@keyframes draw {
  to {
    stroke-dashoffset: 0;
  }
}

.dash {
  animation: spin 7s linear infinite;
  transform-origin: center;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.float-a {
  animation: floatA 5s ease-in-out infinite;
}
.float-b {
  animation: floatB 6.5s ease-in-out infinite;
}

@keyframes floatA {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-6px);
  }
}

@keyframes floatB {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(5px);
  }
}

.wave {
  animation: waveShift 6s ease-in-out infinite;
}
.wave2 {
  animation: waveShift 8s ease-in-out infinite reverse;
}

@keyframes waveShift {
  0%,
  100% {
    transform: translateX(0);
  }
  50% {
    transform: translateX(-26px);
  }
}

.row {
  animation: rowIn 0.9s ease backwards;
}
.row:nth-child(2) {
  animation-delay: 0.14s;
}
.row:nth-child(3) {
  animation-delay: 0.28s;
}

@keyframes rowIn {
  from {
    opacity: 0;
    transform: translateX(-10px);
  }
  to {
    opacity: 1;
  }
}

.bars rect,
.bars2 rect {
  animation: grow 3.6s ease-in-out infinite;
  transform-origin: bottom;
}
.bars rect:nth-child(2),
.bars2 rect:nth-child(2) {
  animation-delay: 0.3s;
}
.bars rect:nth-child(3),
.bars2 rect:nth-child(3) {
  animation-delay: 0.6s;
}
.bars2 rect:nth-child(4) {
  animation-delay: 0.9s;
}

@keyframes grow {
  0%,
  100% {
    opacity: 0.35;
  }
  50% {
    opacity: 0.95;
  }
}

.pulse,
.pulse2 {
  animation: pulseDot 2.4s ease-in-out infinite;
}
.pulse2 {
  animation-delay: 0.6s;
}

.ripple2 circle {
  animation: rippleOut2 2.8s ease-out infinite;
  transform-origin: 196px 126px;
}
.ripple2 circle:nth-child(2) {
  animation-delay: 0.6s;
}
.ripple2 circle:nth-child(3) {
  animation-delay: 1.2s;
}

@keyframes rippleOut2 {
  0% {
    transform: scale(0.35);
    opacity: 0.9;
  }
  100% {
    transform: scale(1.3);
    opacity: 0;
  }
}

.bubble {
  animation: bubbleIn 3.6s ease-in-out infinite;
}

@keyframes bubbleIn {
  0%,
  100% {
    opacity: 0.45;
    transform: translateY(0);
  }
  50% {
    opacity: 1;
    transform: translateY(-4px);
  }
}

.bubble-line {
  animation: bubbleIn 3.6s ease-in-out infinite;
}

.push {
  stroke-dasharray: 6 60;
  animation: pushMove 2.2s linear infinite;
}

@keyframes pushMove {
  to {
    stroke-dashoffset: -66;
  }
}

.cart {
  animation: cartFloat 4.5s ease-in-out infinite;
}

@keyframes cartFloat {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
  }
}

.flow2 path {
  stroke-dasharray: 7 46;
  animation: flow2Move 2.4s linear infinite;
}
.flow2 path:nth-child(2) {
  animation-delay: 0.8s;
}

@keyframes flow2Move {
  to {
    stroke-dashoffset: -53;
  }
}

.ai-line {
  stroke-dasharray: 320;
  stroke-dashoffset: 320;
  animation: draw 3s ease forwards;
}

.ai-future {
  animation: futureShift 1.6s linear infinite;
}

@keyframes futureShift {
  to {
    stroke-dashoffset: -26;
  }
}

.ai-tag {
  font-size: 11px;
  letter-spacing: 0.08em;
  opacity: 0.85;
}

.ai-pulse,
.ai-pulse2 {
  animation: pulseDot 2.2s ease-in-out infinite;
}

.ai-pulse2 {
  animation-delay: 0.7s;
}

.dot1,
.dot2 {
  animation: pulseDot 2.4s ease-in-out infinite;
}
.dot2 {
  animation-delay: 0.8s;
}

@keyframes pulseDot {
  0%,
  100% {
    opacity: 0.4;
  }
  50% {
    opacity: 1;
  }
}

.ripple circle {
  animation: rippleOut 3s ease-out infinite;
  transform-origin: 286px 78px;
}
.ripple circle:nth-child(2) {
  animation-delay: 0.5s;
}
.ripple circle:nth-child(3) {
  animation-delay: 1s;
}

@keyframes rippleOut {
  0% {
    transform: scale(0.4);
    opacity: 0.9;
  }
  100% {
    transform: scale(1.25);
    opacity: 0;
  }
}

.flow path {
  stroke-dasharray: 8 190;
  animation: flowMove 2.6s linear infinite;
}
.flow path:nth-child(2) {
  animation-delay: 0.5s;
}
.flow path:nth-child(3) {
  animation-delay: 1s;
}

@keyframes flowMove {
  to {
    stroke-dashoffset: -198;
  }
}

/* query —— 查询/择校类：结果行依次高亮 + 搜索光标闪烁 */
.q-row1 {
  animation: qSlide 4s ease-in-out infinite;
}
.q-row2 {
  animation: qSlide 4s ease-in-out 0.6s infinite;
}
@keyframes qSlide {
  0%,
  100% {
    opacity: 0.6;
    transform: translateY(0);
  }
  50% {
    opacity: 1;
    transform: translateY(-2px);
  }
}
.q-cursor {
  animation: qBlink 1.4s steps(2, end) infinite;
}
@keyframes qBlink {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.1;
  }
}

@media (prefers-reduced-motion: reduce) {
  svg * {
    animation: none !important;
  }
}
</style>
