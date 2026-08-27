# Data Engineer Quest

## Claude Code向け 0→1 開発指示書

---

# 0. このドキュメントの目的

あなたはこのドキュメントを、Data Engineer QuestというWebアプリケーションを0から設計・実装するための最上位仕様書として扱う。

単なる学習サイトやDatabricks教材サイトを作るのではない。

このプロダクトの目的は、

> **未経験領域に挑戦する人が、実際のData Engineeringの問題を解きながら、「自分にもできる」という感覚を少しずつ獲得し、自分自身で次のキャリアへの足がかりを掴めるようにすること。**

である。

技術知識の習得は目的の一つだが、最終目的ではない。

最終的にユーザーが、

> 「最初は何も分からなかったけど、今ならこの仕事の話についていける」
> 「実際に手を動かして問題を解決できた」
> 「Data Engineerという仕事が少し見えてきた」
> 「自分も次の仕事に挑戦できるかもしれない」

と思える状態を作る。

この思想を、UI・UX・ゲームシステム・学習設計・AI・データモデルのすべてに反映すること。

---

# 1. プロダクトコンセプト

## Product Name

**Data Engineer Quest**

## Tagline

第一候補：

> **Learn by solving. Grow by doing.**

日本語では、

> **問題を解く。仕事がわかる。自信がつく。**

という思想。

---

# 2. 絶対に守るプロダクト思想

## 2.1 「勉強させるアプリ」にしない

典型的な学習サービス：

```text
教材を見る
↓
説明を読む
↓
暗記する
↓
小テスト
↓
次の教材
```

Data Engineer Questでは、これを基本構造にしない。

基本構造は、

```text
事件・課題が発生
↓
状況を理解する
↓
自分で考える
↓
調査する
↓
コードを書く
↓
実行する
↓
結果を見る
↓
原因を考える
↓
解決する
↓
振り返る
↓
「できるようになったこと」を実感する
```

とする。

---

# 3. 最重要KPI

単純なDAUやログイン日数を最上位KPIにしない。

最重要指標は、

## 「自己効力感の変化」

ユーザーが、

> 「この領域について、以前より自分で考えられるようになった」

と感じること。

プロダクト上ではこれを直接・間接的に計測する。

例：

- Quest完了数
- 初回挑戦から解決までの時間
- ヒント使用回数の減少
- 同じ概念を別問題で使える割合
- 未知問題への挑戦率
- Mastery Score
- 「自信度」の自己評価
- Career Confidence
- 以前できなかった問題ができるようになった数

---

# 4. ターゲットユーザー

最初のターゲット：

### Primary

Data Engineering未経験〜初級者。

特に、

- SQLは少しできる
- Excel / BI / データ分析経験がある
- IT経験はあるがData Engineeringは未経験
- Databricksを触ることになった
- データ基盤に興味がある
- Data Engineerにキャリアチェンジしたい
- Udemyなどの動画教材では挫折しやすい

人。

---

# 5. ユーザーが抱えている問題

典型的な初心者：

> 「何から勉強すればいいかわからない」

↓

Udemyを見る。

↓

最初は頑張る。

↓

SQL文法。

↓

Sparkの説明。

↓

Delta Lakeの説明。

↓

なんとなく理解した気になる。

↓

実際の仕事で、

> 「で、これって何に使うの？」

となる。

↓

挫折。

---

Data Engineer Questはこの問題を解決する。

## 原則

### 「必要になったから学ぶ」

を採用する。

例えば、

> 「データパイプラインが壊れた」

↓

なぜJOINが必要なのか分からない

↓

JOINを学ぶ

ではなく、

> 「この2つのテーブルから顧客ごとの注文情報を作らないといけない」

↓

自分で試す

↓

JOINが必要になる

↓

JOINを理解する

という順番。

---

# 6. 学習体験の基本ループ

すべての学習体験は可能な限り以下のループにする。

```text
MISSION
  ↓
CONTEXT
  ↓
CHALLENGE
  ↓
ATTEMPT
  ↓
FEEDBACK
  ↓
REFLECTION
  ↓
MASTERY
  ↓
NEXT QUEST
```

---

# 7. Questシステム

## Questとは

Questは単なる「問題」ではない。

Questは、

> **Data Engineerとして実際に遭遇しそうな仕事上の出来事**

として設計する。

---

## Quest例

### Quest 001

