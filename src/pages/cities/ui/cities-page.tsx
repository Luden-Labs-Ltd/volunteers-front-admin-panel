import { FC, useState } from 'react';

import { useGetCities } from '@/entities/city';
import { CreateCityForm } from '@/features/city-create';
import { useI18n } from '@/shared/lib/i18n';
import { Button, Modal, Pagination, Table } from '@/shared/ui';
import { paginate } from '@/shared/lib/utils';
import { Layout } from '@/widgets/layout';
import type { City } from '@/entities/city';
import type { User } from '@/entities/user';

export const CitiesPage: FC = () => {
  const { t } = useI18n();
  const [page, setPage] = useState(1);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState<City | null>(null);

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
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('cities.columns.actions')}
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
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedCity(city)}
                        >
                          {t('cities.viewVolunteers', { count: String(city.volunteers?.length || 0) })}
                        </Button>
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

        {/* Модальное окно со списком волонтеров */}
        {selectedCity && (
          <Modal
            isOpen={!!selectedCity}
            onClose={() => setSelectedCity(null)}
            title={t('cities.volunteers', { city: selectedCity.name })}
            size="lg"
          >
            <div className="space-y-4">
              {!selectedCity.volunteers || selectedCity.volunteers.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  {t('cities.noVolunteers')}
                </div>
              ) : (
                <div className="max-h-96 overflow-y-auto">
                  <Table>
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                          {t('users.columns.name')}
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                          {t('users.columns.email')}
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                          {t('users.columns.phone')}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {selectedCity.volunteers.map((volunteer: User) => (
                        <tr key={volunteer.id}>
                          <td className="px-4 py-2 text-sm">
                            {`${volunteer.firstName || ''} ${volunteer.lastName || ''}`.trim() || '-'}
                          </td>
                          <td className="px-4 py-2 text-sm text-gray-500">
                            {volunteer.email || '-'}
                          </td>
                          <td className="px-4 py-2 text-sm text-gray-500">
                            {volunteer.phone || '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              )}
              <div className="flex justify-end pt-4 border-t">
                <Button variant="ghost" onClick={() => setSelectedCity(null)}>
                  {t('common.close')}
                </Button>
              </div>
            </div>
          </Modal>
        )}
      </div>
    </Layout>
  );
};
