#!/bin/bash

# venvがアクティブかどうかを確認
if [[ -z "$VIRTUAL_ENV" ]]; then
    # venvがアクティブでなければ、アクティベートする
    source ./venv/bin/activate
else
    echo "venv is already active."
fi

cd project
cd content