# 「朝6時のデータが来ない」

あなたはData Platform Teamに配属された新人Data Engineer。

毎朝6:00に更新されるSales Dashboardが更新されていない。

Business TeamからSlackが届く。

> 「今日の売上データ、まだ昨日のままなんだけど……？」

ユーザーは調査を開始する。

---

### Quest内で行うこと

- Pipeline Statusを見る
- Job Logを見る
- SQLを見る
- Input Dataを見る
- Error Messageを見る
- 原因を仮説立てする
- 修正する
- 再実行する

最後に、

> **MISSION COMPLETE**

---

# 8. 「正解を当てるゲーム」にしない

非常に重要。

Data Engineeringは、

> 正解のコードを書く能力

だけではない。

実務では、

> なぜその問題が起きたのか
> どこを調べるべきか
> どんな設計が妥当か

を考える能力が重要。

そのため、

- 正解
- 不正解

だけで評価しない。

以下も評価対象にする。

### Problem Solving

- 問題を正しく理解できたか
- 調査手順が妥当だったか
- 仮説を立てられたか
- 適切なデータを確認したか
- 解決方法が妥当だったか

---

# 9. AI Senior Engineer

AIを単なるChatGPTのようなQ&A機能にしない。

ユーザーには、

> **Senior Data Engineer**

というAIメンターが存在する。

---

## AIの役割

### 1. ヒント

いきなり答えを言わない。

例えば、

ユーザー：

> わかりません。

AI：

> 「まず、どこで処理が止まったのか確認してみよう。
> Jobのどの部分を見るとよさそう？」

---

### 2. ソクラテス式質問

ユーザーが答えを求めても、

```text
なぜそう思った？
↓
何を確認すれば分かる？
↓
その仮説なら、どんな結果になる？
```

と考えさせる。

---

### 3. Code Review

コードを書いたら、

- 正しく動くか
- 可読性
- パフォーマンス
- 保守性
- 実務上のリスク

をレビューする。

---

### 4. 成長の可視化

AIはユーザーの過去のQuestを参照し、

> 「最初のQuestではSQL JOINでかなり迷っていたけど、今回は自力でJOIN条件を設計できている。」

のように、

**過去の自分との比較**

をフィードバックする。

これは非常に重要。

他人との比較ではなく、

> **昨日の自分との比較**

を基本とする。

---

# 10. Hintシステム

ヒントは3段階。

## Hint 1：方向性

> 「まず、データがどこで止まっているか確認しよう。」

## Hint 2：具体的な観点

> 「Job Runの最後に実行されたTaskを確認してみよう。」

## Hint 3：かなり具体的

> 「SQLのWHERE条件が、昨日追加されたカラムを参照していることに注目。」

## Answer

どうしても解けない場合のみ解答を見る。

ただし、

**解答を見た = 失敗**

とは扱わない。

「ヒントを使って解決した」という成長として扱う。

---

# 11. Failure Design

失敗を罰しない。

これは非常に重要。

Data Engineer Questでは、

> **失敗 = 学習データ**

と定義する。

例えば、

```text
❌ Wrong
```

ではなく、

> 🔎 Interesting.
>
> そのアプローチだと、このデータ量では問題が起きる可能性があります。
>
> 「なぜこの方法ではうまくいかなかったか」を確認してみよう。

とする。

---

# 12. Retry

何度でも挑戦可能。

ただし単純なリトライではなく、

```text
Attempt 1
↓
Feedback
↓
Hint
↓
Attempt 2
↓
New insight
↓
Attempt 3
↓
Clear
```

という学習履歴を残す。

---

# 13. Mastery System

ユーザーが「問題を解いた数」だけでなく、

**スキルの習熟度**

を持つ。

例：

```text
SQL
████████░░ 82%

Data Modeling
██████░░░░ 61%

ETL
█████░░░░░ 54%

Spark
███░░░░░░░ 31%

Databricks
██░░░░░░░░ 22%
```

ただし、

**単純な正解率をMastery Scoreにしない。**

以下を組み合わせる。

- 初回正答
- ヒント使用
- 再挑戦
- 類題での成功
- 時間経過後の再テスト
- 別文脈での応用
- 説明能力

---

# 14. Retrieval Practice

一度解いた問題を完全に終わらせない。

数日後、

> 「そういえば、この問題覚えてる？」

と短いReview Questを出す。

