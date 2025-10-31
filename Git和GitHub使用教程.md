# Git 和 GitHub 使用教程

> 本教程专为 Lovebox 项目编写，包含 Git 基础知识和实际操作指南

---

## 📋 目录

1. [Git 和 GitHub 是什么](#1-git-和-github-是什么)
2. [基础概念](#2-基础概念)
3. [常用 Git 命令](#3-常用-git-命令)
4. [首次推送到 GitHub](#4-首次推送到-github)
5. [更新版本到 GitHub](#5-更新版本到-github)
6. [针对本项目的操作步骤](#6-针对本项目的操作步骤)
7. [常见问题](#7-常见问题)

---

## 1. Git 和 GitHub 是什么

### Git（版本控制系统）
- **Git** 是一个**本地**的版本控制系统
- 记录文件的所有修改历史
- 可以随时回退到任何历史版本
- 就像"游戏存档"一样，可以保存多个版本

### GitHub（代码托管平台）
- **GitHub** 是一个**在线**的代码托管平台
- 可以把本地的 Git 仓库上传到云端
- 支持多人协作、代码备份、版本管理
- 就像"云盘"一样，但专门为代码设计

### 关系
```
你的电脑（本地仓库）  ←→  GitHub（远程仓库）
     Git 管理              在线备份和分享
```

---

## 2. 基础概念

### 2.1 工作区、暂存区、仓库

```
工作区（Working Directory）
   ↓ git add
暂存区（Staging Area）
   ↓ git commit
本地仓库（Local Repository）
   ↓ git push
远程仓库（Remote Repository - GitHub）
```

- **工作区**：你正在编辑的文件所在的文件夹
- **暂存区**：临时存放准备提交的修改
- **本地仓库**：Git 在本地保存的所有版本历史
- **远程仓库**：GitHub 上的在线仓库

### 2.2 重要术语

| 术语 | 说明 | 类比 |
|------|------|------|
| **repository（仓库）** | 存放项目代码和历史的地方 | 项目文件夹 |
| **commit（提交）** | 保存一次修改的快照 | 游戏存档 |
| **push（推送）** | 把本地修改上传到 GitHub | 上传到云盘 |
| **pull（拉取）** | 从 GitHub 下载最新代码 | 从云盘下载 |
| **clone（克隆）** | 从 GitHub 复制整个仓库到本地 | 复制整个项目 |
| **branch（分支）** | 代码的不同版本线 | 平行宇宙 |
| **merge（合并）** | 合并不同分支的代码 | 合并时间线 |

---

## 3. 常用 Git 命令

### 3.1 查看状态

```bash
# 查看当前状态（哪些文件被修改了）
git status

# 查看修改的具体内容
git diff

# 查看提交历史
git log

# 查看提交历史（简洁版）
git log --oneline
```

### 3.2 添加和提交

```bash
# 添加单个文件到暂存区
git add 文件名

# 添加所有修改的文件到暂存区
git add .

# 提交暂存区的修改到本地仓库
git commit -m "提交说明"

# 添加并提交（一步完成）
git commit -am "提交说明"
```

### 3.3 推送和拉取

```bash
# 推送到 GitHub（上传）
git push origin main

# 从 GitHub 拉取最新代码（下载）
git pull origin main

# 首次推送（设置上游分支）
git push -u origin main
```

### 3.4 分支操作

```bash
# 查看所有分支
git branch

# 创建新分支
git branch 分支名

# 切换到某个分支
git checkout 分支名

# 创建并切换到新分支
git checkout -b 分支名

# 合并某个分支到当前分支
git merge 分支名

# 删除分支
git branch -d 分支名
```

### 3.5 远程仓库

```bash
# 查看远程仓库
git remote -v

# 添加远程仓库
git remote add origin https://github.com/用户名/仓库名.git

# 修改远程仓库地址
git remote set-url origin https://github.com/用户名/仓库名.git
```

---

## 4. 首次推送到 GitHub

### 4.1 在 GitHub 上创建仓库

1. 登录 GitHub：https://github.com
2. 点击右上角的 `+` → `New repository`
3. 填写仓库名称（如：lovebox）
4. 选择 Public（公开）或 Private（私有）
5. **不要**勾选 "Initialize this repository with a README"
6. 点击 `Create repository`

### 4.2 本地初始化并推送

```bash
# 1. 进入项目目录
cd D:\AI coding\project\lovebox

# 2. 初始化 Git 仓库（如果还没初始化）
git init

# 3. 添加所有文件到暂存区
git add .

# 4. 提交到本地仓库
git commit -m "Initial commit"

# 5. 添加远程仓库地址
git remote add origin https://github.com/a534132549/lovebox.git

# 6. 推送到 GitHub
git push -u origin main
```

**注意：** 如果报错说没有 `main` 分支，而是 `master` 分支，使用：
```bash
git push -u origin master
```

---

## 5. 更新版本到 GitHub

当你修改了代码后，要把更新推送到 GitHub：

### 5.1 标准流程（推荐）

```bash
# 1. 查看哪些文件被修改了
git status

# 2. 查看具体修改内容（可选）
git diff

# 3. 添加所有修改到暂存区
git add .

# 4. 提交修改，写清楚修改说明
git commit -m "feat: 升级为62个任务，支持5个关系阶段筛选"

# 5. 推送到 GitHub
git push origin main
```

### 5.2 提交信息规范

好的提交信息应该清楚说明做了什么：

```bash
# ✅ 好的提交信息
git commit -m "feat: 添加关系阶段筛选功能"
git commit -m "fix: 修复任务抽取重复的bug"
git commit -m "docs: 更新README文档"
git commit -m "style: 优化按钮样式"

# ❌ 不好的提交信息
git commit -m "update"
git commit -m "修改"
git commit -m "aaa"
```

**常用前缀：**
- `feat:` - 新功能
- `fix:` - 修复bug
- `docs:` - 文档更新
- `style:` - 样式修改
- `refactor:` - 代码重构
- `test:` - 测试相关
- `chore:` - 构建工具或辅助工具的变动

---

## 6. 针对本项目的操作步骤

### 6.1 检查当前状态

首先，让我们看看你的项目当前的 Git 状态：

```bash
# 进入项目目录
cd "D:\AI coding\project\lovebox"

# 查看 Git 状态
git status

# 查看远程仓库地址
git remote -v
```

### 6.2 推送本次更新到 GitHub

你现在已经完成了重大更新，应该推送到 GitHub 备份和分享！

```bash
# 1. 查看修改状态
git status

# 2. 添加所有修改的文件
git add .

# 3. 提交修改
git commit -m "feat: 重大升级 - 从50个任务升级到62个任务，支持5个关系阶段筛选

- 新增5个关系阶段筛选功能
- 任务从50个扩展到62个，基于心理学研究
- 更新tasks.json数据结构，添加stage字段
- 更新app.js支持阶段筛选
- 更新index.html UI，添加关系阶段筛选器
- 新增更新指南.md文档
- 更新README.md和CLAUDE.md"

# 4. 推送到 GitHub
git push origin main
```

**如果报错说分支是 master 而不是 main，使用：**
```bash
git push origin master
```

### 6.3 如果推送失败

#### 情况1：需要输入用户名和密码

GitHub 从2021年8月起不再支持密码认证，需要使用 Personal Access Token（个人访问令牌）。

**解决方案：**

1. 访问 GitHub：https://github.com/settings/tokens
2. 点击 `Generate new token` → `Generate new token (classic)`
3. 填写 Note（如：lovebox-token）
4. 勾选权限：至少勾选 `repo`
5. 点击 `Generate token`
6. **复制生成的 token（只显示一次！）**
7. 推送时输入：
   - Username: 你的GitHub用户名
   - Password: 粘贴刚才的token（不是你的GitHub密码）

#### 情况2：远程仓库有新内容

```bash
# 先拉取远程最新代码
git pull origin main --rebase

# 如果有冲突，解决冲突后
git add .
git rebase --continue

# 然后再推送
git push origin main
```

#### 情况3：远程仓库和本地完全不同

```bash
# 强制推送（⚠️ 会覆盖远程仓库，谨慎使用）
git push -f origin main
```

### 6.4 推送后查看

推送成功后，访问你的仓库：
https://github.com/a534132549/lovebox

你会看到：
- ✅ 所有文件都已更新
- ✅ 提交历史记录
- ✅ 最新的 README.md 显示在首页

---

## 7. 常见问题

### Q1: 我应该多久提交一次？

**A:** 建议：
- 完成一个功能就提交一次
- 修复一个bug就提交一次
- 一天结束时至少提交一次
- 不要积累太多修改才提交

### Q2: 哪些文件不应该提交到 Git？

**A:** 以下文件不应该提交：
- 临时文件（`.tmp`, `~$*`）
- 系统文件（`.DS_Store`, `Thumbs.db`）
- 依赖文件夹（`node_modules/`）
- 编译产物（`dist/`, `build/`）
- 私密���息（API密钥、密码）
- 大型二进制文件（视频、大图片）

**解决方案：**创建 `.gitignore` 文件

```gitignore
# 系统文件
.DS_Store
Thumbs.db
desktop.ini

# 编辑器
.vscode/
.idea/
*.swp
*.swo

# 临时文件
*.tmp
~$*

# 日志
*.log

# 依赖
node_modules/

# 构建产物
dist/
build/
```

### Q3: 如何撤销修改？

```bash
# 撤销工作区的修改（还没 add）
git checkout -- 文件名

# 撤销暂存区的修改（已经 add，但还没 commit）
git reset HEAD 文件名

# 撤销最近一次提交（已经 commit，但还没 push）
git reset --soft HEAD^

# 完全撤销最近一次提交（危险操作）
git reset --hard HEAD^
```

### Q4: 如何查看某个文件的修改历史？

```bash
# 查看文件的提交历史
git log -- 文件名

# 查看文件每次修改的内容
git log -p 文件名
```

### Q5: 如何删除 GitHub 上的文件，但保留本地？

```bash
# 从 Git 跟踪中删除，但保留文件
git rm --cached 文件名

# 提交并推送
git commit -m "remove file from git tracking"
git push origin main
```

### Q6: 推送时显示"fatal: refusing to merge unrelated histories"

```bash
# 允许合并不相关的历史
git pull origin main --allow-unrelated-histories

# 然后再推送
git push origin main
```

### Q7: 如何在不同电脑上同步代码？

**电脑A（工作后）：**
```bash
git add .
git commit -m "update"
git push origin main
```

**电脑B（开始工作前）：**
```bash
git pull origin main
```

### Q8: 如何删除远程仓库的分支？

```bash
# 删除本地分支
git branch -d 分支名

# 删除远程分支
git push origin --delete 分支名
```

---

## 8. Git 工作流程图

### 8.1 日常开发流程

```
1. 修改代码
   ↓
2. git status（查看修改）
   ↓
3. git add .（添加到暂存区）
   ↓
4. git commit -m "说明"（提交到本地仓库）
   ↓
5. git push origin main（推送到GitHub）
```

### 8.2 团队协作流程

```
1. git pull origin main（拉取最新代码）
   ↓
2. 修改代码
   ↓
3. git add .
   ↓
4. git commit -m "说明"
   ↓
5. git pull origin main（再次拉取，防止冲突）
   ↓
6. 解决冲突（如果有）
   ↓
7. git push origin main（推送到GitHub）
```

---

## 9. GitHub 高级功能

### 9.1 Issues（议题）
- 记录 bug 和功能需求
- 可以分配给他人
- 可以关联提交

### 9.2 Pull Request（拉取请求）
- 代码审查
- 合并分支前的讨论
- 团队协作的核心功能

### 9.3 Actions（自动化）
- 自动测试
- 自动部署
- 持续集成/持续部署（CI/CD）

### 9.4 Releases（发布）
- 标记版本
- 发布软件包
- 生成更新日志

### 9.5 GitHub Pages
- 免费托管静态网站
- 你的 Lovebox 项目可以部署到这里！

---

## 10. 针对 Lovebox 项目的建议

### 10.1 推荐的 .gitignore 文件

在项目根目录创建 `.gitignore` 文件：

```gitignore
# 系统文件
.DS_Store
Thumbs.db
desktop.ini

# 编辑器
.vscode/
.idea/
*.swp

# 临时文件
*.tmp
~$*

# 日志
*.log

# Word临时文件
~$*.docx

# 备份文件
*.bak
*.backup
```

### 10.2 推荐的版本标签

为重要版本打标签：

```bash
# 为当前版本打标签
git tag -a v2.0 -m "重大升级：支持5个关系阶段，62个任务"

# 推送标签到 GitHub
git push origin v2.0

# 推送所有标签
git push origin --tags
```

### 10.3 部署到 GitHub Pages

让你的网站在线访问：

```bash
# 1. 确保代码已推送到 main 分支
git push origin main

# 2. 在 GitHub 仓库页面：
#    Settings → Pages → Source → main → Save

# 3. 几分钟后，你的网站就可以访问了：
#    https://a534132549.github.io/lovebox/
```

---

## 11. 快速参考命令表

| 操作 | 命令 |
|------|------|
| 查看状态 | `git status` |
| 添加文件 | `git add .` |
| 提交 | `git commit -m "说明"` |
| 推送 | `git push origin main` |
| 拉取 | `git pull origin main` |
| 查看历史 | `git log --oneline` |
| 创建分支 | `git checkout -b 分支名` |
| 切换分支 | `git checkout 分支名` |
| 查看远程仓库 | `git remote -v` |
| 克隆仓库 | `git clone URL` |

---

## 12. 学习资源

### 官方文档
- Git 官方文档：https://git-scm.com/doc
- GitHub 文档：https://docs.github.com/

### 在线教程
- 廖雪峰 Git 教程：https://www.liaoxuefeng.com/wiki/896043488029600
- GitHub Learning Lab：https://lab.github.com/

### 可视化工具
- GitHub Desktop：图形界面 Git 工具
- GitKraken：功能强大的 Git GUI
- SourceTree：免费的 Git GUI

---

## 📝 总结

### 对于你的 Lovebox 项目：

**是��，你应该推送更新版本到 GitHub！**

理由：
1. ✅ **备份代码**：防止本地文件丢失
2. ✅ **版本历史**：可以回退到任何历史版本
3. ✅ **展示作品**：GitHub 是你的代码名片
4. ✅ **协作开发**：未来如果有人想贡献代码
5. ✅ **在线访问**：可以部署到 GitHub Pages

### 立即行动：

```bash
# 在项目目录执行
cd "D:\AI coding\project\lovebox"
git status
git add .
git commit -m "feat: 升级到v2.0 - 支持5个关系阶段，62个任务"
git push origin main
```

---

**祝你 Git 和 GitHub 使用愉快！** 🎉
