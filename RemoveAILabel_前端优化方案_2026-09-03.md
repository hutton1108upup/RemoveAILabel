# RemoveAILabel.app 前端设计优化方案（MVP 走查）

> 走查日期：2026-09-03
> 走查范围：线上 https://removeailabel.app 首页（桌面 1280 / 移动 390）、内页 `/instagram-ai-info`、工具完整流程（上传 → 扫描 → 结果卡）
> 对照基准：`RemoveAILabel_前端设计规范_v1_Codex.md`、`RemoveAILabel_PRD_v3_Codex.md`
> 说明：本方案只做优化建议，不涉及代码改动；每项标注了问题证据与建议方向，可直接转交给 Codex 实现。

---

## 0. 总体结论

MVP 完成度高于预期：设计语言（soft-tech 浅色 + teal + 单一 navy 区块）基本落地，**性能非常好**（TTFB 251ms / LCP 312ms / CLS 0 / 无控制台报错），移动端无横向滚动，工具流程全链路可用。当前问题集中在三类：

1. **生产环境残留开发痕迹**（Footer 占位文案、disabled 按钮、状态文案不更新）——最伤信任，优先修；
2. **首屏与结果区的排版失衡**（孤儿 chips、大面积空白、卡片冗余）——影响专业感与转化；
3. **实现与设计规范的细节偏差**（图标、字重、对齐）——需要双向对齐（改实现或更新规范）。

---

## P0 — 上线即改（生产环境瑕疵，直接损害可信度）

| # | 问题 | 证据（走查实录） | 建议 |
|---|---|---|---|
| P0-1 | **Footer "Companion" 栏显示开发占位文案**："Visible cleanup guidance appears only when the companion site is configured." | 桌面/移动端页脚均可见 | Site B 未配置时整栏**不渲染**；配置后按 PRD §14.12 显示自然品牌链接。任何环境都不应把配置状态文案暴露给用户 |
| P0-2 | **Footer 链接列表带原生 bullet 圆点**（Guides / Site 两列），像未完成的样式 | 页脚截图，`list-style: disc` 明显 | 列表去 bullet，改为常规纵向链接（13-15px，ink-secondary，hover accent），行高 2 倍左右 |
| P0-3 | **首页示例报告 "Download example report" 按钮是 disabled 态且无任何说明**——用户视角 = 坏掉的按钮 | snapshot 确认 `[disabled]` | 二选一：①让按钮真正可下载一份示例报告（.txt/.pdf，零成本且是 SEO/信任加分项）；②移除按钮，只保留表格演示。不要保留灰色禁用态 |
| P0-4 | **工具处理完成后，队列顶部仍显示 "Checking 1 of 1 files…"**（进行中文案残留到完成态） | 上传 adobe-20220124-CA.jpg 完成后的结果区截图 | 完成后该汇总文案应切换为完成态（如 "Checked 1 file"）或随结果卡出现而移除 |
| P0-5 | **复数语法错误**："1 files checked"、"1 clean copies ready" | 结果汇总卡实录文本 | 做单复数处理（1 file / N files），或改用不涉复数的表述（"Files checked: 1"） |

---

## P1 — 首屏与核心转化区排版优化（影响专业感与工具转化率）

| # | 问题 | 证据 | 建议 |
|---|---|---|---|
| P1-1 | **Hero 信任 chips 桌面端 3+1 孤儿换行**："No image re-encoding on supported files" 单独掉一行，视觉重心歪 | 首屏截图 | 方案 A：缩短文案使 4 枚一行放下（如 "No re-encoding"）；方案 B：2×2 网格居中。移动端当前被拉伸成全宽横条（像按钮列表），应恢复 pill 形态、居中自适应排列 |
| P1-2 | **"What It Preserves" 高亮卡右侧约 60% 面积空白**，纯圆点列表撑不满横卡，像半成品 | 桌面 seg1 截图 | 改 2~3 列网格布局，圆点换 success check 图标（与 navy 区 "can do" 列表图标语义一致），顺带强化"保留什么"这个差异化卖点的可读性 |
| P1-3 | **navy 信任区来源卡 5 张白色大卡 4+1 孤儿**，且与规范"caption 级、不抢眼"定位不符，底部还留了大片暗色空白 | seg2 截图 | 改为 caption 级外链行（图标 + 名称 + 外链 icon，单行排列或可换行居中），或收成 navy-card 小卡一排 5 张。同时压缩该区块底部 padding |
| P1-4 | **结果区三张卡纵向冗余**：队列行卡 + 五行统计汇总卡 + 结果卡堆叠，单文件场景下 "0 already clean / 0 review needed / 0 unsupported" 全是零值噪音 | live-tool-result2 截图 | ①单文件时不显示五行汇总卡，直接出结果卡；②多文件时汇总改为单行紧凑统计（如 "8 checked · 6 cleaned · 1 already clean · 1 failed"，只显示非零项）；③队列行在完成态可折叠 |
| P1-5 | **"Image still looks AI-generated?" 以普通按钮形态与主下载按钮并列**，不符合规范 §4.8 对 Site B 导流"不得比主状态抢眼、放在结果卡之后"的定位；且与 P0-1 联动——companion 未配置时这个入口去向存疑 | live-tool-result3 截图 | 规范形态：结果卡之后的 navy 导流卡（或降级为结果卡底部一行 ghost 链接）；companion 未配置时不渲染 |