例：

```text
以前学んだJOINについて、
別のデータセットで1問だけ解いてみよう。
```

ゲーム的な演出よりも、

**思い出す → 使う → 定着する**

ことを優先する。

---

# 15. Spaced Review

Masteryが低いスキルについて、

自然なタイミングで復習Questを出す。

例：

> 🔄 Skill Review
>
> 3日前に学んだJOIN。
> もう一度だけ実戦で使ってみよう。

ユーザーに大量の復習リストを見せない。

---

# 16. Progression

進行は「教材番号」ではなく、

**Career Journey**

として設計する。

例：

```text
🌱 Rookie
   ↓
🧑‍💻 Junior Data Engineer
   ↓
⚙️ Data Engineer
   ↓
🧠 Senior Data Engineer
   ↓
🏗️ Data Platform Engineer
```

ただし、称号を取得すること自体を目的にしない。

称号は、

> 「ここまでできるようになった」

という自己認識を補助するために使う。

---

# 17. World Map

アプリのメイン画面には、

**Data Engineering World**

を表示する。

例：

```text
                    🏰 Data Platform
                         │
              ┌──────────┴──────────┐
              │                     │
        ⚔️ Fundamentals        🏗️ Architecture
              │                     │
        SQL / Python          Data Modeling
              │                     │
           🔧 Pipeline ──────── ☁️ Cloud
              │
           ⚡ Spark
              │
        🟦 Databricks
```

未開放領域は薄く表示。

ユーザーが進むことで世界が開いていく。

---

# 18. Autonomy

ユーザーにある程度選択肢を与える。

例えば、

> 今日どのQuestに挑戦する？

```text
🔧 Pipeline Troubleshooting
⚡ Spark Performance
🧱 Data Modeling
🟦 Databricks
🎯 Review
```

完全一本道にしない。

「自分で選んだ」という感覚を持たせる。

---

# 19. Daily Quest

毎日大量の学習を要求しない。

### 目標

**5〜15分でも進められること。**

例えば、

> ⚔️ Today's Quest
>
> 所要時間：約8分
>
> 「壊れたSQLを修正せよ」

とする。

---

# 20. Streak

Streakは導入する。

ただし、

**Streakを途切れたことで自己嫌悪になる設計にはしない。**

例えば、

```text
🔥 7 day streak
```

とする一方、

休んだ場合、

> 「7日続けた。十分すごい。
> また今日から1日目を始めよう。」

とする。

Streak Freezeなどの救済も将来的に検討する。

---

# 21. Weekly Quest

毎週、

> **Weekly Mission**

を設定。

例：

# 「今週のデータ障害を解決せよ」

複数の小さなQuestをクリアすると、

最後に総合Questが解放される。

---

# 22. Boss Quest

一定のスキルを身につけたら、

**Boss Quest**

を解放する。

例：

# BOSS: 壊れたデータ基盤を復旧せよ

状況：

- Pipelineが遅い
- データ欠損
- Schema変更
- Job failure

が同時発生。

ユーザーは、

- 原因調査
- SQL
- Spark
- Data Quality
- Architecture

を組み合わせて解決する。

これまでの学習を統合する。

---

# 23. Career Simulation

Data Engineer Questの最重要機能の一つ。

ユーザーに、

> 「実際の仕事では何をするの？」

を体験させる。

Questの背景を、

- EC
- SaaS
- FinTech
- Manufacturing
- Healthcare
- Retail
- Logistics

などに変える。

---

# 24. Business Context

技術だけを扱わない。

例えば、

> 「Sales部門が新しいDashboardを作りたい」

という依頼から、

```text
Business Requirement
↓
Data Requirement
↓
Data Modeling
↓
Pipeline
↓
DWH
↓
BI
```

まで考えさせる。

これにより、

**「Data Engineer = SQLを書く人」**

という誤解を防ぐ。

---

# 25. Real-World Decision Quest

選択肢問題も導入する。

例：

> 毎日5TBのログが入ります。
>
> 現在のETLが遅くなっています。
>
> 何から調査しますか？

A. サーバーを増やす
B. SQLを書き直す
C. Job Metricsを確認する
D. 全部作り直す

単純な暗記問題ではなく、

**判断力**

を育てる。

---

# 26. 「なぜ？」を重視

正解後に、

> Why?

を聞く。

例：

