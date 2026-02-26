import { FC } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthPage } from '@/pages/auth/ui';
import { ProgramsPage } from '@/pages/programs/ui';
import { CategoriesPage } from '@/pages/categories/ui';
import { SkillsPage } from '@/pages/skills/ui';
import { TasksPage } from '@/pages/tasks/ui';
import { UsersPage } from '@/pages/users/ui';
import { CitiesPage } from '@/pages/cities/ui';
import { CityGroupsPage } from '@/pages/city-groups/ui';
import { NotFoundPage } from '@/pages/not-found/ui';
import { PrivateRoute } from './private-route';

export const Router: FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={<AuthPage />} />
        <Route
          path="/*"
          element={
            <PrivateRoute>
              <Routes>
                <Route path="/" element={<Navigate to="/programs" replace />} />
                <Route path="/programs" element={<ProgramsPage />} />
                <Route path="/categories" element={<CategoriesPage />} />
                <Route path="/skills" element={<SkillsPage />} />
                <Route path="/tasks" element={<TasksPage />} />
                <Route path="/users" element={<UsersPage />} />
                <Route path="/cities" element={<CitiesPage />} />
                <Route path="/city-groups" element={<CityGroupsPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};
