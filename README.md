# netminn012.com

netminn012の主要なSNS、ブログ、運営サイトをまとめた1ページのリンク集です。

## 内容の変更

普段の更新は、次の2ファイルだけで行えます。

- `src/data/site.ts`: サイト名、プロフィール文、画像、各見出し、SEO説明、Footer
- `src/data/links.ts`: メインリンク、その他のリンク、運営サイト

プロフィール画像を変更する場合は、画像を`public/`へ追加し、`src/data/site.ts`の`profileImage`を変更してください。リンクを追加する場合は、対象配列へ既存項目と同じ形式で追記します。`icon`には`discord`、`github`、`x`、`youtube`、`hatena`、`scratch`、`note`、`qiita`、`site`を指定できます。

## 開発

```sh
npm ci --include=optional
npm run dev
```

Astro、TypeScript、CSSで構成し、GitHub Pagesへ静的出力をデプロイします。

Codespacesでnative bindingのエラーが出た場合は、以前の依存関係を削除して入れ直してください。

```sh
rm -rf node_modules
npm ci --include=optional
```
