<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from 'vue'

const canvasRef = ref<HTMLCanvasElement | null>(null)

interface Star {
  x: number
  y: number
  r: number
  layer: number
  tw: number
  twSpeed: number
  base: number
  col: string
  bright: boolean
  gl: boolean
}

interface FarPlanet {
  x0: number
  y0: number
  r: number
  rgb: string
  ring: boolean
  lrx: number
  lry: number
  w: number
  a0: number
}

let ctx: CanvasRenderingContext2D | null = null
let raf = 0
let W = 0
let H = 0
let dpr = 1
let stars: Star[] = []
let running = true
let reducedMotion = false

const pointer = { x: -9999, y: -9999 }
const FAR: FarPlanet[] = []
const SUN = { x: 0, y: 0 }
const PLANET = { x: 0, y: 0, r: 0 }
const ORBIT = { cx: 0, cy: 0, rx: 0, ry: 0, speed: (Math.PI * 2) / 240000, a0: 0 }

/* 离屏画布：静态深空场景 / 行星中性纹理 / 行星逐帧受光 */
const staticCvs = document.createElement('canvas')
const texCvs = document.createElement('canvas')
const litCvs = document.createElement('canvas')

const CFG = {
  /* 星海：多色高密度（白/冰蓝/金/粉），最亮一瞬半径放大 */
  starDensity: 1 / 2600,
  maxStars: 900,
  twinkleSize: 1.2,
  /* 远景带环行星 */
  planetR: 0.052, /* min(W,H) 的占比 */
  orbitSpeed: (Math.PI * 2) / 240000, /* 公转一圈约 4 分钟 */
  earthPeriod: 240000, /* 远邻行星周期换算基准（ms） */
  ringTilt: -0.32
}

function rand(min: number, max: number) {
  return min + Math.random() * (max - min)
}

/* ================= 静态深空场景（resize 时烘焙一次） ================= */

