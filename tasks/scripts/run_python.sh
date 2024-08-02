#!/usr/bin/bash
set -eox pipefail

cd prompt_brew
python -m pip install -r requirements.txt

fastapi run --host 127.0.0.1 --port ${CDSW_APP_PORT-8081}
