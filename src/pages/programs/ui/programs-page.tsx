import { FC, useState } from 'react';

import { usePrograms } from '@/entities/program';
import { CreateProgramForm } from '@/features/program-create';
import { DeleteProgramButton } from '@/features/program-delete';
import { EditProgramForm } from '@/features/program-edit';
import { useI18n } from '@/shared/lib/i18n';
import { Badge, Button, Modal, Pagination, Table } from '@/shared/ui';
import { paginate } from '@/shared/lib/utils';
import { Layout } from '@/widgets/layout';
import type { Program } from '@/entities/program';

export const ProgramsPage: FC = () => {
  const { t } = useI18n();
  const [page, setPage] = useState(1);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingProgram, setEditingProgram] = useState<Program | null>(null);

  const { data: programs = [], isLoading, refetch } = usePrograms();

  const { data: paginatedPrograms, pagination } = paginate(programs, page, 10);

  const handleCreateSuccess = () => {
    setIsCreateModalOpen(false);
    refetch();
  };

  const handleEditSuccess = () => {
    setEditingProgram(null);
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
            {t('programs.title')}
          </h1>
          <Button
            size="sm"
            onClick={() => setIsCreateModalOpen(true)}
            className="sm:hidden"
          >
            {t('programs.create')}
          </Button>
          <Button
            onClick={() => setIsCreateModalOpen(true)}
            className="hidden sm:inline-flex"
          >
            {t('programs.create')}
          </Button>
        </div>

        {isLoading ? (
          <div className="text-center py-8 text-gray-500">
            {t('common.loading')}
          </div>
        ) : paginatedPrograms.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">{t('programs.empty')}</p>
            <Button
              size="sm"
              onClick={() => setIsCreateModalOpen(true)}
              className="sm:hidden"
            >
              {t('programs.createFirst')}
            </Button>
            <Button
              onClick={() => setIsCreateModalOpen(true)}
              className="hidden sm:inline-flex"
            >
              {t('programs.createFirst')}
            </Button>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <Table>
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('programs.columns.name')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('programs.columns.description')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('programs.columns.status')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('programs.columns.actions')}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedPrograms.map((program) => (
                    <tr key={program.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {program.name}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-500 max-w-md truncate">
                          {program.description || '-'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge
                          variant={program.isActive ? 'success' : 'default'}
                        >
                          {program.isActive
                            ? t('programs.status.active')
                            : t('programs.status.inactive')}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setEditingProgram(program)}
                          >
                            {t('common.edit')}
                          </Button>
                          <DeleteProgramButton
                            programId={program.id}
                            programName={program.name}
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
          title={t('programs.create')}
        >
          <CreateProgramForm
            onSuccess={handleCreateSuccess}
            onCancel={() => setIsCreateModalOpen(false)}
          />
        </Modal>

        {/* Модальное окно редактирования */}
        {editingProgram && (
          <Modal
            isOpen={!!editingProgram}
            onClose={() => setEditingProgram(null)}
            title={t('programs.edit')}
          >
            <EditProgramForm
              program={editingProgram}
              onSuccess={handleEditSuccess}
              onCancel={() => setEditingProgram(null)}
            />
          </Modal>
        )}
      </div>
    </Layout>
  );
};
