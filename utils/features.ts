// せんべろ属性のキーと表示ラベルの共通定義。
// 検索結果カードのタグ表示と、検索結果画面の絞り込みチップで共用する。
export const FEATURE_TAGS: { key: string; label: string }[] = [
  { key: 'is_standing', label: '立ち飲み' },
  { key: 'is_kakuuchi', label: '角打ち' },
  { key: 'has_set', label: 'せんべろセット' },
  { key: 'daytime_available', label: '昼飲み' },
  { key: 'morning_available', label: '朝飲み' },
  { key: 'has_happy_hour', label: 'ハッピーアワー' },
  { key: 'has_chinchiro', label: 'チンチロ' },
  { key: 'outside_available', label: '外飲み' },
  { key: 'has_hoppy', label: 'ホッピー' },
  { key: 'solo_friendly', label: '一人飲み歓迎' },
];

// 距離(km)を徒歩分数に換算する（不動産表示で使われる80m/分基準）
export const walkMinutes = (distanceKm: number): number => {
  return Math.max(1, Math.ceil((distanceKm * 1000) / 80));
};

// はしご酒で「歩いて行ける」と見なす上限(分)。
// イマココ検索の結果リストはこの境界で区切って表示する。
export const WALKABLE_LIMIT_MINUTES = 15;

export const isWalkable = (distanceKm: number): boolean => {
  return walkMinutes(distanceKm) <= WALKABLE_LIMIT_MINUTES;
};
