export const formatTime = (timeString) => {
  if (!timeString) return "";
  try {
    const jstOffset = 9 * 60 * 60 * 1000;
    const date = new Date(new Date(timeString).getTime() - jstOffset);
    return date.toLocaleTimeString('ja-JP', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZone: 'Asia/Tokyo'
    });
  } catch (error) {
    console.error("Invalid time format:", timeString);
    return "";
  }
};

export const getTodayOperatingHours = (operatingHours) => {
  // Date.getDay()の値をday_of_weekの形式に変換
  const today = new Date().getDay();
  const dayOfWeek = today;

  if (operatingHours && Array.isArray(operatingHours)) {
    // day_of_weekが一致する営業時間を探す
    const todayHours = operatingHours.find(hours => hours.day_of_week === dayOfWeek);
    
    if (todayHours) {
      return `${formatTime(todayHours.open_time)} ~ ${formatTime(todayHours.close_time)}`;
    }
  }
  return "営業時間情報がありません";
};