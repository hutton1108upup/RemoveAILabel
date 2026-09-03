# RemoveAILabel 前端设计规范（Codex 实现专用）

> 文档版本：v1.0
> 配套文件：`RemoveAILabel_PRD_v3_Codex.md`（产品与文案唯一来源）、`RemoveAILabel - 垂直工具站设计系统与首页.pdf`（视觉走查参照）、`tokens.css`（设计令牌，可直接引入）
> 适用范围：Site A 全部页面（首页工具页 + 6 个内容页 + guides/about/privacy/terms）
> 定位说明：本文档只规定**视觉与交互实现**；页面文案、TDH、关键词、合规红线一律以 PRD v3 为准，二者冲突时 PRD 优先。

---

# 1. 设计语言概述

| 维度 | 决策 | 理由 |
|---|---|---|
| 整体气质 | 浅色、清爽、专业工具感（soft-tech） | 目标用户是摄影师/运营，要"可信的实用工具"而非"酷炫 AI 产品" |
| 主色 | 青绿 teal `#0D9487` | 传达"安全、通过、干净"，与成功态同族但明度区分 |
| 暗色 | 深藏青 `#0A1426` **仅用于"能力边界/信任"区块与 Site B 导流卡** | 暗色是稀缺资源，全站最多出现 2 处，滥用会失去强调作用 |
| 字体 | Inter（UI 全文）+ JetBrains Mono（文件名/字节数/Hash/路由/状态标签） | 等宽字体强化"元数据工具"的技术可信度 |
| 质感 | 平涂 + 1px 细边框 + 极浅投影，**不用渐变、不用玻璃拟态、不用装饰大图** | 工具站首屏必须让位给 Dropzone |

---

# 2. 设计令牌（Design Tokens）

## 2.1 颜色

令牌已导出为 `tokens.css`，可直接 `@import`。Tailwind 按下表映射到 `theme.extend.colors`：

| Token | 值 | 用途 |
|---|---|---|
| `canvas` | `#FAFAF7` | 页面底色（暖白，不用纯白） |
| `surface` | `#FFFFFF` | 卡片、表格、Dropzone、Header 底色 |
| `ink` | `#1C1A17` | 一级文字（标题、正文强调） |
| `ink-secondary` | `#57544F` | 二级文字（正文、说明） |
| `ink-tertiary` | `#A8A39E` | 三级文字（caption、占位、禁用） |
| `accent` | `#0D9487` | 主按钮、链接、进行中状态、聚焦环 |
| `accent-hover` | `#0F756E` | 主按钮 hover/active |
| `accent-soft` | `#F0FCFA` | accent 浅底（高亮卡、对比表我方列、选中态） |
| `accent-border` | `#99F5E3` | accent 浅底上的边框/分隔线 |
| `border` | `#E8E5E3` | 卡片、表格、分隔线统一边框色 |
| `success` / `success-soft` | `#17A34A` / `#DBFCE8` | Removed / Preserved / Clean copy ready |
| `warning` / `warning-soft` | `#D97805` / `#FFF2C7` | Review needed / Possible findings / Beta 标签 |
| `danger` / `danger-soft` | `#DB2626` / `#FFE3E3` | Failed / Unsupported / 错误提示 |
| `navy` | `#0A1426` | 信任区、Site B 卡底色 |
| `navy-card` | `#17243B` | navy 区块内的卡片底 |
| `navy-text` | `#CCD6E0` | navy 区块内的二级文字（一级文字用 `#FFFFFF`） |

**规则：**
- 所有边框只用 `border` 一个色，不要发明灰色阶。
- 状态色必须"前景色 + 对应 soft 底色"成对使用（如 success 文字配 success-soft 底），不允许单独用纯色块。
- navy 区块内不使用 accent-soft/success-soft 等浅底色，状态用 `success` 纯色文字即可。

## 2.2 字体与字阶

```text
font-sans:  Inter, system-ui, sans-serif
font-mono:  "JetBrains Mono", ui-monospace, monospace
```

| 层级 | 字号 | 字重 | 行高 | 用途 |
|---|---|---|---|---|
| Display | 56 / 移动 36 | 600 | 1.1 | 首页 H1（唯一使用处） |
| H2 | 36 / 移动 28 | 600 | 1.2 | 各 section 标题 |
| H3 | 22 | 600 | 1.3 | 卡片标题、子区块标题 |
| Body-L | 17 | 400 | 1.6 | Hero 副标题、重要说明 |
| Body | 15 | 400 | 1.6 | 正文、卡片描述 |
| Small | 13 | 400/500 | 1.5 | 辅助说明、表头、chip |
| Caption | 12 | 500 | 1.4 | 徽章、来源标注、Last reviewed |

