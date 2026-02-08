import { FC, useState } from 'react';

import { useGetCities } from '@/entities/city';
import { CreateCityForm } from '@/features/city-create';
import { useI18n } from '@/shared/lib/i18n';
import { Button, Modal, Pagination, Table } from '@/shared/ui';
import { paginate } from '@/shared/lib/utils';
import { Layout } from '@/widgets/layout';

export const CitiesPage: FC = () => {
  const { t } = useI18n();
  const [page, setPage] = useState(1);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const { data: cities = [], isLoading, refetch } = useGetCities();

  const { data: paginatedCities, pagination } = paginate(cities, page, 10);

  const handleCreateSuccess = () => {
    setIsCreateModalOpen(false);
    refetch();
  };

  return (
    <Layout>
      <div className="p-4 sm:p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            {t('cities.title')}
          </h1>
          <Button onClick={() => setIsCreateModalOpen(true)}>
            {t('cities.create')}
          </Button>
        </div>

        {isLoading ? (
          <div className="text-center py-8 text-gray-500">
            {t('common.loading')}
          </div>
        ) : paginatedCities.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">
              {t('cities.empty')}
            </p>
            <Button onClick={() => setIsCreateModalOpen(true)}>
              {t('cities.createFirst')}
            </Button>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <Table>
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('cities.columns.name')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('cities.columns.latitude')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('cities.columns.longitude')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('cities.columns.createdAt')}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedCities.map((city) => (
                    <tr key={city.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {city.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {typeof city.latitude === 'number'
                            ? city.latitude.toFixed(6)
                            : Number(city.latitude || 0).toFixed(6)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {typeof city.longitude === 'number'
                            ? city.longitude.toFixed(6)
                            : Number(city.longitude || 0).toFixed(6)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {new Date(city.createdAt).toLocaleDateString('ru-RU')}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>

            {pagination.totalPages > 1 && (
              <div className="mt-4">
                <Pagination
                  currentPage={pagination.page}
                  totalPages={pagination.totalPages}
                  onPageChange={setPage}
                />
              </div>
            )}
          </>
        )}

        {/* Модальное окно создания */}
        <Modal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          title={t('cities.create')}
        >
          <CreateCityForm
            onSuccess={handleCreateSuccess}
            onCancel={() => setIsCreateModalOpen(false)}
          />
        </Modal>
      </div>
    </Layout>
  );
};
