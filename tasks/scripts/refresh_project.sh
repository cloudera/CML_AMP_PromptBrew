#!/usr/bin/bash
set -eox pipefail

git stash
git pull --rebase

set +e
source tasks/scripts/load_nvm.sh > /dev/null
nvm use 22
return_code=$?
set -e
if [ $return_code -ne 0 ]; then
    echo "NVM or required Node version not found.  Installing and using..."
    bash tasks/scripts/install_node.sh
    source tasks/scripts/load_nvm.sh > /dev/null

    nvm use 22
fi

## Install dependencies and build ##
cd FeApp

npm install
npm run build

