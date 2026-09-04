type NullableText = string | null | undefined;

export interface DadataSuggestionForDisplay {
  value: string;
  unrestricted_value?: string;
  data: {
    region?: NullableText;
    region_with_type?: NullableText;
    area?: NullableText;
    area_with_type?: NullableText;
    city?: NullableText;
    city_with_type?: NullableText;
    city_district?: NullableText;
    city_district_with_type?: NullableText;
    settlement?: NullableText;
    settlement_with_type?: NullableText;
  };
}

function clean(value: NullableText): string {
  return value?.trim() || "";
}

function normalizePart(value: string): string {
  return value
    .normalize("NFKC")
    .toLocaleLowerCase("ru-RU")
    .replace(/\s+/g, " ")
    .trim();
}

function uniqueParts(parts: string[]): string[] {
  const seen = new Set<string>();

  return parts.filter(part => {
    const key = normalizePart(part);
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

/**
 * DaData отдаёт value в административном порядке. Для служебного калькулятора
 * важнее сразу видеть населённый пункт на узком экране, поэтому переставляем
 * только отображаемую строку. unrestricted_value остаётся без изменений и
 * продолжает использоваться для точного повторного запроса к DaData.
 */
export function formatDadataSuggestion(
  suggestion: DadataSuggestionForDisplay,
): string {
  const { data } = suggestion;
  const rawValue = clean(suggestion.value);
  const unrestrictedValue = clean(suggestion.unrestricted_value);

  const settlement = clean(data.settlement_with_type);
  const city = clean(data.city_with_type);
  const cityDistrict = clean(data.city_district_with_type);
  const area = clean(data.area_with_type);
  const region = clean(data.region_with_type);

  // Если DaData не прислала типизированную иерархию, безопаснее оставить её
  // исходную строку, чем потерять или ошибочно продублировать часть адреса.
  if (!settlement && !city && !cityDistrict && !area && !region) {
    return rawValue || unrestrictedValue || "Адрес без названия";
  }

  const hierarchy = settlement
    ? [settlement, city, cityDistrict, area, region]
    : [city, cityDistrict, area, region];

  const hierarchyAliases = new Set(
    [
      data.settlement,
      data.settlement_with_type,
      data.city,
      data.city_with_type,
      data.city_district,
      data.city_district_with_type,
      data.area,
      data.area_with_type,
      data.region,
      data.region_with_type,
    ]
      .map(clean)
      .filter(Boolean)
      .map(normalizePart),
  );

  // Улица, дом, корпус, строение и квартира остаются в исходной формулировке
  // DaData и переносятся после административной иерархии.
  const addressDetails = rawValue
    .split(",")
    .map(clean)
    .filter(part => part && !hierarchyAliases.has(normalizePart(part)));

  const formatted = uniqueParts([...hierarchy, ...addressDetails]).join(", ");
  return formatted || rawValue || unrestrictedValue || "Адрес без названия";
}
