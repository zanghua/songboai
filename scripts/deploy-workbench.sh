#!/usr/bin/env bash
# songboai/xiaoezu 发布脚本 —— 阿里云 Workbench CLI 版（宝塔面板 ECS）
#
# 用法：
#   bash scripts/deploy-workbench.sh                      # 发布 songboai（默认站点）
#   bash scripts/deploy-workbench.sh xiaoezu              # 发布 xiaoezu
#   bash scripts/deploy-workbench.sh --rollback           # 回滚 songboai 到上一版
#   bash scripts/deploy-workbench.sh xiaoezu --rollback   # 回滚 xiaoezu
#   bash scripts/deploy-workbench.sh --list               # 列出 songboai 历史版本
#
# 前置条件：
#   1) Workbench CLI 已安装且凭据已配置（~/.workbench/config.json，见 xiaoezu 仓库 docs/DEPLOY-GUIDE.md §W）
#   2) 站点已完成版本结构迁移（releases/ + current 软链，见 SKILL.md）
#
# 设计（与 xiaoezu/scripts/deploy-workbench.sh 保持一致）：
#   - set -euo pipefail：任一步失败立即中止
#   - 版本目录 YYYYMMDD-HHMM；current 软链原子切换（ln -sfn）
#   - 发布后探测首页，非 200/301/302 自动回滚
#   - 自动清理旧版本，保留最近 5 个（当前版本永不清）
set -euo pipefail

# ----------------------------- 站点注册表 -----------------------------
# 新站点在此追加一行：域名|根目录|健康检查URL
SITE_REGISTRY=(
  "songboai|/www/wwwroot/songboai.cn|https://songboai.cn/"
  "xiaoezu|/www/wwwroot/www.xiaoezu.cn|https://www.xiaoezu.cn/"
)

ECS_INSTANCE_ID="i-bp1aixyvr309b2lbrmsv"   # 阿里云 ECS（杭州）
WORKKEEP_RELEASES=5                          # 历史版本保留个数

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

WB="${WORKBENCH_BIN:-$HOME/.workbench/bin/workbench}"
if [[ ! -x "$WB" ]]; then
  # 兜底：PATH 里找
  if command -v workbench >/dev/null 2>&1; then
    WB="workbench"
  else
    echo "❌ 未找到 workbench CLI。安装：curl -fsSL https://workbench-cli.oss-cn-hangzhou.aliyuncs.com/install.sh | bash -s -- -d ~/.workbench/bin"
    exit 1
  fi
fi

# ----------------------------- 参数解析 -----------------------------
SITE_NAME="songboai"
MODE="deploy"
for arg in "$@"; do
  case "$arg" in
    --rollback) MODE="rollback" ;;
    --list)     MODE="list" ;;
    --help|-h)
      sed -n '2,18p' "$0" | sed 's/^# \{0,1\}//'; exit 0 ;;
    *)          SITE_NAME="$arg" ;;
  esac
done

# 查站点配置
SITE_ROOT=""; SITE_URL=""
for entry in "${SITE_REGISTRY[@]}"; do
  IFS='|' read -r name root url <<< "$entry"
  if [[ "$name" == "$SITE_NAME" ]]; then SITE_ROOT="$root"; SITE_URL="$url"; fi
done
if [[ -z "$SITE_ROOT" ]]; then
  echo "❌ 未知站点：${SITE_NAME}（可用：${SITE_REGISTRY[*]%%|*}）"
  exit 1
fi

REMOTE_RELEASES="$SITE_ROOT/releases"
rsh() {  # 远程执行（workbench exec 无状态，命令需自包含）
  "$WB" exec --instance-id "$ECS_INSTANCE_ID" --command "$1"
}

TS="$(date +%Y%m%d-%H%M)"

# ----------------------------- 工具函数 -----------------------------
current_version() {
  rsh "readlink $SITE_ROOT/current 2>/dev/null | xargs -r basename" 2>/dev/null \
    | grep -E '^[0-9]{8}-[0-9]{4}$' || echo ""
}

switch_to() {  # $1=版本目录名
  rsh "ln -sfn $REMOTE_RELEASES/$1 $SITE_ROOT/current"
}

http_status() {
  curl -s -o /dev/null -w '%{http_code}' --max-time 15 "$1" || echo "000"
}

cleanup_old_releases() {
  # 保留最近 KEEP_RELEASES 个，其余清理（当前指向的版本永不清）
  rsh "cd $REMOTE_RELEASES && ls -1 | sort | head -n -$WORKKEEP_RELEASES | while read -r v; do \
[ \"\$v\" != \"\$(basename \$(readlink $SITE_ROOT/current))\" ] && rm -rf \"\$v\" && echo \"cleaned \$v\"; done" \
    || echo "(清理旧版本失败，不阻断发布)"
}

