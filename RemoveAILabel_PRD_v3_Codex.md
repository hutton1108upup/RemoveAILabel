# Remove AI Label 垂直免费工具站 PRD

> 文档版本：v3.0.0（Gemini v2 优点吸收 + 技术校正版）  
> 项目代号：`Project-CleanAITag` / Site A  
> 文档状态：Ready for Codex Implementation  
> 产品形态：免费、免登录、纯本地图片元数据检查与清理工具站  
> 目标开发周期：3–5 个工作日完成可上线 MVP；WebP 完整清理按测试结果灰度开启  
> 推荐技术栈：Next.js 当前稳定版（App Router + Static Export）+ TypeScript + Tailwind CSS

---

## 0. 本版最终决策

本版保留 Gemini v2 的五个关键优点：

1. **纯本地、零图片上传**：文件只在浏览器内处理，不建立图片上传 API。
2. **格式感知的二进制清理**：拒绝用 Canvas 重绘作为默认清理方式，尽量保持压缩图像数据不变。
3. **低摩擦工作流**：上传后自动扫描，并在确认属于安全、明确的目标字段时自动生成推荐清理副本。
4. **可验证结果**：清理后使用同一套扫描器再次检查，展示清理前后差异。
5. **双站关键词分工**：Site A 只争夺 Remove AI Label / AI Info / 软件误标等救急型搜索意图；泛 Metadata 与视觉去 AI 味由 Site B 承接。

同时修正以下问题：

- 不删除所有 JPEG `APP11`，只删除确认属于 C2PA Manifest Store 的连续 APP11 片段。
- PNG 必须处理独立的 `caBX` C2PA Chunk。
- WebP 必须识别独立的 `C2PA` RIFF Chunk，而不只是 EXIF/XMP。
- 不宣称“95% 的误标由 APP11 触发”“重新上传一定不显示标签”“100% 绕过检测”。
- 不把整个文件描述成 bit-for-bit identical；准确表述为“受支持文件的编码图像负载未重新编码”。
- 不把 `ai metadata cleaner`、`ai metadata remover`、`remove ai detection from image` 作为 Site A 的主页面关键词。
- 不设置登录、付费墙、每日次数限制或下载水印。

---

# 1. 产品定义

## 1.1 一句话产品定义

一个帮助用户在发布图片前，**检查并清理受支持的 AI 标签相关文件元数据**的免费浏览器工具；原文件不被覆盖，图片不上传服务器，清理后自动复检。

## 1.2 用户最终得到的结果

用户上传图片后，应得到以下明确结果之一：

### 结果 A：发现并清理了明确字段

```text
Clean copy ready

Embedded C2PA credentials     Removed
AI-related XMP                Removed
Prompt / workflow fields      Removed
Camera EXIF                   Preserved
Creator / copyright           Preserved when stored outside removed packets
ICC color profile             Preserved
Encoded image payload         Not re-encoded
```

### 结果 B：没有发现受支持字段

```text
No supported AI label metadata was found.

The file was not rewritten. A platform may still apply a label using
other signals or disclosure rules.
```

### 结果 C：检测到内容，但无法安全重写

```text
Metadata was detected, but this file variant cannot be cleaned safely yet.
Your original file remains unchanged.
```

## 1.3 核心价值主张

### 对摄影师与修图师

真实拍摄的照片只做了少量生成式扩图、对象移除或 AI 降噪，却担心发布后被笼统标记为 AI。工具帮助其创建一份发布副本，同时尽量保留相机参数、版权和色彩配置。

### 对社媒与电商运营

一批真实商品图或品牌素材经过多个软件处理，运营人员不知道文件中还包含哪些来源信息。工具提供批量扫描、推荐清理和 ZIP 下载。

### 对设计师与自由职业者

交付客户前，不希望文件继续携带 Prompt、模型、Seed 或 ComfyUI Workflow。工具提供干净的交付副本，但不修改源文件。

## 1.4 产品原则

1. **Original First**：永远不覆盖原文件。
2. **Inspect Before Trust**：任何“已清理”结论必须来自清理后的二次扫描。
3. **Remove Only Confirmed Targets**：不因 Marker 或软件名相似就盲删。
4. **Preserve by Default**：相机 EXIF、版权、ICC、方向信息默认保留。
5. **No False Promise**：不承诺平台最终如何分类。
6. **Local by Design**：图片二进制、文件名、Prompt、GPS 不发送给服务器或分析服务。
7. **Fast Without Hiding Work**：流程尽量自动，但必须让用户看到删了什么、保留了什么。

---

# 2. 产品边界与合规文案

## 2.1 本站可以做什么

- 检查嵌入式 C2PA / Content Credentials。
- 检查和清理受支持的 AI 相关 XMP 字段。
- 检查和清理 PNG 中常见的 Prompt、Seed、Model、Sampler、Workflow 等文本字段。
- 可选删除 GPS、设备和日期等隐私元数据。
- 尽量保留相机 EXIF、版权、ICC Profile、透明通道和图片方向。
- 生成新的清理副本并再次验证。

## 2.2 本站不能承诺什么

- 不能修改已经发布到 Instagram、Facebook、Pinterest 或其他平台的帖子。
- 不能控制第三方平台的最终分类结果。
- 不能删除烧录在像素中的可见文字或水印。
- 不承诺删除 SynthID 等像素级不可见水印。
- 不改变皮肤、手指、光影、纹理等视觉 AI 痕迹。
- 不伪造相机型号、GPS、时间或来源证明。
- 不提供“Make AI Undetectable”“Bypass AI Detection”之类的承诺。

## 2.3 首页必须可见的边界说明

```text
This tool removes supported file-level metadata from a new local copy.
It does not edit an existing post, remove visible or pixel-level watermarks,
or guarantee how a third-party platform will classify an image.
```

## 2.4 C2PA 删除提醒

用户首次处理包含 C2PA 的图片时显示一次非阻断提醒：

```text
Content Credentials can contain verifiable provenance and editing history.
The cleaned copy will no longer carry that embedded credential.
Keep your original master file.
```

用户无需点击多层确认；原文件保持不变即可满足可逆性要求。

---

# 3. 目标用户与 JTBD

## 3.1 P0-1：真实商业摄影师 / 修图师

### 触发场景

- Photoshop Generative Fill / Generative Expand。
- 对象移除、背景扩展、AI Denoise。
- 客户要求上传 Instagram、Facebook 或品牌官网。

### Job To Be Done

