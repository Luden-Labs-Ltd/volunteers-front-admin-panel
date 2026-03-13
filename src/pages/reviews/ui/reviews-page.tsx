import { FC, useEffect, useState } from 'react';
import { useI18n } from '@/shared/lib/i18n';
import { Layout } from '@/widgets/layout';
import { Input, Table, Pagination, Card, Badge } from '@/shared/ui';
import { useVolunteerRatingsAdmin } from '@/entities/volunteer-rating';

const SEARCH_DEBOUNCE_MS = 300;

export const ReviewsPage: FC = () => {
  const { t } = useI18n();
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const [searchDebounced, setSearchDebounced] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => setSearchDebounced(searchInput.trim()), SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const { data, isLoading } = useVolunteerRatingsAdmin({
    page,
    limit: 10,
    search: searchDebounced || undefined,
  });

  const items = data?.items ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.ceil(total / 10) || 1;

  return (
    <Layout>
      <div className="p-3 sm:p-6">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">
          {t('reviews.title')}
        </h1>

        <div className="mb-4 sm:mb-6">
          <Input
            placeholder={t('reviews.searchPlaceholder')}
            value={searchInput}
            onChange={(e) => {
              setSearchInput(e.target.value);
              setPage(1);
            }}
            className="w-full sm:w-80 min-w-0"
          />
        </div>

        {isLoading ? (
          <div className="text-center py-8 text-gray-500">{t('common.loading')}</div>
        ) : items.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">{t('reviews.empty')}</p>
          </div>
        ) : (
          <>
            <div className="hidden md:block w-full overflow-x-auto rounded-lg shadow bg-white">
              <Table className="w-full min-w-[800px]">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('reviews.columns.volunteer')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('reviews.columns.contact')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('reviews.columns.score')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('reviews.columns.comment')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('reviews.columns.task')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('reviews.columns.createdAt')}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {items.map((rating) => (
                    <tr key={rating.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {`${rating.volunteerFirstName ?? ''} ${rating.volunteerLastName ?? ''}`.trim() ||
                            rating.volunteerEmail ||
                            rating.volunteerPhone ||
                            rating.volunteerUserId}
                        </div>
                        <div className="text-xs text-gray-400 mt-0.5">
                          ID: {rating.volunteerUserId}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {rating.volunteerEmail || '-'}
                        </div>
                        <div className="text-sm text-gray-500">
                          {rating.volunteerPhone || '-'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className="flex gap-0.5">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <span
                                key={star}
                                className={star <= rating.score ? 'text-yellow-500' : 'text-gray-300'}
                              >
                                ★
                              </span>
                            ))}
                          </div>
                          <span className="text-sm text-gray-700">{rating.score}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-700 max-w-xs line-clamp-3">
                          {rating.comment || '-'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge variant="default" className="text-xs">
                          {rating.taskId}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(rating.createdAt).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>

            <div className="md:hidden space-y-3">
              {items.map((rating) => (
                <Card key={rating.id} className="p-4 shadow-sm border border-gray-100">
                  <div className="space-y-2">
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900">
                        {`${rating.volunteerFirstName ?? ''} ${rating.volunteerLastName ?? ''}`.trim() ||
                          rating.volunteerEmail ||
                          rating.volunteerPhone ||
                          rating.volunteerUserId}
                      </h3>
                      <p className="text-xs text-gray-500 mt-1">
                        ID: {rating.volunteerUserId}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <span
                            key={star}
                            className={star <= rating.score ? 'text-yellow-500' : 'text-gray-300'}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                      <span className="text-xs text-gray-500">
                        {new Date(rating.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    {rating.comment && (
                      <p className="text-sm text-gray-700 mt-1">{rating.comment}</p>
                    )}
                    <div className="pt-2 border-t border-gray-100 flex flex-wrap gap-2 text-xs text-gray-500">
                      <span>{t('reviews.columns.task')}: {rating.taskId}</span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="mt-4 sm:mt-6 flex justify-center">
                <Pagination
                  currentPage={page}
                  totalPages={totalPages}
                  onPageChange={setPage}
                />
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
};

