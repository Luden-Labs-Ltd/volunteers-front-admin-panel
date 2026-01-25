import { FC, useState } from 'react';

import { useCategories } from '@/entities/category';
import { CreateCategoryForm } from '@/features/category-create';
import { EditCategoryForm } from '@/features/category-edit';
import { DeleteCategoryButton } from '@/features/category-delete';
import { useI18n } from '@/shared/lib/i18n';
import { Button, Modal, Pagination, Table } from '@/shared/ui';
import { paginate } from '@/shared/lib/utils';
import { SvgPreview } from '@/features/svg-preview';
import { Layout } from '@/widgets/layout';
import type { Category } from '@/entities/category';

export const CategoriesPage: FC = () => {
  const { t } = useI18n();
  const [page, setPage] = useState(1);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const { data: categories = [], isLoading, refetch } = useCategories();

  const { data: paginatedCategories, pagination } = paginate(
    categories,
    page,
    10,
  );

  const handleCreateSuccess = () => {
    setIsCreateModalOpen(false);
    refetch();
  };

  const handleEditSuccess = () => {
    setEditingCategory(null);
    refetch();
  };

  const handleDeleteSuccess = () => {
    refetch();
  };

  return (
    <Layout>
      <div className="p-4 sm:p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            {t('categories.title')}
          </h1>
          <Button onClick={() => setIsCreateModalOpen(true)}>
            {t('categories.create')}
          </Button>
        </div>

        {isLoading ? (
          <div className="text-center py-8 text-gray-500">
            {t('common.loading')}
          </div>
        ) : paginatedCategories.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">{t('categories.empty')}</p>
            <Button onClick={() => setIsCreateModalOpen(true)}>
              {t('categories.createFirst')}
            </Button>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <Table>
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('categories.columns.icon')}
                    </th>
                    <th className="hidden sm:table-cell px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('categories.columns.name')}
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('categories.columns.actions')}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedCategories.map((category) => (
                    <tr key={category.id} className="hover:bg-gray-50">
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                        <SvgPreview svgCode={category.iconSvg || ''} size={32} />
                      </td>
                      <td className="hidden sm:table-cell px-4 sm:px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {category.name}
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setEditingCategory(category)}
                          >
                            {t('common.edit')}
                          </Button>
                          <DeleteCategoryButton
                            categoryId={category.id}
                            categoryName={category.name}
                            onSuccess={handleDeleteSuccess}
                          />
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
          title={t('categories.create')}
        >
          <CreateCategoryForm
            onSuccess={handleCreateSuccess}
            onCancel={() => setIsCreateModalOpen(false)}
          />
        </Modal>

        {/* Модальное окно редактирования */}
        {editingCategory && (
          <Modal
            isOpen={!!editingCategory}
            onClose={() => setEditingCategory(null)}
            title={t('categories.edit')}
          >
            <EditCategoryForm
              category={editingCategory}
              onSuccess={handleEditSuccess}
              onCancel={() => setEditingCategory(null)}
            />
          </Modal>
        )}
      </div>
    </Layout>
  );
};
