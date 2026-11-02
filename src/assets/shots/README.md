# 作品截图存放说明

详情页的「作品截图」板块会**自动读取本目录**，按"文件夹名 = 作品 id"取图，无需改任何代码。

## 怎么上传一张截图

1. 找到对应作品 id 的文件夹（如下表）；
2. 把截图直接丢进去，命名建议 `01.png`、`02.png`（按文件名排序展示）;
3. 支持 `png / jpg / jpeg / webp / gif / avif`；
4. 执行 `npm run build` 重新构建（图片随构建打进 dist），再上传 dist 到静态托管即可。

## 作品 id 对照表

| 文件夹名 | 作品 |
| --- | --- |
| easypayroll | 易薪资 EasyPayroll |
| jingdriver | 净司机 · 网约车司机出车管家小程序 |
| farmland-one-map | 县域高标准农田一张图 |
| pinglu-canal | 平陆运河航运一张图 |
| datengxia | 大藤峡水利枢纽 · 智慧园区 |
| gxzf-platform | 广西政务一体化平台 / 智桂通 |
| bank-control | 某银行内控管理系统 |
| nrm-system | 省级涉密政务系统 |
| mobile-access | 广州移动智能门禁 |
| wendeng-zsb | 广西文登专升本院校专业查询 |
| GuiBeiCai | 桂备菜 |
| giftnotify | 节假日礼品发放小程序 |

## 注意

- 新增作品时，在 `src/data/portfolio.ts` 里定好 `id`，在这里建同名文件夹即可。
- 建议截图宽度 ≥ 1200px、单张 ≤ 500KB（大图可用 squoosh / tinypng 压一下），加载更快。
- 文件夹为空（只有 .gitkeep）时，详情页不会显示截图板块。
- 涉密项目请自行确认截图可对外展示后再放入。

## 命名规范（2026-10-22 起）

截图文件名一律用**纯 ASCII**：`01.png`、`02.png`…（保持数字序号决定轮播顺序）。

原因：中文文件名会被 Vite 编码进资源 URL，部分静态托管 / CDN 对非 ASCII 路径解码不稳定，会出现图片 404（果账通详情页已踩过坑）。

中文图注写在 `src/data/shotLabels.ts`（key = 项目 id，value = { 文件名: 图注 }）；没配映射的文件回退用「文件名去掉序号前缀」当图注。

## 水印（2026-10-23 起）

放进来的截图建议统一打上署名水印，直接执行：

```
npm run shots:watermark
```

- 脚本：`scripts/watermark-shots.cjs`（基于 sharp，斜向平铺「周赐骏 · 作品集」+ 右下角落款）。
- 首次运行会把原图备份到项目根的 `.shots-original/`；之后重复执行都从备份原图重新生成，**不会叠加两层水印**。
- 新增的未备份图片会自动补备份再打水印，所以新图丢进来后再跑一次本命令即可。
- 自定义文字：`npm run shots:watermark -- --text "你的署名"`；只处理某个作品：`-- --only farmland-one-map`。
- 换完水印记得 `npm run build` + 部署。
