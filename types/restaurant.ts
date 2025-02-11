// types/restaurant.ts
export interface OperatingHour {
  id: number;
  restaurant_id: number;
  day_of_week: number;
  open_time: Date;
  close_time: Date;
  drink_last_order_time?: Date;
  food_last_order_time?: Date;
  happy_hour_start?: Date;
  happy_hour_end?: Date;
  created_at: Date;
  updated_at: Date;
  restaurant: Restaurant;
}

export interface Restaurant {
  // 必須フィールド
  restaurant_id: number;
  name: string;
  country: string;
  state: string;
  city: string;
  address_line1: string;
  address_line2: string;
  latitude: number;
  longitude: number;
  created_at: Date;
  updated_at: Date;

  // オプショナルフィールド
  phone_number?: string;
  capacity?: number;
  home_page?: string;
  description?: string;
  special_rule?: string;
  morning_available?: boolean;
  daytime_available?: boolean;
  has_set?: boolean;
  senbero_description?: string;
  has_chinchiro?: boolean;
  chinchiro_description?: string;
  outside_available?: boolean;
  outside_description?: string;
  is_standing?: boolean;
  standing_description?: string;
  is_kakuuchi?: boolean;
  is_cash_on?: boolean;
  has_charge?: boolean;
  charge_description?: string;
  has_tv?: boolean;
  smoking_allowed?: boolean;
  has_happy_hour?: boolean;
  restaurant_image?: string;
  credit_card?: boolean;
  credit_card_description?: string;
  beer_price?: number;
  beer_types?: string;
  chuhai_price?: number;
  deleted_at?: Date;

  // リレーション
  operating_hours?: OperatingHour[];
}

export interface FeatureEditItemProps {
  icon: React.ElementType;
  label: string;
  isActive?: boolean;
  description?: string;
  onChangeActive: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onChangeDescription?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export interface RestaurantFormProps {
  restaurant: Restaurant;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleOperatingHoursChange: (hours: OperatingHour[]) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>; // Promise<void>に変更
  handleCheckboxChange: (name: string) => (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  imagePreview: string | null;
  loading: boolean; // 追加
  error: string | null; // 追加
  isNew?: boolean;
}