> 当我把真实拍摄但经过少量 AI 辅助修图的照片发布或交付时，我希望先知道文件里是否含有 AI 来源信息，并生成一份尽量保留相机、版权和色彩信息的清理副本，避免别人把整张照片误解为纯 AI 生成。

### 关键要求

- 不重新压缩图像负载。
- 保留 ICC Profile。
- 默认保留相机 EXIF、版权和方向。
- 能明确验证清理结果。

## 3.2 P0-2：社媒运营 / 真实商品图电商卖家

### 触发场景

- 多张商品图经过 Canva、Photoshop、Topaz 等软件处理。
- 发布前需要统一检查。
- 不愿逐张打开桌面软件。

### Job To Be Done

> 当我准备批量发布真实商品或品牌素材时，我希望一次拖入多张图片，快速得到可下载的清理副本与报告，不需要注册或安装软件。

### 关键要求

- 批量队列。
- ZIP 下载。
- 手机端可用。
- 一张失败不影响整批。

## 3.3 P1：设计师 / 插画师 / 自由职业者

### 触发场景

- 使用 Stable Diffusion、ComfyUI 或其他工具辅助创作。
- 交付文件可能包含内部生成参数。

### Job To Be Done

> 当我交付客户副本时，我希望移除受支持的 Prompt、模型、Seed 和 Workflow 信息，同时保留自己的源文件用于归档。

## 3.4 非目标用户

- 希望把虚构新闻现场伪装为真实记录的人。
- 希望伪造商品、人物、拍摄设备或地理位置的人。
- 只追求绕过所有 AI 检测器的人。
- 视频、PDF、Office、音频 Metadata 用户。

---

# 4. 免费策略与产品限制

## 4.1 免费规则

- 无需登录。
- 无需邮箱。
- 无支付系统。
- 无每日次数限制。
- 无下载水印。
- 单张下载免费。
- ZIP 下载免费。
- 连续批次免费。

## 4.2 文件限制

### 桌面端

- 最多 30 个文件/批。
- 单文件最大 25MB。
- 批次总大小最大 200MB。
- 默认并发 3；低性能设备降为 1–2。

### 移动端

- 最多 10 个文件/批。
- 单文件最大 25MB。
- 批次总大小最大 100MB。
- 默认并发 1。

### 规则说明

- 超出限制时，不显示付费墙，只提示拆分成下一批。
- 允许用户完成当前批次后继续处理。
- 文件数量与总字节数必须同时校验。

## 4.3 首发格式范围

| 格式 | 扫描 | 推荐清理 | 发布状态 |
|---|---:|---:|---|
| JPG / JPEG | 是 | 是 | P0 正式支持 |
| PNG | 是 | 是 | P0 正式支持 |
| WebP | 是 | 通过测试后开启 | P0 Beta / Feature Flag |
| HEIC / AVIF | 否 | 否 | P1 |
| GIF / APNG | 基础识别 | 不承诺 | P1 |

---

# 5. 核心用户流程

## 5.1 最终取舍：自动处理，但不盲删

采用 Gemini v2 的低摩擦体验，同时保留透明度：

```text
选择文件
  ↓
自动本地扫描
  ↓
对“明确且受支持”的目标字段自动生成 Recommended Clean 副本
  ↓
立即展示下载按钮 + Before/After 验证报告
  ↓
用户可展开 Advanced Options 修改规则并重新生成
```

说明：

- 原文件从不改变。
- 检测结果不明确时不自动删除，标记为 Review Needed。
- 没有发现目标字段时，不重复重写文件。
- 用户不需要经历“扫描—确认—等待—再确认”的七步流程。

## 5.2 页面状态机

```ts
type ToolState =
  | "idle"
  | "validating"
  | "scanning"
  | "preparing-clean-copy"
  | "ready"
  | "partially-ready"
  | "already-clean"
  | "unsupported"
  | "failed";
```

## 5.3 初始态

### H1

```text
Check and Remove AI Label Metadata Before You Post
```

### 副标题

```text
Create a cleaned local copy by removing supported C2PA, XMP and AI workflow
metadata. Your images never leave your browser.
```

### Dropzone

```text
Drop images here, paste from your clipboard, or choose files
JPG & PNG · WebP beta · Up to 25MB each · No upload
```

### 信任条

```text
Local-only processing
No account
Original file untouched
No image re-encoding on supported files
```

## 5.4 扫描态

按文件显示：

```text
Checking 4 of 8 files…

photo-01.jpg      Scanning
photo-02.png      Clean copy ready
photo-03.webp     Inspecting WebP
photo-04.jpg      Waiting
```

不得显示“Uploading”。

## 5.5 结果卡片

每个文件展示：

```text
photo-clean.jpg
Clean copy ready

Before                         Clean copy
Embedded C2PA     Found        Removed
AI-related XMP    Found        Removed
Prompt/workflow   Not found    Not found
Camera EXIF       Found        Preserved
Creator/copyright Found        Preserved*
ICC profile       Found        Preserved
Image payload     —            Not re-encoded

[Download Cleaned Image]
[Advanced Options]
```

`Preserved*` 必须带说明：若版权只存储在被删除的同一个 XMP 包中，则无法同时移除该包并保留其中字段。

## 5.6 Advanced Options

默认折叠：

```text
Recommended AI Label Clean
[x] Remove embedded C2PA credentials
[x] Remove confirmed AI-related XMP packets
[x] Remove prompt and workflow text fields
[x] Preserve camera EXIF
[x] Preserve creator and copyright when separable
[x] Preserve ICC color profile
[x] Preserve orientation

Privacy Clean
[ ] Remove EXIF/GPS/device/date metadata

[Regenerate Clean Copy]
```

不提供伪造或新增 Metadata 的入口。

## 5.7 Already Clean 状态

```text
No supported AI label metadata was found.
The original file was not rewritten.

A platform may still use other signals or disclosure rules.

[Check Another Image]
```

可以显示 Site B 导流，但不能比主状态更抢眼。

## 5.8 批量汇总

```text
12 files checked
8 clean copies ready
2 already clean
1 review needed
1 unsupported

[Download 8 Cleaned Files as ZIP]
```

ZIP 只包含成功生成的副本，可选附带 `cleanup-report.csv`。

---

# 6. 清理模式

## 6.1 Recommended AI Label Clean（默认）

目标：清理明确的文件级 AI 来源信号，同时尽量保留普通摄影和归属信息。

默认删除：

