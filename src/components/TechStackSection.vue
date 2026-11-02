<script setup lang="ts">
import { profile } from '@/data/portfolio'
</script>

<template>
  <section id="stack" class="section stack">
    <div class="container">
      <div class="head fade-up">
        <span class="eyebrow">Tech Stack</span>
        <h2 class="section-title">技术能力</h2>
        <p class="section-sub">
          主战场是 Vue 生态与若依体系，同时具备 SAPUI5、AngularJS 与 Java 后端对接的老系统迁移经验。
        </p>
      </div>

      <div class="grid fade-up">
        <div v-for="g in profile.techGroups" :key="g.group" class="group">
          <h3 class="group-title">{{ g.group }}</h3>
          <div class="tags">
            <span v-for="t in g.items" :key="t" class="tag">{{ t }}</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.stack {
  scroll-margin-top: 68px;
}

.grid {
  margin-top: 40px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 18px;
}

.group {
  padding: 22px;
  border-radius: var(--radius-lg);
  border: 1px solid var(--border);
  background: var(--panel);
  transition: transform 0.35s ease, border-color 0.35s ease, background 0.35s ease;
}

.group:hover {
  transform: translateY(-5px);
  border-color: rgba(34, 211, 238, 0.4);
  background: var(--panel-hover);
}

.group-title {
  font-size: 14.5px;
  font-weight: 600;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--border);
  margin-bottom: 14px;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
}

.tag {
  transition: color 0.28s ease, border-color 0.28s ease, transform 0.28s ease;
}

.tag:hover {
  color: var(--accent);
  border-color: rgba(34, 211, 238, 0.5);
  transform: translateY(-2px);
}
</style>
