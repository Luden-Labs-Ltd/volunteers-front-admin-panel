import { FC, useState } from 'react';

import { useCategories } from '@/entities/category';
import { useSkills } from '@/entities/skill';
import { CreateSkillForm } from '@/features/skill-create';
import { DeleteSkillButton } from '@/features/skill-delete';
import { EditSkillForm } from '@/features/skill-edit';
import { useI18n } from '@/shared/lib/i18n';
import { Button, Modal, Pagination, Select, Table } from '@/shared/ui';
import { paginate } from '@/shared/lib/utils';
import { SvgPreview } from '@/features/svg-preview';
import { Layout } from '@/widgets/layout';
import type { Skill } from '@/entities/skill';

export const SkillsPage: FC = () => {
  const { t } = useI18n();
  const [page, setPage] = useState(1);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);

  const { data: categories = [] } = useCategories();
  const { data: skills = [], isLoading, refetch } = useSkills(
    selectedCategoryId ? { categoryId: selectedCategoryId } : undefined,
  );

  const { data: paginatedSkills, pagination } = paginate(skills, page, 10);

  const handleCreateSuccess = () => {
    setIsCreateModalOpen(false);
    refetch();
  };

  const handleEditSuccess = () => {
    setEditingSkill(null);
    refetch();
  };

  const handleDeleteSuccess = () => {
    refetch();
  };

  const handleCategoryFilterChange = (categoryId: string) => {
    setSelectedCategoryId(categoryId);
    setPage(1); // Сброс на первую страницу при смене фильтра
  };

  return (
    <Layout>
      <div className="p-4 sm:p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            {t('skills.title')}
          </h1>
          <Button onClick={() => setIsCreateModalOpen(true)}>
            {t('skills.create')}
          </Button>
        </div>

        {/* Фильтр по категории */}
        <div className="mb-4 max-w-xs">
          <Select
            label={t('skills.filterByCategory')}
            value={selectedCategoryId}
            onChange={(e) => handleCategoryFilterChange(e.target.value)}
            options={[
              { value: '', label: t('skills.allCategories') },
              ...categories.map((category) => ({
                value: category.id,
                label: category.name,
              })),
            ]}
          />
        </div>

        {isLoading ? (
          <div className="text-center py-8 text-gray-500">
            {t('common.loading')}
          </div>
        ) : paginatedSkills.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">
              {selectedCategoryId
                ? t('skills.emptyFiltered')
                : t('skills.empty')}
            </p>
            <Button onClick={() => setIsCreateModalOpen(true)}>
              {t('skills.createFirst')}
            </Button>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <Table>
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('skills.columns.icon')}
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('skills.columns.name')}
                    </th>
                    <th className="hidden sm:table-cell px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('skills.columns.category')}
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('skills.columns.actions')}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedSkills.map((skill) => {

                    return <tr key={skill.id} className="hover:bg-gray-50">
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                        <SvgPreview svgCode={skill.iconSvg} size={64} />
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {skill.name}
                        </div>
                      </td>
                      <td className="hidden sm:table-cell px-4 sm:px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {skill.category?.name || '-'}
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setEditingSkill(skill)}
                          >
                            {t('common.edit')}
                          </Button>
                          <DeleteSkillButton
                            skillId={skill.id}
                            skillName={skill.name}
                            onSuccess={handleDeleteSuccess}
                          />
                        </div>
                      </td>
                    </tr>
                  })}
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
          title={t('skills.create')}
        >
          <CreateSkillForm
            onSuccess={handleCreateSuccess}
            onCancel={() => setIsCreateModalOpen(false)}
          />
        </Modal>

        {/* Модальное окно редактирования */}
        {editingSkill && (
          <Modal
            isOpen={!!editingSkill}
            onClose={() => setEditingSkill(null)}
            title={t('skills.edit')}
          >
            <EditSkillForm
              skill={editingSkill}
              onSuccess={handleEditSuccess}
              onCancel={() => setEditingSkill(null)}
            />
          </Modal>
        )}
      </div>
    </Layout>
  );
};
