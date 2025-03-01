// app/admin/restaurants/[id]/page.tsx
import { RestaurantForm } from "@/components/admin/RestaurantForm";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";

export const metadata = {
  title: "レストラン編集",
};

export default async function EditRestaurantPage({
  params,
}: {
  params: { id: string };
}) {
  const id = parseInt(params.id);

  // 新規作成の場合
  if (params.id === "new") {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-6">新規レストラン登録</h1>
        <RestaurantForm />
      </div>
    );
  }

  // 既存レストランの編集の場合
  if (isNaN(id)) {
    notFound();
  }

  const restaurant = await prisma.restaurant.findUnique({
    where: { restaurant_id: id },
  });

  if (!restaurant || restaurant.deleted_at) {
    notFound();
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">レストラン編集: {restaurant.name}</h1>
      <RestaurantForm restaurant={restaurant} />
    </div>
  );
}