import { FC, useState } from 'react';

import { useUsers } from '@/entities/user';
import { useI18n } from '@/shared/lib/i18n';
import { Badge, Button, Card, Modal, Pagination, Table } from '@/shared/ui';
import { paginate } from '@/shared/lib/utils';
import { Layout } from '@/widgets/layout';
import { CreateNeedyForm } from '@/features/needy-create';
import { AssignProgramsButton } from '@/features/volunteer-assign-programs';
import { UserDetailsModal } from '@/features/user-details';
import type { User, UserRole, UserStatus } from '@/entities/user';

const ROLE_ORDER: UserRole[] = ['admin', 'volunteer', 'needy'];

const STATUS_ORDER: UserStatus[] = ['pending', 'approved', 'blocked'];

const getRoleKey = (role: UserRole): string =>
  `users.roles.${role as string}`;

const getStatusKey = (status: UserStatus): string =>
  `users.status.${status as string}`;

const getStatusVariant = (
  status: UserStatus | undefined,
): 'success' | 'default' | 'warning' => {
  if (!status) return 'default';
  if (status === 'approved') return 'success';
  if (status === 'blocked') return 'warning';
  return 'default';
};

export const UsersPage: FC = () => {
  const { t } = useI18n();
  const [page, setPage] = useState(1);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const { data: users = [], isLoading, refetch } = useUsers();

  const sortedUsers = [...users].sort((a, b) => {
    const statusA = STATUS_ORDER.indexOf(a.status);
    const statusB = STATUS_ORDER.indexOf(b.status);

    if (statusA !== statusB) return statusA - statusB;

    const roleA = ROLE_ORDER.indexOf(a.role);
    const roleB = ROLE_ORDER.indexOf(b.role);

    if (roleA !== roleB) return roleA - roleB;

    const nameA =
      `${a.firstName ?? ''} ${a.lastName ?? ''}`.trim() ||
      a.email ||
      a.phone ||
      '';
    const nameB =
      `${b.firstName ?? ''} ${b.lastName ?? ''}`.trim() ||
      b.email ||
      b.phone ||
      '';

    return nameA.localeCompare(nameB);
  });

  const { data: paginatedUsers, pagination } = paginate(sortedUsers, page, 10);

  const handleCreateSuccess = () => {
    setIsCreateModalOpen(false);
    refetch();
  };

  const handleUserDetailsSuccess = () => {
    refetch();
  };

  return (
    <Layout>
      <div className="p-4 sm:p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            {t('users.title')}
          </h1>
          <Button onClick={() => setIsCreateModalOpen(true)}>
            {t('users.addNeedy') || 'Добавить нуждающегося'}
          </Button>
        </div>

        {isLoading ? (
          <div className="text-center py-8 text-gray-500">
            {t('common.loading')}
          </div>
        ) : paginatedUsers.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">{t('users.empty')}</p>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block bg-white rounded-lg shadow overflow-hidden">
              <Table>
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('users.columns.name')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('users.columns.email')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('users.columns.phone')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('users.columns.role')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('users.columns.status')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('users.columns.actions')}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedUsers.map((user: User) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {`${user.firstName ?? ''} ${user.lastName ?? ''}`.trim() ||
                            user.email ||
                            user.phone ||
                            '-'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {user.email}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {user.phone || '-'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {t(getRoleKey(user.role))}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge variant={getStatusVariant(user.status)}>
                          {t(getStatusKey(user.status))}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => setSelectedUserId(user.id)}
                          >
                            {t('users.actions.viewDetails') || 'Детали'}
                          </Button>
                          {user.role === 'volunteer' && (
                            <AssignProgramsButton
                              volunteerId={user.id}
                              onSuccess={handleCreateSuccess}
                            />
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-4">
              {paginatedUsers.map((user: User) => (
                <Card key={user.id} className="p-4">
                  <div className="space-y-2">
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900">
                        {`${user.firstName ?? ''} ${user.lastName ?? ''}`.trim() ||
                          user.email ||
                          user.phone ||
                          '-'}
                      </h3>
                      {(user.email || user.phone) && (
                        <p className="text-xs text-gray-500 mt-1">
                          {user.email || user.phone}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs text-gray-500">
                        {t(getRoleKey(user.role))}
                      </span>
                      <Badge variant={getStatusVariant(user.status)}>
                        {t(getStatusKey(user.status))}
                      </Badge>
                    </div>
                    <div className="mt-2 flex gap-2">
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => setSelectedUserId(user.id)}
                      >
                        {t('users.actions.viewDetails') || 'Детали'}
                      </Button>
                    {user.role === 'volunteer' && (
                        <AssignProgramsButton
                          volunteerId={user.id}
                          onSuccess={handleCreateSuccess}
                        />
                      )}
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

        <Modal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          title={t('users.addNeedy') || 'Добавить нуждающегося'}
        >
          <CreateNeedyForm
            onSuccess={handleCreateSuccess}
            onCancel={() => setIsCreateModalOpen(false)}
          />
        </Modal>

        <UserDetailsModal
          userId={selectedUserId}
          isOpen={!!selectedUserId}
          onClose={() => setSelectedUserId(null)}
          onSuccess={handleUserDetailsSuccess}
        />
      </div>
    </Layout>
  );
};

