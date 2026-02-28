import { FC, useState } from 'react';

import { useUsers } from '@/entities/user';
import { useI18n } from '@/shared/lib/i18n';
import { Badge, Button, Card, Modal, Pagination, Select, Table } from '@/shared/ui';
import { paginate } from '@/shared/lib/utils';
import { Layout } from '@/widgets/layout';
import { CreateNeedyForm } from '@/features/needy-create';
import { CreateVolunteerForm } from '@/features/volunteer-create';
import { InviteNeedyButton } from '@/features/needy-invite-link';
import { AssignProgramsButton } from '@/features/volunteer-assign-programs';
import { UserDetailsModal } from '@/features/user-details';
import type { User, UserRole, UserStatus } from '@/entities/user';

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

type StatusFilterValue = UserStatus | 'all';
type RoleFilterValue = UserRole | 'all';

const STATUS_FILTER_OPTIONS: { value: StatusFilterValue; labelKey: string }[] = [
  { value: 'all', labelKey: 'users.filters.all' },
  { value: 'pending', labelKey: 'users.status.pending' },
  { value: 'approved', labelKey: 'users.status.approved' },
  { value: 'blocked', labelKey: 'users.status.blocked' },
];

const ROLE_FILTER_OPTIONS: { value: RoleFilterValue; labelKey: string }[] = [
  { value: 'all', labelKey: 'users.filters.all' },
  { value: 'admin', labelKey: 'users.roles.admin' },
  { value: 'volunteer', labelKey: 'users.roles.volunteer' },
  { value: 'needy', labelKey: 'users.roles.needy' },
];

export const UsersPage: FC = () => {
  const { t } = useI18n();
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<StatusFilterValue>('all');
  const [roleFilter, setRoleFilter] = useState<RoleFilterValue>('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isCreateVolunteerModalOpen, setIsCreateVolunteerModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const statusParam = statusFilter === 'all' ? undefined : statusFilter;
  const { data: users = [], isLoading, refetch } = useUsers(statusParam);

  const filteredUsers =
    roleFilter === 'all'
      ? users
      : users.filter((u) => u.role === roleFilter);

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    const dateA = new Date(a.createdAt ?? 0).getTime();
    const dateB = new Date(b.createdAt ?? 0).getTime();
    if (dateA !== dateB) return dateB - dateA;

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
    setIsCreateVolunteerModalOpen(false);
    refetch();
  };

  const handleUserDetailsSuccess = () => {
    refetch();
  };

  return (
    <Layout>
      <div className="p-3 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
            {t('users.title')}
          </h1>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <div className="grid grid-cols-2 gap-3 sm:flex sm:grid-cols-none sm:gap-2">
              <Select
                label={t('users.filters.status')}
                options={STATUS_FILTER_OPTIONS.map((opt) => ({
                  value: opt.value,
                  label: t(opt.labelKey),
                }))}
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value as StatusFilterValue);
                  setPage(1);
                }}
                className="w-full sm:w-36 min-w-0"
              />
              <Select
                label={t('users.filters.role')}
                options={ROLE_FILTER_OPTIONS.map((opt) => ({
                  value: opt.value,
                  label: t(opt.labelKey),
                }))}
                value={roleFilter}
                onChange={(e) => {
                  setRoleFilter(e.target.value as RoleFilterValue);
                  setPage(1);
                }}
                className="w-full sm:w-36 min-w-0"
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <InviteNeedyButton />
              <Button
                onClick={() => setIsCreateVolunteerModalOpen(true)}
                className="w-full sm:w-auto min-h-[44px] sm:min-h-0 shrink-0"
                variant="outline"
              >
                {t('users.addVolunteer')}
              </Button>
              <Button
                onClick={() => setIsCreateModalOpen(true)}
                className="w-full sm:w-auto min-h-[44px] sm:min-h-0 shrink-0"
              >
                {t('users.addNeedy')}
              </Button>
            </div>
          </div>
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
            <div className="hidden md:block w-full overflow-x-auto rounded-lg shadow bg-white">
              <Table className="w-full min-w-[720px]">
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
                            {t('users.actions.viewDetails')}
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
            <div className="md:hidden space-y-3">
              {paginatedUsers.map((user: User) => (
                <Card key={user.id} className="p-4 shadow-sm border border-gray-100">
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
                    <div className="mt-3 pt-2 border-t border-gray-100 flex flex-wrap gap-2">
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => setSelectedUserId(user.id)}
                        className="min-h-[40px] flex-1 sm:flex-initial"
                      >
                        {t('users.actions.viewDetails')}
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
              <div className="mt-4 sm:mt-6 flex justify-center">
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
          title={t('users.addNeedy')}
        >
          <CreateNeedyForm
            onSuccess={handleCreateSuccess}
            onCancel={() => setIsCreateModalOpen(false)}
          />
        </Modal>

        <Modal
          isOpen={isCreateVolunteerModalOpen}
          onClose={() => setIsCreateVolunteerModalOpen(false)}
          title={t('users.addVolunteer')}
          size="lg"
        >
          <CreateVolunteerForm
            onSuccess={handleCreateSuccess}
            onCancel={() => setIsCreateVolunteerModalOpen(false)}
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

