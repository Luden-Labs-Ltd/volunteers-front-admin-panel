import { FC, useState, useMemo } from 'react';
import { useI18n } from '@/shared/lib/i18n';
import { Modal, Badge, Button, Select } from '@/shared/ui';
import { useUser, useUpdateUserStatus, useUpdateUserPrograms } from '@/entities/user';
import { usePrograms } from '@/entities/program';
import type { UserStatus } from '@/entities/user';
import { showToast } from '@/shared/lib/toast';
import { useVolunteerRatings } from '@/entities/volunteer-rating';

interface UserDetailsModalProps {
    userId: string | null;
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

const getStatusVariant = (
    status: UserStatus | undefined,
): 'success' | 'default' | 'warning' => {
    if (!status) return 'default';
    if (status === 'approved') return 'success';
    if (status === 'blocked') return 'warning';
    return 'default';
};

export const UserDetailsModal: FC<UserDetailsModalProps> = ({
    userId,
    isOpen,
    onClose,
    onSuccess,
}) => {
    const { t } = useI18n();
    const { data: user, isLoading } = useUser(userId || '');
    const { data: programs = [] } = usePrograms();
    const { mutate: updateStatus, isPending } = useUpdateUserStatus();
    const { mutate: updatePrograms, isPending: isUpdatingPrograms } = useUpdateUserPrograms();
    const { data: ratings = [], isLoading: isRatingsLoading } = useVolunteerRatings(
        user?.role === 'volunteer' ? user.id : null,
        isOpen,
    );

    // Состояние для редактирования программ
    const [isEditingPrograms, setIsEditingPrograms] = useState(false);
    const [selectedProgramId, setSelectedProgramId] = useState<string>('');
    const [selectedProgramIds, setSelectedProgramIds] = useState<string[]>([]);

    // Инициализируем выбранные программы при загрузке пользователя
    useMemo(() => {
        if (user && !isEditingPrograms) {
            if (user.role === 'needy' && user.profile?.program) {
                setSelectedProgramId(user.profile.program.id);
            } else if (user.role === 'volunteer' && user.profile?.programs) {
                setSelectedProgramIds(user.profile.programs.map(p => p.id));
            }
        }
    }, [user, isEditingPrograms]);

    const handleStatusChange = (newStatus: UserStatus) => {
        if (!userId) return;

        updateStatus(
            { userId, status: newStatus },
            {
                onSuccess: () => {
                    showToast.successKey(t, 'users.statusUpdated');
                    onSuccess?.();
                },
                onError: () => {
                    showToast.error(t('users.statusUpdateError'));
                },
            },
        );
    };

    const handleSavePrograms = () => {
        if (!userId) return;

        if (user?.role === 'needy') {
            updatePrograms(
                { userId, programId: selectedProgramId },
                {
                    onSuccess: () => {
                        showToast.successKey(t, 'users.programsUpdated');
                        setIsEditingPrograms(false);
                        onSuccess?.();
                    },
                    onError: () => {
                        showToast.error(t('users.programsUpdateError'));
                    },
                },
            );
        } else if (user?.role === 'volunteer') {
            // Для волонтеров назначаем выбранные программы
            updatePrograms(
                { userId, programIds: selectedProgramIds },
                {
                    onSuccess: () => {
                        showToast.successKey(t, 'users.programsUpdated');
                        setIsEditingPrograms(false);
                        onSuccess?.();
                    },
                    onError: () => {
                        showToast.error(t('users.programsUpdateError'));
                    },
                },
            );
        }
    };

    return (
        <Modal isOpen={isOpen && !!userId} onClose={onClose} title={t('users.details.title')}>
            {!userId ? (
                <div className="text-center py-8 text-gray-500">
                    {t('users.notFound')}
                </div>
            ) : isLoading ? (
                <div className="text-center py-8 text-gray-500">
                    {t('common.loading')}
                </div>
            ) : !user ? (
                <div className="text-center py-8 text-gray-500">
                    {t('users.notFound')}
                </div>
            ) : (
                <div className="space-y-6">
                    {/* Основная информация */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900">
                            {t('users.details.basicInfo')}
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-gray-500">{t('users.columns.name')}</p>
                                <p className="text-sm font-medium text-gray-900">
                                    {`${user.firstName || ''} ${user.lastName || ''}`.trim() || '-'}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">{t('users.columns.email')}</p>
                                <p className="text-sm font-medium text-gray-900">{user.email || '-'}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">{t('users.columns.phone')}</p>
                                <p className="text-sm font-medium text-gray-900">{user.phone || '-'}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">{t('users.columns.role')}</p>
                                <p className="text-sm font-medium text-gray-900">
                                    {t(`users.roles.${user.role}`)}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">{t('users.columns.status')}</p>
                                <Badge variant={getStatusVariant(user.status)}>
                                    {t(`users.status.${user.status}`)}
                                </Badge>
                            </div>
                            {user.createdAt && (
                                <div>
                                    <p className="text-sm text-gray-500">
                                        {t('users.details.createdAt')}
                                    </p>
                                    <p className="text-sm font-medium text-gray-900">
                                        {new Date(user.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Дополнительная информация */}
                    {user.about && (
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                {t('users.details.about')}
                            </h3>
                            <p className="text-sm text-gray-700">{user.about}</p>
                        </div>
                    )}

                    {/* Информация профиля в зависимости от роли */}
                    {'profile' in user && user.profile && (
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-900">
                                {t('users.details.profileInfo')}
                            </h3>
                            {user.role === 'volunteer' && (
                                <div className="grid grid-cols-2 gap-4">
                                    {user.profile.city && (
                                        <div>
                                            <p className="text-sm text-gray-500">{t('users.details.city')}</p>
                                            <p className="text-sm font-medium text-gray-900">{user.profile.city.name}</p>
                                        </div>
                                    )}
                                    {user.profile.points !== undefined && (
                                        <div>
                                            <p className="text-sm text-gray-500">{t('users.details.points')}</p>
                                            <p className="text-sm font-medium text-gray-900">{user.profile.points}</p>
                                        </div>
                                    )}
                                    {user.profile.completedTasksCount !== undefined && (
                                        <div>
                                            <p className="text-sm text-gray-500">
                                                {t('users.details.completedTasks')}
                                            </p>
                                            <p className="text-sm font-medium text-gray-900">
                                                {user.profile.completedTasksCount}
                                            </p>
                                        </div>
                                    )}
                                    {user.profile.rating !== null && user.profile.rating !== undefined && (
                                        <div>
                                            <p className="text-sm text-gray-500">{t('users.details.rating')}</p>
                                            <p className="text-sm font-medium text-gray-900">{user.profile.rating}</p>
                                        </div>
                                    )}
                                    <div className="col-span-2">
                                        <div className="flex items-center justify-between mb-1">
                                            <p className="text-sm text-gray-500">
                                                {t('users.details.programs')}
                                            </p>
                                            {!isEditingPrograms && (
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => setIsEditingPrograms(true)}
                                                >
                                                    {t('users.details.editPrograms')}
                                                </Button>
                                            )}
                                        </div>
                                        {isEditingPrograms ? (
                                            <div className="space-y-2">
                                                <div className="max-h-48 overflow-y-auto border border-gray-300 rounded-lg p-2">
                                                    {programs.length > 0 ? (
                                                        programs.map((program) => (
                                                            <label key={program.id} className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer">
                                                                <input
                                                                    type="checkbox"
                                                                    checked={selectedProgramIds.includes(program.id)}
                                                                    onChange={(e) => {
                                                                        if (e.target.checked) {
                                                                            setSelectedProgramIds([...selectedProgramIds, program.id]);
                                                                        } else {
                                                                            setSelectedProgramIds(selectedProgramIds.filter(id => id !== program.id));
                                                                        }
                                                                    }}
                                                                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                                                                />
                                                                <span className="text-sm text-gray-900">{program.name}</span>
                                                            </label>
                                                        ))
                                                    ) : (
                                                        <p className="text-sm text-gray-500 p-2">
                                                            {t('users.details.noProgramsAvailable')}
                                                        </p>
                                                    )}
                                                </div>
                                                <div className="flex gap-2">
                                                    <Button
                                                        variant="primary"
                                                        size="sm"
                                                        onClick={handleSavePrograms}
                                                        disabled={isUpdatingPrograms}
                                                    >
                                                        {t('common.save')}
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => {
                                                            setIsEditingPrograms(false);
                                                            // Восстанавливаем исходные значения
                                                            if (user.profile?.programs) {
                                                                setSelectedProgramIds(user.profile.programs.map(p => p.id));
                                                            }
                                                        }}
                                                    >
                                                        {t('common.cancel')}
                                                    </Button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex flex-wrap gap-2">
                                                {user.profile.programs && user.profile.programs.length > 0 ? (
                                                    user.profile.programs.map((program) => (
                                                        <Badge key={program.id} variant="default">
                                                            {program.name}
                                                        </Badge>
                                                    ))
                                                ) : (
                                                    <span className="text-sm text-gray-400">
                                                        {t('users.details.noPrograms')}
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                    {user.profile.skills && user.profile.skills.length > 0 && (
                                        <div className="col-span-2">
                                            <p className="text-sm text-gray-500 mb-1">
                                                {t('users.details.skills')}
                                            </p>
                                            <div className="flex flex-wrap gap-2">
                                                {user.profile.skills.map((skill) => (
                                                    <Badge key={skill.id} variant="default">
                                                        {skill.name}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                            {user.role === 'volunteer' && (
                                <div className="space-y-2">
                                    <h4 className="text-sm font-semibold text-gray-900">
                                        {t('users.details.reviews')}
                                    </h4>
                                    {isRatingsLoading ? (
                                        <p className="text-sm text-gray-500">{t('common.loading')}</p>
                                    ) : ratings.length === 0 ? (
                                        <p className="text-sm text-gray-500">
                                            {t('users.details.noReviews')}
                                        </p>
                                    ) : (
                                        <div className="space-y-2 max-h-56 overflow-y-auto border border-gray-100 rounded-lg p-3">
                                            {ratings.map((rating) => (
                                                <div key={rating.id} className="border-b last:border-b-0 pb-2 last:pb-0">
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
                                                        <span className="text-xs text-gray-400">
                                                            {new Date(rating.createdAt).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                    {rating.comment && (
                                                        <p className="text-sm text-gray-700 mt-1">
                                                            {rating.comment}
                                                        </p>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                            {user.role === 'needy' && (
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="col-span-2">
                                        <div className="flex items-center justify-between mb-1">
                                            <p className="text-sm text-gray-500">
                                                {t('users.details.program')}
                                            </p>
                                            {!isEditingPrograms && (
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => setIsEditingPrograms(true)}
                                                >
                                                    {t('users.details.editProgram')}
                                                </Button>
                                            )}
                                        </div>
                                        {isEditingPrograms ? (
                                            <div className="space-y-2">
                                                <Select
                                                    value={selectedProgramId}
                                                    onChange={(e) => setSelectedProgramId(e.target.value)}
                                                    options={[
                                                        { value: '', label: t('users.details.selectProgram') },
                                                        ...programs.map(p => ({ value: p.id, label: p.name }))
                                                    ]}
                                                />
                                                <div className="flex gap-2">
                                                    <Button
                                                        variant="primary"
                                                        size="sm"
                                                        onClick={handleSavePrograms}
                                                        disabled={isUpdatingPrograms || !selectedProgramId}
                                                    >
                                                        {t('common.save')}
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => {
                                                            setIsEditingPrograms(false);
                                                            // Восстанавливаем исходное значение
                                                            if (user.profile?.program) {
                                                                setSelectedProgramId(user.profile.program.id);
                                                            }
                                                        }}
                                                    >
                                                        {t('common.cancel')}
                                                    </Button>
                                                </div>
                                            </div>
                                        ) : (
                                            <p className="text-sm font-medium text-gray-900">
                                                {user.profile.program?.name || '-'}
                                            </p>
                                        )}
                                    </div>
                                    {user.profile.city && (
                                        <div>
                                            <p className="text-sm text-gray-500">{t('users.details.city')}</p>
                                            <p className="text-sm font-medium text-gray-900">{user.profile.city.name}</p>
                                        </div>
                                    )}
                                    {user.profile.address && (
                                        <div className="col-span-2">
                                            <p className="text-sm text-gray-500">
                                                {t('users.details.address')}
                                            </p>
                                            <p className="text-sm font-medium text-gray-900">{user.profile.address}</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Действия со статусом */}
                    <div className="border-t pt-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            {t('users.details.actions')}
                        </h3>
                        <div className="flex gap-2 flex-wrap">
                            {user.status !== 'approved' && (
                                <Button
                                    variant="primary"
                                    onClick={() => handleStatusChange('approved')}
                                    disabled={isPending}
                                >
                                    {t('users.actions.approve')}
                                </Button>
                            )}
                            {user.status !== 'blocked' && (
                                <Button
                                    variant="danger"
                                    onClick={() => handleStatusChange('blocked')}
                                    disabled={isPending}
                                >
                                    {t('users.actions.block')}
                                </Button>
                            )}
                            {user.status !== 'pending' && (
                                <Button
                                    variant="outline"
                                    onClick={() => handleStatusChange('pending')}
                                    disabled={isPending}
                                >
                                    {t('users.actions.setPending')}
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </Modal>
    );
};
