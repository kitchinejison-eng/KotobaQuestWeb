# GitHub Pages 画像表示の原因切り分け・修正（Ver.42）

## 結論
画像フォルダーを置くだけでは不十分な場合があります。次の3点すべてが一致している必要があります。
1. Pagesが公開しているブランチ（例：`main`）
2. Pagesが公開しているフォルダー（例：`/(root)`）
3. `index.html` から見た素材フォルダーの位置とファイル名

このセットは、画像・音楽・アイコンフォントを含む完全なサイトです。ZIPの中身はリポジトリの最上位に置く前提です。外側のフォルダー名ごとリポジトリに入れるとパスが合わなくなります。

## まず診断ページを公開して確認
完全版をリポジトリに反映後、以下を開きます。
`https://kitchinejison-eng.github.io/kotobatore_tesut/asset-check.html`

診断ページで「読み込み失敗」が出る場合、ゲームの問題以前に、公開先のブランチ／フォルダーまたは素材パスが一致していません。

## 推奨手順：GitHub Desktopでサイト全体を反映
1. GitHub Desktopで `https://github.com/kitchinejison-eng/kotobatore_tesut.git` をCloneします。
2. `KotobaQuestWeb_V41_GitHubPages_FIXED.zip` をパソコン上の別フォルダーに展開します。
3. ZIP内の**中身全部**（`index.html`、`style.css`、`app.js`、`.nojekyll`、`images/`、`assets/`、`BGM/`、`fontawesome/`など）を、Cloneした `kotobatore_tesut` フォルダーにコピーし、同名ファイルは置き換えます。
4. コピー後、`kotobatore_tesut/index.html` と `kotobatore_tesut/images/apple.jpg` が存在していることを確認します。
5. GitHub Desktopで変更をCommitして、Push originします。
6. GitHubのリポジトリの **Settings → Pages** で、公開元が意図したブランチとフォルダー（たとえば `main` / `/(root)`）になっていることを確認します。
7. 数分待ってから診断ページを開きます。反映に時間がかかることがあります。

## 正しいフォルダー構成

```
kotobatore_tesut/
  index.html
  style.css
  browser-responsive.css
  app.js
  app-ui.js
  asset-check.html
  images/
    apple.jpg
    ivent/
      cat_1_crop.png
      avatar_default_01.png
  assets/
    icons/
    images/
  BGM/
  fontawesome/
```

## 間違いやすい配置

```
kotobatore_tesut/
  KotobaQuestWeb_V41_FIXED/
    index.html
    images/
```

このように余計な親フォルダーが1段あると、Pagesの入口 `index.html` から `images/apple.jpg` を読み込めません。

## GitHub Webでアップロードする場合
ブラウザ上の「Add file → Upload files」では、フォルダー構成の取り違えが起きやすいです。上記のGitHub Desktop方法が推奨です。Webアップロードを使う場合も、素材フォルダーが公開元のルートに作成され、コミット済みであることを確認してください。