- 字重只允许 400 / 500 / 600，不用 700+。
- JetBrains Mono 使用场景：文件名、文件大小、Hash、路由路径、状态机标签（如 `Scanning`）、对比表中的技术名词。
- 中英文/混排不做特殊处理，全站英文内容。

## 2.3 圆角 / 间距 / 阴影

```text
radius-card:   16px   /* 所有卡片、Dropzone、表格容器 */
radius-button: 12px   /* 按钮、输入框 */
radius-chip:   999px  /* 徽章、状态标签、信任 chip */
```

间距体系（4 的倍数）：

| Token | 值 | 用途 |
|---|---|---|
| `section-y` | 96 / 移动 64 | 区块上下 padding |
| `gutter` | 120（桌面内容最大宽 1200 居中） | 页面左右留白 |
| `gap-lg` | 32 | 卡片网格间距、区块内大间距 |
| `gap-md` | 20 | 卡片内元素间距 |
| `gap-sm` | 12 | 图标与文字、chip 组间距 |

阴影只允许两个：

```css
/* shadow-card：卡片默认 */
box-shadow: 0 1px 2px rgba(28,26,23,0.04), 0 8px 24px -12px rgba(28,26,23,0.08);
/* shadow-cta：主按钮 */
box-shadow: 0 8px 20px -4px rgba(13,148,135,0.25);
```

## 2.4 Tailwind 配置参考

```js
// tailwind.config.js（片段，Codex 可按需调整写法）
theme: {
  extend: {
    colors: {
      canvas: '#FAFAF7', surface: '#FFFFFF',
      ink: { DEFAULT: '#1C1A17', secondary: '#57544F', tertiary: '#A8A39E' },
      accent: { DEFAULT: '#0D9487', hover: '#0F756E', soft: '#F0FCFA', border: '#99F5E3' },
      border: '#E8E5E3',
      success: { DEFAULT: '#17A34A', soft: '#DBFCE8' },
      warning: { DEFAULT: '#D97805', soft: '#FFF2C7' },
      danger:  { DEFAULT: '#DB2626', soft: '#FFE3E3' },
      navy: { DEFAULT: '#0A1426', card: '#17243B', text: '#CCD6E0' },
    },
    fontFamily: {
      sans: ['Inter', 'system-ui', 'sans-serif'],
      mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
    },
    borderRadius: { card: '16px', button: '12px', chip: '999px' },
    maxWidth: { content: '1200px' },
  }
}
```

---

# 3. 全局布局

```text
页面容器：max-width 1200px，水平居中
左右 padding：桌面 120px 自然留白（由 max-width 实现），平板 32px，移动 20px
区块垂直节奏：py-24（96px）/ 移动 py-16（64px）
区块标题区：H2 + 可选副标题，居中对齐，距内容 48px
背景交替：canvas（默认）→ surface（卡片容器承载）→ navy（信任区，全站一次）
```

**断点：**

| 断点 | 范围 | 关键行为 |
|---|---|---|
| mobile | < 768px | 单列；网格全部堆叠；Header 折叠为菜单按钮；Display 降为 36px |
| tablet | 768–1023px | 2 列网格；gutter 32px |
| desktop | ≥ 1024px | 设计稿原始布局 |

---

# 4. 通用组件规范

## 4.1 按钮

| 类型 | 规格 |
|---|---|
| Primary | 底 `accent`，文字白，radius-button，padding `15px 32px`，字号 16/600，shadow-cta；hover 底 `accent-hover`；active 下移 1px |
| Secondary | 底 `surface`，1px `border` 边框，文字 `ink`；hover 边框 `accent` + 文字 `accent` |
| Ghost / 链接 | 文字 `accent`，无底色；hover 下划线；带箭头图标时图标 16px、间距 8px |
| 危险操作（如 Remove file） | 文字 `danger`，hover 底 `danger-soft` |

- 最小触控区域 44×44px（PRD §18.4）。
- 加载态：左侧 16px spinner + 文案（如 `Preparing…`），按钮保持宽度不变（防 CLS）。

## 4.2 状态徽章（Status Badge）

工具状态机的唯一视觉表达，**全部用 chip（radius-chip，padding `4px 12px`，字号 12/500，JetBrains Mono）**：