- 嵌入式 C2PA Manifest Store。
- 确认包含生成式 AI 来源或动作的 XMP Packet。
- PNG 中明确的 Prompt、Negative Prompt、Seed、Model、Sampler、Steps、LoRA、Parameters、Workflow、ComfyUI 字段。
- WebP 中确认属于 C2PA 或 AI XMP 的独立 Chunk。

默认保留：

- JPEG 相机 EXIF APP1。
- IPTC / APP13，除非未来能明确识别并选择性清理。
- APP2 ICC Profile。
- Camera Make / Model、Lens、Exposure、ISO。
- Creator / Copyright，前提是未与被删除目标封装在同一不可分割包中。
- Orientation。
- PNG 色彩、透明、动画和图像数据块。
- WebP 图像、Alpha 和动画数据块。

## 6.2 Privacy Clean（可选）

额外删除：

- EXIF APP1。
- GPS。
- 设备型号、序列信息。
- 拍摄与修改时间。
- 用户名和描述。

处理要求：

- 先读取 Orientation。
- 若删除完整 EXIF 后会造成显示方向异常，应保留/重建只包含 Orientation 的最小 EXIF；若不能安全重建，则阻止处理并说明。
- 明确提示相机信息和部分版权信息也可能被删除。

## 6.3 Full Metadata Clean

不进入首页默认流程，首版可隐藏在实验 Feature Flag 中。

原因：本垂直站核心是“AI Label 相关清理”，不是泛 Metadata Remover。Full Clean 更适合 Site B。

---

# 7. 检测与分类模型

## 7.1 Findings 分类

```ts
type FindingLevel = "confirmed" | "possible" | "general";

type FindingCategory =
  | "c2pa"
  | "ai-xmp"
  | "ai-workflow"
  | "camera-exif"
  | "privacy"
  | "copyright"
  | "color-profile"
  | "unknown";
```

## 7.2 Confirmed

- 官方 C2PA 解析器确认存在嵌入式 Manifest Store。
- C2PA Action 或 Digital Source Type 明确描述生成式 AI。
- PNG 文本 Key 明确为 `parameters`、`workflow`、`prompt` 等生成参数。
- 可解析的 ComfyUI Workflow JSON。
- 明确的 Model、Seed、Sampler、Steps 组合。

## 7.3 Possible

- 软件字段中出现支持 AI 功能的编辑软件，但没有明确生成式声明。
- XMP 中出现 AI 相关字样，但无法确认字段语义。
- APP11 存在但不能确认属于 C2PA。

Possible 项不得自动删除；显示：

```text
Possible related metadata found. Review before cleaning.
```

## 7.4 General

- 相机、镜头、曝光、ISO。
- GPS。
- 日期。
- Creator / Copyright。
- ICC。

不得把 `Photoshop` 软件名本身等同于“AI generated”。

---

# 8. 二进制清理引擎规范

## 8.1 通用处理流水线

```text
1. Read File / Blob as ArrayBuffer
2. Detect real format by magic bytes
3. Parse container structure
4. Scan common metadata
5. Read/validate embedded C2PA when present
6. Classify findings
7. Build cleanup plan
8. Copy all non-target byte ranges unchanged
9. Rebuild container length fields only where required
10. Create a new Blob
11. Re-scan output with the same scanner
12. Compare target findings and image payload hash
13. Return verification report
```

## 8.2 绝对禁止

- 默认使用 Canvas `drawImage()` / `toBlob()`。
- 仅因 Marker 为 APP11 就全部删除。
- 仅因软件名包含 Photoshop/Canva 就判定 AI。
- 无验证就显示 `Cleaned`。
- 在处理失败时静默回退为重新编码。
- 改动用户原始 File 对象。

---

## 8.3 JPEG / JPG

### 文件校验

- SOI 必须为 `FF D8`。
- 按 JPEG Marker 长度规则遍历到 SOS。
- 正确处理无长度 Marker、填充字节与损坏长度。

### C2PA

- C2PA Manifest Store 可能跨多个连续 APP11 Segment。
- **不能删除所有 APP11**；APP11 也可能承载非 C2PA 数据。
- 必须确认某组连续 APP11 属于 C2PA JUMBF 后，才删除该完整片段组。
- 若无法安全识别范围，标记为 `review-needed`，不输出虚假成功。

### APP1

需区分：

- EXIF APP1：通常以 `Exif\0\0` 开头。
- 标准 XMP APP1：通常包含 Adobe XMP namespace header。
- Extended XMP APP1：可能由多个片段组成。

默认模式：

- 保留 EXIF APP1。
- 若标准/扩展 XMP 被确认包含 AI 目标字段，删除完整目标 XMP Packet 及其关联 Extended XMP 片段。
- 不在原 Segment 内原位改写 XML，避免长度与偏移风险。

隐私模式：

- 删除 EXIF APP1。
- 保留或重建最小 Orientation 信息。

### 必须保留

- APP2 ICC，包含多 Segment ICC 顺序。
- APP13 IPTC，除非明确进入未来的选择性清理能力。
- APP14 Adobe。
- DQT、DHT、SOF、DRI、SOS 与压缩扫描数据。
- 非 C2PA APP11。

### JPEG Payload Hash

运行时对 SOS 后的编码扫描数据计算 Hash；测试环境额外将清理前后图片解码为 RGBA 比较。

结果文案：

```text
Encoded image payload not re-encoded
```

不得写：

```text
Entire file is bit-for-bit identical
```

---

## 8.4 PNG

### 文件校验

魔数必须为：

```text
89 50 4E 47 0D 0A 1A 0A
```

### 处理原则

- 按 Length + Type + Data + CRC 遍历 Chunk。
- 默认复制所有 Chunk，只有命中明确目标时才丢弃整个 Chunk。
- 删除整个 Chunk 时不需要改写其他 Chunk 的 CRC。
- 只有在未来需要改写 Chunk 内容时才重新计算其 CRC32。

### C2PA

- 删除确认存在的 `caBX` Chunk。

### AI 文本字段

检查：

- `tEXt`
- `zTXt`
- `iTXt`

命中以下明确 Key 或结构时可删除整个 Chunk：

```text
parameters
prompt
negative_prompt
workflow
comfyui
model
seed
sampler
steps
lora
```

对于承载通用 XMP 的 iTXt：

- 先解析 XMP。
- 只有确认含目标 AI 字段时删除该 XMP Chunk。
- 不因 `Software` 一词单独删除。

### eXIf

- 默认保留。
- Privacy Clean 时删除。

