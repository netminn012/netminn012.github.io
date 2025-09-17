# ブログ機能の使い方メモ

このサイトはJekyllを使ってブログ機能を追加しています。GitHub Pagesで自動的にビルド・公開されます。

## ファイル構造

```
/workspaces/netminn012.github.io/
├── _config.yml          # Jekyll設定ファイル
├── _layouts/            # レイアウトファイル
│   ├── default.html     # デフォルトレイアウト
│   └── post.html        # ブログ記事用レイアウト
├── _posts/              # ブログ記事フォルダ
│   └── YYYY-MM-DD-title.md  # 記事ファイル
├── blog/
│   └── index.md         # ブログ一覧ページ
├── index.md             # ホームページ
├── style.css            # CSSファイル
├── Gemfile              # Ruby依存関係
└── .github/workflows/
    └── jekyll.yml       # GitHub Actionsワークフロー
```

## ブログ記事の作成方法

### 1. 記事ファイルを作成
`_posts`フォルダに以下の命名規則でMarkdownファイルを作成します：
```
YYYY-MM-DD-記事タイトル.md
```
例: `2025-09-17-hello-world.md`

### 2. ファイルの先頭にYAML front matterを追加
```yaml
---
layout: post
title: "記事のタイトル"
date: 2025-09-17
categories: カテゴリ名
---
```

### 3. Markdownで本文を書く
YAML front matterの下に通常のMarkdownで記事を書きます。

```markdown
---
layout: post
title: "初めてのブログ記事"
date: 2025-09-17
categories: 雑記
---

こんにちは！これは初めてのブログ記事です。

## 見出し
本文をMarkdownで書けます。

- リスト
- リンク
- **太字** など

コードブロックも使えます：

```javascript
console.log("Hello, World!");
```
```

## 利用可能なYAMLオプション

- `layout`: 使用するレイアウト（通常 `post`）
- `title`: 記事のタイトル
- `date`: 公開日（YYYY-MM-DD形式）
- `categories`: カテゴリ（複数可、配列形式）
- `tags`: タグ（複数可、配列形式）
- `excerpt`: 抜粋文（指定しない場合は本文の先頭から自動生成）

## デプロイ方法

### GitHub Pagesの場合
1. 記事ファイルをコミット・プッシュ
2. GitHub Actionsが自動的にビルドを実行
3. `_site`フォルダに生成されたHTMLが公開される

### ローカルでテストする場合
```bash
# Jekyllをインストール（初回のみ）
gem install jekyll bundler

# ローカルサーバーを起動
bundle exec jekyll serve

# ブラウザで http://localhost:4000 にアクセス
```

## 便利な機能

### Liquidテンプレート
記事内でJekyllのLiquidテンプレートが使えます：
- `{{ site.title }}`: サイトタイトル
- `{{ page.date | date: "%Y年%m月%d日" }}`: 日付のフォーマット
- `{{ post.url }}`: 記事のURL

### 画像の配置
`assets`フォルダに画像を置き、以下のように参照：
```markdown
![代替テキスト]({{ '/assets/image.jpg' | relative_url }})
```

### リンクの作成
```markdown
[リンクテキスト]({{ '/blog' | relative_url }})
```

## 注意点

- ファイル名は必ず `YYYY-MM-DD-` で始めること
- YAML front matterは `---` で囲むこと
- Markdownの文法に従って書くこと
- 特殊文字は適切にエスケープすること

## トラブルシューティング

### 記事が表示されない場合
- ファイル名が正しいか確認
- YAML front matterが正しいか確認
- GitHub Actionsのビルドログを確認

### ローカルで動作しない場合
- RubyとJekyllがインストールされているか確認
- `bundle install` を実行

## 参考リンク
- [Jekyll公式ドキュメント](https://jekyllrb.com/docs/)
- [GitHub Pages + Jekyll](https://docs.github.com/en/pages/setting-up-a-github-pages-site-with-jekyll)
- [Markdown記法](https://www.markdownguide.org/basic-syntax/)