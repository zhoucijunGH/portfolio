/**
 * ============================================================
 *  作品集数据源 —— 只改这一个文件就能更新整个网站
 * ============================================================
 *
 * 怎么用：
 * 1. 新增作品：复制下面任意一个对象，改 id（必须唯一，会作为详情页链接 /project/xxx）。
 * 2. links 三种入口，填了才会在卡片上显示对应按钮：
 *      { kind: 'detail' }              —— 站内案例详情页（涉密项目用这个，不开放源码）
 *      { kind: 'demo', url: '...' }    —— 在线演示地址（GitHub Pages / Vercel）
 *      { kind: 'repo', url: '...' }    —— 源码仓库地址
 *      { kind: 'external', url: '' }   —— 外部展示页（如产品上架页）
 *    url 留空字符串 = 不放链接，只有 detail 入口。
 * 3. confidential: true 的项目，详情页会自动显示保密声明，且不放"在线演示/源码"按钮。
 * 4. industry 决定行业筛选器分类，取值请从 INDUSTRIES 里选。
 */

export interface ProjectLink {
  kind: 'detail' | 'demo' | 'repo' | 'external'
  url?: string
  label?: string
}

export interface CaseStudy {
  background: string
  contributions: string[]
  techNotes: string[]
  results?: string[]
}

export interface Project {
  id: string
  name: string
  enName: string
  industry: string
  /** 卡片主色（行业配色），用于示意图与行业徽章 */
  accent: string
  /**
   * 卡片示意图类型（决定封面画什么图形）：
   * saas=数据平台  gov=政务门户  water=水利水位  finance=金融看板
   * telecom=门禁/信号  infra=服务器内网  miniapp=小程序消息推送
   * retail=电商点单  supply=供应链流程  ai=AI预测曲线  query=查询/择校筛选列表
   */
  coverType:
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
  coverLabel: string
  summary: string
  /** 主要功能介绍 */
  features: string[]
  /** 使用的技术栈 */
  techStack: string[]
  period: string
  role: string
  /** 是否涉密 / 签有保密协议 */
  confidential: boolean
  links: ProjectLink[]
  caseStudy: CaseStudy
}

/** 行业筛选分类 */
export const INDUSTRIES = ['出行', '政务', '水利', '农业', '金融', '运营商', '企业服务', '教育', '餐饮'] as const
export type Industry = (typeof INDUSTRIES)[number]

export interface Profile {
  name: string
  enName: string
  /** 头像图片，放在 public/ 下。换头像直接覆盖同名文件，或改这里的文件名 */
  avatar: string
  title: string
  badge: string
  headline: string
  intro: string
  stats: { value: string; label: string }[]
  highlights: { title: string; desc: string }[]
  techGroups: { group: string; items: string[] }[]
  contact: { phone: string; email: string; location: string; wechatQr: string }
}

export const profile: Profile = {
  name: '周赐骏',
  enName: 'Zhou Cijun',
  // 头像：public/avatar.jpg（640×640，已裁成正方形）。换头像直接覆盖同名文件即可
  avatar: 'avatar.jpg',
  title: '前端 / 全栈开发工程师',
  badge: '政务 · 水利 · 金融信息化',
  headline: '把复杂的政企业务，做成可靠、可交付的系统',
  intro:
    '7 年+ 前端与全栈开发经验，深耕 Vue 技术栈与若依（RuoYi-Vue）生态二次开发 5 年+。职业主线始终在政企信息化：从运营商、银行的 early 项目，到国家级水利工程现场，再到省级政务平台与涉密政务系统。长期驻场交付，习惯直接面对甲方、把问题在现场解决掉。',
  stats: [
    { value: '7 年+', label: '前端开发经验' },
    { value: '5 年+', label: '若依 RuoYi 二开' },
    { value: '4 类', label: '行业交付 · 运营商/银行/水利/政务' }
  ],
  highlights: [
    {
      title: '若依生态深度二开',
      desc: '连续 5 年+ 基于 RuoYi-Vue 改造权限体系、代码生成器、工作流与数据权限，不是"用过框架"，是反复改过框架的骨架。'
    },
    {
      title: '产品级研发经历',
      desc: '在 SAP 在华唯一合资公司参与薪酬 SaaS 产品从内部自用到对外产品化的全过程，并主导前端由 SAPUI5 迁移至 Vue2 上线投用。'
    },
    {
      title: '驻场交付能力',
      desc: '施工现场与政企单位连续驻场 6 年以上，兼管南宁办事处日常运营、现场问题排查与甲方汇报，能独立扛住一个驻场点。'
    },
    {
      title: '稀缺技术组合',
      desc: 'SAPUI5 + Vue / 若依 + 能对接 Java Spring Boot 后端。'
    }
  ],
  techGroups: [
    { group: '前端', items: ['Vue2 / Vue3', 'TypeScript', 'Vue Router / Pinia', 'Element UI / Element Plus', 'Vite', 'ECharts'] },
    { group: '框架与二开', items: ['若依 RuoYi-Vue', 'SAPUI5 / Fiori', 'AngularJS', 'jQuery', '微信小程序'] },
    { group: '后端与数据', items: ['Java / Spring Boot', 'MySQL', 'RESTful 接口对接', 'OData', 'Spring Security 权限模型'] },
    { group: '工程化', items: ['Webpack', 'Git', '若依代码生成器', 'H5 混合开发与原生桥接', '国产化信创环境适配对接'] }
  ],
  contact: {
    phone: '159-7816-7516',
    email: '15978167516@163.com',
    location: '广西南宁',
    // 占位二维码（内容：手机号）。把你的微信「二维码名片」图片保存为 public/wechat-qr.png 覆盖即可
    wechatQr: 'wechat-qr.png'
  }
}

