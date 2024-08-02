#!/usr/bin/bash
set -eox pipefail

git stash
git pull --rebase

## Install dependencies and build ##
cd FeApp
npm install @pnpm/exe
./node_modules/\@pnpm/exe/pnpm install
./node_modules/\@pnpm/exe/pnpm build


