#!/usr/bin/bash
set -eox pipefail

git stash
git pull --rebase

## Install dependencies and build ##
cd FeApp

set +e
source scripts/load_nvm.sh > /dev/null
nvm use 22
return_code=$?
set -e
if [ $return_code -ne 0 ]; then
    echo "NVM or required Node version not found.  Installing and using..."
    bash scripts/install_node.sh

    nvm use 22
fi

npm install @pnpm/exe
./node_modules/\@pnpm/exe/pnpm install
./node_modules/\@pnpm/exe/pnpm build

