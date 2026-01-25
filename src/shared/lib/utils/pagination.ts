/**
 * Утилита для клиентской пагинации
 */

export interface PaginationState {
  page: number; // текущая страница (начиная с 1)
  limit: number; // элементов на страницу
  total: number; // общее количество элементов
  totalPages: number; // общее количество страниц
}

export interface PaginationResult<T> {
  data: T[];
  pagination: PaginationState;
}

/**
 * Разбивает массив на страницы
 * @param items - массив элементов для пагинации
 * @param page - номер страницы (начиная с 1)
 * @param limit - количество элементов на страницу
 * @returns объект с данными текущей страницы и метаданными пагинации
 */
export function paginate<T>(
  items: T[],
  page: number,
  limit: number,
): PaginationResult<T> {
  const total = items.length;
  const totalPages = Math.ceil(total / limit);
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const data = items.slice(startIndex, endIndex);

  return {
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages,
    },
  };
}