> なぜこの設計を選びましたか？

ユーザーが回答。

AI Senior Engineerが、

> 「その考え方は良い。実務ではさらにコストと保守性も見るといい。」

と返す。

---

# 27. Confidence System

各Quest終了時に、

> この問題、今なら一人で解けそう？

を聞く。

```text
😰 まだ無理
😕 ヒントがあれば
🙂 たぶんできる
😎 一人でできる
🔥 他人にも説明できる
```

これを記録。

後から、

> 「最初は😰だったSQL JOINが、今は😎になっています。」

と見せる。

**これがData Engineer Questの核心。**

---

# 28. Confidence Timeline

ユーザーの成長を時系列で見せる。

例：

```text
SQL JOIN
Aug 01   😰
Aug 04   😕
Aug 09   🙂
Aug 15   😎
Aug 27   🔥
```

ユーザーが、

**「自分は成長している」**

ことを目で確認できるようにする。

---

# 29. Skill Tree

Skill Treeを作る。

例：

```text
SQL
 ├── SELECT
 ├── WHERE
 ├── JOIN
 │    ├── INNER JOIN
 │    ├── LEFT JOIN
 │    └── Complex JOIN
 ├── GROUP BY
 ├── Window Functions
 └── Optimization
```

ただし最初から全部見せない。

Questを通じてアンロックする。

---

# 30. Knowledge should unlock when needed

最初に大量の文法を説明しない。

例えばJOINを知らないユーザーに、

20分のJOIN講義を見せない。

代わりに、

> 「2つのデータセットを組み合わせたい」

という問題を提示する。

ユーザーが困ったら、

> 「この処理にはJOINという方法がある。」

と必要な分だけ説明する。

---

# 31. Micro Learning

説明は短くする。

基本：

```text
Concept
↓
Example
↓
Try
```

長文講義は禁止。

必要な場合だけ、

> Learn More

から詳細説明を開く。

---

# 32. Documentation Simulation

実務ではドキュメントを読む能力も重要。

Quest中に、

- API Documentation
- Schema
- Data Dictionary
- Job Log
- Architecture Diagram
- README
- Slack message
- Ticket

などを読む場面を作る。

---

# 33. Slack Simulation

将来的に実装。

例：

```text
#data-platform

Tanaka:
Sales pipeline failed again.

Sato:
昨日schema変わったらしい。

Manager:
今日中に原因だけでも分かる？
```

ユーザーはSlackを読み、

何を確認するか判断する。

---

# 34. Jira / Ticket Simulation

将来的に、

> Ticket #1042

として、

```text
Priority: High
Requester: Sales Team
Problem:
Yesterday's sales data is missing.
```

などを提示。

技術だけではなく、

**仕事そのもの**

を体験させる。

---

# 35. Portfolio Generation

一定のQuestをクリアすると、

> **My Data Engineering Portfolio**

を生成できるようにする。

例：

```text
Data Engineering Quest
----------------------

Skills:
SQL ★★★★☆
Data Modeling ★★★☆☆
ETL ★★★★☆
Spark ★★★☆☆
Databricks ★★★☆☆

Completed Missions:
42

Projects:
3

Boss Missions:
2

Strong Areas:
Data Pipeline
SQL Troubleshooting

Areas to improve:
Spark Optimization
```

将来的には、

GitHub README形式や職務経歴書の素材として出力できるようにする。

---

# 36. Career Bridge

このアプリの最終目的は、

**アプリ内で強くなることではない。**

現実世界に出ること。

一定のレベルになったら、

> 「次に何をすればいい？」

を提示する。

例：

```text
You are ready for:

□ Databricks Associate preparation
□ Junior Data Engineer job search
□ Data Platform project
□ Portfolio creation
□ Internal transfer
```

---

# 37. 「卒業」を作る

永遠にアプリを使わせようとしない。

むしろ、

> **卒業できるサービス**

を目指す。

例えば、

# Data Engineer Quest Graduate

を取得。

条件：

- Fundamentals Mastery
- Pipeline Quest
- Architecture Quest
- Boss Quest
- Capstone Project

など。

そして、

> 「ここから先は実際のプロジェクトに挑戦してみよう。」

と現実世界へ送り出す。

---

# 38. Capstone Project

最後に、

**自分でData Platformを作るQuest**

を用意する。

例：

> ECサイトのデータ基盤を設計せよ。

