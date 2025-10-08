import { yandexMapsService } from "@/shared/services/yandex-maps.service";

export const findBestMatchPoint = async (searchStr: string) => {
    // Если строка не включает "из" или "Из", просто возвращаем её
    if (!searchStr.toLowerCase().includes('из')) {
      return searchStr;
    }
  
    const response = await yandexMapsService.getSuggestions(searchStr);
    const uniqueData = [...new Set(response)];
  
    const searchLower = searchStr.toLowerCase();
    
    // Ищем полное совпадение в начале строки
    const exactMatch = uniqueData.find(item => 
        item.toLowerCase().startsWith(searchLower)
    );
    if (exactMatch) return exactMatch;
    
    // Ищем совпадение как отдельного слова
    const wordMatch = uniqueData.find(item => {
        const words = item.toLowerCase().split(/[,\s]+/);
        return words.includes(searchLower);
    });
    if (wordMatch) return wordMatch;
    
    // Ищем частичное совпадение
    const partialMatch = uniqueData.find(item => 
        item.toLowerCase().includes(searchLower)
    );
    
    return partialMatch || '';
  }

  export const checkString = (str: string) => {
    const trimmed = String(str).trim();
    return trimmed === '-' ? '' : trimmed;
  }