# ----------------------------- 版本列表模式 -----------------------------
if [[ "$MODE" == "list" ]]; then
  echo "📦 $SITE_NAME 历史版本（${REMOTE_RELEASES}，保留 $WORKKEEP_RELEASES 个）"
  # 区分三种情况：站点目录不存在 / 无 releases / 有版本
  if ! rsh "test -d $SITE_ROOT"; then
    echo "⚠️ 站点根目录不存在：${SITE_ROOT}（宝塔站点未创建，或从未发布过）"
    exit 0
  fi
  if ! rsh "test -d $REMOTE_RELEASES"; then
    echo "⚠️ releases 目录不存在：版本结构未初始化（首次发布前请先做迁移，见 SKILL.md）"
    exit 0
  fi
  VERSIONS="$(rsh "ls -1 $REMOTE_RELEASES | sort")"
  if [[ -z "$VERSIONS" ]]; then
    echo "（releases 目录为空，尚无任何版本）"
    exit 0
  fi
  echo "$VERSIONS"
  CUR="$(current_version)"
  [[ -n "$CUR" ]] && echo "▶ 当前版本：$CUR"
  exit 0
fi

# ----------------------------- 回滚模式 -----------------------------
if [[ "$MODE" == "rollback" ]]; then
  echo "⏪ 回滚模式：$SITE_NAME"
  CUR="$(current_version)"
  if [[ -z "$CUR" ]]; then
    echo "❌ 无法读取当前版本（current 软链不存在），放弃回滚"
    echo "   若尚未做版本结构迁移，先按 SKILL.md 完成迁移再使用本脚本"
    exit 1
  fi
  # 找当前版本的前一个（按时间戳排序）
  TARGET="$(rsh "cd $REMOTE_RELEASES && ls -1 | sort | awk '\$0==\"$CUR\"{print p; exit} {p=\$0}'")"
  if [[ -z "$TARGET" ]]; then
    echo "❌ 没有可回滚的更早版本（当前 $CUR 已是最早）"
    echo "   可用版本见：bash $0 $SITE_NAME --list"
    exit 1
  fi
  echo "回滚：$CUR → $TARGET"
  switch_to "$TARGET"
  STATUS="$(http_status "$SITE_URL")"
  if [[ "$STATUS" != "200" && "$STATUS" != "301" && "$STATUS" != "302" ]]; then
    echo "⚠️ 回滚后探测状态码 ${STATUS}，请人工核查 $SITE_URL"
    exit 1
  fi
  echo "✅ 已回滚至 ${TARGET}（$SITE_URL 状态 ${STATUS}）"
  exit 0
fi

# ----------------------------- 发布流程 -----------------------------
echo "🚀 发布开始：$SITE_NAME $TS → ECS:$REMOTE_RELEASES/$TS"

# 1) 本地构建
echo "── [1/6] 本地构建（pnpm build）"
( cd "$PROJECT_DIR" && pnpm build )

# 2) 打包产物（tar.gz；绕开 upload 单文件 1GB 限制与逐文件上传慢的问题）
echo "── [2/6] 打包 dist → /tmp/${SITE_NAME}-${TS}.tar.gz"
TARBALL="/tmp/${SITE_NAME}-${TS}.tar.gz"
tar -czf "$TARBALL" -C "$PROJECT_DIR/dist" .
TAR_SIZE="$(du -h "$TARBALL" | cut -f1)"
echo "   包大小：$TAR_SIZE"

# 3) 远程建版本目录 + 上传 + 解压
echo "── [3/6] 上传并解压到 $REMOTE_RELEASES/$TS"
rsh "mkdir -p $REMOTE_RELEASES/$TS"
if rsh "test -e $REMOTE_RELEASES/$TS/index.html"; then
  echo "❌ 目标版本目录非空（$TS 已存在），中止"
  exit 1
fi
"$WB" upload "$TARBALL" "/tmp/${SITE_NAME}-${TS}.tar.gz" --instance-id "$ECS_INSTANCE_ID"
rsh "tar -xzf /tmp/${SITE_NAME}-${TS}.tar.gz -C $REMOTE_RELEASES/$TS && rm -f /tmp/${SITE_NAME}-${TS}.tar.gz && test -f $REMOTE_RELEASES/$TS/index.html" \
  || { echo "❌ 解压失败或缺少 index.html，中止"; exit 1; }
rm -f "$TARBALL"

# 4) 原子切换（换软链 = 瞬间完成，无半新半旧窗口）
echo "── [4/6] 原子切换 current → $TS"
PREV="$(current_version)"
switch_to "$TS"

# 5) 验证（首页 200/301/302；否则自动回滚）
echo "── [5/6] 验证 $SITE_URL"
STATUS="$(http_status "$SITE_URL")"
if [[ "$STATUS" != "200" && "$STATUS" != "301" && "$STATUS" != "302" ]]; then
  echo "❌ 探测失败（状态码 ${STATUS}），自动回滚…"
  if [[ -n "$PREV" ]]; then
    switch_to "$PREV"
    echo "↩️  已回滚至 $PREV"
  else
    echo "⚠️ 无先前版本可回滚（首次发布），请人工检查服务器"
  fi
  exit 1
fi

# 6) 清理旧版本（保留最近 5 个）
echo "── [6/6] 清理旧版本（保留 ${WORKKEEP_RELEASES}）"
cleanup_old_releases

echo ""
echo "✅ 发布完成：$SITE_NAME ${TS}（$SITE_URL 状态 ${STATUS}）"
[[ -n "$PREV" ]] && echo "   上一版本 $PREV 仍保留于 releases/，回滚：bash $0 $SITE_NAME --rollback"
exit 0