function bakeStatic() {
  staticCvs.width = Math.floor(W * dpr)
  staticCvs.height = Math.floor(H * dpr)
  const c = staticCvs.getContext('2d')
  if (!c) return
  c.setTransform(dpr, 0, 0, dpr, 0, 0)
  c.clearRect(0, 0, W, H)

  /* 深空底色：左暖灰 → 右深蓝 */
  let g = c.createLinearGradient(0, 0, W, H * 0.4)
  g.addColorStop(0, '#14151c'); g.addColorStop(0.45, '#0d1019'); g.addColorStop(1, '#090d1a')
  c.fillStyle = g; c.fillRect(0, 0, W, H)

  /* 蓝色星尘带（右上向左下） */
  g = c.createRadialGradient(W * 0.62, H * 0.34, 0, W * 0.62, H * 0.34, W * 0.5)
  g.addColorStop(0, 'rgba(90,120,200,.14)'); g.addColorStop(0.6, 'rgba(60,85,160,.06)'); g.addColorStop(1, 'transparent')
  c.fillStyle = g; c.fillRect(0, 0, W, H)

  /* 暖色尘埃带（横贯中部） */
  g = c.createRadialGradient(W * 0.38, H * 0.44, 0, W * 0.38, H * 0.44, W * 0.48)
  g.addColorStop(0, 'rgba(205,185,150,.13)'); g.addColorStop(0.55, 'rgba(170,150,120,.06)'); g.addColorStop(1, 'transparent')
  c.fillStyle = g; c.fillRect(0, 0, W, H)

  /* 底部品红/紫星云 */
  g = c.createRadialGradient(W * 0.16, H * 0.98, 0, W * 0.16, H * 0.98, H * 0.55)
  g.addColorStop(0, 'rgba(200,30,145,.30)'); g.addColorStop(0.5, 'rgba(150,25,120,.12)'); g.addColorStop(1, 'transparent')
  c.fillStyle = g; c.fillRect(0, 0, W, H)
  g = c.createRadialGradient(W * 0.52, H * 1.04, 0, W * 0.52, H * 1.04, H * 0.45)
  g.addColorStop(0, 'rgba(160,25,130,.20)'); g.addColorStop(1, 'transparent')
  c.fillStyle = g; c.fillRect(0, 0, W, H)

  /* ---- 白色恒星：强光 + 横向长光斑 + 斜向细芒 + 镜头残斑 ---- */
  const sx = SUN.x, sy = SUN.y
  g = c.createRadialGradient(sx, sy, 0, sx, sy, H * 0.55)
  g.addColorStop(0, 'rgba(255,255,255,.9)'); g.addColorStop(0.08, 'rgba(230,240,255,.5)')
  g.addColorStop(0.25, 'rgba(170,200,255,.16)'); g.addColorStop(1, 'transparent')
  c.fillStyle = g; c.fillRect(0, 0, W, H)
  g = c.createRadialGradient(sx, sy, 0, sx, sy, 46)
  g.addColorStop(0, '#ffffff'); g.addColorStop(0.55, 'rgba(255,255,255,.85)'); g.addColorStop(1, 'rgba(255,255,255,0)')
  c.fillStyle = g; c.beginPath(); c.arc(sx, sy, 46, 0, Math.PI * 2); c.fill()
  g = c.createLinearGradient(sx - W * 0.42, sy, sx + W * 0.42, sy)
  g.addColorStop(0, 'transparent'); g.addColorStop(0.5, 'rgba(255,255,255,.5)'); g.addColorStop(1, 'transparent')
  c.fillStyle = g
  c.save(); c.translate(sx, sy); c.scale(1, 0.045)
  c.beginPath(); c.arc(0, 0, W * 0.42, 0, Math.PI * 2); c.fill(); c.restore()
  g = c.createLinearGradient(sx, sy - H * 0.3, sx, sy + H * 0.3)
  g.addColorStop(0, 'transparent'); g.addColorStop(0.5, 'rgba(255,255,255,.35)'); g.addColorStop(1, 'transparent')
  c.fillStyle = g
  c.save(); c.translate(sx, sy); c.scale(0.012, 1)
  c.beginPath(); c.arc(0, 0, H * 0.3, 0, Math.PI * 2); c.fill(); c.restore()
  c.save(); c.translate(sx, sy); c.rotate(-0.5)
  g = c.createLinearGradient(-W * 0.3, 0, W * 0.3, 0)
  g.addColorStop(0, 'transparent'); g.addColorStop(0.5, 'rgba(220,235,255,.22)'); g.addColorStop(1, 'transparent')
  c.fillStyle = g; c.save(); c.scale(1, 0.02); c.beginPath(); c.arc(0, 0, W * 0.3, 0, Math.PI * 2); c.fill(); c.restore(); c.restore()
  g = c.createRadialGradient(W * 0.44, H * 0.86, 0, W * 0.44, H * 0.86, 90)
  g.addColorStop(0, 'rgba(140,70,190,.18)'); g.addColorStop(1, 'transparent')
  c.fillStyle = g; c.fillRect(W * 0.44 - 90, H * 0.86 - 90, 180, 180)
  g = c.createRadialGradient(W * 0.33, H * 0.7, 0, W * 0.33, H * 0.7, 46)
  g.addColorStop(0, 'rgba(110,200,170,.10)'); g.addColorStop(1, 'transparent')
  c.fillStyle = g; c.fillRect(W * 0.33 - 46, H * 0.7 - 46, 92, 92)

  /* ---- 碎石带：横贯画面 ---- */
  for (let i = 0; i < 110; i++) {
    const inBand = Math.random() < 0.72
    const x = rand(-40, W + 40)
    const y = inBand ? rand(H * 0.22, H * 0.8) : rand(0, H)
    const s = inBand ? rand(2, 13) : rand(1.5, 7)
    drawRock(c, x, y, s)
  }
  drawRock(c, W * 0.70, H * 0.66, 26)
  drawRock(c, W * 0.60, H * 0.30, 14)
  drawRock(c, W * 0.24, H * 0.62, 18)
  drawRock(c, W * 0.86, H * 0.48, 12)
  drawRock(c, W * 0.46, H * 0.14, 10)
}