---

## P2 — 细节打磨与转化增强（排期宽裕时做）

| # | 问题/机会 | 建议 |
|---|---|---|
| P2-1 | **缺少 "Try a sample image" 体验入口**：手上没有合适文件的访客无法立即体验工具，首屏转化漏斗断一环 | Dropzone 副文案下方加一行 ghost 链接 "No file handy? Try a sample image"，点击直接加载内置示例图跑完整流程。工具站实测这类入口对首次使用率提升明显，成本极低 |
| P2-2 | **Final CTA 区块上下留白过大**（桌面约 200px+），页尾节奏拖沓 | padding 收至 section-y 的 0.7 倍，或与 Footer 合并视觉节奏 |
| P2-3 | **FAQ 展开图标用 +/−，规范 §4.6 要求 chevron** | 统一为 chevron 旋转 180° 动画；图标语义全站一致（规范 §8） |
| P2-4 | **移动端验证表表头堆叠错位**："Item / Before / Clean copy" 三个表头纵向堆在顶部，与下方逐行数据对应关系不明 | 移动端改为每行自带标签的卡片式行（Item 名 + Before/Clean copy 两个键值对），去掉独立表头 |
| P2-5 | **区块标题对齐与规范不一致**：规范 §3 要求 H2 居中，线上全部左对齐 | 走查判断左对齐实际观感更好（工具感更强），建议**更新规范**为左对齐并全站统一，而不是改实现 |
| P2-6 | **H1 字重疑似 700**，规范上限 600 | 核实 `font-weight`，若为 700 降到 600；同时核对 Display 字号（56/36）是否按规范 |
| P2-7 | 内页顶部 breadcrumb 与 Header 间距偏大 | 微调 padding，非必须 |

---

## 已验证达标项（无需改动）

- 性能：TTFB 251ms / LCP 312ms / CLS 0，静态导出架构有效，无需优化
- 无控制台错误、无页面 JS 异常
- 移动端 375px 无横向滚动；Header 折叠菜单正常
- 设计令牌整体落地（canvas 暖白、teal accent、navy 唯一暗色区、Inter + JetBrains Mono）
- 工具 9 态流转可用：上传 → Checking → Clean copy ready → Verification 表（Found/Removed/Preserved*/Not re-encoded 状态样式齐全）→ Download / Advanced Options
- 内页模板（面包屑 / Quick Answer 高亮卡 / 内嵌工具 / Last reviewed mono 注脚 / 正文分节）与规范 §7 一致
- 合规红线未踩：全站无 "Uploading"、"Guaranteed"、"100% undetectable" 类违禁文案

---

## 建议执行顺序

1. **第一批（半天内）**：P0-1 ~ P0-5 全部是文案/条件渲染级修改，风险为零，先上线
2. **第二批**：P1-1 ~ P1-5 排版调整，改完首屏和结果区即达到"可对外推广"的视觉完成度
3. **第三批**：P2 项随下次迭代带上；其中 P2-1（sample image）建议提前，对冷启动转化帮助最大

> 走查截图存档：`tmp/live-home-desktop.png`、`tmp/live-home-mobile.png`、`tmp/live-guide-desktop.png`、`tmp/live-tool-result*.png`（含分段裁切图）