要件：

- Orders
- Customers
- Products
- Events

ユーザーが、

- Architecture
- Data Model
- Pipeline
- SQL
- Spark
- Data Quality

を設計する。

---

# 39. Databricks

Databricksは最初の重点Platformとして実装する。

ただしプロダクト自体は、

> **Databricks Learning App**

にしない。

Data Engineer Questの中に、

```text
Platform
├── Databricks
├── Snowflake
├── BigQuery
└── Fabric
```

という構造を作れるようにする。

MVPではDatabricksだけ実装する。

---

# 40. Databricks Learning Path

初期カリキュラム例：

```text
Databricks World

01 Workspace
02 Data & Tables
03 SQL
04 PySpark
05 Delta Lake
06 Data Transformation
07 Jobs / Workflows
08 Data Quality
09 Performance
10 Governance
11 Production Pipeline
12 Capstone
```

ただし、

**文法 → 説明 → テスト**

の順番にしない。

すべて可能な限りQuestから導入する。

---

# 41. Quest Design Principles

すべてのQuestは以下を満たす。

### Must

- 現実的な仕事の文脈がある
- ユーザーが何をすべきか考える
- 何らかの意思決定がある
- 実際に手を動かす
- 失敗できる
- ヒントがある
- 解決後に振り返る
- 何のスキルが伸びたか分かる

### Avoid

- 単純な暗記問題
- 長い動画
- 長い説明文
- 「正解はAです」で終わる問題
- 意味のないポイント稼ぎ
- ランキング至上主義
- 他人との比較
- 失敗によるペナルティ

---

# 42. Gamification Principles

ゲーミフィケーションは目的ではなく手段。

導入するもの：

- XP
- Level
- Quest
- Skill Tree
- Mastery
- Streak
- Achievement
- Boss
- World Map
- Progress
- Daily Quest
- Weekly Quest
- Personal Best
- Career Rank

ただし、

**すべて「成長を実感させるため」に存在すること。**

---

# 43. XP Design

XPは、

「正解したら100XP」

だけにしない。

例：

```text
Quest Clear        +100
First Attempt      +50
Good Investigation  +30
Used Hint           +10
Explained Why       +40
Review Success      +50
Boss Clear         +500
```

ただし、ヒント使用で大きなペナルティを与えない。

**「助けを求めること」を悪としない。**

---

# 44. Achievement

バッジは単なるコレクションにしない。

例：

### 🔎 Detective

3回、ログから自力で原因を特定。

### 🧠 Think First

5回、Hint 1だけでQuestを解決。

### 🔥 Debugger

5つのPipeline障害を解決。

### 🏗 Architect

3つのArchitecture Questを完了。

### 🚀 First Production

最初のCapstoneを完成。

---

# 45. Personal Achievement

他人と競争させるより、

**過去の自分との比較**

を中心にする。

例：

> 「最初のQuestより平均Hint使用回数が42%減りました。」

> 「SQLの初回正答率が38% → 74%になりました。」

---

# 46. No Shame UX

絶対に、

```text
FAILED
WRONG
YOU LOST
```

を中心的な表現にしない。

代わりに、

```text
Not quite.
Let's investigate.

Good attempt.

You found something interesting.

Try another approach.
```

など。

---

# 47. Onboarding

初回起動時に長い説明をしない。

まず、

> **Welcome to Data Engineer Quest.**

> You don't need to know everything.

> Your first mission is waiting.

とする。

---

# 48. 最初のQuest

初回Questは絶対に難しくしない。

目的は、

**「自分でも解けた」**

という最初の成功体験。

例：

# Quest 001

## 「Sales Dashboardがおかしい」

簡単なCSVを用意。

ユーザーに、

> 「昨日より売上が大きく減っています。本当に売上が減ったのでしょうか？」

と問いかける。

データを見る。

単純な集計。

そして、

> 「実はデータが1日分欠けている」

ことを発見。

ここで、

**Data Engineerとして問題を発見できた**

という成功体験を作る。

---

# 49. Progressive Difficulty

難易度は、

```text
Tutorial
↓
Easy
↓
Normal
↓
Hard
↓
Expert
↓
Boss
```

とする。

ただし難易度は問題数ではなく、

- 情報量
- 不確実性
- 必要な知識
- 複数スキルの組み合わせ
- 制約条件

で上げる。

---

