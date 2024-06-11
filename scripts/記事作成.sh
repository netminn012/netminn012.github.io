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

# ユーザーにタイトル、本文、およびファイル名を入力してもらう
echo "タイトルを入力:"
read title
echo "Enter the filename (without extension):"
read filename

# ファイル名に拡張子を追加し、マークダウンファイルを作成
filename_with_ext="${filename}.md"
echo "# $title" > "$filename_with_ext"


echo "Markdown file created as $filename_with_ext"