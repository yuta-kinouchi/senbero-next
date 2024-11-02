import { PrismaClient } from '@prisma/client';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const prisma = new PrismaClient();

      // Restaurantデータの取得（operating_hoursを含む）
      const restaurants = await prisma.restaurant.findMany({
        include: {
          operating_hours: true,
        },
      });

      // CSVヘッダー
      const csvHeader = [
        'restaurant_id', 'name', 'phone_number', 'country', 'state', 'city',
        'address_line1', 'address_line2', 'latitude', 'longitude', 'capacity', 
        'day_of_week', 'open_time', 'close_time', 'drink_last_order_time', 
        'food_last_order_time', 'happy_hour_start', 'happy_hour_end',
        'home_page', 'description', 'special_rule', 'morning_available',
        'daytime_available', 'has_set', 'senbero_description', 'has_chinchiro',
        'chinchiro_description', 'outside_available', 'outside_description',
        'is_standing', 'standing_description', 'is_kakuuchi', 'is_cash_on',
        'has_charge', 'charge_description', 'has_tv', 'smoking_allowed', 
        'has_happy_hour', 'restaurant_image',
        'credit_card', 'credit_card_description', 
        'beer_price', 'beer_types', 'chuhai_price', 
        'created_at', 'updated_at', 'deleted_at' 
      ].join(',');

      // データをCSV形式に変換
      const csvRows = restaurants.flatMap(r =>
        r.operating_hours.map(oh => [
          r.restaurant_id, r.name, r.phone_number, r.country, r.state, r.city,
          r.address_line1, r.address_line2, r.latitude, r.longitude, r.capacity,
          oh.day_of_week, formatTimeToJST(oh.open_time), formatTimeToJST(oh.close_time),
          formatTimeToJST(oh.drink_last_order_time), formatTimeToJST(oh.food_last_order_time),
          formatTimeToJST(oh.happy_hour_start), formatTimeToJST(oh.happy_hour_end),
          r.home_page, r.description, r.special_rule, r.morning_available,
          r.daytime_available, r.has_set, r.senbero_description, r.has_chinchiro,
          r.chinchiro_description, r.outside_available, r.outside_description,
          r.is_standing, r.standing_description, r.is_kakuuchi, r.is_cash_on,
          r.has_charge, r.charge_description, r.has_tv, r.smoking_allowed,
          r.has_happy_hour, r.restaurant_image,
          r.credit_card, r.credit_card_description,
          r.beer_price, r.beer_types, r.chuhai_price,
          formatTimeToJST(r.created_at), formatTimeToJST(r.updated_at), formatTimeToJST(r.deleted_at)
        ].map(cell => `"${formatCell(cell)}"`).join(','))
      );

      // CSVファイルの内容
      const csv = `${csvHeader}\n${csvRows.join('\n')}`;

      // レスポンスヘッダーの設定
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=restaurants_with_hours.csv');

      // CSVデータを送信
      res.status(200).send(csv);
    } catch (error) {
      console.error('CSV export failed', error);
      res.status(500).json({ message: 'CSV export failed' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

// セルの内容をフォーマットする関数
function formatCell(value) {
  if (value === null || value === undefined) {
    return '';
  }
  if (typeof value === 'boolean') {
    return value ? 'true' : 'false';
  }
  return String(value).replace(/"/g, '""'); // ダブルクォートをエスケープ
}

// 時間を日本時間（JST）にフォーマットする関数
function formatTimeToJST(dateTime) {
  if (!dateTime) return '';

  // dateTimeが文字列の場合、Dateオブジェクトに変換
  const date = typeof dateTime === 'string' ? new Date(dateTime) : dateTime;

  // HH:MM:SS 形式で出力
  return date.toISOString().split('T')[1].split('.')[0];
}