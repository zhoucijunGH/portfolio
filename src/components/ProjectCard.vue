<script setup lang="ts">
import { computed } from 'vue'
import type { Project } from '@/data/portfolio'
import ProjectCover from '@/components/ProjectCover.vue'

const props = defineProps<{ project: Project }>()

const outLinks = computed(() => {
  return props.project.links.filter((l) => l.kind !== 'detail' && !!l.url)
})

const displayFeatures = computed(() => props.project.features.slice(0, 3))

const linkLabel = (kind: string, fallback?: string) => {
  switch (kind) {
    case 'demo':
      return '在线演示'
    case 'repo':
      return '源码仓库'
    case 'external':
      return fallback || '外部链接'
    default:
      return fallback || '查看'
  }
}

function openLink(url?: string) {
  if (!url) return
  window.open(url, '_blank', 'noopener')
}
</script>

<template>
  <article class="card" :style="{ '--accent': project.accent }">
    <router-link :to="`/project/${project.id}`" class="card-link">
      <div class="cover-wrap">
        <ProjectCover :type="project.coverType" :accent="project.accent" :label="project.coverLabel" />

        <div class="cover-actions">
          <button
            v-for="l in outLinks"
            :key="l.kind"
            class="out-btn"
            @click.prevent.stop="openLink(l.url)"
          >
            {{ linkLabel(l.kind, l.label) }}
            <span class="out-arrow">↗</span>
          </button>
          <span v-if="project.confidential && !outLinks.length" class="lock-chip">
            保密 · 详情页可见
          </span>
        </div>

        <span class="industry-chip">{{ project.industry }}</span>
      </div>

      <div class="body">
        <div class="meta">
          <span class="period">{{ project.period }}</span>
          <span class="dot">·</span>
          <span class="role">{{ project.role }}</span>
        </div>

        <h3 class="name">
          {{ project.name }}
          <em>{{ project.enName }}</em>
        </h3>

        <p class="summary">{{ project.summary }}</p>

        <ul class="features">
          <li v-for="(f, i) in displayFeatures" :key="i">
            <i class="check"></i>
            {{ f }}
          </li>
        </ul>

        <div class="techs">
          <span v-for="(t, i) in project.techStack" :key="t" class="tech" :style="{ transitionDelay: `${i * 45}ms` }">
            {{ t }}
          </span>
        </div>

        <div class="foot">
          <span class="more">
            查看详情
            <span class="arrow">→</span>
          </span>
          <span class="tech-count">{{ project.techStack.length }} 项技术栈</span>
        </div>
      </div>
    </router-link>
  </article>
</template>

<style scoped>
.card {
  position: relative;
  border-radius: var(--radius-lg);
  border: 1px solid var(--border);
  background: var(--panel);
  overflow: hidden;
  height: 100%;
  transition: transform 0.4s cubic-bezier(0.22, 1, 0.36, 1), border-color 0.4s ease,
    box-shadow 0.4s ease, background 0.4s ease;
}

.card::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  pointer-events: none;
  opacity: 0;
  background: radial-gradient(560px 260px at 50% -10%, color-mix(in srgb, var(--accent) 22%, transparent), transparent 70%);
  transition: opacity 0.4s ease;
}

.card:hover {
  transform: translateY(-8px);
  border-color: color-mix(in srgb, var(--accent) 55%, transparent);
  background: var(--panel-hover);
  box-shadow: 0 26px 54px -26px rgba(30, 50, 100, 0.35);
}

.card:hover::after {
  opacity: 1;
}