| 状态 | 配色 |
|---|---|
| `Queued` / `Waiting` | ink-secondary 文字 + border 边框，白底 |
| `Validating` / `Scanning` / `Preparing` | accent 文字 + accent-soft 底 + accent-border 边框 |
| `Clean copy ready` / `Verified` | success 文字 + success-soft 底 |
| `Already clean` | ink-secondary 文字 + border 边框（中性，不用 success——没有产生副本） |
| `Review needed` / WebP `Beta` | warning 文字 + warning-soft 底 |
| `Failed` / `Unsupported` | danger 文字 + danger-soft 底 |

## 4.3 卡片（Card）

```text
基础卡：surface 底 + 1px border + radius-card + shadow-card + padding 24-32px
图标卡：顶部 40px 方形图标位（accent-soft 底 + accent 图标，radius 12px），
        下接 H3 + Body 描述
高亮卡（What we preserve 用）：accent-soft 底 + accent-border 边框，不用 shadow
暗卡（navy 区块内）：navy-card 底 + 无边框 + 白标题 + navy-text 正文
```

hover 微交互（仅可点击卡）：translateY(-2px) + 阴影加深，200ms ease。纯展示卡无 hover。

## 4.4 Dropzone（首页核心组件）

```text
容器：surface 底，2px dashed border，radius-card，padding 48px 32px，居中文案
图标：48px upload 图标，accent 色
主文案：Body-L / ink —— Drop images here, paste from your clipboard, or choose files
副文案：Small / ink-tertiary / mono —— JPG & PNG · WebP beta · Up to 25MB each · No upload
内嵌 Secondary 按钮：Choose files

交互态：
- hover：border 变 accent
- dragover：底变 accent-soft + border 实线 accent + 图标上浮 2px
- 粘贴/选择后立即进入 scanning 态（PRD §5，无"Uploading"字样）
- 键盘可聚焦（role="button", tabindex=0, Enter/Space 触发文件选择）
```

## 4.5 Verification 表（Before / After 报告，PRD §5.5）

```text
容器：surface + border + radius-card
表头三列：项目名（左）/ Before（中）/ Clean copy（右），Small/500/ink-secondary
行高 44px，行间 1px border 分隔
单元格状态：
  Found        → ink（中性陈述）
  Not found    → ink-tertiary
  Removed      → success + 左侧 14px check 图标
  Preserved    → success 文字（相机 EXIF/ICC 等，差异化卖点）
  Preserved*   → success + 星号，表尾 caption 注脚（PRD §5.5 版权说明）
  Not re-encoded → mono + success
底部操作行：Primary [Download Cleaned Image] + Ghost [Advanced Options]
```

## 4.6 FAQ 手风琴

```text
容器：surface + border + radius-card，条目间 1px border
问题行：padding 20px 24px，Body/500/ink，右侧 chevron 20px（ink-tertiary）
展开：答案 Body/ink-secondary，padding 0 24px 20px，动画 200ms
默认：仅第一条展开
键盘：button 语义 + aria-expanded
```

## 4.7 场景页入口卡片（首页 §14.10 + Related Guides）

```text
白卡 + 40px 图标位（accent-soft）+ H3 + Body 描述 + Ghost 链接（Guide →）
4 卡网格：桌面 4 列 / 平板 2 列 / 移动 1 列
```

## 4.8 Site B 导流卡（PRD §16）

```text
底 navy，radius-card，padding 32px
标题白 H3 + 正文 navy-text + Primary 按钮（accent）
出现条件严格按 PRD §16.1（下载成功后 / 无 metadata / 用户主动展开），
不得比主状态更抢眼：尺寸小于结果卡，放在结果卡之后
链接必须带 PRD §16.4 的 utm 参数
```

---

# 5. 首页区块规格（对应 PRD §14，自上而下）

> 视觉参照 PDF 首页稿；区块内容以 PRD v3 为准（PDF 基于旧版 PRD，以下标注了差异点，**以本节为准**）。