### 必须保留

除目标 Chunk 外，默认全部原样复制，包括但不限于：

- `IHDR`
- `PLTE`
- `IDAT`
- `IEND`
- `tRNS`
- `iCCP`
- `sRGB`
- `gAMA`
- `cHRM`
- `pHYs`
- APNG 的 `acTL`、`fcTL`、`fdAT`

### PNG Payload Hash

对所有 `IDAT` 数据按顺序拼接后计算 Hash；APNG 另覆盖动画数据块测试。

---

## 8.5 WebP（Beta / Release Gate）

### 文件校验

- `RIFF`
- 文件长度字段
- `WEBP`

### 目标 Chunk

- `C2PA`：嵌入式 C2PA Manifest Store。
- `XMP `：仅在确认包含目标 AI 字段时删除。
- `EXIF`：默认保留；Privacy Clean 时删除。

### 必须保留

- `VP8 ` / `VP8L`
- `VP8X`
- `ALPH`
- `ICCP`
- `ANIM`
- `ANMF`
- 所有未知非目标 Chunk

### 重建要求

- 正确处理 RIFF Chunk 偶数字节 Padding。
- 更新 RIFF Size。
- 若删除 Metadata Chunk，按规范更新 `VP8X` Feature Flags。
- 动画、Alpha、色彩和尺寸必须不变。

### 上线门槛

只有以下测试全部通过，才把 WebP 从 `Beta Inspect` 切换为 `Full Clean`：

- 静态有损 WebP。
- 静态无损 WebP。
- Alpha WebP。
- 动画 WebP。
- 带 ICC 的 WebP。
- 带 C2PA 的 WebP。
- 带 EXIF/XMP 的 WebP。

---

# 9. C2PA 解析策略

## 9.1 使用官方浏览器 SDK

使用当前官方 `@contentauth/c2pa-web`：

- 在用户选择文件后动态加载。
- WASM 文件单独托管于静态资源目录。
- 不让 WASM 阻塞首屏。
- 用于读取与验证 C2PA Manifest，不用于对外发送文件。

## 9.2 自定义清理器与官方解析器的分工

### 官方解析器负责

- 判断是否存在有效或可读的 C2PA Manifest。
- 读取 Manifest / Actions / Digital Source Type。
- 清理后再次确认 Manifest 不再存在。

### 自定义容器解析器负责

- 找到对应格式中的目标字节范围。
- 复制非目标字节。
- 重建容器长度。
- 计算 Payload Hash。

## 9.3 失败策略

若官方解析器确认存在 C2PA，但自定义解析器不能安全确定移除范围：

```text
C2PA detected, but safe local removal is not supported for this file variant.
```

不得改用 Canvas 重编码兜底。

---

# 10. 前端架构

## 10.1 技术栈

- Next.js 当前稳定版。
- App Router。
- `output: 'export'`。
- TypeScript `strict: true`。
- Tailwind CSS。
- Lucide React。
- `fflate` 用于 ZIP、必要的压缩文本读取。
- `@contentauth/c2pa-web` 用于 C2PA 浏览器解析。
- 可选 `ExifReader` 仅做只读扫描；不能用它替代格式安全重写。
- Vitest。
- Playwright。

## 10.2 Static Export 约束

- 不使用 Server Actions。
- 不使用动态 API Route。
- 不依赖 Cookies、Headers 或服务端 Session。
- 所有动态内容页 Slug 必须通过 `generateStaticParams()` 在构建时生成。
- 工具逻辑为 Client Component。
- SEO 正文为 Server Component，在构建时输出静态 HTML。
- C2PA WASM 使用动态 import。

## 10.3 Worker

所有以下工作放入 Web Worker：

- Magic Bytes 校验。
- Metadata 扫描。
- 容器解析。
- C2PA 读取。
- 二进制清理。
- Hash。
- 复检。
- ZIP 可视文件量较大时也放入 Worker。

主线程只负责：

- 文件选择。
- 队列状态。
- 结果渲染。
- 下载触发。

---

# 11. 核心数据结构

```ts
export type SupportedFormat = "jpeg" | "png" | "webp";

export type ProcessingStatus =
  | "queued"
  | "validating"
  | "scanning"
  | "preparing"
  | "ready"
  | "already-clean"
  | "review-needed"
  | "unsupported"
  | "failed";

export type FindingLevel = "confirmed" | "possible" | "general";

export type FindingCategory =
  | "c2pa"
  | "ai-xmp"
  | "ai-workflow"
  | "camera-exif"
  | "privacy"
  | "copyright"
  | "color-profile"
  | "unknown";

export interface MetadataFinding {
  id: string;
  category: FindingCategory;
  source: "C2PA" | "XMP" | "EXIF" | "IPTC" | "PNG_TEXT" | "WEBP_CHUNK";
  label: string;
  level: FindingLevel;
  removable: boolean;
  autoRemoveEligible: boolean;
  explanation: string;
  // UI 默认不显示敏感原值；Analytics 永不接收此字段。
  localValuePreview?: string;
}

export interface ScanReport {
  fileId: string;
  fileName: string;
  format: SupportedFormat;
  mimeType: string;
  bytes: number;
  width?: number;
  height?: number;
  findings: MetadataFinding[];
  hasEmbeddedC2pa: boolean;
  hasConfirmedAiMetadata: boolean;
  hasPossibleAiMetadata: boolean;
  hasCameraExif: boolean;
  hasPrivacyMetadata: boolean;
  hasCopyright: boolean;
  hasIccProfile: boolean;
  payloadHash: string;
}

export interface CleanupOptions {
  removeEmbeddedC2pa: boolean;
  removeConfirmedAiXmp: boolean;
  removePromptWorkflowFields: boolean;
  removeExifPrivacyData: boolean;
  preserveCameraExif: boolean;
  preserveCopyrightWhenSeparable: boolean;
  preserveIccProfile: boolean;
  preserveOrientation: boolean;
}

export interface VerificationReport {
  removedFindingIds: string[];
  remainingTargetFindingIds: string[];
  preservedCategories: FindingCategory[];
  dimensionsUnchanged: boolean;
  encodedPayloadUnchanged: boolean;
  iccPreserved: boolean | null;
  orientationPreserved: boolean | null;
  c2paAbsentAfterCleanup: boolean | null;
  verified: boolean;
  warnings: string[];
}

export interface ProcessedFileItem {
  id: string;
  originalFile: File;
  status: ProcessingStatus;
  scan?: ScanReport;
  cleanedBlob?: Blob;
  verification?: VerificationReport;
  errorCode?: string;
  errorMessage?: string;
}
```

