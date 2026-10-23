<div align="center">

# ⏱️ Focus Task Tracker
### 〜 バニラJSの軽量性を活かし、タスク管理と集中セッションをシームレスに統合したWebアプリケーション 〜

[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Vercel](https://img.shields.io/badge/Vercel-000000?style=flat-square&logo=vercel&logoColor=white)](https://vercel.com/)

[🌐 デモサイトはこちら](https://focus-task-tracker-one.vercel.app/)

</div>

---

## 💡 アプリケーションの概要 (Overview)

「やるべきことに圧倒され、集中が続かない」という課題を解決するために開発した、**タスク管理と集中セッション（タイマー機能）を一体化したプロダクト**です。

外部の重いフレームワークに頼らず、HTML5・CSS3・JavaScript（ES6+）のバニラな技術のみでスクラッチ構築することで、高速な動作とミニマルなUXを実現しています。

---

## ✨ 主な機能とこだわり（Features）

* **🎯 タスク管理 × 集中タイマーのシームレスな統合**
  * 日々のタスクをリスト化し、そのままタイマーを連動させて集中状態に入れる直感的な動線設計。
* **📊 達成感を見える化する進捗トラッキング**
  * 日々の作業実績や完了ステータスを即座に反映し、ユーザーの生産性維持を強力にサポート。
* **🎨 視認性と没入感を追求したUIデザイン**
  * 長時間の作業でも目が疲れにくく、洗練されたレイアウトをCSS（またはTailwind）で構築。
* **💾 ブラウザストレージによるデータ永続化**
  * サーバーサイドを持たない軽量構成でありながら、ブラウザのローカルストレージを活用してリロード後もデータを保持。

---

## 🛠️ 使用技術 (Tech Stack)

| カテゴリ | 技術・ツール |
| :--- | :--- |
| **Markup & Style** | HTML5, CSS3 |
| **Logic** | JavaScript (ES6+) |
| **Storage** | Browser LocalStorage |
| **Deployment** | Vercel |
| **Tools** | Git / GitHub, VS Code |

---

## 📂 ディレクトリ構成 (Directory Structure)

```text
📦 focus-task-tracker
 ┣ 📂 css/          # スタイルシート
 ┣ 📂 js/           # タイマー・タスク管理のロジック
 ┗ 📜 index.html    # メインページ
