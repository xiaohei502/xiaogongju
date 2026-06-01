# 小工具库

一个轻量化、可扩展、面向写作和文本处理的小工具平台。它可以统一管理多个独立小工具，支持首页卡片展示、搜索、分类筛选、状态筛选，以及通过 JSON 配置快速新增工具。

## 功能特点

- 首页以卡片形式展示工具标题、简介、标签、分类和状态。
- 支持关键词搜索、分类筛选、状态筛选（可用 / 规划中）。
- 工具列表由根目录 `tools.json` 动态加载，新增工具不需要改首页 HTML。
- 每个工具独立放在 `tools/<tool-id>/` 子文件夹中，便于独立维护和迭代。
- 纯静态页面，无构建步骤，可直接部署到 GitHub Pages、Netlify、Vercel 或任意静态服务器。
- 支持电脑端和手机端自适应布局。

## 目录结构

```text
.
├── index.html                 # 工具库首页
├── tools.json                 # 工具卡片配置
├── assets/
│   ├── app.js                 # 首页加载、搜索与筛选逻辑
│   └── styles.css             # 全站样式与响应式布局
└── tools/
    ├── text-counter/          # 文本计数器
    ├── markdown-cleaner/      # Markdown 清理器
    └── title-polisher/        # 规划中的工具占位目录
```

## 本地预览

由于首页通过 `fetch("tools.json")` 加载配置，建议使用本地静态服务器预览：

```bash
python3 -m http.server 8000
```

然后访问：

```text
http://localhost:8000/
```

## 如何新增工具

1. 在 `tools/` 下创建新的工具目录，例如：`tools/my-tool/`。
2. 在该目录中添加独立页面，例如：`tools/my-tool/index.html`。
3. 在根目录 `tools.json` 的 `tools` 数组中追加配置：

```json
{
  "id": "my-tool",
  "title": "我的新工具",
  "description": "一句话说明这个工具能做什么。",
  "category": "写作辅助",
  "tags": ["标签一", "标签二"],
  "status": "available",
  "icon": "✦",
  "path": "tools/my-tool/"
}
```

`status` 当前建议使用：

- `available`：可用
- `planned`：规划中

## 已内置工具

- 文本计数器：统计字符数、字词数、段落数和预计阅读时间。
- Markdown 清理器：清理行尾空格、多余空行和基础标题间距。
- 标题润色助手：规划中的占位工具。