---

# 12. 页面信息架构与关键词分工

## 12.1 Site A 负责的搜索意图

### 核心词

- `remove ai label`
- `ai label remover`
- `remove ai label from image`
- `remove ai label online`
- `ai info remover`

### 平台与误标场景

- `instagram ai info`
- `facebook ai info`
- `photoshop generative fill ai label`
- `why does my photo say ai info`
- `lightroom ai denoise ai label`
- `remove ai label iphone`

## 12.2 Site A 不建立主页面的词

以下关键词属于 Site B：

- `ai metadata cleaner`
- `ai metadata remover`
- `metadata checker`
- `metadata remover`
- `remove ai image metadata`
- `remove ai detection from image`
- `remove metadata from png`
- `remove metadata from jpeg`
- `remove c2pa metadata`
- `remove ai look`
- `ai image humanizer`
- `ai artifact remover`

Site A 可以在解释原理时自然提到 `AI metadata`，但不得在 URL、H1、Title 与主要内链锚文本上争夺以上泛词。

## 12.3 首发路由

```text
/
├── /instagram-ai-info
├── /facebook-ai-info
├── /photoshop-ai-label
├── /why-does-my-photo-say-ai-info
├── /c2pa-ai-label
├── /supported-formats
├── /guides
├── /about
├── /privacy
└── /terms
```

## 12.4 第二阶段页面

```text
/guides/lightroom-ai-denoise-label
/guides/canva-ai-info-label
/guides/topaz-photo-ai-label
/guides/background-removal-ai-label
/guides/pinterest-ai-modified-label
/guides/remove-ai-label-iphone
```

只有出现 GSC 查询或真实用户证据后再扩展，不批量生成平台名字替换页。

---

# 13. 核心页面 TDH 与页面任务

| URL | Title | Meta Description | H1 | 页面任务 |
|---|---|---|---|---|
| `/` | Remove AI Label from Images — Free & Private Tool | Check and remove supported C2PA, XMP and AI label metadata from JPG and PNG images locally in your browser. Free, private and no account. | Check and Remove AI Label Metadata Before You Post | 主工具 + 核心词 |
| `/instagram-ai-info` | Instagram AI Info on Photos: What You Can Check | Learn why Instagram may show AI Info on a real or lightly edited photo, inspect supported file metadata, and create a cleaned local copy before posting. | Why Instagram Shows AI Info on Some Photos | Instagram 问题意图 |
| `/facebook-ai-info` | Facebook AI Info on Photos: File Signals Explained | Check a Facebook-ready image for supported C2PA and AI editing metadata, then create a local cleaned copy without uploading the file. | Why Facebook Adds AI Info to Some Photos | Facebook 问题意图 |
| `/photoshop-ai-label` | Photoshop Generative Fill AI Label: Check the Export | Inspect Photoshop exports for C2PA and supported generative AI metadata after Generative Fill, Expand or other AI-assisted edits. | Check Photoshop Exports for AI Label Metadata | 核心软件误标场景 |
| `/why-does-my-photo-say-ai-info` | Why Does My Photo Say AI Info? Signals Explained | Understand how Content Credentials, XMP, editing software, disclosures and platform systems can contribute to an AI label on a photo. | Why Does My Real Photo Say “AI Info”? | 支柱科普页 |
| `/c2pa-ai-label` | C2PA and AI Labels: What Content Credentials Mean | Learn what C2PA Content Credentials record, how they relate to AI labels, and what is lost when an embedded credential is removed. | How C2PA Content Credentials Relate to AI Labels | 教育与信任页 |
| `/supported-formats` | Supported Formats and Metadata Fields | See what the local tool can inspect, remove or preserve in JPG, PNG and beta WebP files, including C2PA, XMP, EXIF and ICC. | Supported Image Formats and Metadata | 技术可信度 |
| `/guides` | AI Info and Image Label Guides | Practical guides for checking AI label metadata in Instagram, Facebook, Photoshop and other image workflows. | AI Label and AI Info Guides | 聚合内链 |

## 13.1 文案限制

页面不得出现以下确定性表述：

```text
Remove the label from an existing post
Re-upload and the label will disappear
Guaranteed Instagram fix
Bypass automated detection
100% undetectable
Restore reach or conversion
```

建议使用：

```text
Check supported file-level signals
Create a cleaned local copy before posting
A platform may still use other signals or disclosure rules
Results on third-party platforms are not guaranteed
```

---

# 14. 首页页面结构

## 14.1 Header

```text
Logo / Remove AI Label
How It Works
Instagram
Photoshop
Guides
Use Free Tool
```

不出现：

- Pricing。
- Login。
- Dashboard。
- 泛 Tools Mega Menu。

## 14.2 Hero + Tool

首屏直接包含工具，不使用大幅装饰图抢占空间。

结构：

```text
Eyebrow: Free local image tool
H1
Subtitle
Trust badges
Dropzone
Format / privacy note
```

## 14.3 工具动态区域

- Queue。
- Scan progress。
- Per-file result。
- Advanced options。
- Download。
- Batch ZIP。

不得跳转到独立结果 URL。

## 14.4 What This Tool Checks

四张卡片：

1. Embedded C2PA Credentials。
2. AI-related XMP Fields。
3. Prompt and Workflow Data。
4. Optional Privacy Metadata。

## 14.5 What It Preserves

- Encoded image payload。
- Camera EXIF by default。
- ICC color profile。
- Orientation。
- PNG transparency。
- Original source file。

注意使用“on supported files”“when separable”等准确限定。

## 14.6 What It Cannot Guarantee

使用可见双栏，不藏在 Terms：

```text
Can remove supported file metadata
Cannot change an existing post
Cannot remove visible/pixel watermarks
Cannot change visible AI artifacts
Cannot guarantee platform classification
Cannot replace required disclosure
```

## 14.7 目标用户场景

- Real Photos Lightly Edited with AI。
- Social Media Image Preflight。
- Authentic Product Photo Delivery。
- Clean Client Copies。

不要使用“流量腰斩”“转化暴跌”等未经当前数据支持的结论。

## 14.8 How It Works

```text
1. Add files
2. Scan locally
3. Prepare a recommended clean copy
4. Verify and download
```

## 14.9 Before / After Report

展示 Metadata 差异，不做假视觉 Before/After。

## 14.10 重点入口卡片

