import { FC, useState } from 'react';
import { useGetCityGroups, type CityGroup } from '@/entities/city-group';
import { CreateCityGroupForm } from '@/features/city-group-create';
import { EditCityGroupForm } from '@/features/city-group-edit';
import { ManageCitiesForm } from '@/features/city-group-manage-cities';
import { DeleteCityGroupButton } from '@/features/city-group-delete';
import { Button, Modal, Table } from '@/shared/ui';
import { useI18n } from '@/shared/lib/i18n';
import { Layout } from '@/widgets/layout';

export const CityGroupsPage: FC = () => {
  const { t } = useI18n();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<CityGroup | null>(null);
  const [managingGroup, setManagingGroup] = useState<CityGroup | null>(null);

  const { data: groups = [], isLoading, refetch } = useGetCityGroups();

  return (
    <Layout>
      <div className="p-4 sm:p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            {t('cityGroups.title')}
          </h1>
          <Button onClick={() => setIsCreateOpen(true)}>
            {t('cityGroups.create')}
          </Button>
        </div>

        {isLoading ? (
          <div className="text-center py-8 text-gray-500">
            {t('common.loading')}
          </div>
        ) : groups.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">{t('cityGroups.empty')}</p>
            <Button onClick={() => setIsCreateOpen(true)}>
              {t('cityGroups.createFirst')}
            </Button>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <Table>
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('cityGroups.columns.name')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('cityGroups.columns.citiesCount')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('cityGroups.columns.actions')}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {groups.map((group) => (
                  <tr key={group.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {group.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {group.cities?.length ?? 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex gap-2">
                        <Button
                          variant="secondary"
                          onClick={() => setEditingGroup(group)}
                        >
                          {t('cityGroups.edit')}
                        </Button>
                        <Button
                          variant="secondary"
                          onClick={() => setManagingGroup(group)}
                        >
                          {t('cityGroups.manageCities')}
                        </Button>
                        <DeleteCityGroupButton
                          group={group}
                          onDeleted={() => refetch()}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        )}
      </div>

      <Modal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title={t('cityGroups.create')}
      >
        <CreateCityGroupForm
          onSuccess={() => {
            setIsCreateOpen(false);
            refetch();
          }}
          onCancel={() => setIsCreateOpen(false)}
        />
      </Modal>

      <Modal
        isOpen={!!editingGroup}
        onClose={() => setEditingGroup(null)}
        title={t('cityGroups.edit')}
      >
        {editingGroup && (
          <EditCityGroupForm
            group={editingGroup}
            onSuccess={() => {
              setEditingGroup(null);
              refetch();
            }}
            onCancel={() => setEditingGroup(null)}
          />
        )}
      </Modal>

      <Modal
        isOpen={!!managingGroup}
        onClose={() => setManagingGroup(null)}
        title={t('cityGroups.manageCities')}
        size="lg"
      >
        {managingGroup && (
          <ManageCitiesForm
            group={managingGroup}
            onSuccess={() => {
              setManagingGroup(null);
              refetch();
            }}
            onCancel={() => setManagingGroup(null)}
          />
        )}
      </Modal>
    </Layout>
  );
};
