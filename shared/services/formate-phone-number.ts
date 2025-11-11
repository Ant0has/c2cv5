export const formatPhoneNumber = (phoneNumber: string): {markedPhone: string, phone: string} => {
  const cleaned = ('' + phoneNumber).replace(/\D/g, '');
  
  // Если номер начинается с 7, добавляем +, иначе оставляем как есть
  const match = cleaned.match(/^(7|8)?(\d{3})(\d{3})(\d{2})(\d{2})$/);
  
  if (match) {
    const countryCode = match[1];
    const areaCode = match[2];
    const firstPart = match[3];
    const secondPart = match[4];
    const thirdPart = match[5];
    
    if (countryCode === '7' || countryCode==='8') {
      return {
        markedPhone:`+7 (${areaCode}) ${firstPart}-${secondPart}-${thirdPart}`,
        phone:`+7${areaCode}${firstPart}${secondPart}${thirdPart}`
      }
    } else {
      return {
        markedPhone:`${areaCode} ${firstPart}-${secondPart}-${thirdPart}`,
        phone:`${areaCode}${firstPart}${secondPart}${thirdPart}`
      }
    }
  }
  
  return {
    markedPhone:phoneNumber,
    phone:phoneNumber
  }
}