- Instagram AI Info。
- Photoshop Generative Fill。
- Facebook AI Info。
- Why Does My Photo Say AI Info。

## 14.11 FAQ

建议问题：

1. What does an AI label remover actually remove?
2. Are my images uploaded?
3. Can this remove AI Info from an existing post?
4. Does cleaning metadata guarantee no AI label?
5. Does the tool reduce image quality?
6. What is C2PA?
7. Will camera EXIF and copyright be preserved?
8. Can it remove PNG prompts and ComfyUI workflows?
9. Why was no metadata found?
10. Is the tool free?

## 14.12 Footer

- About。
- Privacy。
- Terms。
- Supported Formats。
- Guides。
- 一条自然的 Site B 品牌链接即可；不堆精确匹配关键词。

---

# 15. 场景页统一内容模板

每个内页采用：

```text
Breadcrumb
H1
Quick Answer
Embedded Tool
Last Reviewed / Evidence Note
Why This Can Happen
What the Tool Can Check
What the Tool Cannot Change
Step-by-Step Pre-Publish Workflow
How to Verify the Cleaned File
Common Misunderstandings
FAQ
Related Guides
```

## 15.1 Quick Answer 示例

```text
A file may contain Content Credentials or editing metadata after an
AI-assisted workflow. This tool can inspect and remove supported embedded
file metadata from a new local copy. It cannot change an existing post or
guarantee a platform result.
```

## 15.2 证据标签

```text
Last reviewed: [build-time date]
Based on: official platform documentation + local file-format testing
Platform behavior may change
```

不得虚构“已在 1000 张图片上测试”。

---

# 16. Site B 跨站漏斗

## 16.1 展示条件

只在以下状态展示：

1. 用户成功下载后。
2. 文件没有发现受支持 Metadata。
3. 用户主动展开“Image still looks AI-generated?”。

## 16.2 文案

### 清理成功后

```text
File metadata is clean.
This does not change visible skin, lighting, hands, textures or other image artifacts.

[Make the Image Look More Natural →]
```

### 没发现 Metadata

```text
No supported file metadata was found.
If the image still looks AI-generated, the issue may be visual rather than file-level.

[Check Visible AI Artifacts →]
```

## 16.3 禁止文案

```text
Platforms scan plastic skin and will label it
Remove visual AI look to bypass detection
Guaranteed reach recovery
```

## 16.4 跟踪参数

```text
?utm_source=remove-ai-label
&utm_medium=referral
&utm_campaign=post-clean
&utm_content=verified-result
```

动态结果区的链接不阻断下载，不弹窗拦截。

---

# 17. SEO 技术规范

## 17.1 每页必须有

- 独立 Title。
- 独立 Meta Description。
- 唯一 H1。
- Canonical。
- Open Graph。
- Twitter Card。
- 静态可见正文。
- BreadcrumbList（内页）。
- WebApplication 或 SoftwareApplication（核心工具页）。
- Organization。
- sitemap.xml。
- robots.txt。

## 17.2 FAQ Schema

- 只有页面上真实可见的 FAQ 才可输出 FAQPage。
- Schema 内容必须与可见文本一致。
- 不把 FAQ 富摘要作为排名或流量 KPI。

## 17.3 pSEO 限制

- 首发最多 6 个实质不同的内容页。
- 不用模板仅替换平台名。
- 每个页面必须有不同 Quick Answer、原因、步骤、限制和 FAQ。
- 新页面必须由 GSC 查询、真实用户反馈或平台变化触发。

## 17.4 Canonical 与索引

以下状态不得生成索引页：

```text
/?mode=privacy
/?sample=photoshop
/?result=ready
/instagram-ai-info?tool=open
```

统一 Canonical 到所属静态页面。

---

# 18. 隐私、安全与可访问性

## 18.1 网络隐私

禁止发送：

- 图片二进制。
- Base64。
- 文件名。
- Prompt 内容。
- Workflow JSON。
- GPS。
- EXIF 原值。
- 图片 Hash。
- 缩略图。

## 18.2 内存管理

- 每个文件单独读取与处理。
- 处理后释放临时 ArrayBuffer 引用。
- 下载后或队列删除时 `URL.revokeObjectURL()`。
- 移动端并发 1。
- 一张失败不终止 Worker 队列。

## 18.3 文件安全

- 通过 Magic Bytes 而不是扩展名识别格式。
- 所有长度、偏移、Chunk Size 在读取前做边界校验。
- 对损坏或恶意构造文件设置最大循环次数与最大 Metadata 尺寸。
- 不信任 MIME Type。
- ZIP 文件名做路径清理，避免 `../`。

## 18.4 可访问性

- Dropzone 可键盘操作。
- 文件选择按钮有明确 Label。
- 状态变化使用 `aria-live="polite"`。
- 错误不只依靠颜色。
- Advanced Options 可用键盘展开。
- Focus 不被自动处理流程抢走。
- 按钮最小触控区域 44px。

---

# 19. Analytics 与核心指标

## 19.1 默认策略

建立 Analytics Adapter；未配置环境变量时不加载分析脚本。

可接：

- Plausible。
- Cloudflare Web Analytics。
- GA4。

无论使用何种方案，都不得上报文件内容或原始 Metadata。

## 19.2 事件

```text
tool_view
files_selected
scan_started
scan_completed
confirmed_target_found
possible_target_found
no_supported_metadata_found
clean_copy_prepared
verification_passed
verification_failed
download_single
download_zip
advanced_options_opened
privacy_clean_enabled
site_b_clicked
unsupported_format
safe_rewrite_failed
```

## 19.3 允许的属性

- `page_slug`
- `format`
- `file_count_bucket`: `1`, `2-5`, `6-10`, `11-30`
- `size_bucket`: `<2MB`, `2-10MB`, `10-25MB`
- `has_c2pa`: boolean
- `result`: enum
- `processing_time_bucket`

## 19.4 北极星指标

```text
Verified Clean Download Rate
= verification_passed and download / files_selected sessions
```

辅助指标：

- 首页工具启动率。
- 扫描成功率。
- 安全重写成功率。
- 已经干净的文件比例。
- 批量 ZIP 使用率。
- Site B 上下文导流率。

## 19.5 MVP 内部目标

这些是验证目标，不是公开承诺：

- 文件选择后扫描完成率 ≥ 95%。
- 支持格式的安全重写成功率 ≥ 98%。
- 验证通过后的下载率 ≥ 65%。
- 文件内容上传请求 = 0。
- 损坏输出文件 = 0。