# 50. Adaptive Difficulty

ユーザーが連続して簡単に解いている場合、

次のQuestを少し難しくする。

逆に連続して失敗している場合、

難易度を下げる。

ただし、

> 「難易度を下げました」

とは言わない。

自然に補助Questを提示する。

---

# 51. Learning Analytics

ユーザーごとに、

```text
skill mastery
attempt history
hint usage
confidence
time spent
error patterns
review history
quest completion
```

を記録する。

これをAI Tutorが利用する。

---

# 52. AI Personalization

AIはユーザーの苦手分野を分析。

例：

> 「SQL自体は問題ないけど、JOIN条件の設計でよくミスしている。」

↓

JOINの別Questを出す。

---

# 53. Motivation Recovery

ユーザーがしばらくログインしていない場合、

罪悪感を煽らない。

NG：

> 「7日もサボっています！」

OK：

> 「Welcome back.
>
> 前回のQuestから続けよう。
>
> 今日は5分だけの復帰Questがあります。」

---

# 54. Burnout Prevention

毎日学習を強制しない。

例えば、

> 「今日は休む」

を選択できる。

Streakを維持するために無理をさせない。

長期的な学習継続を優先する。

---

# 55. Social Features

初期MVPでは必須ではない。

将来的に、

- Friends
- Team Quest
- Community
- Mentor
- Leaderboard

などを検討。

ただしLeaderboardは慎重に扱う。

競争によって初心者の自己効力感を下げないこと。

---

# 56. UI Design

全体として、

**Educational SaaS × RPG × Developer Tool**

の雰囲気。

ただし子供向けゲームにはしない。

目指すのは、

> **「大人が本気でData Engineeringを学ぶためのQuest」**

---

# 57. Visual Direction

推奨：

- Dark UI
- Developer tool感
- Map
- Terminal
- Logs
- Cards
- Progress bars
- Skill Tree
- Quest panels

過剰なアニメーションは禁止。

---

# 58. Main Navigation

MVP：

```text
🏠 Home
🗺️ Quest Map
🧠 Skills
📊 Progress
👨‍💻 AI Mentor
👤 Profile
```

---

# 59. Home

Homeでは情報を詰め込みすぎない。

表示：

```text
Good evening, [Name]

🔥 7 day streak

Today's Quest
[Start Quest]

Your Journey
Junior Data Engineer
███████░░░ 72%

Recent Growth
SQL JOIN ↑
Data Modeling ↑

Continue where you left off
[Quest]
```

---

# 60. Quest UI

基本構造：

```text
Quest Title
Context
Mission
Available Resources

[Investigate]
[Write SQL]
[Run]
[Ask Mentor]

Progress

Hint
Submit
```

---

# 61. Terminal / Code Editor

コードを書くQuestでは、

- SQL editor
- Python editor
- PySpark editor

を使えるようにする。

MVPではまずSQLを優先。

---

# 62. Execution Environment

安全なsandbox環境を使う。

ユーザーコードを本番環境で実行しない。

MVPでは、

- SQLite
- DuckDB
- Python sandbox

など安全なローカル/サーバー環境を検討。

Databricks実環境との接続は後段。

---

# 63. MVP Scope

絶対に最初から全部作らない。

MVPは以下だけ。

## Core

- Authentication
- Home
- Quest Map
- Quest
- SQL Editor
- SQL Execution
- Hint
- AI Mentor
- XP
- Level
- Skill
- Mastery
- Progress
- Streak
- Quest completion

---

# 64. MVP Content

最初に作るQuestは20〜30個程度。

カテゴリ：

```text
SQL Fundamentals       5
Data Investigation     5
Data Modeling          4
ETL                    4
Pipeline Debugging     4
Databricks Intro       4
```

---

# 65. MVPで作らないもの

以下は後回し。

- Social
- Leaderboard
- Mobile App
- Multiplayer
- Complex avatar
- Marketplace
- In-app currency
- Advanced AI Agent
- Full Databricks integration
- Snowflake
- AWS
- GCP
- Fabric

---

# 66. Technical Architecture

Claude Codeは実装前に、

1. 技術スタック
2. ディレクトリ構成
3. DB schema
4. API design
5. Component architecture
6. Quest data model
7. AI architecture
8. Execution sandbox architecture

を設計する。

その設計をREADMEまたはdocs/architecture.mdに保存する。

