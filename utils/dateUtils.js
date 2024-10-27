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
  const today = new Date().getDay();
  if (operatingHours && Array.isArray(operatingHours) && operatingHours[today]) {
    const todayHours = operatingHours[today];
    return `${formatTime(todayHours.open_time)} ~ ${formatTime(todayHours.close_time)}`;
  }
  return "営業時間情報がありません";
};