---

# 20. 性能目标

## 20.1 Web 指标

以真实用户 p75 为目标：

- LCP ≤ 2.5s。
- INP ≤ 200ms。
- CLS ≤ 0.1。

## 20.2 工具性能

- 首屏不加载 C2PA WASM。
- 用户选择文件后再动态加载。
- 普通 5–10MB JPEG 扫描与清理在现代桌面设备上应以亚秒到数秒为目标，不对外承诺固定 300ms。
- 处理超过 500ms 时必须展示进度。
- 长任务不能阻塞主线程。

---

# 21. 错误处理

## 21.1 错误代码

```ts
type ProcessingErrorCode =
  | "UNSUPPORTED_FORMAT"
  | "FILE_TOO_LARGE"
  | "BATCH_TOO_LARGE"
  | "INVALID_MAGIC_BYTES"
  | "TRUNCATED_CONTAINER"
  | "INVALID_SEGMENT_LENGTH"
  | "C2PA_DETECTED_RANGE_UNKNOWN"
  | "SAFE_REWRITE_NOT_SUPPORTED"
  | "VERIFICATION_FAILED"
  | "OUT_OF_MEMORY"
  | "ZIP_FAILED"
  | "UNKNOWN";
```

## 21.2 用户文案

### 不支持格式

```text
This format is not supported yet. Please use JPG or PNG. WebP cleaning is in beta.
```

### 无法安全处理

```text
We found metadata, but could not create a safe clean copy for this file variant.
Your original file is unchanged.
```

### 验证失败

```text
The clean copy did not pass verification, so it was not offered for download.
```

### 批次过大

```text
This batch is too large for reliable browser processing. Split it into smaller batches.
```

---

# 22. 测试与验收

## 22.1 测试顺序

先建立 Fixtures 与单元测试，再完成 UI。不得先写“成功”界面后补解析器。

## 22.2 JPEG Fixtures

至少包括：

- 带有效 C2PA 的 Photoshop JPEG。
- C2PA 跨多个连续 APP11 Segment。
- 带非 C2PA APP11 的 JPEG。
- EXIF APP1 + XMP APP1 同时存在。
- Extended XMP。
- 多段 ICC APP2。
- Orientation 1 / 6 / 8。
- Progressive JPEG。
- APP13 IPTC。
- 损坏长度。
- 伪造扩展名。

## 22.3 PNG Fixtures

- `caBX` C2PA。
- `tEXt parameters`。
- `iTXt workflow`。
- `zTXt` 生成参数。
- 通用 XMP 但没有 AI 字段。
- `eXIf` 相机信息。
- `iCCP`。
- 透明 PNG。
- APNG。
- 损坏 CRC。
- 超大文本 Chunk。

## 22.4 WebP Fixtures

- VP8。
- VP8L。
- Alpha。
- Animation。
- ICCP。
- EXIF。
- XMP。
- `C2PA` Chunk。
- 奇数字节 Padding。

## 22.5 单元测试

必须验证：

- 只删除目标 C2PA APP11，不删除非 C2PA APP11。
- JPEG 压缩图像负载 Hash 不变。
- EXIF 默认保留。
- ICC 默认保留。
- XMP 目标包删除。
- PNG `caBX` 删除。
- PNG IDAT Hash 不变。
- PNG Alpha 不变。
- WebP RIFF Size 正确。
- WebP VP8X Flags 正确。
- 清理后 C2PA 复检不存在。
- 目标字段复检不存在。
- 失败时不提供下载。

## 22.6 视觉/像素测试

测试环境中：

1. 清理前后解码为 RGBA。
2. 宽高一致。
3. RGBA Hash 一致。
4. ICC 存在时使用 Photoshop/macOS Preview 做人工色彩回归。
5. Orientation 在 Safari、Chrome、Firefox、系统预览中一致。

## 22.7 E2E

Playwright 覆盖：

- 单张上传。
- 粘贴图片。
- 批量上传。
- 自动扫描。
- 自动准备推荐副本。
- Advanced Options 重生成。
- 单张下载。
- ZIP 下载。
- Already Clean。
- Review Needed。
- 单文件失败、其他文件继续。
- 移动端布局。
- Site B 导流出现条件。

## 22.8 网络隐私验收

在浏览器 Network 中验证：

- 无图片 Blob 上传。
- 无 Base64 上传。
- 无文件名上报。
- 无 Prompt / GPS 上报。
- 错误监控不包含原始 Metadata。

---

# 23. 目录结构

```text
app/
├── layout.tsx
├── page.tsx
├── instagram-ai-info/page.tsx
├── facebook-ai-info/page.tsx
├── photoshop-ai-label/page.tsx
├── why-does-my-photo-say-ai-info/page.tsx
├── c2pa-ai-label/page.tsx
├── supported-formats/page.tsx
├── guides/page.tsx
├── about/page.tsx
├── privacy/page.tsx
├── terms/page.tsx
├── sitemap.ts
├── robots.ts
├── icon.tsx
└── opengraph-image.tsx

components/
├── tool/
│   ├── RemoveAiLabelTool.tsx
│   ├── ImageDropzone.tsx
│   ├── FileQueue.tsx
│   ├── FileResultCard.tsx
│   ├── VerificationTable.tsx
│   ├── AdvancedOptions.tsx
│   ├── BatchSummary.tsx
│   ├── DownloadActions.tsx
│   └── SiteBUpsell.tsx
├── content/
│   ├── QuickAnswer.tsx
│   ├── CapabilityGrid.tsx
│   ├── Limitations.tsx
│   ├── HowItWorks.tsx
│   ├── FAQ.tsx
│   └── RelatedGuides.tsx
└── layout/
    ├── Header.tsx
    └── Footer.tsx

content/
├── pages.ts
├── faqs.ts
└── navigation.ts

lib/
├── metadata/
│   ├── types.ts
│   ├── scan.ts
│   ├── classify.ts
│   ├── cleanup-plan.ts
│   ├── verify.ts
│   ├── c2pa.ts
│   ├── exif.ts
│   ├── xmp.ts
│   ├── payload-hash.ts
│   └── formats/
│       ├── jpeg/
│       │   ├── parse.ts
│       │   ├── identify-c2pa.ts
│       │   ├── identify-xmp.ts
│       │   └── clean.ts
│       ├── png/
│       │   ├── parse.ts
│       │   ├── text.ts
│       │   └── clean.ts
│       └── webp/
│           ├── parse.ts
│           └── clean.ts
├── files/
│   ├── limits.ts
│   ├── magic-bytes.ts
│   ├── filename.ts
│   ├── download.ts
│   └── zip.ts
├── analytics/
│   ├── adapter.ts
│   └── events.ts
└── seo/
    ├── metadata.ts
    └── schema.ts

workers/
└── metadata.worker.ts

public/
├── wasm/
│   └── c2pa.wasm
└── samples/
    ├── photoshop-c2pa.jpg
    ├── stable-diffusion-parameters.png
    └── clean-camera-photo.jpg

tests/
├── fixtures/
├── unit/
│   ├── jpeg-clean.test.ts
│   ├── png-clean.test.ts
│   ├── webp-clean.test.ts
│   ├── c2pa-detect.test.ts
│   └── verify.test.ts
└── e2e/
    └── tool-flow.spec.ts
```

