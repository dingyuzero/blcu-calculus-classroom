# 北语心理学院高数课程资源系统

用于心理学专业高等数学课堂的交互资源网站。六章、十八个演示，含函数、极限、微积分、泰勒展开与心理学数学模型。课程展示版，非学校官方平台。

- [公开网站](https://dingyuzero.github.io/blcu-calculus-classroom/)
- [单 HTML 离线版与交付包](https://github.com/dingyuzero/blcu-calculus-classroom/releases/latest)
- [使用说明书](docs/使用说明.md)
- [开发交接文档](docs/开发交接.md)
- [公开与离线部署](docs/公开与离线部署.md)

核心依赖 JSXGraph、math.js、KaTeX 均随包提供。无账号、无后端、无学生数据上传；参数仅保存在本机浏览器。对数可以直接写 `log10(x)`、`log2(x)`、`ln(x)`。

## 开发

```powershell
npm.cmd ci
npm.cmd test
npm.cmd run check:assets
npm.cmd run build:portable
python -m http.server 8765 --bind 127.0.0.1 --directory dist
```

访问 http://127.0.0.1:8765/ 。`dist/` 就是可发布的静态网站；构建单文件后，`release/高数课堂-单文件.html` 可拷贝到其他电脑使用。

原创代码与文档使用 [MIT](LICENSE)，第三方许可见 [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md)。有限图形采样不是数学证明；心理学案例均为教学模型。
