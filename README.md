This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.


## データベース

```mermaid
---
title: "せんべろ Cheers"
---
erDiagram
    user ||--o{ post : ""
    restaurant ||--o{ post : ""
    post ||--o{ photo : ""
    restaurant ||--o{ operating_hours : ""

    user {
        integer user_id PK "ユーザーID"
        string user_name "ユーザーネーム"
        string email "メールアドレス"
        string hashed_password "パスワード"
        date birth_day "生年月日"
        integer gender "性別"
        timestamp deleted_at "削除日時"
        timestamp created_at "作成日時"
        timestamp updated_at "更新日時"
    }

    restaurant {
        integer restaurant_id PK "レストランID"
        string name "レストラン名"
        string phone_number "電話番号"
        string country "国"
        string state "県"
        string city "市区町村"
        string address_line1 "住所1"
        string address_line2 "住所2"
        float latitude "緯度"
        float longitude "軽度"
        integer capacity "収容人数"
        string home_page "ホームページ"
        text description "詳細"
        text special_rule "特殊ルール"
        boolean morning_available "朝飲み"
        boolean daytime_available "昼飲み"
        boolean has_set "せんべろセット"
        text senbero_description "せんべろセット詳細"
        boolean has_chinchiro "チンチロ"
        text chinchiro_description "チンチロ詳細"
        boolean outside_available "外飲み"
        text outside_description "外飲み詳細"
        boolean is_standing "立ち飲み"
        text standing_description "立ち飲み詳細"
        boolean is_kakuuchi "角打ち"
        boolean is_cash_on "キャッシュオン"
        boolean has_charge "チャージなし"
        text charge_description "チャージ詳細"
        boolean has_tv "テレビ"
        boolean smoking_allowed "喫煙"
        boolean has_happy_hour "ハッピーアワー"
        timestamp deleted_at "削除日時"
        timestamp created_at "作成日時"
        timestamp updated_at "更新日時"
    }

    operating_hours {
        integer id PK "営業時間ID"
        integer restaurant_id FK "レストランID"
        string day_of_week "曜日"
        time start_time "開始時間"
        time end_time "終了時間"
        time happy_hour_start "ハッピーアワー開始時間"
        time happy_hour_end "ハッピーアワー終了時間"
        timestamp created_at "作成日時"
        timestamp updated_at "更新日時"
    }

    post {
        integer post_id PK "ポストID"
        integer user_id FK "ユーザーID"
        integer restaurant_id FK "レストランID"
        datetime visit_time "来店日時"
        integer number_of_visitors "人数"
        integer price "金額"
        text detail "詳細"
        timestamp deleted_at "削除日時"
        timestamp created_at "作成日時"
        timestamp updated_at "更新日時"
    }

    photo {
        integer photo_id PK "フォトID"
        integer post_id FK "ポストID"
        integer category "カテゴリー"
        integer price "金額"
        string name "商品名"
        text memo "メモ"
        timestamp deleted_at "削除日時"
        timestamp created_at "作成日時"
        timestamp updated_at "更新日時"
    }
```