---

# 24. 开发阶段与上线闸门

## Phase 0：Fixtures 与协议测试

- 建立 JPEG / PNG 样本。
- 完成 Magic Bytes 与边界解析测试。
- 接入 C2PA 浏览器读取。

## Phase 1：P0 引擎

- JPEG 扫描与目标清理。
- PNG 扫描与目标清理。
- Payload Hash。
- 清理后复检。

## Phase 2：工具 UI

- Dropzone。
- Queue。
- 自动扫描与自动准备。
- Verification Report。
- Advanced Options。
- 下载与 ZIP。

## Phase 3：SEO 与合规页面

- 首页。
- Instagram。
- Photoshop。
- Why AI Info。
- Facebook。
- C2PA 教育页。
- Supported Formats。
- Privacy / Terms。

## Phase 4：WebP Release Gate

- 完成全部 WebP Fixtures。
- 通过测试后打开 `NEXT_PUBLIC_ENABLE_WEBP_CLEAN=true`。
- 未通过时保留 Inspect-only 或不在前台承诺。

## 上线必须满足

- JPG / PNG 目标测试全部通过。
- 没有文件上传请求。
- 无验证失败文件被提供下载。
- 无“保证平台结果”的文案。
- Site A 没有争夺 Site B 泛关键词的页面。

---

# 25. Codex 工程执行 Prompt

将以下内容连同本 PRD 一起交给 Codex：

```text
You are implementing the attached PRD for Project-CleanAITag, a free,
client-side Remove AI Label metadata tool.

WORKING RULES
- Do not use subagents unless explicitly approved.
- Do not refactor unrelated repository code.
- Use the current stable Next.js App Router with static export.
- TypeScript strict mode is required.
- No backend, database, image upload API, auth, payment, or server-side image processing.
- Do not use Canvas drawImage/toBlob as a cleanup fallback.
- Never claim that the tool bypasses all AI detection or guarantees a platform result.
- Do not create generic pages targeting ai metadata cleaner, ai metadata remover,
  metadata checker, remove ai detection from image, or remove metadata from PNG/JPEG.
  Those belong to Site B.

IMPLEMENTATION ORDER
1. Inspect the repository and produce a concise implementation checklist.
2. Create test fixtures and TypeScript types.
3. Implement magic-byte validation and safe container parsers.
4. Integrate the current official @contentauth/c2pa-web package for browser-side
   C2PA reading and post-clean verification. Host its WASM as a static asset and
   load it only after the first file is selected.
5. Implement JPEG cleaning:
   - never strip all APP11 segments;
   - identify and remove only confirmed C2PA APP11 fragment groups;
   - preserve non-C2PA APP11;
   - preserve EXIF APP1 by default;
   - preserve APP2 ICC and encoded scan data;
   - remove confirmed AI XMP packets without rewriting XML in place.
6. Implement PNG cleaning:
   - remove confirmed caBX C2PA chunks;
   - remove only confirmed AI prompt/workflow text chunks;
   - preserve eXIf by default, iCCP, transparency, IDAT and unknown non-target chunks.
7. Implement WebP behind a feature flag:
   - identify C2PA, XMP and EXIF chunks correctly;
   - preserve image/alpha/animation/ICC chunks;
   - update RIFF size and VP8X flags;
   - keep disabled until its full fixture matrix passes.
8. Implement Web Worker processing, auto-scan, automatic preparation of a
   Recommended Clean copy, post-clean verification, individual downloads and ZIP.
9. Build the static SEO pages and use only the supplied TDH/copy boundaries.
10. Add Vitest and Playwright tests, then run typecheck, lint, unit tests,
    build and E2E tests.

PRODUCT BEHAVIOR
- Original files are never modified.
- On file selection, scan automatically.
- Automatically prepare a Recommended Clean copy only for confirmed, supported
  targets. Possible/ambiguous findings must not be auto-removed.
- Show a before/after verification report.
- If verification fails, do not offer the output for download.
- If no supported target is found, do not rewrite the file.
- Advanced Options allow Privacy Clean and regeneration.
- The tool is fully free with no account and no paywall.
- Desktop batch: up to 30 files / 200MB total.
- Mobile batch: up to 10 files / 100MB total.
- Per file: 25MB.

PRIVACY
- Never send image bytes, Base64, file names, prompts, GPS, raw EXIF/XMP,
  thumbnails or hashes to analytics or error monitoring.
- Analytics may only receive page slug, format, count/size buckets,
  processing result and timing bucket.

DEFINITION OF DONE
- JPEG and PNG fixtures pass.
- C2PA is absent after confirmed cleanup.
- Target AI fields are absent after cleanup.
- Encoded image payload hashes are unchanged.
- ICC, orientation and camera EXIF are preserved in default mode when separable.
- No image network upload occurs.
- A failed or unsafe file never blocks the rest of a batch.
- Static export build succeeds.
- No unsupported SEO claims appear in rendered HTML.

Start with the parser/test foundation, not the marketing UI. Do not mark a
format as supported until its fixture suite passes.
```

---

# 26. 最终验收结论

这个站不是泛 Metadata Cleaner，也不是 AI Detector Bypass。其最终定位必须始终保持为：

> **帮助真实照片、真实商品素材和商业交付文件，在发布前检查并清理受支持的 AI Label 文件元数据，同时尽量保留普通摄影、版权和色彩信息。**

产品竞争力来自四点：

1. 真正本地处理。
2. 不重新编码图片负载。
3. 只删除确认目标，而不是盲删所有 Metadata。
4. 清理后再次验证，让用户知道删了什么、保留了什么。