| # | 区块 | 背景 | 布局要点 |
|---|---|---|---|
| 1 | Header（§14.1） | surface，sticky，底部 1px border | 左 logo（Remove AI Label），中导航（How It Works / Instagram / Photoshop / Guides），右 Primary 按钮 `Use Free Tool`。无 Pricing/Login。移动折叠为菜单 |
| 2 | Hero + Tool（§14.2/14.3） | canvas | 居中：Caption 徽章（`Free local image tool`，accent-soft chip）→ H1 Display → 副标题 Body-L/ink-secondary → 信任条 4 chips（mono Small，白底 border）→ **Dropzone** → 工具动态区（见 §6）。工具在首屏，无装饰图 |
| 3 | What This Tool Checks（§14.4） | canvas | 4 图标卡网格（4/2/1 列）：Embedded C2PA Credentials / AI-related XMP Fields / Prompt and Workflow Data / Optional Privacy Metadata |
| 4 | What It Preserves（§14.5） | canvas | 1 张 accent-soft 高亮卡（与上区同网格收尾或独立横卡），列 6 项保留清单，文案带 `on supported files` `when separable` 限定 |
| 5 | What It Cannot Guarantee（§14.6） | **navy**（全站唯一大暗色区） | 标题白；双栏 navy-card 卡：左 `What this tool can do`（success check 图标 3-4 条），右 `What it cannot do`（danger/白 x 图标 5-6 条，文案 §2.2）；底部 4 张来源卡（Meta / TikTok or platform docs / C2PA / DeepMind SynthID，caption 级，外链 icon）。此区是转化信任核心，不得删减 |
| 6 | 目标用户场景（§14.7） | canvas | 4 场景卡：Real Photos Lightly Edited with AI / Social Media Image Preflight / Authentic Product Photo Delivery / Clean Client Copies |
| 7 | How It Works（§14.8） | canvas | 4 步横排（移动纵向）：序号用 mono accent 大字（01-04）+ H3 + Body；步骤间无连线装饰 |
| 8 | Before / After Report（§14.9） | canvas | 一张示例 Verification 表（§4.5 规格，静态演示数据）+ 下载按钮演示。**只做 Metadata 差异表，不做假视觉对比图** |
| 9 | 重点入口卡片（§14.10） | canvas | §4.7 规格，4 卡：Instagram AI Info → `/instagram-ai-info`、Photoshop Generative Fill → `/photoshop-ai-label`、Facebook AI Info → `/facebook-ai-info`、Why Does My Photo Say AI Info → `/why-does-my-photo-say-ai-info`（**路由按 PRD §12.3，勿用 PDF 上的旧路由**） |
| 10 | FAQ（§14.11） | canvas | §4.6 规格，问题从 PRD §14.11 的 10 条中选取，页面可见 FAQ 才可输出 FAQPage schema（§17.2） |
| 11 | Final CTA | canvas | 居中 H2 + 副文案 + Primary `Use Free Tool` + mono caption（No sign-up · No upload · Works offline），点击平滑滚动回 Hero Dropzone |
| 12 | Footer（§14.12） | canvas，顶部 1px border | 4 列：品牌列（logo + 一句话定位 + mono copyright）/ Guides（6 个内页链接）/ Site（About / Supported Formats / Privacy / Terms）/ 一行自然 Site B 品牌链接（§14.12，不堆关键词）。底栏 Caption/ink-tertiary |

---

# 6. 工具动态区域状态规格（PRD §5.2 状态机的视觉实现）

状态切换都在 Dropzone 下方的同一容器内完成，**不跳转 URL，不弹窗**。

| 状态 | 视觉 |
|---|---|
| `idle` | 仅 Dropzone |
| `validating` / `scanning` | 队列列表出现：每行 = 文件名（mono，截断）+ 大小（mono ink-tertiary）+ 状态徽章 + 行内进度条（2px accent）。顶部汇总 `Checking 4 of 8 files…`（Small）。**禁止出现 Uploading** |
| `preparing-clean-copy` | 该行徽章 `Preparing` + spinner |
| `ready` | 展开结果卡（§4.5 Verification 表 + 下载按钮）；多张时结果卡纵向堆叠，间距 gap-md |
| `partially-ready` | 顶部汇总条（§5.8 文案）+ 各文件卡；Primary 按钮 `[Download N Cleaned Files as ZIP]` 置汇总条右侧 |
| `already-clean` | 中性卡片：success 图标 + §5.7 文案 + Ghost `[Check Another Image]` + 可选 Site B 卡（§4.8，不抢视觉） |
| `unsupported` / `failed` | danger-soft 底提示行：danger 图标 + §21.2 对应文案；单文件失败不影响队列其余文件，队列继续 |
| C2PA 首次提醒（§2.4） | 结果卡顶部 warning-soft 提示条（非阻断、无需确认按钮，展示一次即可） |

**Advanced Options（§5.6）：** 默认折叠的 secondary 面板，展开后两组 checkbox（Recommended AI Label Clean 7 项默认全选 / Privacy Clean 1 项默认不选）+ `[Regenerate Clean Copy]` Secondary 按钮。checkbox 用 accent 选中色，radius 4px。

