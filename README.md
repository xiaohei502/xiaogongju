# 小工具库

一个轻量、静态、可扩展的小工具入口页。首页通过 `tools.json` 读取工具配置，每个工具放在 `tools/<tool-id>/` 子目录中，方便独立更新和部署。

## 本地预览

```bash
python3 -m http.server 8000
```

访问 `http://localhost:8000/`。

## 新增工具

1. 在 `tools/` 下创建工具目录，例如 `tools/my-tool/`。
2. 在工具目录中添加 `index.html`。
3. 在 `tools.json` 的 `tools` 数组追加工具配置。

```json
{
  "id": "my-tool",
  "title": "我的工具",
  "description": "工具简介",
  "category": "写作辅助",
  "tags": ["写作"],
  "status": "available",
  "path": "tools/my-tool/"
}
```