function drawRock(c: CanvasRenderingContext2D, x: number, y: number, s: number) {
  const a0 = rand(0, Math.PI * 2)
  c.beginPath()
  for (let k = 0; k < 8; k++) {
    const a = a0 + (k / 8) * Math.PI * 2
    const rr = s * rand(0.72, 1.15)
    const vx = x + Math.cos(a) * rr, vy = y + Math.sin(a) * rr * rand(0.75, 1)
    if (k) c.lineTo(vx, vy); else c.moveTo(vx, vy)
  }
  c.closePath()
  const toSun = Math.atan2(SUN.y - y, SUN.x - x)
  const g = c.createLinearGradient(x - Math.cos(toSun) * s, y - Math.sin(toSun) * s, x + Math.cos(toSun) * s, y + Math.sin(toSun) * s)
  g.addColorStop(0, '#3a3f4b'); g.addColorStop(0.55, '#20242e'); g.addColorStop(1, '#0b0d14')
  c.fillStyle = g; c.fill()
  c.strokeStyle = 'rgba(180,195,220,.10)'; c.lineWidth = 0.6; c.stroke()
}

/* ================= 带环主行星（纹理烘焙 + 逐帧受光） ================= */

function bakePlanet() {
  const pr = PLANET.r
  const pad = Math.ceil(pr * 0.9)
  const size = Math.ceil((pr + pad) * 2) * dpr
  texCvs.width = texCvs.height = litCvs.width = litCvs.height = size
  const c = texCvs.getContext('2d')
  if (!c) return
  c.setTransform(dpr, 0, 0, dpr, 0, 0)
  const half = size / dpr / 2
  const cx = half, cy = half

  /* 中性纹理：明暗光照由 relightPlanet 逐帧叠加 */
  c.save()
  c.beginPath(); c.arc(cx, cy, pr, 0, Math.PI * 2); c.clip()
  let g = c.createRadialGradient(cx - pr * 0.15, cy - pr * 0.15, 0, cx, cy, pr)
  g.addColorStop(0, '#414754'); g.addColorStop(1, '#181c26')
  c.fillStyle = g; c.fillRect(0, 0, half * 2, half * 2)

  for (let i = 0; i < 60; i++) {
    const a = rand(0, Math.PI * 2)
    const d = Math.sqrt(Math.random()) * pr * 0.96
    const x = cx + Math.cos(a) * d, y = cy + Math.sin(a) * d
    const cr = rand(1.2, 5) * (pr / 55)
    c.fillStyle = 'rgba(0,0,0,.22)'
    c.beginPath(); c.arc(x, y, cr, 0, Math.PI * 2); c.fill()
    c.strokeStyle = 'rgba(195,205,225,.16)'
    c.lineWidth = Math.max(0.5, cr * 0.18)
    c.beginPath(); c.arc(x, y, cr * 0.9, a - 1.2, a + 1.2); c.stroke()
  }

  g = c.createRadialGradient(cx, cy, 0, cx, cy, pr)
  g.addColorStop(0, 'rgba(205,185,150,.07)'); g.addColorStop(1, 'transparent')
  c.fillStyle = g; c.fillRect(0, 0, half * 2, half * 2)
  c.restore()
}

function relightPlanet() {
  const pr = PLANET.r
  const c = litCvs.getContext('2d')
  if (!c) return
  const half = litCvs.width / dpr / 2
  c.setTransform(dpr, 0, 0, dpr, 0, 0)
  c.clearRect(0, 0, half * 2, half * 2)
  c.drawImage(texCvs, 0, 0, half * 2, half * 2)
  const cx = half, cy = half
  const sunDx = SUN.x - PLANET.x, sunDy = SUN.y - PLANET.y
  const L = Math.sqrt(sunDx * sunDx + sunDy * sunDy) || 1
  const ux = sunDx / L, uy = sunDy / L
  const toSun = Math.atan2(uy, ux)

  c.save()
  c.beginPath(); c.arc(cx, cy, pr, 0, Math.PI * 2); c.clip()
  const g = c.createRadialGradient(cx + ux * pr * 0.75, cy + uy * pr * 0.75, 0, cx + ux * pr * 0.75, cy + uy * pr * 0.75, pr * 2.2)
  g.addColorStop(0, 'rgba(255,240,218,.16)')
  g.addColorStop(0.32, 'rgba(0,0,0,0)')
  g.addColorStop(0.62, 'rgba(0,0,0,.5)')
  g.addColorStop(1, 'rgba(2,3,8,.94)')
  c.fillStyle = g; c.fillRect(0, 0, half * 2, half * 2)
  c.restore()

  c.strokeStyle = 'rgba(215,230,255,.4)'
  c.lineWidth = Math.max(0.8, pr * 0.025)
  c.beginPath(); c.arc(cx, cy, pr - 0.5, toSun - 0.8, toSun + 0.8); c.stroke()
}

