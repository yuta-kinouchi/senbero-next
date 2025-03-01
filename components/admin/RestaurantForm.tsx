// components/admin/RestaurantForm.tsx
"use client";

import { Restaurant } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

type FormData = {
  name: string;
  phone_number: string;
  country: string;
  state: string;
  city: string;
  address_line1: string;
  address_line2: string;
  latitude: number;
  longitude: number;
  capacity: number;
  home_page: string;
  description: string;
  special_rule: string;
  morning_available: boolean;
  daytime_available: boolean;
  has_set: boolean;
  senbero_description: string;
  has_chinchiro: boolean;
  chinchiro_description: string;
  outside_available: boolean;
  outside_description: string;
  is_standing: boolean;
  standing_description: string;
  is_kakuuchi: boolean;
  is_cash_on: boolean;
  has_charge: boolean;
  charge_description: string;
  has_tv: boolean;
  smoking_allowed: boolean;
  has_happy_hour: boolean;
  credit_card: boolean;
  credit_card_description: string;
  beer_price: number;
  beer_types: string;
  chuhai_price: number;
};

export function RestaurantForm({ restaurant }: { restaurant?: Restaurant }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    defaultValues: restaurant || {
      country: "日本",
      state: "東京都",
      latitude: 35.6812,
      longitude: 139.7671,
    }
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setError(null);

    try {
      const url = restaurant
        ? `/api/admin/restaurants/${restaurant.restaurant_id}`
        : "/api/admin/restaurants";

      const response = await fetch(url, {
        method: restaurant ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "エラーが発生しました");
      }

      router.push("/admin/restaurants");
      router.refresh();
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "エラーが発生しました");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 rounded-lg shadow">
      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 基本情報セクション */}
        <div className="md:col-span-2">
          <h2 className="text-xl font-semibold mb-4 border-b pb-2">基本情報</h2>
        </div>

        <div>
          <label className="block mb-2 font-medium">店名 <span className="text-red-500">*</span></label>
          <input
            {...register("name", { required: "店名は必須です" })}
            className="w-full p-2 border rounded"
          />
          {errors.name && <p className="mt-1 text-red-500">{errors.name.message}</p>}
        </div>

        <div>
          <label className="block mb-2 font-medium">電話番号</label>
          <input
            {...register("phone_number")}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">国 <span className="text-red-500">*</span></label>
          <input
            {...register("country", { required: "国は必須です" })}
            className="w-full p-2 border rounded"
          />
          {errors.country && <p className="mt-1 text-red-500">{errors.country.message}</p>}
        </div>

        <div>
          <label className="block mb-2 font-medium">都道府県 <span className="text-red-500">*</span></label>
          <input
            {...register("state", { required: "都道府県は必須です" })}
            className="w-full p-2 border rounded"
          />
          {errors.state && <p className="mt-1 text-red-500">{errors.state.message}</p>}
        </div>

        <div>
          <label className="block mb-2 font-medium">市区町村 <span className="text-red-500">*</span></label>
          <input
            {...register("city", { required: "市区町村は必須です" })}
            className="w-full p-2 border rounded"
          />
          {errors.city && <p className="mt-1 text-red-500">{errors.city.message}</p>}
        </div>

        <div>
          <label className="block mb-2 font-medium">住所1 <span className="text-red-500">*</span></label>
          <input
            {...register("address_line1", { required: "住所1は必須です" })}
            className="w-full p-2 border rounded"
          />
          {errors.address_line1 && <p className="mt-1 text-red-500">{errors.address_line1.message}</p>}
        </div>

        <div>
          <label className="block mb-2 font-medium">住所2 <span className="text-red-500">*</span></label>
          <input
            {...register("address_line2", { required: "住所2は必須です" })}
            className="w-full p-2 border rounded"
          />
          {errors.address_line2 && <p className="mt-1 text-red-500">{errors.address_line2.message}</p>}
        </div>

        {/* ここに緯度・経度、収容人数、ホームページなどの追加フィールドを配置 */}

        <div className="md:col-span-2">
          <label className="block mb-2 font-medium">説明</label>
          <textarea
            {...register("description")}
            rows={4}
            className="w-full p-2 border rounded"
          />
        </div>

        {/* 特徴セクション */}
        <div className="md:col-span-2 mt-6">
          <h2 className="text-xl font-semibold mb-4 border-b pb-2">店舗の特徴</h2>
        </div>

        {/* チェックボックスとテキストフィールドの組み合わせ */}
        <div>
          <div className="flex items-center mb-2">
            <input
              type="checkbox"
              {...register("has_set")}
              id="has_set"
              className="mr-2"
            />
            <label htmlFor="has_set" className="font-medium">せんべろセット</label>
          </div>
          <input
            {...register("senbero_description")}
            placeholder="せんべろセットの説明"
            className="w-full p-2 border rounded"
          />
        </div>

        {/* 他の特徴フィールドを同様に */}

        {/* 価格情報セクション */}
        <div className="md:col-span-2 mt-6">
          <h2 className="text-xl font-semibold mb-4 border-b pb-2">価格情報</h2>
        </div>

        <div>
          <label className="block mb-2 font-medium">ビール価格</label>
          <input
            type="number"
            {...register("beer_price", { valueAsNumber: true })}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">ビールの種類</label>
          <input
            {...register("beer_types")}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">酎ハイ価格</label>
          <input
            type="number"
            {...register("chuhai_price", { valueAsNumber: true })}
            className="w-full p-2 border rounded"
          />
        </div>
      </div>

      <div className="mt-8 flex justify-end">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-4 py-2 mr-2 bg-gray-200 rounded"
        >
          キャンセル
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-300"
        >
          {loading ? "保存中..." : (restaurant ? "更新する" : "登録する")}
        </button>
      </div>
    </form>
  );
}