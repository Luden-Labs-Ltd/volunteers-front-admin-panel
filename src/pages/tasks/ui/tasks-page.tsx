import { FC, useState } from 'react';

import { useTasks } from '@/entities/task';
import { CreateTaskForm } from '@/features/task-create';
import { EditTaskForm } from '@/features/task-edit';
import { DeleteTaskButton } from '@/features/task-delete';
import { AssignVolunteerButton } from '@/features/task-assign-volunteer';
import { UnassignVolunteerButton } from '@/features/task-unassign-volunteer';
import { useI18n } from '@/shared/lib/i18n';
import { Badge, Button, Card, Modal, Pagination, Table } from '@/shared/ui';
import { paginate } from '@/shared/lib/utils';
import { Layout } from '@/widgets/layout';
import type { Task } from '@/entities/task';

export const TasksPage: FC = () => {
  const { t } = useI18n();
  const [page, setPage] = useState(1);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const { data: tasks = [], isLoading, refetch } = useTasks();

  const { data: paginatedTasks, pagination } = paginate(tasks, page, 10);

  const getStatusKey = (status: Task['status'] | undefined): string => {
    if (!status) return 'tasks.status.new';

    const statusMap: Record<Task['status'], string> = {
      active: 'tasks.status.new',
      in_progress: 'tasks.status.inProgress',
      completed: 'tasks.status.done',
      cancelled: 'tasks.status.canceled',
    };

    return statusMap[status] || 'tasks.status.new';
  };

  const getStatusVariant = (
    status: Task['status'] | undefined,
  ): 'success' | 'default' | 'warning' => {
    if (!status) return 'default';
    if (status === 'completed') return 'success';
    if (status === 'in_progress') return 'warning';
    return 'default';
  };

  const handleCreateSuccess = () => {
    setIsCreateModalOpen(false);
    refetch();
  };

  const handleEditSuccess = () => {
    setEditingTask(null);
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
            {t('tasks.title')}
          </h1>
          <Button onClick={() => setIsCreateModalOpen(true)}>
            {t('tasks.create')}
          </Button>
        </div>

        {isLoading ? (
          <div className="text-center py-8 text-gray-500">
            {t('common.loading')}
          </div>
        ) : paginatedTasks.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">{t('tasks.empty')}</p>
            <Button onClick={() => setIsCreateModalOpen(true)}>
              {t('tasks.createFirst')}
            </Button>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block bg-white rounded-lg shadow overflow-hidden">
              <Table>
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('tasks.columns.title')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('tasks.columns.description')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('tasks.columns.status')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('tasks.assignedVolunteer')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('tasks.columns.actions')}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedTasks.map((task: Task) => (
                    <tr key={task.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {task.title}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-500 max-w-md truncate">
                          {task.description || '-'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge variant={getStatusVariant(task.status)}>
                          {t(getStatusKey(task.status))}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {task.assignedVolunteer
                            ? `${task.assignedVolunteer.firstName || ''} ${task.assignedVolunteer.lastName || ''}`.trim() || task.assignedVolunteer.email || '-'
                            : t('tasks.notAssigned')}
                        </div>
                        {task.assignedVolunteer?.email && (
                          <div className="text-xs text-gray-500">
                            {task.assignedVolunteer.email}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center gap-2">
                          <AssignVolunteerButton
                            taskId={task.id}
                            programId={task.programId}
                            currentVolunteerId={task.assignedVolunteerId}
                            taskStatus={task.status}
                            onSuccess={handleDeleteSuccess}
                          />
                          {task.assignedVolunteerId && (
                            <UnassignVolunteerButton
                              taskId={task.id}
                              taskStatus={task.status}
                              onSuccess={handleDeleteSuccess}
                            />
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setEditingTask(task)}
                          >
                            {t('common.edit')}
                          </Button>
                          <DeleteTaskButton
                            taskId={task.id}
                            taskTitle={task.title}
                            taskStatus={task.status}
                            onSuccess={handleDeleteSuccess}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-4">
              {paginatedTasks.map((task: Task) => (
                <Card key={task.id} className="p-4">
                  <div className="space-y-3">
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900">
                        {task.title}
                      </h3>
                      {task.description && (
                        <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                          {task.description}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant={getStatusVariant(task.status)}>
                        {t(getStatusKey(task.status))}
                      </Badge>
                    </div>
                    {task.assignedVolunteer && (
                      <div className="text-sm text-gray-600">
                        <div className="font-medium">
                          {t('tasks.assignedVolunteer')}:{' '}
                          {`${task.assignedVolunteer.firstName || ''} ${task.assignedVolunteer.lastName || ''}`.trim() || task.assignedVolunteer.email || '-'}
                        </div>
                        {task.assignedVolunteer.email && (
                          <div className="text-xs text-gray-500">
                            {task.assignedVolunteer.email}
                          </div>
                        )}
                      </div>
                    )}
                    <div className="flex items-center gap-2 pt-2">
                      <AssignVolunteerButton
                        taskId={task.id}
                        programId={task.programId}
                        currentVolunteerId={task.assignedVolunteerId}
                        taskStatus={task.status}
                        onSuccess={handleDeleteSuccess}
                      />
                      {task.assignedVolunteerId && (
                        <UnassignVolunteerButton
                          taskId={task.id}
                          taskStatus={task.status}
                          onSuccess={handleDeleteSuccess}
                        />
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingTask(task)}
                        className="flex-1"
                      >
                        {t('common.edit')}
                      </Button>
                      <DeleteTaskButton
                        taskId={task.id}
                        taskTitle={task.title}
                        taskStatus={task.status}
                        onSuccess={handleDeleteSuccess}
                      />
                    </div>
                  </div>
                </Card>
              ))}
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
          title={t('tasks.create')}
        >
          <CreateTaskForm
            onSuccess={handleCreateSuccess}
            onCancel={() => setIsCreateModalOpen(false)}
          />
        </Modal>

        {/* Модальное окно редактирования */}
        {editingTask && (
          <Modal
            isOpen={!!editingTask}
            onClose={() => setEditingTask(null)}
            title={t('tasks.edit')}
          >
            <EditTaskForm
              task={editingTask}
              onSuccess={handleEditSuccess}
              onCancel={() => setEditingTask(null)}
            />
          </Modal>
        )}
      </div>
    </Layout>
  );
};
