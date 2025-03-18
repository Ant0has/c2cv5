export const getPaginatedList = <T = unknown>(data: T[], page: number, countItem: number): T[] => {
  return data.slice(page * countItem, page * countItem + countItem);
};