# 更新日志 / Changelog

本项目的所有重要更改都将记录在此文件中。

格式基于 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.0.0/)，项目遵循 [语义化版本控制](https://semver.org/lang/zh-CN/)。

## [0.2.0](https://github.com/guizimo/n-admin/compare/v0.1.0...v0.2.0) (2026-06-17)


### 🐛 Bug 修复

* 更新头部组件样式，增加圆角和溢出隐藏 fixed [#5](https://github.com/guizimo/n-admin/issues/5) ([cc85e7c](https://github.com/guizimo/n-admin/commit/cc85e7ccbb32943ab156a62adec87175db3b95a0))


### 🔨 其他修改

* improve auth secret handling and tooling ([cc8c844](https://github.com/guizimo/n-admin/commit/cc8c844d6b750217994ac2ad9597f9b8c81204d2))
* update dependencies and configuration ([efe9a87](https://github.com/guizimo/n-admin/commit/efe9a8738fd7c94e0f6e8eab85e433929432f72d))


### ✨ 新增功能

* add AI insights analysis API ([4d07a0e](https://github.com/guizimo/n-admin/commit/4d07a0e12a0a2067c5cf71678f9ff2817cd6fab6))
* surface AI assistant insights on dashboard ([daee3de](https://github.com/guizimo/n-admin/commit/daee3de2166124ab4199090a37122670197ab830))
* 添加渐变动画和背景网格效果 ([617cddd](https://github.com/guizimo/n-admin/commit/617cdddcfbef77fc55fc34870a2f018d48e79f32))

## [0.1.0](https://github.com/guizimo/n-admin/compare/v0.0.13...v0.1.0) (2025-07-31)


### ✨ 新增功能

* 更新权限、角色和用户模块的 FilterField 接口定义 ([acb3e8b](https://github.com/guizimo/n-admin/commit/acb3e8be06a9432fad417abc22ef3060f793d026))

### [0.0.13](https://github.com/guizimo/n-admin/compare/v0.0.12...v0.0.13) (2025-07-31)


### ✨ 新增功能

* 为权限、角色、用户和日志管理页面添加分页功能 ([f696096](https://github.com/guizimo/n-admin/commit/f696096a16e934d8984d88eb27c978475dc2a54b)), closes [#4](https://github.com/guizimo/n-admin/issues/4)


### 🐛 Bug 修复

* 修复表头组件的 z-index 设置 ([b0ca504](https://github.com/guizimo/n-admin/commit/b0ca504c716042322c3e956a116c332337e6e8c6)), closes [#3](https://github.com/guizimo/n-admin/issues/3)

### [0.0.12](https://github.com/guizimo/n-admin/compare/v0.0.11...v0.0.12) (2025-07-01)


### ✨ 新增功能

* 优化登录流程，增强认证状态管理 ([5f39909](https://github.com/guizimo/n-admin/commit/5f39909cd7953caddef4c2ea32d7872c5b33af48))
* 删除权限种子数据文件，清理不再使用的代码 ([21628cb](https://github.com/guizimo/n-admin/commit/21628cb999340262ee3e1a00f5152b2e2fbf5d38))
* 更新应用配置和布局，增强可维护性 ([769f9c6](https://github.com/guizimo/n-admin/commit/769f9c60bdd0c302a1be964d569844e3e4108de4))
* 添加超级管理员配置，优化初始化逻辑 ([88535b3](https://github.com/guizimo/n-admin/commit/88535b3c20dc25a6433621310e3039c6f65403cd))

### [0.0.11](https://github.com/guizimo/n-admin/compare/v0.0.10...v0.0.11) (2025-07-01)


### 🐛 Bug 修复

* 优化数据过滤逻辑，使用常量替代变量 ([8fefe41](https://github.com/guizimo/n-admin/commit/8fefe410401897c5b18c565ff4d338383bd9525a))


### ✨ 新增功能

* 优化日志记录方式，简化用户认证模块的日志管理 ([221953b](https://github.com/guizimo/n-admin/commit/221953bfe2cd2d7db63f20deba55d7b492bfd6af))
* 优化过滤器组件布局，移除多余的溢出样式 ([0ded3c3](https://github.com/guizimo/n-admin/commit/0ded3c3c5c801433632c33d96f49d3bfaef1ed1e))
* 优化面包屑组件和头部布局，增强移动端体验 ([cf3babe](https://github.com/guizimo/n-admin/commit/cf3babe6ee3ee9833a164bfaad90ec45cd331eb7))
* 更新布局和组件，增强用户体验 ([25bc5f5](https://github.com/guizimo/n-admin/commit/25bc5f586b6b31f903948e74b98cc8deb509d72e))
* 更新用户注册趋势统计，支持最近30天数据展示 ([2020ab8](https://github.com/guizimo/n-admin/commit/2020ab831cb6f69a2996f19bca88fbdf289c1309))
* 更新登录表单，支持开发环境下的默认凭据 ([c004c1f](https://github.com/guizimo/n-admin/commit/c004c1fac2b7efd95cbb9e6a895ed4509f834f44))
* 更新组件导入路径，优化代码结构 ([8386dd2](https://github.com/guizimo/n-admin/commit/8386dd2ad7ee9d68e4498bfa0091358349993d0f))
* 添加 KBar 组件和搜索功能，优化导航体验 ([fafb288](https://github.com/guizimo/n-admin/commit/fafb288716284be5fdb26ae1d2e58f2f13c643cf))

### [0.0.10](https://github.com/guizimo/n-admin/compare/v0.0.9...v0.0.10) (2025-06-27)


### ✨ 新增功能

* 优化分页组件布局，增强移动端和PC端体验 ([ba282f1](https://github.com/guizimo/n-admin/commit/ba282f17dd06871109b0b36de1447f4f434c70c2))
* 优化数据表组件和页面布局 ([183356a](https://github.com/guizimo/n-admin/commit/183356a9caef5c6c3c4ff5fa6a006d5750514839))
* 优化数据表组件的空状态展示 ([f4771b7](https://github.com/guizimo/n-admin/commit/f4771b7746967c9a1f88bb97d7d0228ea27a5783))
* 优化权限和角色管理页面，移除不必要的筛选字段 ([d21d4c6](https://github.com/guizimo/n-admin/commit/d21d4c61209cfdcb1c06439934f2753d7e6c6d57))
* 优化角色管理页面和权限选择逻辑 ([99f4789](https://github.com/guizimo/n-admin/commit/99f47896c75c0d970862a5ad9b3fa8f1d8e1f967))
* 优化面包屑组件和导航逻辑 ([b170200](https://github.com/guizimo/n-admin/commit/b170200bac6d1c0d8dad252b6af94786e534c9c8))
* 更新侧边栏内容和样式 ([d5e2427](https://github.com/guizimo/n-admin/commit/d5e24277bb8b86f985d822e25a3daae530e54dbe))
* 更新布局元数据，修改标题和描述 ([b622932](https://github.com/guizimo/n-admin/commit/b622932e3c05ffb9fcdfcf3c49fce6fe0452da87))
* 更新数据库连接配置，支持自签名证书 ([93f3eec](https://github.com/guizimo/n-admin/commit/93f3eecab0630d9af910ca3f5c3935dbd82eedbb))
* 更新权限管理代码，调整权限标识符 ([b7e7ae9](https://github.com/guizimo/n-admin/commit/b7e7ae98080fc25bb32d532dd1544ba5a8306476)), closes [#1](https://github.com/guizimo/n-admin/issues/1)
* 更新用户管理功能，添加用户状态管理 ([1ad914c](https://github.com/guizimo/n-admin/commit/1ad914c67cba78dfde98bd7aa04dfaf66712be84))
* 更新用户管理页面，优化用户表格和空状态展示 ([c63c000](https://github.com/guizimo/n-admin/commit/c63c000600d8ab4d7a3335353562aca5bc8d90ff))
* 更新用户管理页面，重构组件和优化状态管理 ([88c1f73](https://github.com/guizimo/n-admin/commit/88c1f73ac445ad118becf0313c7175b84182ba77))
* 更新角色和权限对话框组件，优化布局和交互体验 ([127b3c9](https://github.com/guizimo/n-admin/commit/127b3c9760171f11760b51005977515c04601ead))
* 更新配置文件，优化 ESLint 规则和忽略文件 ([d60df2d](https://github.com/guizimo/n-admin/commit/d60df2d78ae11ad602ba070c792fd188f549b7a5))
* 添加 Zustand 状态管理库并重构认证相关代码 ([ea19861](https://github.com/guizimo/n-admin/commit/ea19861458857a833677463dc9298a7579c0bd0b)), closes [#2](https://github.com/guizimo/n-admin/issues/2)
* 添加超级管理员角色保护机制，优化角色管理功能 ([85f48f4](https://github.com/guizimo/n-admin/commit/85f48f439e198016782e2537aec4d7ef1def2bf8))
* 添加高级筛选功能，优化用户、角色、权限和日志管理页面 ([0f1da4b](https://github.com/guizimo/n-admin/commit/0f1da4b7f282ace113e045fd294337a12e23b66c))
* 重构导航组件，优化导航列表管理 ([a50ee63](https://github.com/guizimo/n-admin/commit/a50ee6331d8f721c0af7b0947837dbbb13a7ada8))
* 重构日志管理页面，优化组件结构和状态管理 ([6ba1848](https://github.com/guizimo/n-admin/commit/6ba1848b7703c8292021d0a09c6f96ca0bd01a97))
* 重构权限管理组件和优化认证状态管理 ([84dfd09](https://github.com/guizimo/n-admin/commit/84dfd094c4dbd9a28e1b5f1c5ff93708d5d24a74))
* 重构权限管理页面，优化组件结构和状态管理 ([d05cb98](https://github.com/guizimo/n-admin/commit/d05cb986b68ecd15b22642d958a014df9dfe3c45))

### [0.0.9](https://github.com/guizimo/n-admin/compare/v0.0.8...v0.0.9) (2025-06-16)


### ✨ 新增功能

* **部署优化:** 添加 GitHub Pages 部署指南和静态构建支持 ([39e14a1](https://github.com/guizimo/n-admin/commit/39e14a1cabf3495a91d82b0e5b9054a5a1d6715f))
* **登录页面优化:** 重构登录页面布局和样式 ([847c584](https://github.com/guizimo/n-admin/commit/847c5841865f8e8debcbad6faea2093e5a30f5d0))
* 更新 README 文档，简化内容并调整格式 ([7a823d6](https://github.com/guizimo/n-admin/commit/7a823d6da92da3e898adb1f528bdda9c2f195593))
* 优化仪表板加载体验和更新角色API接口 ([8297c98](https://github.com/guizimo/n-admin/commit/8297c98605cf6bd00c2d27bc7a55dc3ff3a7591a))
* **重构与优化:** 更新部署文档和移除模拟数据 ([2e45533](https://github.com/guizimo/n-admin/commit/2e4553355941f04c564c0c091667ddf3e04012e2))

### [0.0.8](https://github.com/guizimo/n-admin/compare/v0.0.7...v0.0.8) (2025-06-12)


### ✨ 新增功能

* **代码优化:** 更新 ESLint 配置和组件依赖 ([cd12846](https://github.com/guizimo/n-admin/commit/cd128465656a7491c40320eea8bd66a73557c7b5))
* 更新.gitignore文件，调整对.env文件的忽略规则，确保.env文件被纳入版本控制。 ([8681537](https://github.com/guizimo/n-admin/commit/86815370dbf900b73a25d8aa5c175a807f6d544b))
* 更新README和数据库配置，确保环境变量加载和数据库创建提示 ([e0dca4c](https://github.com/guizimo/n-admin/commit/e0dca4c8a7fb1a3b98b89e902cf3723bf3ff29e0))
* **滚动条样式:** 添加自定义滚动条样式和滚动监听组件 ([290b8ca](https://github.com/guizimo/n-admin/commit/290b8ca0c272c80f532108e33099974e51893b05))
* **主页优化:** 移除GitHub统计功能并简化导航栏设计 ([9f67e3d](https://github.com/guizimo/n-admin/commit/9f67e3dd800b7cf22edffc912efdd8d7df04d001))

### [0.0.7](https://github.com/guizimo/n-admin/compare/v0.0.6...v0.0.7) (2025-06-10)


### ✨ 新增功能

* **导航组件:** 增强导航菜单的激活状态管理 ([3452cae](https://github.com/guizimo/n-admin/commit/3452cae67f749a0da9b7c13b7ccb2f738f51c242))
* **依赖管理:** 更新依赖项并添加日志功能 ([a2b46b6](https://github.com/guizimo/n-admin/commit/a2b46b64fa5f936f1a3d6a2cbc07370b6afce084))
* **仪表盘:** 删除过时的统计组件和相关错误处理 ([514b950](https://github.com/guizimo/n-admin/commit/514b950c527447c8b7f03211f76d742c2f79c93f))

### [0.0.6](https://github.com/guizimo/n-admin/compare/v0.0.5...v0.0.6) (2025-06-10)


### ✨ 新增功能

* **发布流程:** 更新发布脚本以创建更完整的发布包 ([a04b3a1](https://github.com/guizimo/n-admin/commit/a04b3a1ec592669935ccd59ca4d53cbb449d28bf))

### [0.0.5](https://github.com/guizimo/n-admin/compare/v0.0.4...v0.0.5) (2025-06-10)


### ✨ 新增功能

* **代码优化:** 更新布局组件和API参数处理 ([c458399](https://github.com/guizimo/n-admin/commit/c4583996f7c3367d1b097ee3660e75eff106aa43))
* **权限管理:** 引入权限守卫并优化页面结构 ([3fe959e](https://github.com/guizimo/n-admin/commit/3fe959e25d73c42e21273d4b375efb1bcbc47fc3))

### [0.0.4](https://github.com/guizimo/n-admin/compare/v0.0.3...v0.0.4) (2025-06-10)


### ✨ 新增功能

* **代码优化:** 更新 ESLint 配置和多个页面的依赖项 ([9a54fed](https://github.com/guizimo/n-admin/commit/9a54fed3dce291036b74bca7ee36fff1f38e8c3a))
* **权限与角色管理:** 更新权限结构和角色管理功能 ([26d8a22](https://github.com/guizimo/n-admin/commit/26d8a2270ba3eb87d689886ece5dc3920ec085df))
* **权限与角色管理:** 增强API的分页和筛选功能 ([ebcc9fb](https://github.com/guizimo/n-admin/commit/ebcc9fbfb4d7304894080c41ce945502ff744ffd))
* **权限与角色:** 删除角色和用户管理页面的列定义文件，更新相关页面的样式和布局，优化操作按钮的对齐方式。 ([8bc1d93](https://github.com/guizimo/n-admin/commit/8bc1d937ab2f9b29bb0748177c78d84d334dff85))

### [0.0.3](https://github.com/guizimo/n-admin/compare/v0.0.2...v0.0.3) (2025-06-09)


### 🐛 Bug 修复

* **用户表单:** 修复角色ID处理和选择框的必填项 ([1e4096f](https://github.com/guizimo/n-admin/commit/1e4096f52458ec5a41936829ac24b8c2cddbf815))


### ✨ 新增功能

* **权限与角色管理:** 增强API和前端筛选功能 ([d11f03a](https://github.com/guizimo/n-admin/commit/d11f03ae527f415c70ff60def373f8108f08a945))
* **用户管理:** 更新用户管理页面，添加角色选择功能和数据表工具栏 ([008b666](https://github.com/guizimo/n-admin/commit/008b66620c538668dd45e51c7eefc87a9469ec93))

### [0.0.2](https://github.com/guizimo/n-admin/compare/v0.0.1...v0.0.2) (2025-06-09)


### ✨ 新增功能

* **项目配置:** 更新 package.json，添加新的依赖项和脚本配置 ([c92520c](https://github.com/guizimo/n-admin/commit/c92520c59d6a900bf5a7e9940c853b29601fb833))

### 0.0.1 (2025-06-06)


### 📦 构建系统

* 添加Prettier配置文件及忽略文件 ([ffc6d0d](https://github.com/guizimo/n-admin/commit/ffc6d0d6d4580620a3d1c7bf01b7085d74d39b4a))


### 📚 文档更新

* 更新 README.md 以详细描述项目特性和使用指南 ([41de5a9](https://github.com/guizimo/n-admin/commit/41de5a994d21497c54e734d8176b905a1634bd2e))
* 更新 README.md 以增强可读性和视觉吸引力 ([76ed1b4](https://github.com/guizimo/n-admin/commit/76ed1b4a3d940635da36be15c6b1d380cb4d441b))
* 更新 README.md 中的环境配置和数据库操作说明 ([736fdba](https://github.com/guizimo/n-admin/commit/736fdba24d3546c276f63ee88a100659851ec9a1))


### ♻️ 代码重构

* **表格组件:** 将DataTable和DataTableSkeleton移动到table目录并优化加载逻辑 ([8f66bd9](https://github.com/guizimo/n-admin/commit/8f66bd9180bbf3bcaea595e8dab2ef8ccb274e58))
* **侧边栏:** 使用 siteConfig 替换硬编码的公司信息 ([a9e9918](https://github.com/guizimo/n-admin/commit/a9e991880e3cd1c2f272edce02881304cea7285b))
* **数据表格:** 优化表格样式和分页显示 ([ca01c72](https://github.com/guizimo/n-admin/commit/ca01c72edfba55f8e98abca68b8bf026aeffa0d5))
* **auth:** 将用户角色字段从`role`改为`roleId`，并添加超级管理员相关逻辑 ([d36c969](https://github.com/guizimo/n-admin/commit/d36c969af236dcce170e606469e96fb2943b9cc1))
* **drizzle:** 重构数据库结构并优化初始化脚本 ([a77bf61](https://github.com/guizimo/n-admin/commit/a77bf61705d629aa1543cb0942c89376be20e707))
* **layout:** 移除冗余代码并重构用户导航组件 ([a6410e6](https://github.com/guizimo/n-admin/commit/a6410e66fefe31a8e9cec28a24d4a706391aa975))
* **login:** 将登录表单组件移动到features目录 ([22e8b6b](https://github.com/guizimo/n-admin/commit/22e8b6b65a709160cb8c64be33a725e919985973))
* **not-found:** 使用 Card 组件重构 404 页面 ([0f9f903](https://github.com/guizimo/n-admin/commit/0f9f90375314eb2c62d7259e0c950ea86c86b8cb))


### ✨ 新增功能

* 初始化Next.js项目并添加基础组件和配置 ([3a94d92](https://github.com/guizimo/n-admin/commit/3a94d923e810fd2f32c61d65982342a21a9d5cf8))
* **代码质量:** 添加 lint-staged 配置以自动格式化和修复代码 ([b79525b](https://github.com/guizimo/n-admin/commit/b79525b6207e91665a7b749f32acec3c3372a3f2))
* **角色管理:** 新增角色管理功能，包括角色表单、API及权限校验 ([4363999](https://github.com/guizimo/n-admin/commit/4363999f5f4a5ec964f8594fff29deaf3a39a8a1))
* **权限管理:** 添加权限管理功能及相关API ([90ce647](https://github.com/guizimo/n-admin/commit/90ce64774ebeb8c234bc8d45df07c80eab60443c))
* **认证:** 添加用户退出登录功能 ([7197467](https://github.com/guizimo/n-admin/commit/7197467e141ef60f196d3ccf4a3d996ba4bab3f0))
* **首页布局:** 优化首页组件结构与样式 ([0a38a0f](https://github.com/guizimo/n-admin/commit/0a38a0fe4c96acef160d77f8f46b9edcf63dce31))
* 添加 GitHub 统计数据并更新主页布局 ([6e1b83d](https://github.com/guizimo/n-admin/commit/6e1b83db09c54cf2550b4a9ad87508449dd61cc3))
* 添加用户管理相关组件和功能 ([8e04b48](https://github.com/guizimo/n-admin/commit/8e04b4878937fd3fdcd895ca044a1d69798e1c6b))
* 添加用户和角色管理功能，优化导航和面包屑组件 ([754312d](https://github.com/guizimo/n-admin/commit/754312d00f84ed7d2904bcbc5255712284916642))
* 添加用户认证功能并更新数据库结构 ([1d5ef33](https://github.com/guizimo/n-admin/commit/1d5ef335dedb48224a920d7ae73b19fba8b73bbb))
* **项目配置:** 更新 package.json 和 pnpm-lock.yaml，添加提交和版本管理工具 ([be4772a](https://github.com/guizimo/n-admin/commit/be4772ad907bcf71637da3c06a72f6364deb4a79))
* **项目配置:** 更新 package.json 和 README.md，添加作者和许可证信息 ([3d88c17](https://github.com/guizimo/n-admin/commit/3d88c175b65e0b3d1e33b1659db9072e560aba60))
* 新增认证模块及仪表盘页面 ([923b147](https://github.com/guizimo/n-admin/commit/923b147de9256dade3a12f88ccdebf78a280e682))
* 新增UI组件和功能，优化代码结构 ([f3f66fb](https://github.com/guizimo/n-admin/commit/f3f66fb9650aa25bc8914b86cec17a73d11df55f))
* **依赖管理:** 更新依赖项并优化重定向逻辑 ([927097a](https://github.com/guizimo/n-admin/commit/927097a39681bdbfd018959840b33901284851ae))
* **仪表盘:** 添加仪表盘概览页面及图表组件 ([ce0e479](https://github.com/guizimo/n-admin/commit/ce0e47980452fa5ab94fc1d2244f122065406fa1))
* **用户管理:** 添加用户管理功能，支持增删改查操作 ([9068c24](https://github.com/guizimo/n-admin/commit/9068c248781aea3ceda5d9952810f9232763d263))
* **用户管理:** 添加用户删除功能并引入AlertDialog组件 ([8a56c43](https://github.com/guizimo/n-admin/commit/8a56c433f5007121b161acc2a1884d705f24a09f))
* **用户管理:** 优化用户列表显示及角色管理功能 ([401bda2](https://github.com/guizimo/n-admin/commit/401bda2d0167e50c280371198f5d51bd2a926398))
* **用户界面:** 添加用户头像首字母生成功能并优化导航栏 ([2c6c88d](https://github.com/guizimo/n-admin/commit/2c6c88dc25a7480ec0f68c31f435046860c7f693))
* **用户系统:** 添加用户名和头像字段，优化用户信息展示 ([5032bac](https://github.com/guizimo/n-admin/commit/5032bac1775122391cfd41b501a02f307d0f8dd5))
* **db:** 添加Drizzle ORM配置和用户表 ([00958c6](https://github.com/guizimo/n-admin/commit/00958c69af6d6aba97a2516f7055ed657f159a49))


### 💄 代码格式

* 更新项目图标和品牌名称 ([8f242c4](https://github.com/guizimo/n-admin/commit/8f242c48763fb5a01566c0b0f967e44b297793ee))
* lint code ([8ff33c2](https://github.com/guizimo/n-admin/commit/8ff33c2a9f89088541abf5df11acb8fa4ba14f46))


### 🐛 Bug 修复

* **api:** 修复用户和角色API中的参数解析问题 ([e08f477](https://github.com/guizimo/n-admin/commit/e08f477711eb187e357eef1772253fa6e1e5f947))
* **package.json:** 将版本号从 "0.0.1" 修改为 null，修正版本管理配置 ([959bc0f](https://github.com/guizimo/n-admin/commit/959bc0f165b00d6231bf8cf82696e7b7ada7cf5f))
* **package.json:** 移除 lint-staged 中的 eslint --fix 配置，保留仅使用 prettier 进行格式化 ([b90c2d2](https://github.com/guizimo/n-admin/commit/b90c2d218761bb986bb22a513f7dc3a08ff73202))


### 🔨 其他修改

* **版本管理:** 移除不必要的脚本配置，简化版本管理文件 ([675b102](https://github.com/guizimo/n-admin/commit/675b102ecbcb2100a3ec63a3eacf8e54fed05eef))
* 更新依赖并优化Drizzle配置 ([f586129](https://github.com/guizimo/n-admin/commit/f586129aec29a847985436945742b414a0ed098e))
