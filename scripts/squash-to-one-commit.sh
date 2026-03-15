#!/usr/bin/env bash
# 将当前分支所有历史压成 1 个 commit，代码保持当前状态
# 使用前请确认已提交或暂存所有需要的修改

set -e

BRANCH="${1:-main}"
COMMIT_MSG="${2:-chore: squash history into one commit}"

echo "当前分支: $(git branch --show-current)"
echo "将把当前代码压成 1 个 commit，新分支名: ${BRANCH}"
echo "提交信息: ${COMMIT_MSG}"
echo ""
read -p "继续? (y/N) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
  echo "已取消"
  exit 0
fi

# 新建无历史的孤儿分支
git checkout --orphan temp-squash

# 当前所有文件加入暂存区（和现在 main 上的内容一致）
git add -A
git commit -m "${COMMIT_MSG}"

# 删掉原来的 main，把当前分支改名为 main
git branch -D "${BRANCH}" 2>/dev/null || true
git branch -m "${BRANCH}"

echo "完成。当前为 1 个 commit。推送请执行:"
echo "  git push --force-with-lease origin ${BRANCH}"
