import { FC } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HomePage } from '@/pages/home/ui';
import { AuthPage } from '@/pages/auth/ui';
import { ProgramsPage } from '@/pages/programs/ui';
import { CategoriesPage } from '@/pages/categories/ui';
import { SkillsPage } from '@/pages/skills/ui';
import { TasksPage } from '@/pages/tasks/ui';
import { UsersPage } from '@/pages/users/ui';
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
                <Route path="/" element={<HomePage />} />
                <Route path="/programs" element={<ProgramsPage />} />
                <Route path="/categories" element={<CategoriesPage />} />
                <Route path="/skills" element={<SkillsPage />} />
                <Route path="/tasks" element={<TasksPage />} />
                <Route path="/users" element={<UsersPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};
