<script setup lang="ts">
import { computed, ref } from 'vue'
import { projects, INDUSTRIES } from '@/data/portfolio'
import ProjectCard from '@/components/ProjectCard.vue'

/* 行业筛选 + 数量统计，与首页精选案例共用同一数据源 */
const filters = ['全部', ...INDUSTRIES] as const
const active = ref<string>('全部')

const filtered = computed(() =>
  active.value === '全部' ? projects : projects.filter((p) => p.industry === active.value)
)

const countOf = (industry: string) =>
  industry === '全部' ? projects.length : projects.filter((p) => p.industry === industry).length
</script>

<template>
  <main class="portfolio-page">
    <!-- 页头横幅 -->
    <section class="page-hero">
      <div class="container">
        <h1>项目案例</h1>
        <p>
          覆盖政务 / 水利 / 金融 / 运营商 / 出行等行业的真实交付案例；涉密项目已脱敏，详情页可查技术方案与交付成果。
        </p>
      </div>
    </section>

    <!-- 筛选 + 网格 -->
    <section class="section">
      <div class="container">
        <div class="filter-bar fade-up">
          <div class="filters">
            <button
              v-for="f in filters"
              :key="f"
              class="chip"
              :class="{ active: active === f }"
              @click="active = f"
            >
              {{ f }}
              <span class="chip-num">{{ countOf(f) }}</span>
            </button>
          </div>
          <span class="result-count">共 {{ filtered.length }} 个案例</span>
        </div>

        <transition-group name="grid" tag="div" class="grid" :key="active">
          <div
            v-for="(p, i) in filtered"
            :key="p.id"
            class="grid-item"
            :style="{ animationDelay: `${i * 70}ms` }"
          >
            <ProjectCard :project="p" />
          </div>
        </transition-group>

        <p v-if="!filtered.length" class="empty">该分类下暂无公开案例，欢迎联系我了解详情。</p>
      </div>
    </section>
  </main>
</template>

<style scoped>
main {
  padding-top: 68px;
}

.page-hero {
  background: linear-gradient(120deg, var(--accent), var(--accent-2));
  color: #fff;
  padding: 64px 0 56px;
}

.page-hero h1 {
  color: #fff;
  font-size: clamp(26px, 3.2vw, 34px);
  font-weight: 700;
}

.page-hero p {
  margin-top: 12px;
  font-size: 14.5px;
  color: rgba(255, 255, 255, 0.85);
  max-width: 640px;
  line-height: 1.85;
}

.filter-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
  margin-bottom: 28px;
}

.filters {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 15px;
  border-radius: 99px;
  font-size: 13.5px;
  color: var(--text-dim);
  border: 1px solid var(--border);
  background: var(--panel);
  transition: all 0.28s ease;
}

.chip:hover {
  color: var(--accent);
  border-color: var(--accent);
  transform: translateY(-2px);
}

.chip.active {
  color: var(--accent-contrast);
  background: var(--accent);
  border-color: var(--accent);
  font-weight: 500;
}

.chip-num {
  font-size: 11.5px;
  opacity: 0.65;
  font-family: var(--mono);
}

.result-count {
  font-size: 13px;
  color: var(--text-mute);
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
  gap: 22px;
}

.grid-item {
  animation: cardIn 0.6s cubic-bezier(0.22, 1, 0.36, 1) backwards;
}

@keyframes cardIn {
  from {
    opacity: 0;
    transform: translateY(22px);
  }
  to {
    opacity: 1;
    transform: none;
  }
}

.grid-enter-active,
.grid-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.grid-enter-from {
  opacity: 0;
  transform: translateY(14px);
}

.grid-leave-active {
  position: absolute;
}

.empty {
  text-align: center;
  color: var(--text-mute);
  padding: 60px 0;
}

@media (max-width: 520px) {
  .grid {
    grid-template-columns: 1fr;
  }
}
</style>