function drawRing(c: CanvasRenderingContext2D, x: number, y: number, pr: number, a0: number, a1: number, alpha: number) {
  const rot = CFG.ringTilt
  c.strokeStyle = `rgba(208,196,172,${alpha})`
  c.lineWidth = pr * 0.42
  c.beginPath(); c.ellipse(x, y, pr * 2.15, pr * 0.62, rot, a0, a1); c.stroke()
  c.strokeStyle = `rgba(185,192,214,${(alpha * 0.6).toFixed(3)})`
  c.lineWidth = pr * 0.2
  c.beginPath(); c.ellipse(x, y, pr * 2.62, pr * 0.79, rot, a0, a1); c.stroke()
}

/* ================= 太阳系远邻行星（周期比参照真实公转） ================= */
/* 以主行星=地球（240s/圈）换算：水星 ~58s / 金星 ~2min28s / 火星 ~7.5min / 木星 ~47min / 土星 ~118min */
function buildFar() {
  FAR.length = 0
  const EARTH = CFG.earthPeriod
  const mk = (fx: number, fy: number, r: number, rgb: string, days: number, loopR: number, ring: boolean, a0: number) => {
    FAR.push({
      x0: W * fx, y0: H * fy, r, rgb, ring,
      lrx: loopR, lry: loopR * 0.55,
      w: (Math.PI * 2) / ((EARTH * days) / 365.25), a0
    })
  }
  mk(0.34, 0.12, 5, '232,217,184', 224.7, 40, false, 2.1) /* 金星 */
  mk(0.50, 0.27, 3, '154,147,140', 87.97, 52, false, 0.6) /* 水星 */
  mk(0.63, 0.58, 4.5, '193,85,58', 686.98, 46, false, 3.8) /* 火星 */
  mk(0.30, 0.70, 9, '198,164,120', 4332.6, 34, false, 5.2) /* 木星 */
  mk(0.69, 0.38, 6, '216,196,154', 10759, 28, true, 1.4) /* 土星 */
}

function drawFarPlanet(c: CanvasRenderingContext2D, x: number, y: number, r: number, rgb: string, ring: boolean) {
  const dx = SUN.x - x, dy = SUN.y - y
  const L = Math.sqrt(dx * dx + dy * dy) || 1
  const ux = dx / L, uy = dy / L
  if (ring) {
    c.strokeStyle = 'rgba(216,196,154,.45)'; c.lineWidth = r * 0.32
    c.beginPath(); c.ellipse(x, y, r * 2.1, r * 0.62, -0.3, 0, Math.PI * 2); c.stroke()
    c.strokeStyle = 'rgba(190,175,150,.25)'; c.lineWidth = r * 0.16
    c.beginPath(); c.ellipse(x, y, r * 2.55, r * 0.78, -0.3, 0, Math.PI * 2); c.stroke()
  }
  const g = c.createRadialGradient(x + ux * r * 0.55, y + uy * r * 0.55, 0, x, y, r * 1.35)
  g.addColorStop(0, `rgba(${rgb},.95)`); g.addColorStop(0.5, `rgba(${rgb},.55)`)
  g.addColorStop(0.85, 'rgba(8,10,18,.8)'); g.addColorStop(1, 'rgba(8,10,18,.2)')
  c.fillStyle = g
  c.beginPath(); c.arc(x, y, r, 0, Math.PI * 2); c.fill()
  if (r >= 8) { /* 木星条纹 */
    c.strokeStyle = 'rgba(120,80,50,.4)'; c.lineWidth = r * 0.14
    c.beginPath(); c.arc(x, y, r * 0.9, 0.4, 1.2); c.stroke()
    c.beginPath(); c.arc(x, y, r * 0.85, 2.2, 3.0); c.stroke()
    c.beginPath(); c.arc(x, y, r * 0.8, 4.4, 5.2); c.stroke()
  }
  const h = c.createRadialGradient(x, y, 0, x, y, r * 3)
  h.addColorStop(0, `rgba(${rgb},.14)`); h.addColorStop(1, 'transparent')
  c.fillStyle = h; c.beginPath(); c.arc(x, y, r * 3, 0, Math.PI * 2); c.fill()
}

