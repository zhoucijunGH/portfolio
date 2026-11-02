<script setup lang="ts">
import { computed, ref } from 'vue'
import { projects, INDUSTRIES } from '@/data/portfolio'
import ProjectCard from '@/components/ProjectCard.vue'

const filters = ['全部', ...INDUSTRIES] as const
const active = ref<string>('全部')

const filtered = computed(() =>
  active.value === '全部' ? projects : projects.filter((p) => p.industry === active.value)
)

const countOf = (industry: string) =>
  industry === '全部' ? projects.length : projects.filter((p) => p.industry === industry).length
</script>

<template>
  <section id="projects" class="section projects">
    <div class="container">
      <div class="head fade-up">
        <span class="eyebrow">Portfolio</span>
        <h2 class="section-title">精选作品集</h2>
        <p class="section-sub">
          按行业分类浏览。每张卡片标注了技术栈与适用场景；涉密项目不做公开演示，但提供站内案例详情。
        </p>
      </div>

      <div class="filters fade-up">
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

      <transition-group name="grid" tag="div" class="grid" :key="active">
        <div
          v-for="(p, i) in filtered"
          :key="p.id"
          class="grid-item"
          :style="{ animationDelay: `${i * 90}ms` }"
        >
          <ProjectCard :project="p" />
        </div>
      </transition-group>
    </div>
  </section>
</template>

<style scoped>
.projects {
  scroll-margin-top: 68px;
}

.head {
  max-width: 640px;
}

.filters {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 32px 0 26px;
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
  color: var(--text);
  border-color: var(--border-hover);
  transform: translateY(-2px);
}

.chip.active {
  color: #04222b;
  background: var(--accent);
  border-color: var(--accent);
  font-weight: 500;
}

.chip-num {
  font-size: 11.5px;
  opacity: 0.65;
  font-family: var(--mono);
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
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

@media (max-width: 520px) {
  .grid {
    grid-template-columns: 1fr;
  }
}
</style>