**批量队列规则：** 超出 §4.2 限制时不弹付费墙，在队列顶部显示 warning 提示行（拆批建议）。

---

# 7. 内页模板规格（PRD §15 统一模板）

所有场景页（`/instagram-ai-info` 等 5 页）+ `/supported-formats` 共用同一骨架，只换内容：

```text
Breadcrumb（Small，ink-tertiary，当前页 ink，面包屑输出 BreadcrumbList schema）
H1（H2 字号即可，不用 Display）+ Quick Answer（accent-soft 高亮卡，Body-L）
Embedded Tool（复用首页工具组件，嵌入上下文）
Last Reviewed / Evidence Note（caption mono ink-tertiary，§15.2 三行）
Why This Can Happen（H2 + 正文，可配简单列表）
What the Tool Can Check / Cannot Change（复用首页 §5 双栏卡样式，但白底版：
  浅色页面上用 surface 卡 + success/danger 图标，不再用 navy）
Step-by-Step Pre-Publish Workflow（复用 How It Works 序号样式）
How to Verify the Cleaned File（正文 + 可嵌示例 Verification 表）
Common Misunderstandings（列表，danger x 图标）
FAQ（§4.6）
Related Guides（§4.7 卡片 3-4 张）
```

`/about` `/privacy` `/terms`：窄栏（max-width 720px）正文排版，H2 分节，无卡片装饰。

`/guides`：聚合页，H1 + 全部指南卡的网格（§4.7）。

---

# 8. 图标与插图

- 图标库：**Lucide React**，全站统一 stroke 1.5px，尺寸 16 / 20 / 24 / 40 / 48 五档。
- 状态语义固定：check=成功/保留，x=不能/失败，alert-triangle=警告/Review，info=提示，shield-check=隐私/本地，file-check=验证通过，download=下载，upload=Dropzone。
- **不使用任何插图、3D 图、人物图、装饰 hero 图**；需要"示例"时一律用真实的 Verification 表组件做演示。

---

# 9. 可访问性与交互细节（PRD §18.4 落地）

- 焦点环：2px accent outline，offset 2px，全站可聚焦元素统一。
- 状态变化区域（队列、结果卡）容器加 `aria-live="polite"`。
- 错误不只靠颜色：danger 状态必须同时带图标 + 文字。
- 自动处理流程不得抢夺焦点；结果出现时不自动 scroll（用户主动触发的展开除外）。
- 对比度：ink/canvas、ink-secondary/canvas、白/accent 均满足 AA；ink-tertiary 仅用于非关键文字。

---

# 10. 文案与合规红线（实现时逐条核对）

1. 所有页面文案以 PRD v3 §13 TDH 表与各节文案块为准，**设计稿 PDF 中的旧文案（旧路由、旧清单条目）如与 PRD 冲突，一律以 PRD 为准**。
2. 禁止文案见 PRD §13.1（`Guaranteed Instagram fix` / `Bypass automated detection` / `100% undetectable` 等），按钮、徽章、alt、title 中同样禁止。
3. 路由唯一来源是 PRD §12.3：`/instagram-ai-info` `/facebook-ai-info` `/photoshop-ai-label` `/why-does-my-photo-say-ai-info` `/c2pa-ai-label` `/supported-formats` `/guides` `/about` `/privacy` `/terms`。
4. 工具区任何位置不得出现 `Uploading` 字样；成功文案用 `Encoded image payload not re-encoded`，禁止 `bit-for-bit identical`（§8.3）。
5. Site A 不为 Site B 泛词建页（§12.2），Footer/内链锚文本同样遵守。

---

# 11. 交付检查清单（Definition of Done — 视觉部分）

- [ ] tokens.css 或等价 Tailwind theme 已接入，全站无色值硬编码
- [ ] 首页 12 区块顺序与 §5 一致，navy 暗色区全站仅出现 1 次（Site B 卡除外）
- [ ] 工具 9 种状态徽章配色与 §4.2 一致，无 Uploading 文案
- [ ] Verification 表 6 种单元格状态样式齐全，Preserved* 有注脚
- [ ] 移动端（375px）无横向滚动，按钮触控区 ≥ 44px
- [ ] Lucide 图标统一 1.5px stroke，无第三方图标混入
- [ ] 无任何渐变/玻璃拟态/装饰大图
- [ ] CLS：按钮加载态宽度不变，结果卡出现预留最小高度

---

*设计走查参照：`RemoveAILabel - 垂直工具站设计系统与首页.pdf`。实现中遇到本规范未覆盖的组件，按"§4 通用组件"就近套用，保持令牌一致即可。*
