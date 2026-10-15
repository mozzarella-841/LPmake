# microCMS 接続手順

## 1. microCMS

アカウントとサービスを作成し、APIを作成します。

- API名：LP編集
- エンドポイント：`lp`
- APIの型：オブジェクト型（リスト型ではありません）

APIスキーマに次のフィールドを追加します。すべて任意項目です。未入力の項目は既存の文章・写真を使用します。

| フィールドID | 表示名 | 種類 |
| --- | --- | --- |
| heroTitle | メインキャッチコピー | テキストエリア |
| heroDescription | メイン説明文 | テキストエリア |
| heroImage | メイン写真 | 画像 |
| conceptText | 考え方の紹介文 | テキストエリア |
| conceptImage | 考え方の写真 | 画像 |
| trainerName | トレーナー名 | テキストフィールド |
| trainerProfile | プロフィール紹介文 | テキストエリア |
| trainerImage | トレーナー写真 | 画像 |
| trialTitle | 体験メニュー名 | テキストフィールド |
| trialDescription | 体験メニュー説明 | テキストエリア |
| trialPrice | 体験料金・所要時間 | テキストフィールド |
| planTitle | 継続プラン名 | テキストフィールド |
| planDescription | 継続プラン説明 | テキストエリア |
| planPrice | 継続料金・回数 | テキストフィールド |
| contactText | 最後の相談案内文 | テキストエリア |
| bookingUrl | 予約先URL（https://で始まるURL） | テキストフィールド |
| faqs | よくある質問 | 繰り返し（カスタムフィールド） |

FAQにはカスタムフィールド `faq` を作成し、`question`（質問：テキストフィールド）、`answer`（回答：テキストエリア）を用意して選択します。FAQを空にすると既存の6件を使用します。改行はそのまま表示されます。HTMLタグは入力しません。

最初は `heroTitle` のみでも接続できます。編集後に「公開」してください。下書きは取得しません。

APIキーは `lp` のGETのみを許可した専用のものを作成してください。POST/PATCH/DELETEは不要です。キーをチャットやリポジトリに貼らないでください。

## 2. GitHubの非公開設定

https://github.com/mozzarella-841/LPmake/settings/secrets/actions

「New repository secret」で次の2つを保存します。

- `MICROCMS_SERVICE_DOMAIN`：管理画面URLの `https://○○.microcms.io/` の○○部分だけ
- `MICROCMS_API_KEY`：GET専用APIキー

## 3. 公開の接続

https://github.com/mozzarella-841/LPmake/settings/pages

Sourceを **GitHub Actions** に変更します（既存のgh-pagesから切り替え）。

https://github.com/mozzarella-841/LPmake/actions

**Publish LP from microCMS** → **Run workflow** → main → **Run workflow**。

緑のチェックが付いたら公開URLを再読み込みして、管理画面で入力した文章になっているか確認します。

https://mozzarella-841.github.io/LPmake/

## 通常の編集

microCMSで編集し「公開」すると、GitHub Actionsの約5分間隔のスケジュールで取得・再公開します。予約投稿や即時反映を保証するものではなく、GitHubの混雑による遅延があります。急ぐ場合はActionsから手動実行できます。公開リポジトリのスケジュール実行は60日間リポジトリの活動がないと停止するため、その場合はActionsで再有効化します。

API取得やビルドに失敗した場合は既存の公開ページを保持します。Actionsの赤い実行結果を確認してください。予約先URLを空にすると準備中の案内に戻ります。

管理画面で扱うのは公開してよい文章・写真のみです。APIキーはビルド時にだけ使用し、配信ファイルには含めません。実際のサービスと接続するまでは連携の完了ではありません。
