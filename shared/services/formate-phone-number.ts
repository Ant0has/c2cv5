export const formatPhoneNumber = (phoneNumber: string) => {
  const cleaned = ('' + phoneNumber).replace(/\D/g, '');
  
  // Если номер начинается с 7, добавляем +, иначе оставляем как есть
  const match = cleaned.match(/^(7|8)?(\d{3})(\d{3})(\d{2})(\d{2})$/);
  
  if (match) {
    const countryCode = match[1];
    const areaCode = match[2];
    const firstPart = match[3];
    const secondPart = match[4];
    const thirdPart = match[5];
    
    // Если номер начинается с 7, добавляем +, иначе выводим без плюса
    if (countryCode === '7') {
      return `+7 (${areaCode}) ${firstPart}-${secondPart}-${thirdPart}`;
    } else if (countryCode === '8') {
      // Для номеров, начинающихся с 8, можно либо убрать 8, либо оставить
      return `+7 (${areaCode}) ${firstPart}-${secondPart}-${thirdPart}`;
    } else {
      // Для номеров без кода страны (10 цифр)
      return `${areaCode} ${firstPart}-${secondPart}-${thirdPart}`;
    }
  }
  
  return phoneNumber;
}