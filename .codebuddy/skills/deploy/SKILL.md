---
name: deploy
description: 将本项目（Astro 静态站）发布到阿里云 ECS 宝塔面板服务器（116.62.55.62），或回滚/查看历史版本。当用户说"部署/发布/上线/更新网站/回滚/切换版本/查看线上版本"时使用。支持 songboai 与 xiaoezu 两个站点。
---

# 部署 Skill（阿里云 ECS · 宝塔 · Workbench CLI）

## 环境事实（已验证，2026-08-25）

| 项 | 值 |
|---|---|
| ECS 实例 | `i-bp1aixyvr309b2lbrmsv`（杭州 cn-hangzhou，116.62.55.62） |
| 面板 | 宝塔（站点根目录 `/www/wwwroot/`，vhost 配置 `/www/server/panel/vhost/nginx/`） |
| Nginx | 1.30.4（≥1.25，`http2 on;` 新语法可用） |
| 通道 | 阿里云 Workbench CLI（本地 `~/.workbench/bin/workbench`，凭据已配置于 `~/.workbench/config.json`） |
| 站点 | songboai（运行中，产物平铺在根目录、**尚未做版本结构迁移**）、xiaoezu（备案中，宝塔站点未建） |

## 核心原则

1. **一切发布/回滚动作都通过 `scripts/deploy-workbench.sh` 执行**，不要手工拼 workbench 命令操作站点目录。
2. **破坏性命令必须先向用户确认**（rm -rf、清版本、改 vhost、`nginx -s reload`）。Workbench 官方 Skill 安全要求同此。
3. 站点结构是 `releases/YYYYMMDD-HHMM/` + `current` 软链原子切换；**保留最近 5 个版本**；发布后首页非 200/301/302 自动回滚。
4. **首次发布前必须先完成版本结构迁移**（见下节），否则脚本会因 current 软链不存在而拒绝执行——这是预期行为。
5. xiaoezu 备案完成前禁止发布 xiaoezu。

## 用户意图 → 动作映射

| 用户说 | 执行 |
|---|---|
| "部署 / 发布 / 上线" | `bash scripts/deploy-workbench.sh`（默认 songboai） |
| "部署 xiaoezu" | `bash scripts/deploy-workbench.sh xiaoezu` |
| "回滚 / 出问题了退回去" | `bash scripts/deploy-workbench.sh --rollback`（确认后执行） |
| "回滚 xiaoezu" | `bash scripts/deploy-workbench.sh xiaoezu --rollback` |
| "看看线上有哪些版本" | `bash scripts/deploy-workbench.sh --list` |

发布前自查（对话内完成，不必问用户）：
- `git status` 是否干净、当前分支；未提交改动要提醒用户
- 首次发布：确认迁移已完成（`workbench exec -c "readlink /www/wwwroot/songboai.cn/current"` 有输出）
- 发布耗时长（build+打包+OSS 中转），用 `run_in_background` 执行并告知用户

## 首次使用前：songboai 版本结构迁移（一次性，需用户确认）

songboai 当前产物平铺在 `/www/wwwroot/songboai.cn/`，无版本结构。首次发布前迁移：

```bash
# 服务器上执行（经 workbench exec，逐条或 && 链式）
M=/www/wwwroot/songboai.cn
mkdir -p $M/releases/init
# 把根目录下的静态文件（index.html/_astro/ 等）移入 releases/init，再：
ln -sfn $M/releases/init $M/current
# 宝塔面板：songboai.cn 站点"运行目录"改为 /current（或改 vhost root 加 /current）
```

迁移后验证 `curl -I https://songboai.cn` 仍 200。之后统一走 `bash scripts/deploy-workbench.sh`。

## Workbench CLI 速查（排障用）

```bash
export PATH="$HOME/.workbench/bin:$PATH"
workbench exec --instance-id i-bp1aixyvr309b2lbrmsv --command "df -h"        # 远程命令（无状态，链式用 &&）
workbench upload <本地文件> <远程路径> --instance-id i-bp1aixyvr309b2lbrmsv  # 上传（≤1GB，OSS 中转）
workbench list ecs --region cn-hangzhou                                       # 实例列表
```

- 每次调用独立 shell，`cd`/`export` 不跨调用保留。
- upload 有覆盖确认（默认 No），自动化前先 `exec test -e <路径>` 检查。
- 排障：403=RAM 权限（策略 WorkbenchCLIDeploy）、4=认证失败（查 config.json）、5=网络。

## 失败处理

- 发布中途失败：脚本自动回滚并退出非零；查看输出定位是 build/上传/解压/验证哪一步
- 版本目录残留半成品：`workbench exec` 检查 `releases/$TS` 是否含 index.html，不含则可删（需用户确认）
- 健康探测 000：多为 HTTPS 未启用却探测 https，临时 `SITE_URL=http://...` 重发，或先修证书
- 部署文档（完整版）在 xiaoezu 仓库：`~/IdeaProjects/xiaoezu/docs/DEPLOY-GUIDE.md` §W
