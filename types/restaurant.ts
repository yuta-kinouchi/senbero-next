export interface Restaurant {
  name: string;
  phone_number?: string;
  country: string;
  state: string;
  city: string;
  address_line1: string;
  address_line2: string;
  latitude: number;
  longitude: number;
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
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  handleCheckboxChange: (name: string) => (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  imagePreview: string | null;
  isNew?: boolean;
}