.card-link {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.cover-wrap {
  position: relative;
}

.cover-wrap :deep(svg) {
  transition: transform 0.7s cubic-bezier(0.22, 1, 0.36, 1);
}

.card:hover .cover-wrap :deep(svg) {
  transform: scale(1.07);
}

.cover-actions {
  position: absolute;
  top: 12px;
  right: 12px;
  display: flex;
  gap: 6px;
  opacity: 0;
  transform: translateY(-6px);
  transition: opacity 0.35s ease, transform 0.35s ease;
}

.card:hover .cover-actions {
  opacity: 1;
  transform: none;
}

.out-btn,
.lock-chip {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 5px 11px;
  border-radius: 8px;
  font-size: 12px;
  color: #03181f;
  background: var(--accent);
  border: 1px solid transparent;
  backdrop-filter: blur(6px);
  transition: transform 0.25s ease, filter 0.25s ease;
}

.out-btn:hover {
  transform: translateY(-2px);
  filter: brightness(1.08);
}

.lock-chip {
  background: rgba(255, 255, 255, 0.85);
  border-color: var(--border);
  color: var(--text-dim);
}

.out-arrow {
  font-size: 11px;
}

.industry-chip {
  position: absolute;
  bottom: 12px;
  right: 12px;
  padding: 4px 11px;
  border-radius: 99px;
  font-size: 11.5px;
  color: var(--accent);
  border: 1px solid color-mix(in srgb, var(--accent) 45%, transparent);
  /* 浅色玻璃：主题色淡底 + 白色半透明，替代原来的深色底 */
  background: color-mix(in srgb, var(--accent) 10%, rgba(255, 255, 255, 0.82));
  backdrop-filter: blur(6px);
  opacity: 0.9;
  transition: opacity 0.35s ease;
}

.card:hover .industry-chip {
  opacity: 1;
}

.body {
  padding: 20px 22px 18px;
  display: flex;
  flex-direction: column;
  flex: 1;
}

.meta {
  display: flex;
  align-items: center;
  gap: 7px;
  font-size: 12px;
  color: var(--text-mute);
}

.role {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.name {
  margin-top: 8px;
  font-size: 18.5px;
  font-weight: 600;
  transition: color 0.3s ease;
}

.name em {
  display: block;
  font-style: normal;
  font-size: 11.5px;
  font-weight: 400;
  letter-spacing: 0.06em;
  color: var(--text-mute);
  margin-top: 2px;
}

.card:hover .name {
  color: var(--accent);
}

.summary {
  margin-top: 10px;
  font-size: 13.5px;
  line-height: 1.75;
  color: var(--text-dim);
}

.features {
  margin-top: 14px;
  display: flex;
  flex-direction: column;
  gap: 7px;
}

.features li {
  display: flex;
  gap: 8px;
  font-size: 13px;
  line-height: 1.6;
  color: var(--text-dim);
}

.check {
  position: relative;
  flex-shrink: 0;
  width: 13px;
  height: 13px;
  margin-top: 6px;
  border-radius: 50%;
  border: 1px solid color-mix(in srgb, var(--accent) 55%, transparent);
}

.check::after {
  content: '';
  position: absolute;
  left: 3px;
  top: 2px;
  width: 5px;
  height: 3px;
  border-left: 1.5px solid var(--accent);
  border-bottom: 1.5px solid var(--accent);
  transform: rotate(-45deg) scale(0.6);
  opacity: 0;
  transition: all 0.3s ease;
}

.card:hover .check::after {
  opacity: 1;
  transform: rotate(-45deg) scale(1);
}

.techs {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 16px;
}

.tech {
  padding: 3px 10px;
  border-radius: 7px;
  font-size: 12px;
  color: var(--text-mute);
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--border);
  transition: color 0.35s ease, border-color 0.35s ease, background 0.35s ease;
}

.card:hover .tech {
  color: var(--text);
  border-color: color-mix(in srgb, var(--accent) 40%, transparent);
  background: color-mix(in srgb, var(--accent) 10%, transparent);
}

.foot {
  margin-top: auto;
  padding-top: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-top: 1px solid var(--border);
}

.more {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 13.5px;
  font-weight: 500;
  color: var(--accent);
}

.arrow {
  transition: transform 0.3s ease;
}

.card:hover .arrow {
  transform: translateX(5px);
}

.tech-count {
  font-size: 11.5px;
  color: var(--text-mute);
}

@media (max-width: 640px) {
  .cover-actions {
    opacity: 1;
    transform: none;
  }
}
</style>
