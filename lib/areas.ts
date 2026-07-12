// エリア別ランディングページの定義。
// slugがURL(/areas/[slug])、citiesはRestaurant.cityとの対応
export interface AreaDef {
  slug: string;
  label: string;
  cities: string[];
  description: string;
}

export const AREAS: AreaDef[] = [
  {
    slug: 'ueno',
    label: '上野',
    cities: ['台東区'],
    description:
      '上野・御徒町・アメ横エリアは、朝飲みできる老舗立ち飲みから角打ち、せんべろセットの名店までが高架下にひしめく、都内屈指のせんべろ激戦区です。',
  },
  {
    slug: 'kinshicho',
    label: '錦糸町',
    cities: ['墨田区', '江東区'],
    description:
      '錦糸町・住吉エリアは、駅前の大衆酒場から下町の角打ち・ホッピー専門店まで、はしご酒にちょうどいい距離感で名店が点在しています。',
  },
  {
    slug: 'akabane',
    label: '赤羽',
    cities: ['北区'],
    description:
      '「せんべろの聖地」とも呼ばれる赤羽。朝7時から開く伝説の立ち飲みや24時間営業のキャッシュオン酒場など、昼夜を問わず飲める街です。',
  },
  {
    slug: 'naha',
    label: '那覇',
    cities: ['那覇市'],
    description:
      '那覇・牧志公設市場周辺は、1,000円で3杯+おつまみが定番の「せんべろ文化」が根付く沖縄随一の飲み屋街。昼から立ち飲みでオリオンビールが楽しめます。',
  },
];

export const findArea = (slug: string): AreaDef | undefined =>
  AREAS.find((area) => area.slug === slug);
