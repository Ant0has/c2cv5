'use client';

import { RegionsContext } from "@/app/providers";
import { getPaginatedList } from "@/shared/services/get-paginated-list";
import { IRoute, IRouteData } from "@/shared/types/route.interface";
import { IRegion } from "@/shared/types/types";
import { Pagination } from "antd";
import clsx from "clsx";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FC, useContext, useState, useEffect, useMemo, useCallback } from "react";
import s from './Cities.module.scss';
import FilialAddressBlock from "@/shared/components/FilialAddressBlock/FilialAddressBlock";
import { Input } from "antd";
import { SearchOutlined, CloseOutlined } from "@ant-design/icons";

interface IProps {
  routes?: IRoute[]
  routeData?: IRouteData  
}

const Cities: FC<IProps> = ({ routes, routeData }) => {
  const [page, setPage] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const regions = useContext(RegionsContext)
  const router = useRouter()

  // Функция для нормализации текста поиска
  const normalizeText = (text: string): string => {
    return text
      .toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/ё/g, 'е')
      .replace(/[^a-zа-я0-9\s]/g, ' ')
      .trim();
  };

  // Функция для получения названия региона/маршрута для поиска
  const getRegionNameForSearch = useCallback((item: IRegion | IRoute): string => {
    if ('meta_value' in item) {
      // Для IRegion
      return item.meta_value || '';
    } else if ('title' in item) {
      // Для IRoute
      return item.title.replace(/Такси\s+/gi, '').trim() || '';
    }
    return '';
  }, []);

  // Фильтрация данных по поисковому запросу
  const filteredData = useMemo(() => {
    const data = routes || regions || [];
    
    if (!searchQuery.trim()) {
      return data;
    }

    const normalizedQuery = normalizeText(searchQuery);
    
    return data.filter(item => {
      const regionName = getRegionNameForSearch(item);
      const normalizedName = normalizeText(regionName);
      
      // Ищем совпадения по названию
      if (normalizedName.includes(normalizedQuery) || 
          normalizedQuery.includes(normalizedName)) {
        return true;
      }
      
      // Дополнительно для маршрутов ищем по city_seo_data
      if ('city_seo_data' in item && item.city_seo_data) {
        const cityData = normalizeText(item.city_seo_data);
        if (cityData.includes(normalizedQuery)) {
          return true;
        }
      }
      
      return false;
    });
  }, [routes, regions, searchQuery, getRegionNameForSearch]);

  // Пагинация отфильтрованных данных
  const paginatedData = useMemo(() => {
    return getPaginatedList(filteredData, page, 20);
  }, [filteredData, page]);

  // Сброс пагинации при поиске
  useEffect(() => {
    setPage(0);
  }, [searchQuery]);

  const handleRegionClick = (region: IRegion | IRoute) => {
    router.push(`/${region.url}.html`);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
  };

  if (routes?.length === 0 || (!regions || regions.length === 0)) {
    return null;
  }

  return (
    <div className={clsx('container', s.container)}>
      <div className="title margin-b-48">Другие города</div>

      {/* Поисковая строка */}
      <div className={s.searchWrapper}>
        <div className={s.searchContainer}>
          <SearchOutlined className={s.searchIcon} />
          <Input
            placeholder="Поиск по городам..."
            value={searchQuery}
            onChange={handleSearchChange}
            className={s.searchInput}
            size="large"
            bordered={false}
          />
          {searchQuery && (
            <button 
              onClick={handleClearSearch}
              className={s.clearButton}
              aria-label="Очистить поиск"
            >
              <CloseOutlined />
            </button>
          )}
        </div>
      </div>

      {/* Список городов */}
      <div className={s.slide}>
        {paginatedData.length > 0 ? (
          paginatedData.map((region) => (
            <Link
              href={`${region.url || ''}.html`}
              key={region.ID}
              className={clsx(s.region, 'font-16-medium')}
              onClick={() => handleRegionClick(region)}
            >
              {'meta_value' in region 
                ? `Такси ${region.meta_value}`
                : region.title
              }
            </Link>
          ))
        ) : searchQuery ? (
          <div className={s.noResults}>
            По запросу "{searchQuery}" ничего не найдено
          </div>
        ) : null}
      </div>

      {/* Пагинация - всегда показываем если есть данные */}
      {filteredData.length > 0 && (
        <Pagination
          align="center"
          pageSize={20}
          current={page + 1}
          defaultPageSize={20}
          defaultCurrent={1}
          total={filteredData.length} // Используем filteredData для отображения общего количества
          onChange={(pageNum) => setPage(pageNum - 1)}
          hideOnSinglePage={filteredData.length <= 20} // Скрываем если одна страница
          showTitle={false}
          className={s.pagination}
        />
      )}

      {/* Блок с адресом филиала */}
      <FilialAddressBlock routeData={routeData} />
    </div>
  );
};

export default Cities;