---

# 67. 推奨技術スタック

まず以下を候補として検討する。

Frontend:

- Next.js
- TypeScript
- Tailwind CSS

Backend:

- Next.js server actions / API
- または適切なbackend framework

Database:

- PostgreSQL

Authentication:

- Supabase Auth等を候補として検討

Code Editor:

- Monaco Editor

SQL Execution:

- DuckDB / PostgreSQL等を安全に利用

AI:

- API経由のLLM

Deployment:

- Vercel等を候補として検討

ただし、Claude Codeは現在のエコシステムと実装容易性を確認した上で最適な構成を選択する。

---

# 68. Database Design

最低限、

```text
users
profiles
quests
quest_attempts
quest_hints
skills
user_skills
achievements
user_achievements
streaks
daily_quests
ai_conversations
confidence_records
```

を設計。

---

# 69. Quest Data Model

Questはコードにハードコードしない。

可能な限りDBまたはJSON/YAML等で管理する。

例：

```json
{
  "id": "quest-001",
  "title": "The Missing Sales Data",
  "difficulty": "easy",
  "skills": ["sql", "data-investigation"],
  "estimatedMinutes": 10,
  "type": "investigation",
  "story": "...",
  "mission": "...",
  "hints": [],
  "successCriteria": {},
  "xp": 100
}
```

将来的にコンテンツを大量追加できる設計にする。

---

# 70. ContentとApplication Logicを分離

Questコンテンツとアプリロジックを完全に分離する。

これにより将来的に、

```text
Databricks Quest Pack
Snowflake Quest Pack
BigQuery Quest Pack
AWS Quest Pack
```

などを追加可能にする。

---

# 71. AI Architecture

AIには以下のContextを渡せるようにする。

```text
Current Quest
Current Attempt
User Skills
Mastery
Past Mistakes
Hint History
Confidence
Previous Quest History
```

ただしユーザーに不要な個人情報を渡さない。

---

# 72. AI Safety

AIは答えを簡単に出しすぎない。

Tutor Modeでは、

```text
Level 1 → Question
Level 2 → Hint
Level 3 → Explanation
Level 4 → Example
Level 5 → Answer
```

のように段階的に支援。

ユーザーが明示的に「答えを見たい」と言った場合はAnswerを表示する。

ただし、

> 「答えを見ることは失敗ではない」

というUXにする。

---

# 73. Feedback Design

Quest終了時：

```text
MISSION COMPLETE 🎉

You solved:
Pipeline Failure

Skills improved:
SQL +8
Debugging +12

You used:
Hint ×1

Confidence:
🙂 → 😎

Senior Engineer says:
「最初はログ全体を見ていたけど、
今回は失敗したTaskに絞れていた。
調査の仕方がかなり良くなっている。」
```

---

# 74. 「成長の証拠」を残す

非常に重要。

ユーザーが過去の自分を見返せるようにする。

例：

> 30 days ago:
> 「JOINがよく分からない」

↓

現在：

> 「3つのテーブルをJOINして集計できる」

この変化を可視化する。

---

# 75. Career Confidence

Profile画面に、

## Career Readiness

を表示。

ただし、

> 「あなたはData Engineerになれます」

と断定しない。

代わりに、

```text
SQL             Strong
Data Modeling   Developing
ETL             Strong
Spark           Developing
Databricks      Beginner
Architecture    Beginner
```

と表示。

さらに、

> 「次に伸ばすと良いスキル」

を提示。

---

# 76. Reality Check

ユーザーに過剰な自信を与えない。

例えば、

> 「Questを100個解いたから実務で完璧」

とは絶対にしない。

代わりに、

> 「基礎的な問題解決能力を身につけています。
> 次は実際のプロジェクトで経験を積む段階です。」

とする。

**自信と過信を区別する。**

---

# 77. Core Emotional Journey

ユーザー体験を、

```text
不安
↓
好奇心
↓
小さな成功
↓
もう一回
↓
失敗
↓
理解
↓
成功
↓
成長実感
↓
挑戦
↓
自信
↓
現実世界への挑戦
```

にする。

---

# 78. 最も重要なUX原則

ユーザーがアプリを閉じるとき、

> 「今日も勉強しなきゃ……」

ではなく、

> **「今日ちょっとData Engineerっぽいことできたな。」**

と思えること。

これを最優先する。

---