/* ================= 星海 ================= */

function buildStars() {
  stars = []
  const count = Math.min(CFG.maxStars, Math.round(W * H * CFG.starDensity))
  const palette: [string, number][] = [
    ['220,230,255', 0.55], ['255,255,255', 0.2], ['150,180,255', 0.12],
    ['255,215,160', 0.08], ['255,170,200', 0.05]
  ]
  for (let i = 0; i < count; i++) {
    let roll = Math.random()
    let col = palette[0][0]
    for (const [cc, w] of palette) {
      if (roll < w) { col = cc; break }
      roll -= w
    }
    const layer = Math.random() < 0.1 ? 2 : Math.random() < 0.46 ? 1 : 0
    const bright = Math.random() < 0.06
    stars.push({
      x: Math.random() * W,
      y: Math.random() * H,
      r: bright ? rand(1.3, 2.1) : layer === 2 ? rand(0.9, 1.4) : rand(0.4, 1.0),
      layer,
      tw: rand(0, Math.PI * 2),
      twSpeed: rand(0.004, 0.02),
      base: bright ? 0.9 : layer === 2 ? 0.6 : layer === 1 ? 0.4 : 0.26,
      col, bright,
      gl: bright && Math.random() < 0.12 /* 只有极少数亮星带十字星芒 */
    })
  }
}

/* ================= 布局与渲染 ================= */

function resize() {
  const canvas = canvasRef.value
  if (!canvas) return
  dpr = Math.min(window.devicePixelRatio || 1, 1.5)
  W = window.innerWidth
  H = window.innerHeight
  canvas.width = Math.floor(W * dpr)
  canvas.height = Math.floor(H * dpr)
  canvas.style.width = W + 'px'
  canvas.style.height = H + 'px'
  if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

  SUN.x = W * 0.78; SUN.y = H * 0.18
  PLANET.r = Math.min(W, H) * CFG.planetR
  ORBIT.cx = W * 0.5; ORBIT.cy = H * 0.46
  ORBIT.rx = Math.min(W * 0.3, H * 0.52)
  ORBIT.ry = Math.min(W, H) * 0.36

  bakePlanet()
  bakeStatic()
  buildStars()
  buildFar()
  if (reducedMotion) drawStill()
}

/* 减弱动效模式：渲染一帧静态宇宙 */
function drawStill() {
  const c = ctx
  if (!c) return
  c.clearRect(0, 0, W, H)
  c.drawImage(staticCvs, 0, 0, W, H)
  for (const s of stars) {
    c.fillStyle = `rgba(${s.col},${s.base.toFixed(3)})`
    c.beginPath(); c.arc(s.x, s.y, s.r, 0, Math.PI * 2); c.fill()
  }
  for (const p of FAR) drawFarPlanet(c, p.x0, p.y0, p.r, p.rgb, p.ring)
  PLANET.x = ORBIT.cx; PLANET.y = ORBIT.cy
  relightPlanet()
  const sz = litCvs.width / dpr
  c.drawImage(litCvs, PLANET.x - sz / 2, PLANET.y - sz / 2, sz, sz)
  drawRing(c, PLANET.x, PLANET.y, PLANET.r, 0, Math.PI * 2, 0.4)
}

