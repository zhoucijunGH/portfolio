<script setup lang="ts">
import { profile } from '@/data/portfolio'

function scrollToId(id: string) {
  const el = document.getElementById(id)
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}
</script>

<template>
  <section id="hero" class="hero">
    <div class="container hero-inner">
      <div class="hero-copy">
        <span class="badge">
          <i class="badge-dot"></i>
          {{ profile.badge }} · 开放新机会
        </span>

        <h1 class="hero-title">
          你好，我是<span class="hl">{{ profile.name }}</span><br />
          {{ profile.headline }}
        </h1>

        <p class="hero-desc">{{ profile.intro }}</p>

        <div class="hero-actions">
          <button class="btn btn-primary" @click="scrollToId('projects')">
            浏览作品集
            <span class="arrow">→</span>
          </button>
          <button class="btn" @click="scrollToId('stack')">查看技术能力</button>
        </div>

        <div class="stats">
          <div v-for="s in profile.stats" :key="s.label" class="stat">
            <span class="stat-value">{{ s.value }}</span>
            <span class="stat-label">{{ s.label }}</span>
          </div>
        </div>
      </div>

      <aside class="hero-card glass">
        <div class="card-head">
          <span class="card-title">当前状态</span>
          <span class="card-status">
            <i></i>
            求职开放中
          </span>
        </div>
        <ul class="card-list">
          <li v-for="h in profile.highlights" :key="h.title">
            <strong>{{ h.title }}</strong>
            <p>{{ h.desc }}</p>
          </li>
        </ul>
        <div class="card-foot">
          <span>{{ profile.contact.location }}</span>
          <span class="sep">·</span>
          <span>{{ profile.title }}</span>
        </div>
      </aside>
    </div>

    <div class="scroll-hint" aria-hidden="true">
      <span>向下滚动</span>
      <i></i>
    </div>
  </section>
</template>

<style scoped>
.hero {
  position: relative;
  padding: 116px 0 96px;
  scroll-margin-top: 68px;
}

.hero-inner {
  display: grid;
  grid-template-columns: 1.15fr 0.85fr;
  gap: 48px;
  align-items: start;
}

.badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 5px 13px;
  border-radius: 99px;
  border: 1px solid rgba(34, 211, 238, 0.35);
  background: rgba(34, 211, 238, 0.08);
  color: var(--accent);
  font-size: 12.5px;
  letter-spacing: 0.02em;
}

.badge-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--accent);
  animation: blink 1.8s ease-in-out infinite;
}

@keyframes blink {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.25;
  }
}

.hero-title {
  margin: 22px 0 0;
  font-size: clamp(32px, 4.6vw, 52px);
  line-height: 1.22;
  letter-spacing: -0.02em;
}

.hl {
  color: var(--accent);
}

.hero-desc {
  margin-top: 20px;
  max-width: 620px;
  color: var(--text-dim);
  font-size: 15.5px;
}

.hero-actions {
  display: flex;
  gap: 12px;
  margin-top: 30px;
  flex-wrap: wrap;
}

.arrow {
  transition: transform 0.25s ease;
}

.btn:hover .arrow {
  transform: translateX(4px);
}

.stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;
  margin-top: 40px;
  max-width: 560px;
}

.stat {
  padding: 16px 18px;
  border-radius: var(--radius);
  border: 1px solid var(--border);
  background: var(--panel);
  transition: transform 0.3s ease, border-color 0.3s ease, background 0.3s ease;
}

.stat:hover {
  transform: translateY(-4px);
  border-color: rgba(34, 211, 238, 0.4);
  background: rgba(34, 211, 238, 0.07);
}

.stat-value {
  display: block;
  font-size: 26px;
  font-weight: 600;
  color: var(--text);
  font-family: var(--mono);
  letter-spacing: -0.02em;
}

.stat-label {
  display: block;
  margin-top: 2px;
  font-size: 12.5px;
  color: var(--text-mute);
  line-height: 1.5;
}

.hero-card {
  padding: 22px;
}

.card-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 14px;
  border-bottom: 1px solid var(--border);
}

.card-title {
  font-size: 14.5px;
  font-weight: 600;
}

.card-status {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: var(--accent);
}

.card-status i {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--accent);
}

.card-list {
  margin-top: 6px;
}

.card-list li {
  padding: 14px 0;
  border-bottom: 1px dashed rgba(255, 255, 255, 0.07);
}

.card-list li:last-child {
  border-bottom: none;
}

.card-list strong {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: var(--text);
}

.card-list p {
  margin-top: 4px;
  font-size: 13px;
  line-height: 1.65;
  color: var(--text-mute);
}

.card-foot {
  display: flex;
  gap: 8px;
  align-items: center;
  padding-top: 14px;
  border-top: 1px solid var(--border);
  font-size: 12.5px;
  color: var(--text-mute);
}

.sep {
  opacity: 0.5;
}

.scroll-hint {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  margin-top: 72px;
  font-size: 11.5px;
  letter-spacing: 0.16em;
  color: var(--text-mute);
}

.scroll-hint i {
  width: 1px;
  height: 42px;
  background: linear-gradient(to bottom, rgba(34, 211, 238, 0.7), transparent);
}

@media (max-width: 980px) {
  .hero-inner {
    grid-template-columns: 1fr;
    gap: 36px;
  }
  .hero {
    padding: 84px 0 64px;
  }
  .scroll-hint {
    display: none;
  }
}

@media (max-width: 560px) {
  .stats {
    grid-template-columns: 1fr;
  }
}
</style>