# 79. Development Process

Claude Codeは一気に全機能を実装しない。

以下のPhaseで進める。

## Phase 0

Requirements整理

## Phase 1

Architecture

## Phase 2

Project setup

## Phase 3

Core UI

## Phase 4

Quest engine

## Phase 5

SQL execution

## Phase 6

Progress / Mastery

## Phase 7

AI Mentor

## Phase 8

Gamification

## Phase 9

Initial Quest content

## Phase 10

Polish

## Phase 11

Deployment

---

# 80. 各Phaseで必ず行うこと

各Phase終了時に、

- lint
- typecheck
- tests
- build
- manual verification

を実施。

壊れた状態を次Phaseに持ち越さない。

---

# 81. Development Philosophy

Claude Codeは、

> 「とりあえず動くものを大量に作る」

ことを避ける。

優先順位：

```text
UX
↓
Core Learning Loop
↓
Correctness
↓
Maintainability
↓
Visual Polish
↓
Additional Features
```

---

# 82. Do not overengineer

MVPで必要のない、

- Microservices
- Kubernetes
- 複雑なEvent Architecture
- 大規模AI Agent Framework

などは導入しない。

小さく始める。

---

# 83. But design for extensibility

ただし、

- Quest
- Skill
- Platform
- User Progress
- AI Mentor

は将来拡張できる設計にする。

---

# 84. Initial User Flow

初回：

```text
Landing
↓
Start Quest
↓
簡単なQuest
↓
Clear
↓
XP
↓
Skill unlocked
↓
「あなたはData Engineerの最初の一歩を踏み出しました」
↓
次のQuest
```

---

# 85. Landing Page

Hero:

> # Data Engineer Quest
>
> **Learn by solving. Grow by doing.**
>
> データエンジニアリングを、
> 「勉強」ではなく「実戦」から始めよう。

CTA：

> Start Your First Quest

---

# 86. Marketing Message

避ける：

> 「最短3ヶ月でData Engineer！」

> 「未経験から確実に転職！」

> 「AIがあなたをData Engineerにします！」

使う：

> 「何から勉強すればいいか分からない人へ。」

> 「実際の問題を解きながら、Data Engineerの仕事を知る。」

> 「昨日できなかったことが、今日できる。」

---

# 87. Product Philosophy

最終的にData Engineer Questが目指すのは、

**Learning PlatformではなくCareer Launchpad。**

つまり、

```text
興味
↓
学習
↓
実践
↓
理解
↓
自信
↓
Portfolio
↓
応募
↓
仕事
↓
実務経験
```

という流れの最初の部分を支える。

---

# 88. Success Definition

Data Engineer Questが成功したと言える状態：

ユーザーが、

> 「Data Engineeringって何かよく分からなかった」

から、

> 「Data Engineerの仕事が何となく分かる」

になり、

さらに、

> 「実際にSQLやPipelineの問題を自分で解いた経験がある」

になり、

最終的に、

> **「じゃあ実際の仕事に挑戦してみよう」**

と思えること。

---

# 89. Claude Codeへの最終指示

このドキュメントを読み込んだら、いきなり大量のコードを書き始めないこと。

まず以下を行う。

1. このプロダクトの目的を理解する
2. Core User Journeyを整理する
3. MVP Scopeを定義する
4. Technical Architectureを提案する
5. Database Schemaを設計する
6. Quest Data Modelを設計する
7. AI Mentor Architectureを設計する
8. UI Wireframeを設計する
9. 実装Planを作る

その上で、実装を開始する。

---

# 90. 最重要ルール

最後にもう一度。

Data Engineer Questは、

**「ユーザーをアプリに依存させるプロダクト」ではない。**

ユーザーが、

> **「自分ならできるかもしれない」**

と思えるようになり、

最終的には、

> **「じゃあ、現実の世界でやってみよう」**

とアプリの外に出ていくためのプロダクトである。

XP、Streak、Badge、Level、Quest、AI Mentorなど、すべての機能はこの目的のために存在する。

**ユーザーの時間を奪うことではなく、ユーザーの可能性を広げることを最優先する。**

If a gamification feature increases engagement but undermines learning, confidence, autonomy, or long-term career growth, do not implement it.

Build a product that makes people think:

> **“I didn't know this yesterday.
> I can do it today.
> Maybe I can do this as a career.”**

それがData Engineer Questである。