function frame(now: number) {
  const c = ctx
  if (!c || !running) return
  c.clearRect(0, 0, W, H)

  /* 静态深空层 */
  c.drawImage(staticCvs, 0, 0, W, H)

  /* 星海：闪烁 + 最亮一瞬放大；极少数亮星带十字星芒 */
  for (const s of stars) {
    s.tw += s.twSpeed
    const bright = 0.5 + 0.5 * Math.sin(s.tw)
    const alpha = s.base * (0.5 + 0.5 * bright)
    const r = s.r * (2 - CFG.twinkleSize + CFG.twinkleSize * bright)
    const px = s.x + (s.layer === 0 ? 0 : (pointer.x - W / 2) * -0.004 * s.layer)
    const py = s.y + (s.layer === 0 ? 0 : (pointer.y - H / 2) * -0.004 * s.layer)
    c.fillStyle = `rgba(${s.col},${alpha.toFixed(3)})`
    c.beginPath(); c.arc(px, py, r, 0, Math.PI * 2); c.fill()
    if (s.gl && bright > 0.65) {
      const len = r * (3 + 3 * bright)
      c.strokeStyle = `rgba(${s.col},${(0.35 * bright).toFixed(3)})`
      c.lineWidth = 0.8
      c.beginPath()
      c.moveTo(px - len, py); c.lineTo(px + len, py)
      c.moveTo(px, py - len); c.lineTo(px, py + len)
      c.stroke()
    }
  }

  /* 太阳系远邻：沿各自小椭圆巡行（朝恒星受光） */
  for (const p of FAR) {
    const a = p.a0 + now * p.w
    drawFarPlanet(c, p.x0 + Math.cos(a) * p.lrx, p.y0 + Math.sin(a) * p.lry, p.r, p.rgb, p.ring)
  }

  /* 主行星：椭圆轨道公转（上远下近透视缩放），昼夜面随位置实时变化 */
  const oa = ORBIT.a0 + now * ORBIT.speed
  PLANET.x = ORBIT.cx + Math.cos(oa) * ORBIT.rx
  PLANET.y = ORBIT.cy + Math.sin(oa) * ORBIT.ry
  const depth = (Math.sin(oa) + 1) / 2
  relightPlanet()
  const ox = (pointer.x > -999 ? (pointer.x - W / 2) * -0.005 : 0) + Math.sin(now * 0.00022) * 1.2
  const oy = (pointer.y > -999 ? (pointer.y - H / 2) * -0.004 : 0) + Math.cos(now * 0.00017) * 0.9
  const s = 0.82 + 0.3 * depth
  const sz = (litCvs.width / dpr) * s
  const pcx = PLANET.x + ox, pcy = PLANET.y + oy
  const pr = PLANET.r * s
  const ringA = 0.3 + 0.22 * depth
  drawRing(c, pcx, pcy, pr, Math.PI, Math.PI * 2, ringA) /* 远端半环 */
  c.globalAlpha = 0.72 + 0.28 * depth
  c.drawImage(litCvs, pcx - sz / 2, pcy - sz / 2, sz, sz)
  c.globalAlpha = 1
  drawRing(c, pcx, pcy, pr, 0, Math.PI, ringA) /* 近端半环 */

  raf = requestAnimationFrame(frame)
}

function onPointerMove(e: PointerEvent) {
  pointer.x = e.clientX
  pointer.y = e.clientY
}

function onVisibility() {
  if (document.hidden) {
    running = false
    cancelAnimationFrame(raf)
  } else if (!reducedMotion) {
    running = true
    raf = requestAnimationFrame(frame)
  }
}

onMounted(() => {
  const canvas = canvasRef.value
  if (!canvas) return
  ctx = canvas.getContext('2d')
  reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  resize()
  window.addEventListener('resize', resize)
  window.addEventListener('pointermove', onPointerMove, { passive: true })
  document.addEventListener('visibilitychange', onVisibility)
  if (!reducedMotion) {
    running = true
    raf = requestAnimationFrame(frame)
  }
})

onBeforeUnmount(() => {
  running = false
  cancelAnimationFrame(raf)
  window.removeEventListener('resize', resize)
  window.removeEventListener('pointermove', onPointerMove)
  document.removeEventListener('visibilitychange', onVisibility)
})
</script>

<template>
  <canvas ref="canvasRef" class="starfield" aria-hidden="true"></canvas>
</template>

<style scoped>
.starfield {
  position: fixed;
  inset: 0;
  z-index: -1;
  display: block;
  pointer-events: none;
  opacity: var(--star-opacity);
  transition: opacity 0.3s ease;
}
</style>
