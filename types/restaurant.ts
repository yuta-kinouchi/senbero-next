// types/restaurant.ts
export interface OperatingHour {
  day_of_week: number;
  open_time: string;
  close_time: string;
  drink_last_order_time?: string;
  food_last_order_time?: string;
  happy_hour_start?: string;
  happy_hour_end?: string;
 }
 
 export interface Restaurant {
  restaurant_id?: number;
  name: string;
  phone_number?: string;
  country?: string;
  state?: string;
  city?: string;
  address_line1?: string;
  address_line2?: string;
  capacity?: number;
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