export const projects: Project[] = [
  {
    id: 'jingdriver',
    name: '净司机 · 网约车司机出车管家小程序',
    enName: 'JingSiJi Driver Assistant',
    industry: '出行',
    accent: '#FF7E33',
    coverType: 'miniapp',
    coverLabel: '小程序 + 云函数 + 车队工作台',
    summary:
      '面向网约车司机的出车管家：多平台流水合并、净收益与净时薪核算、成本与合规台账、会员授权，配套车队侧 PC 工作台。Taro 3 + Vue3 小程序 11 页、11 个微信云函数、12 个云数据库集合，另有自建本地网关（Node + MySQL）让云函数源码零改动跑在真库上；PC 后台为 Vue3 + TypeScript + Vite。',
    features: [
      '首页驾驶舱：本月净收益 / 净时薪 / 在线时长三项核心指标、今日目标进度、证件逾期横幅、车队授权后一键拉取，多平台流水合并展示',
      '账单双通道录入：按平台给出三步导出引导，导出的 CSV / Excel 走云函数解析入库；零散流水可走剪贴板文本抽取',
      '净时薪分析：近 7 日净时薪趋势、各平台净时薪对比、成本构成拆解、本周与上周环比报告',
      '成本记账：充电 / 加油 / 高速停车 / 保养维修 / 罚单 / 其他六类「记一笔」，月度成本合计与占流水比例',
      '合规台账：证件 / 合同 / 违章 / 押金时间线，按「即将到期 / 已逾期」筛选，到期前 30 天提醒',
      '数据授权与合规：司机同意流单独落库（公司授权 ≠ 司机授权），撤销即双向断流；隐私政策、用户协议独立成页',
      '会员中心：连续包月 / 年付两档，权益清单与开通入口（支付与订阅消息按接口契约留桩）',
      'PC 车队工作台：车队概览、净收益排名、流失预警、合规台账、成本台账、数据同步、接口管理、对账导出 8 个模块'
    ],
    techStack: [
      'Taro 3 + Vue3',
      '微信小程序（11 页）',
      '微信云开发 · 11 个云函数 · 12 个集合',
      'Node 本地网关 + MySQL 8',
      'Vue3 + TypeScript + Vite + Pinia',
      'vue-router + ECharts + xlsx 导出',
      'CSV / Excel 账单解析',
      '接口契约测试'
    ],
    period: '2026.10',
    role: '独立开发（小程序 + 云函数 + 本地网关 + PC 车队工作台）',
    confidential: false,
    links: [{ kind: 'detail' }],
    caseStudy: {
      background:
        '网约车司机大多多平台接单，流水散在滴滴、曹操等各自 App 里，抽成、租车、油电、停车一扣，月底算不清自己到底挣了多少、净时薪是多少；证件到期、违章罚款、日常成本也缺少统一台账。租车公司和车队侧则关心另一个问题：车队整体净收益、谁在流失、合规有没有风险。净司机把这两头并进一套系统——司机端看净收益与净时薪、记成本、管台账；车队用 PC 工作台看整体收益、排名与流失预警。需求分析、MVP 技术落地清单、小程序、云函数、本地网关、PC 后台与部署文档全部由本人独立完成。',
      contributions: [
        '小程序 11 个页面：首页驾驶舱、导入账单、账单列表、净时薪分析、合规台账、成本记账、会员中心、数据授权、我的、隐私政策、用户协议；tabBar 四入口（首页 / 账单 / 分析 / 我的）',
        '11 个微信云函数按职责拆分：report（净收益与净时薪统计）、parseBill（CSV/Excel 账单解析入库）、clipboardParse（剪贴板文本抽取）、addCost（成本记账）、fleetCosts（车队成本台账）、syncFleet（车队 API 定时同步）、pay（支付下单与回调）、subscribe（订阅消息）、consent（授权同意态）、ocrBill（票据识别，灰度）、qr（车队码分流）；另留 initDb 建库与 cloudbase_auth 环境共享备件',
        '云数据库 12 个集合与索引设计：users、bills、costs、contracts、certs、violations、companies、driver_consent、subscriptions、ocr_usage、ocr_cache、fleet_sync_task，高频查询按 openid + month / fleetId + month 建索引',
        '自建本地网关 code/server：HTTP 网关 + wx-server-sdk 本地替身，把云函数里的 require(\'wx-server-sdk\') 重定向到本机 MySQL，云函数源码一行未改即可脱离云环境联调；对外 14 条 REST 路由 + 14 条 admin 路由',
        'PC 车队工作台（Vue3 + TS + Vite + Pinia + vue-router）：登录鉴权与 8 个模块，图表走 ECharts，对账导出走 xlsx，数据全部经鉴权接口从库实时聚合',
        '测试与文档：小程序侧接口契约测试并入 npm test；服务端 25 项端到端断言 + 22 项查询单元测试全过；输出《上线缺口清单》《部署手册》'
      ],
      techNotes: [
        '前端选 Taro 3 + Vue3：复用既有 Vue 技术栈，小程序与后台一套心智；接口层只留 api/contract + transport，mock / http / cloud 三种模式改一个常量切换，页面代码零改动',
        '读接口加 60 秒缓存与并发请求合并（inflight），写操作后立刻清缓存——司机在赶路间隙反复进出首页，这层能砍掉三四成重复请求，又不会出现「刚记完账看不到」',
        '账单录入做双通道：文件导入走 parseBill 解析，零散流水走 clipboardParse 抽成结构化记录，覆盖司机不同的使用习惯',
        '数据合规按个保法走：公司授权不等于司机授权，同意态单独落库，撤销即双向断流；订单原文不跨主体留存、注销即删',
        '本地网关的价值：不买云环境、不备案，也能把 11 个云函数对着本机 MySQL 跑通闭环，代价只是替换 wx-server-sdk 的加载路径；上线前仍需在真云上跑最后一轮',
        '支付与订阅消息按契约留桩，接入商户号与模板 ID 后即可开；票据 OCR 走灰度开关，识别准确率不达标就不回填账目'
      ],
      results: [
        '闭环跑通：导入 / 拉取 → 账单列表 → 净时薪统计 → 成本与合规台账 → 会员与授权，司机端与车队侧共用一套数据模型',
        '11 个小程序页面 + 11 个云函数 + 12 个集合 + 8 个 PC 模块，形成可复用的「司机侧记账 + 车队侧运营」模板',
        '本地网关让联调不依赖云环境与备案，25 项端到端断言、22 项查询单测全过；开发期还借它抓出两处真云上同样存在的缺陷（证件横幅字段取错、批量插入未实现）'
      ]
    }
  },
  {
    id: 'guozhangtong',
    name: '果账通 · 水果收购开单记账系统',
    enName: 'GuoZhangTong',
    industry: '农业',
    accent: '#3E9B4F',
    coverType: 'miniapp',
    coverLabel: '小程序 + 管理后台 + 后端服务',
    summary:
      '面向水果收购商的开单记账系统：uni-app 开单小程序 + Vue3 管理后台 + Spring Boot 后端，覆盖开单、收购流水、日结报表、欠款汇总全流程，前后端与部署全部独立完成。',
    features: [
      '开单小程序：收购开单、磅单拍照上传、流水查询，基于 uni-app 一套代码多端编译',
      '管理后台：Vue3 + Element Plus + Pinia + ECharts，经营看板 / 收购流水 / 日结报表 / 欠款汇总 / 果品档案 / 用户管理',
      '后端服务：Spring Boot + Spring Security + JWT 认证鉴权，RESTful 接口设计',
      '数据库设计与部署：MySQL 建库脚本 + Docker 化部署，附完整部署操作文档'
    ],
    techStack: [
      'uni-app 小程序',
      'Vue3',
      'TypeScript',
      'Element Plus',
      'Pinia',
      'ECharts',
      'Java 17 · Spring Boot',
      'Spring Security',
      'MySQL',
      'Docker 部署'
    ],
    period: '2026',
    role: '独立全栈开发（小程序 + 管理后台 + 后端 + 部署）',
    confidential: false,
    links: [{ kind: 'detail' }],
    caseStudy: {
      background:
        '水果收购商日常靠纸质单据记账，对账难、欠款易漏、日结靠手算。果账通以「开单小程序 + 老板管理后台」的组合，把收购开单、付款状态、欠款汇总、日结报表搬进系统，开单员现场开单，老板后台实时看数。项目从需求、设计、前后端研发到部署全部由本人独立完成。',
      contributions: [
        'uni-app 开单小程序开发：开单表单、果品选择、金额自动计算、磅单照片上传，一套代码编译到微信小程序等多端',
        'Vue3 + Element Plus + Pinia 管理后台：ECharts 经营数据看板、收购流水（按日期/关键字/付款状态检索 + 导出 Excel）、日结报表、欠款汇总、果品档案、用户管理（ADMIN/STAFF 角色权限）',
        'Spring Boot 后端：RESTful 接口、Spring Security + JWT 认证鉴权、磅单照片上传与静态资源服务',
        'MySQL 数据库设计与建库脚本（含演示数据），Docker 化部署并整理部署操作文档'
      ],
      techNotes: [
        'uni-app 多端方案选型：开单端以微信小程序为主，同时保留 H5 / 其他小程序端的编译能力',
        '前后端分离：管理后台走 Axios + RESTful，接口形态与权限模型对齐 Spring Security 的认证体系，ADMIN / STAFF 双角色控制菜单与接口权限',
        '业务建模：以收购单为核心实体，联动果品档案、果农信息与付款状态，欠款汇总与日结报表均由单据状态实时聚合',
        '部署链路：后端 Dockerfile 容器化，GZT_* 环境变量一套代码兼容本地化与云服务部署，uploads 静态资源与 SQL 初始化脚本一并纳入部署文档'
      ],
      results: ['完成从需求到上线部署的全链路独立交付，形成可复用的「收购开单记账」行业全栈模板']
    }
  },
  {
    id: 'pinglu-canal',
    name: '平陆运河航运一张图',
    enName: 'Pinglu Canal Map',
    industry: '水利',
    accent: '#0E8F7E',
    coverType: 'water',
    coverLabel: '航运一张图 · 地图可视化',
    summary:
      '面向调度 / 监管场景的航运一张图可视化系统：运河航道地图、48 艘船舶动态、梯级船闸、水位监测预警与时间轴回放，前后端独立完成。',
    features: [
      '航运一张图：运河航道（带流向动画）、三大梯级枢纽、桥梁 / 码头 / 锚地 / 水位站',
      '船舶动态：位置沿航道中心线插值，按航向旋转、状态配色、重点物资船标记',
      '水位监测与预警中心：超警戒自动变红并联动预警，点击定位到地图对象',
      '时间轴回放：回放过去 24 小时船流，支持 1x / 4x / 16x 倍速',
      'URL 直达定位：?v=船舶 / ?lock=枢纽，便于演示与分享'
    ],
    techStack: [
      'Vue3',
      'TypeScript',
      'Vite',
      'Pinia',
      'Leaflet 1.9（自绘矢量底图）',
      'ECharts 5',
      'Java Spring Boot（后端）',
      'MySQL'
    ],
    period: '2026',
    role: '独立全栈开发（前端可视化 + 后端服务）',
    confidential: false,
    links: [{ kind: 'detail' }],
    caseStudy: {
      background:
        '平陆运河是西部陆海新通道的标志性工程，航运一张图面向调度与监管场景，把船舶动态、枢纽运行、水位与预警收进一张可交互的地图。数据为模拟数据，接口形态对齐真实系统（AIS / 北斗经 WebSocket 推送），便于后续接真实数据源。',
      contributions: [
        '地图引擎选型 Leaflet，底图完全自绘矢量、零第三方瓦片依赖，断网可跑',
        '48 艘模拟船舶的位置插值、航向旋转与状态配色渲染',
        '枢纽详情、水位监测、预警中心、时间轴回放、图层控制等模块',
        'Pinia 状态管理接口形态对齐真实系统，预留 WebSocket 接入位'
      ],
      techNotes: [
        '零瓦片依赖：航道、枢纽、设施全部矢量自绘，规避在线底图的断网与合规问题',
        '船舶动态：沿航道中心线做位置插值，时间轴回放支持 1x / 4x / 16x 倍速',
        'URL 参数直达（?v=VS003 / ?lock=LK01），演示场景免点选直达目标对象'
      ],
      results: ['形成可对外演示的航运一张图完整 Demo，覆盖一张图 / 详情 / 预警 / 回放全场景']
    }
  },
  {
    id: 'easypayroll',
    name: '易薪资 EasyPayroll',
    enName: 'EasyPayroll',
    industry: '企业服务',
    accent: '#22D3EE',
    coverType: 'saas',
    coverLabel: '薪酬核算 SaaS 平台',
    summary:
      '企业级薪酬核算 SaaS 产品，中国地区首个上架 SAP App Center 的解决方案；前端最初基于 SAPUI5，由我主导重构迁移至 Vue2 并上线投用。',
    features: [
      '薪酬核算与工资条生成发放全流程，支持历史月份数据回溯查询',
      '工资条查看密码鉴权机制，敏感薪酬数据分级可控展示',
      '与 SAP SuccessFactors 集成，基于 SAP Cloud Platform 部署',
      '工资条微信小程序端，服务集团及上级集团 5000 人以上规模员工',
      '集团内部自用持续调优后，完成对外 SaaS 产品化'
    ],
    techStack: ['Vue2', 'SAPUI5', 'SAP Cloud Platform', '微信小程序', 'Java Spring Boot'],
    period: '2018 - 2020',
    role: '前端负责人 · 带教 2 名实习生',
    confidential: false,
    links: [
      { kind: 'detail' },
      // 如需外链 SAP 的产品展示页，把地址填在下面这行的 url 里即可
      { kind: 'external', url: '', label: 'SAP 应用商店' }
    ],
    caseStudy: {
      background:
        '易薪资是中数通信息有限公司（SAP 在华唯一合资公司）的薪酬核算产品，面向集团型企业提供薪酬核算与工资条送达能力，并与 SAP SuccessFactors 打通。产品路径是先集团内部自用、持续调优，再完成对外 SaaS 产品化。',
      contributions: [
        '招聘薪酬计算、工资条生成与发放、历史月份回溯查询等核心模块的前端实现',
        '工资条小程序：密码鉴权查看 + 历史月份查询，覆盖 5000 人以上员工规模',
        '主导前端技术栈由 SAPUI5（XML View + MVC + OData 绑定 + Fiori 规范）迁移到 Vue2，全量重写并上线投用',
        '后端为传统 Java + Spring Boot，未做改动，通过接口层完成对接'
      ],
      techNotes: [
        '迁移动因：SAPUI5 开发模式固化，自定义交互成本高、迭代慢，业务侧自定义表单与图表需求无法快速响应',
        '迁移评估：确认前端可整体替换而不触碰后端——后端保留 Spring Boot 与既有接口契约，风险收敛在视图层',
        '实施：按模块分批次重写替换，先低风险页面验证接口可用性，再推进核心核算页面，全程保持线上可用',
        '结果：新 stack 上线投用，前端迭代效率显著提升，后续场次唯一 GUI 框架收于 Vue2'
      ],
      results: [
        '2019.12.02 成为中国地区首个上架 SAP App Center 的解决方案',
        '获 SAP Store 季度最受欢迎解决方案',
        '2018.11 获 SAP 开发者创新大赛「智慧业务价值奖」'
      ]
    }
  },
  {
    id: 'datengxia',
    name: '大藤峡水利枢纽 · 智慧园区',
    enName: 'Datengxia Smart Park',
    industry: '水利',
    accent: '#5DCAA5',
    coverType: 'water',
    coverLabel: '水利枢纽智慧园区系统',
    summary:
      '国务院 172 项节水供水重大水利工程的配套信息化系统，施工现场驻场两年半，负责智慧园区板块、砂石方管理系统与现场快速响应。',
    features: [
      '智慧园区板块：园区人员、车辆、设施与访客的数字化管理',
      '砂石方管理系统：砂石料运输、计量与结算数据的流程化管理',
      '疫情防控期间的健康码登记模块快速上线',
      '驻场现场的问题排查、修复与甲方汇报，兼顾南宁办事处日常运营'
    ],
    techStack: ['Vue2', '若依 RuoYi-Vue', 'Element UI', 'jQuery（部分模块）', 'Java Spring Boot（若依后端）', 'MySQL'],
    period: '2019 - 2021',
    role: '前端开发 · 现场驻场交付负责人',
    confidential: false,
    links: [{ kind: 'detail' }],
    caseStudy: {
      background:
        '大藤峡水利枢纽是国务院 172 项节水供水重大水利工程的标志性工程，"智慧大藤峡"分为智慧工地、智慧运营、智慧企业、智慧园区四大板块。我在 2019.04 起由中数通派驻现场，2020.04 随项目转入珠江委技术咨询体系，同一工程连续交付约两年半。',
      contributions: [
        '智慧园区板块的前端模块开发与迭代',
        '砂石方管理系统：把现场散乱的纸质流程数字化，覆盖运输、计量与结算链路',
        '施工现场驻场：直接对接甲方与施工单位，现场排查修复问题并做汇报',
        '兼管南宁办事处日常运营'
      ],
      techNotes: [
        '基于若依 RuoYi-Vue 做二次开发，复用其权限体系与代码生成器快速产出后台管理页面',
        '现场网络与设备条件受限，前端做轻量化处理，保证弱网环境下的可用性',
        '需求多来自现场口头提出，采用小步快跑迭代，先上线可用版本再持续打磨'
      ]
    }
  },
  {
    id: 'gxzf-platform',
    name: '广西政务一体化平台 / 智桂通',
    enName: 'Guangxi Gov Platform',
    industry: '政务',
    accent: '#85B7EB',
    coverType: 'gov',
    coverLabel: '省级政务服务平台 · H5',
    summary:
      '驻场广西壮族自治区大数据发展局，参与省级政务一体化平台建设，以及广西政务 App 与智桂通的 H5 混合开发。',
    features: [
      '省级政务一体化平台的前端模块开发与联调',
      '广西政务 App 与智桂通的 H5 页面开发，走原生 App 混合开发模式',
      '与原生壳的 JSBridge 交互对接与性能优化',
      '作为前端负责人做任务分工与技术把关（前端负责人 + 1 名前端协作，含混合开发调优）'
    ],
    techStack: ['Vue2', 'H5 混合开发', '原生 App 桥接调优', 'Java Spring Boot（后端）', '政务外网环境'],
    period: '2021 - 2023',
    role: '前端负责人 · 不含团队管理',
    confidential: true,
    links: [{ kind: 'detail' }],
    caseStudy: {
      background:
        '广西壮族自治区政务一体化平台是自治区层面的政务服务统一入口，向下衔接各厅局办事系统；智桂通与广西政务 App 是面向企业与群众的移动端载体，采用原生 App + H5 混合开发模式。',
      contributions: [
        '政务一体化平台前端模块开发与联调推进',
        '智桂通 / 广西政务 App 的 H5 页面开发',
        '原生 App 混合开发的配合与性能调优（首屏、缓存、桥接调用）'
      ],
      techNotes: [
        '混合开发模式下重点处理 H5 与原生壳的桥接：登录态透传、页面栈管理、离线缓存',
        '政务外网环境限制多，依赖与静态资源做内网化处理',
        '多端（PC + App 内嵌）并行，通过组件复用与统一主题降低重复开发量'
      ]
    }
  },
  {
    id: 'bank-control',
    name: '某银行内控管理系统',
    enName: 'Bank Internal Control',
    industry: '金融',
    accent: '#ED93B1',
    coverType: 'finance',
    coverLabel: '数据看板 · 指标监测',
    summary:
      '银行内部控制系统，覆盖员工工作指标监测与异常预警推送；我负责后台管理模块与 ECharts 数据看板。',
    features: [
      '员工工作指标的采集、统计与展示',
      '异常指标识别与预警推送',
      '后台管理：指标规则配置、用户与权限管理',
      'ECharts 数据看板：多维度监测指标的图形化呈现'
    ],
    techStack: ['Vue', 'ECharts', '数据可视化', 'Java Spring Boot（后端）'],
    period: '2018 - 2020',
    role: '前端开发 · 后台管理与看板负责',
    confidential: true,
    links: [{ kind: 'detail' }],
    caseStudy: {
      background:
        '项目服务于银行内控场景，系统名称与业务规则受保密约束，此处做脱敏处理。',
      contributions: [
        '后台管理模块：指标规则配置、用户与权限管理',
        'ECharts 数据看板：把监测指标做成可读、可下钻的图形化界面',
        '异常预警推送的前端联动与状态展示'
      ],
      techNotes: [
        '指标数据量大且维度多，看板侧做分页、聚合与懒加载，避免一次性渲染导致卡顿',
        'ECharts 实例随组件生命周期销毁回收，避免内存泄漏',
        '涉密原因不提供源码与在线演示，可在面谈中讲解通用实现思路'
      ]
    }
  },
  {
    id: 'nrm-system',
    name: '省级涉密政务系统',
    enName: 'Provincial Confidential Gov System',
    industry: '政务',
    accent: '#AFA9EC',
    coverType: 'infra',
    coverLabel: '省级涉密政务系统',
    summary:
      '驻场广西壮族自治区自然资源厅，基于若依 RuoYi-Vue 开发省级涉密政务系统，负责多个业务模块的完整实现。',
    features: [
      '基于若依 RuoYi-Vue 的业务模块开发与迭代',
      '涉密环境下的权限与数据边界处理',
      '驻场需求沟通、开发联调与现场问题处理'
    ],
    techStack: ['Vue2', '若依 RuoYi-Vue', 'Element UI', 'Java Spring Boot（若依后端）', '保密 / 内网环境'],
    period: '2023 - 2024',
    role: '前端开发 · 驻场交付',
    confidential: true,
    links: [{ kind: 'detail' }],
    caseStudy: {
      background: '项目为省级涉密政务系统，驻场交付，系统细节依据保密要求不做公开。',
      contributions: [
        '独立完成多个业务模块的前端开发与联调',
        '涉密环境下的数据权限与展示边界处理',
        '驻场期间的需求响应与问题闭环'
      ],
      techNotes: [
        '涉密内网环境：依赖离线引入、无外网 CDN，构建流程按内网部署要求调整',
        '若依的权限链路在此场景下需叠加更严格的字段级控制',
        '因保密要求不提供源码、截图与在线演示'
      ],
      results: [
        '为解决「涉密项目不能演示」的问题，我用公开数据重建了同架构的可公开演示版本 —— 见作品《广西自然资源综合监测平台》'
      ]
    }
  },
  {
    id: 'gx-nrm-monitor',
    name: '广西自然资源综合监测平台',
    enName: 'Guangxi NRM Monitoring Platform',
    industry: '政务',
    accent: '#2f6fd0',
    coverType: 'saas',
    coverLabel: '自然资源综合监测一张图',
    summary:
      '自然资源「一张图」监测场景的前端完整实现：综合监测大屏 + 地图分级下钻 + 图斑管理 + 任务调度 + 多维分析，覆盖耕地、违法用地、矿产、地灾、感知五类业务数据。原业务系统涉密不可对外演示，故用公开地理数据与模拟业务数据重建了同架构、可公开演示的版本（个人重构演示项目，非客户交付项目）。',
    features: [
      '综合监测大屏：6 项核心指标 + 广西行政区地图 + 5 类图表一屏集成，含实时动态流与设备在线状态',
      '地图分级监测：行政区板块按违法办件数量五级配色（绿→蓝→橙→深橙→暗红）并附分级图例',
      '三级下钻：全区 → 地市 → 县区 → 乡镇，面包屑可逐级返回，点击统计散点也能继续下钻',
      '图斑管理：变化图斑的地图分布与列表联动，点击图斑直达详情；大屏与图斑页可互相深链跳转',
      '任务调度闭环：任务列表支持筛选与状态流转，详情用弹窗查看、派发用弹窗操作（确定/取消），不跳页打断上下文',
      '多维数据分析：14 地市 × 5 指标对比表，综合指数量化进度条 + 图表联动，表格与图表等高对齐',
      '其余业务模块：耕地保护、违法用地、矿产监管、地质灾害隐患、感知监测、成果管理'
    ],
    techStack: ['Vue3', 'Vite', 'Element Plus', 'ECharts', 'Vue Router', 'Java Spring Boot（后端）', 'GeoJSON 地图下钻', 'dayjs'],
    period: '2026',
    role: '个人项目 · 独立完成前端架构、可视化与交互实现',
    confidential: false,
    links: [{ kind: 'detail' }],
    caseStudy: {
      background:
        '我在自治区自然资源厅驻场交付的省级政务系统签有保密协议，无法对外展示任何界面。为了让招聘方能直接看到我在这个行业里的交付能力，我用公开的行政区划边界数据与模拟业务数据，重建了一个同架构、可公开演示的综合监测平台：同样的业务域（耕地 / 违法用地 / 矿产 / 地灾 / 感知 / 变化图斑）、同样的技术选型（Vue3 + Element Plus + ECharts + 若依风格的后台管理范式）、同样的大屏与地图交互模式。需要说明的是：这是个人重构演示项目，不是客户交付项目。',
      contributions: [
        '从零搭建前端架构：路由与布局壳、主题色板、图表工厂、异步数据层与页面状态机（loading / error / 重试）',
        '综合监测大屏：指标卡、地图、饼图、柱状、雷达、实时动态流的整屏编排与配色统一',
        '地图分级与下钻：行政区按违法办件数分档填色 + 三级下钻 + 面包屑回退 + 图斑深链跳转',
        '业务页面与交互：任务调度、图斑管理、多维分析等 13 个路由，列表详情/派发改为弹窗交互',
        '视觉与布局打磨：浅色中台主题、侧栏与顶栏品牌渐变、面板弹性等高、表格列宽自适应'
      ],
      techNotes: [
        '主题层集中管理：色板、分级色阶、图表工厂（坐标轴 / 柱状渐变 / 饼图样式 / 表格样式）统一在 config/theme，改一处全站生效，避免每个页面手抄色值',
        '地图配色不是单色底：按当前层级的违法办件数在 min~max 区间等分 5 档；乡镇层数据量小时自动切换为整数递增分档，避免图例出现「2~2」这类空档',
        '三级下钻共用一套 GeoJSON 注册与面包屑回退逻辑；统计散点（无图斑 ID）走下钻、图斑散点（带 patchId）走详情跳转',
        '数据层：所有页面走 api 异步层 + useAsyncData（loading / error / 重试），彻底去掉同步 import mock，页面状态机完整',
        '交互取舍：列表的详情与派发改为弹窗（带确定 / 取消），避免跳页丢失筛选条件与滚动位置——政务系统的高频操作不该打断上下文',
        '布局：侧栏 / 顶栏 / 画布按品牌色统一；大屏左列与地图面板弹性等高；底部表格用 fit + min-width 做列宽自适应，不再留右侧空白'
      ],
      results: [
        '为「涉密项目不能演示」提供了可公开讲解的替代方案：面试时可当场打开，不接触任何真实项目数据',
        '13 个路由逐页验证零控制台报错，下钻、弹窗、深链跳转等交互闭环均已跑通'
      ]
    }
  },
  {
    id: 'farmland-one-map',
    name: '县域高标准农田一张图',
    enName: 'County Farmland One-Map',
    industry: '农业',
    accent: '#3E9B4F',
    coverType: 'water',
    coverLabel: '农田上图核查 · GIS 一张图',
    summary:
      '面向高标准农田建设「上图入库 + 底数核查」场景的 GIS 一张图演示系统：图斑核查状态三色上图、农田设施要素（渠/路/塘）、外业举证照片挂接、项目区统计联动，前后端分离、接口层预留完整。',
    features: [
      '一张图核心：地块图斑按核查状态三色渲染（已核实 / 存疑 / 图数不符），点击弹出详情与外业举证照片',
      '项目区管理：三个项目区列表点击飞行定位，统计面板按项目自动过滤（图斑数 / 面积 / 完成率）',
      '农田设施图层：灌排渠、机耕路（线要素）与蓄水池、泵站（点要素）独立图层与开关',
      '图层管理：图斑 / 项目区 / 标注 / 设施四组图层独立控制，图例完整',
      '底图可切换：高德（演示） / 天地图 WMTS / 内部 ArcGIS Server 切片服务，配置驱动、切换即用',
      '统计联动：ECharts 地类构成饼图 + 核查完成率进度条，随选中范围实时刷新'
    ],
    techStack: ['Vue3', 'Vite', 'Element Plus', 'OpenLayers 10', 'ECharts 5', 'GeoJSON', '天地图 / ArcGIS Server 瓦片服务', '接口层预留（可接若依后端）'],
    period: '2026',
    role: '个人项目 · 独立完成（前端架构 + GIS 可视化 + 交互）',
    confidential: false,
    links: [{ kind: 'detail' }],
    caseStudy: {
      background:
        '2026 年广西正按自治区统一部署开展高标准农田建设底数核查（解决上图入库「图、数、地」不一致问题，成果须接入全国农田建设综合监测监管平台）。县级核查与「一张图」监管系统的采购密集落地，而这批项目的中标方多为测绘 / 规划设计单位，软件能力普遍是短板。本作品针对这个场景，用公开数据与虚构图斑重建了一个可演示的「县域一张图」：业务形态对齐真实核查流程（图斑核查状态、项目区进度、设施要素、举证照片），数据全部为虚构，不接触任何真实图斑数据。',
      contributions: [
        'OpenLayers 地图核心：GeoJSON 图斑渲染、按核查状态动态样式、点击选中与项目区飞行定位',
        '设施要素层：渠 / 路线要素与蓄水 / 泵站点要素的符号化渲染与图层联动',
        '底图配置驱动：高德 / 天地图 WMTS / 内部 ArcGIS Server 切片一套配置切换，交付时直接指向甲方内网服务',
        '数据接口层：USE_MOCK 开关 + 统一请求封装，mock / 真实后端组件零改动切换，预留认证 Token 注入位'
      ],
      techNotes: [
        '底图合规：公开演示走高德瓦片，正式交付切换天地图（CGCS2000 对齐政务要求），内部地图走 ArcGIS Server 缓存切片 —— 三种来源在同一套图层代码下工作',
        '样式即状态：图斑 fill 色由核查状态字段驱动，选中项目后重刷样式实现业务高亮，无需冗余图层',
        '接口层设计：组件只依赖 api 异步层，数据库层无论 MySQL 还是达梦 / 人大金仓对前端透明 —— 国产化适配收敛在后端，前端构建产物为纯静态文件',
        '举证照片占位：按图斑 ID 生成固定 SVG data-URI 占位图，接口位已留好，真实交付时替换为外业 App 拍照挂接'
      ],
      results: [
        '形成可对外演示的县域高标农田一张图完整 Demo，覆盖上图展示 / 设施要素 / 举证挂接 / 统计联动全场景',
        '与《广西自然资源综合监测平台》构成「自然资源 + 农业农村」两张一张图，GIS 一张图类交付能力可互相印证'
      ]
    }
  },
  {
    id: 'mobile-access',
    name: '广州移动智能门禁',
    enName: 'Guangzhou Mobile Smart Access',
    industry: '运营商',
    accent: '#EF9F27',
    coverType: 'telecom',
    coverLabel: '智能门禁管理系统',
    summary:
      '职业生涯起点：驻场中国移动广州分公司总部开发的智能门禁系统。原系统运行于内部环境无法对外演示，因此我用最新 Angular 重建了同构脱敏演示版「智汇门禁管理平台」——同样的业务模块与技术范式，数据均为虚构，本页截图均来自重建演示版。',
    features: [
      '数据看板：今日通行人次 / 本周访客登记 / 待审批访客 / 设备在线率 4 项核心指标 + 近 7 日通行趋势 + 门点通行排行',
      '人员管理：部门树 + 人员台账，人脸采集状态标注、部门筛选、人员增删改查与搜索',
      '通行权限配置：权限组管理，按「门点 × 时段」下发通行授权，授权明细分页管理',
      '访客管理：来访登记、审批、在访状态与离场留痕，全流程可追溯',
      '通行记录：进出明细多条件查询（门点 / 通行方式 / 通行结果），配套结果统计',
      '设备管理：门禁设备台账（人脸闸机 / 刷卡读卡器 / 二维码终端 / 电控锁），在线状态监控与远程重启',
      '系统设置：操作日志审计（等级筛选 + 分页）、系统参数配置、角色权限说明',
      '平台能力：登录鉴权 + 路由守卫、侧栏 / 顶栏固定布局、全列表统一分页、固定视口内表格吸顶与横向滚动'
    ],
    techStack: ['AngularJS', 'jQuery', '重建演示版：Angular 21', 'TypeScript', 'Angular Signals', 'ECharts', 'Java Spring Boot（后端对接）'],
    period: '2017 - 2018 · 演示版 2026',
    role: '前端开发 · 驻场交付（演示版独立重建）',
    confidential: false,
    links: [{ kind: 'detail' }],
    caseStudy: {
      background:
        '这是我职业生涯的起点：由广州丰石科技派驻中国移动广州分公司总部，参与智能门禁系统的前端开发，也是我第一次体验甲方驻场交付的工作方式。原系统运行在运营商内部环境，无法对外演示；为了让面试官能直接看到这个业务域的交付能力，2026 年我用最新 Angular 重建了同构脱敏演示版「智汇门禁管理平台」——保留同样的业务模块划分（人员 / 权限 / 访客 / 通行记录 / 设备）与后台管理范式，数据全部为虚构。',
      contributions: [
        '原项目：人员管理、通行权限配置页面的开发，访客记录与通行记录的查询展示实现',
        '原项目：驻场期间配合甲方做需求确认与现场调整',
        '重建版：独立完成 8 大模块的需求还原、页面设计与前端实现（登录 + 数据看板 + 6 个业务模块）',
        '重建版：数据看板 ECharts 图表编排、通用分页组件、操作日志审计与设备远程重启等完整业务闭环'
      ],
      techNotes: [
        '原项目技术栈为 AngularJS + jQuery，双向数据绑定极大简化了配置类表单的开发',
        '重建版采用最新 Angular（Standalone 组件 + Signals + Zoneless + @if/@for 控制流），是一次从 AngularJS 到现代 Angular 的完整对照实践',
        '重建版采用固定视口后台范式：侧栏 / 顶栏固定、路由区内部滚动、表头吸顶、宽表横向滚动、列表统一分页',
        '登录态 localStorage 持久化 + CanActivate 路由守卫，对齐真实项目的 Token 守卫模式',
        '门禁场景对数据准确性要求高，表单校验与关键操作二次确认在两个版本中都做了完整处理'
      ],
      results: [
        '重建演示版含 8 大核心模块、8 个核心页面，本页作品截图均为演示版实际运行画面',
        '一次从 AngularJS（2017）到最新 Angular（2026）的同业务域对照，可以讲清框架演进与前端选型判断'
      ]
    }
  },
  {
    id: 'wendeng-zsb',
    name: '广西文登专升本院校专业查询',
    enName: 'Guangxi WenDeng Query',
    industry: '教育',
    accent: '#5B8FF9',
    coverType: 'query',
    coverLabel: '专升本择校查询小程序',
    summary:
      '面向广西专升本考生的择校查询小程序（微信搜索「广西文登专升本」可直接体验）：填写就读专业自动判定专业大类，一路查出可报本科专业、可报院校、招生计划与考试科目。我负责全部前端实现，后端由另后端人员基于 Spring Boot 提供。',
    features: [
      '专业大类判定：填写入学年份、就读院校、专业、生源地区与考生类型后自动判定所属大类，首页常驻展示',
      '可报专业查询：列出该大类可报本科专业，含专业类别、公办/民办招生院校数与人数、男女比例、平均年薪、考公与考研适配度',
      '可报院校查询：院校列表含城市、办学类型、是否保研、招生专业数与规模，支持按城市/类型/热度筛选排序',
      '招生计划与分数：下钻到单个院校，按考生类型（普通考生 / 建档立卡 / 退役士兵）查看招生计划、学制、学费、就读校区',
      '考试科目查询：公共课 + 专业课的科目、分值、考试时间，以及各科考试范围与题型分值',
      '志愿填报参考：输入分数与全区排位，匹配往年同位次录取数据，输出「冲 / 稳 / 保」三类院校清单',
      '分享有礼与会员体系：生成专属二维码，按邀请注册人数解锁 VIP 无限查询与备考资料权益'
    ],
    techStack: ['微信小程序原生', 'JavaScript', 'WXML / WXSS', 'RESTful 接口对接', 'Java Spring Boot（后端人员负责）'],
    period: '2023',
    role: '前端开发 · 负责全部前端实现（后端由后端人员开发）',
    confidential: false,
    links: [{ kind: 'detail' }],
    caseStudy: {
      background:
        '广西专升本考生的核心痛点是信息不对称：考试院发布的招生计划是几十页表格，考生很难快速回答"我这个专科专业能报哪些本科专业、哪些院校、往年要多少分"。广西文登教育（专注广西统招专升本辅导）要做的就是把这些数据变成随手可查的工具——小程序收录近三年录取数据，覆盖 35 所招生院校、208 个专业。2023 年我和朋友一起做这个项目，我负责小程序的全部前端实现，后端由后端的人员用 Spring Boot 提供接口。',
      contributions: [
        '全部前端页面实现：首页功能入口、专业大类判定流程、可报专业 / 可报院校列表与筛选、院校与专业详情、考试科目、志愿填报结果',
        '数据链路编排：把「就读专业 → 专业大类 → 可报本科专业 → 招生院校 → 招生计划与分数」串成一条查询主线，考生填一次信息就能一路查到底',
        '列表页的筛选与排序交互：按城市、办学类型、公办 / 民办、招生规模多维筛选',
        '个人中心：基本信息填报与判定结果展示——该信息仅允许修改一次，前端做锁定与二次确认'
      ],
      techNotes: [
        '数据量不小（院校 × 专业 × 考生类型 × 年份），长列表走分页 / 触底加载，避免一次性渲染导致滚动卡顿',
        '查询结果依赖多层嵌套数据，前端做本地缓存复用，切换筛选条件时不再重复请求',
        '与后端约定以「专业大类」为核心维度组织接口，客户端只做展示与筛选，不在前端做业务判定，保证数据口径统一',
        '招生计划按年度变化，前端保留年份切换能力，不做硬编码'
      ],
      results: [
        '微信搜索「广西文登专升本」即可直接体验——这是继易薪资之后，我履历里第二个面试官能当场搜到的公开产品',
        '小程序收录近 3 年录取数据，覆盖 35 所招生院校、208 个专业（截至最新版本，上线后由团队持续迭代）'
      ]
    }
  },
  {
    id: 'GuiBeiCai',
    name: '桂备菜',
    enName: 'GuiBeiCai',
    industry: '餐饮',
    accent: '#ef4527',
    coverType: 'ai',
    coverLabel: 'AI 智能备菜预测系统',
    summary:
      '和朋友自研的广西AI智能备菜预测系统',
    features: [
      '工作台首页：各类数据的统计与可视化展示',
      '智能预测：数据上传，执行预测，预测总览，预测结果推送',
      '数据管理：门店管理，菜品管理，食材管理，数据初始化，post数据对接'
    ],
    techStack: ['Workbuddy','Python', 'JavaScript', 'HTML / CSS', 'Java Spring Boot（后端）'],
    period: '2026 - 2026',
    role: '前端开发 · 远程协作',
    confidential: false,
    links: [{ kind: 'detail' }],
    caseStudy: {
      background:
        '这是我们做餐饮的一个朋友聊天的时候提出来的一个想法，想要做一个AI智能备菜预测系统，帮助餐饮老板更好的管理库存和备菜。',
      contributions: [
        '工作台首页：各类数据的统计与可视化展示',
        '智能预测：预测总览，预测结果推送',
        '数据管理：数据集中管理模块'
      ],
      techNotes: [
        '技术栈为 Python + javascript，进行页面的开发与逻辑处理'
      ]
    }
  },
  {
    id: 'giftnotify',
    name: '节假日礼品发放小程序',
    enName: 'GiftNotify',
    industry: '企业服务',
    accent: '#F5A623',
    coverType: 'miniapp',
    coverLabel: '微信小程序 · 批量消息推送',
    summary:
      '面向公司节假日礼品发放场景的微信小程序，把人工逐条编辑、核对、发送的流程做成「批量选人 → 批量编辑 → 暂存 → 一键推送」。',
    features: [
      '批量选择微信好友：搜索、多选、全选/取消，选中后自动为每人生成独立表单行',
      '批量编辑表单：推送称呼、时段问候、祝福文案模板、快递公司与单号，全字段可手动修改',
      '时段问候语按系统时间自动匹配（上午/中午/下午/晚间），手动修改优先级高于自动匹配',
      '暂存列表：未发送任务本地永久留存，可再次进入继续编辑、续发，发送成功后自动清除',
      '一键批量推送：自动组装「称呼 + 问候 + 祝福 + 快递信息」，逐条发至对应好友会话；暂存/发送/删除均有二次确认'
    ],
    techStack: ['微信小程序原生', 'WXML / WXSS', 'JavaScript', 'Java Spring Boot（后端接口）', '微信好友选择能力', '本地存储 Storage'],
    period: '2026',
    role: '需求梳理 + 小程序开发',
    confidential: false,
    links: [{ kind: 'detail' }],
    caseStudy: {
      background:
        '公司每逢节假日要为优秀员工、核心董事统一发放礼品快递通知，原先需逐个修改昵称、手机号、快递单号、祝福语再手动发微信，人工单条操作繁琐、效率低、易出错。这个小程序把整条链路自动化，同时统一了对外话术。',
      contributions: [
        '梳理并输出完整需求文档：从首页入口、选人流程、表单字段到暂存与推送规则，逐条定义清楚',
        '礼品发放三步流程实现：批量选好友 → 批量生成并编辑表单 → 暂存或直接发送',
        '暂存能力设计：完整表单数据本地留存，支持二次编辑与续发，规避误操作导致的数据丢失',
        '消息组装规则：称呼 + 时段问候 + 主体祝福 + 快递信息，保证逐条精准匹配到对应好友'
      ],
      techNotes: [
        '问候语按系统时间分段自动填充（06/12/14/18 四个时段），并保留人工覆盖能力——优先级明确为手动 > 自动',
        '所有关键操作（暂存、发送、删除）都加二次确认弹窗，批量场景下误触代价太高',
        '暂存数据写本地 Storage，不依赖后端，小程序重装前不丢失；发送成功后再做清理，避免"发了但没记录"',
        '批量表单渲染按人数动态生成，需保证多选大批量好友时页面不卡顿、已编辑内容切页不丢'
      ]
    }
  }
]

export function getProject(id: string): Project | undefined {
  return projects.find((p) => p.id === id)
}
