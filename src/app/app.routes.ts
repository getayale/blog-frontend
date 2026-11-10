import { Routes } from '@angular/router';

import { ReaderDashboard } from './features/dashboard/reader-dashboard/reader-dashboard';
import { AuthorDashboard } from './features/dashboard/author-dashboard/author-dashboard';
import { AdminDashboard } from './features/dashboard/admin-dashboard/admin-dashboard';

import { Home } from './features/home/home';
import { Login } from './features/auth/login/login';
import { Register } from './features/auth/register/register';
import { PostDetails } from './features/posts/post-details/post-details';

import { authGuard } from './guards/auth-guard';
import { adminGuard } from './guards/admin-guard';
import { authorGuard } from './guards/author-guard';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'login', component: Login },
  { path: 'register', component: Register },

  {
    path: 'reader-dashboard',
    component: ReaderDashboard,
    canActivate: [authGuard]
  },

  {
    path: 'author-dashboard',
    component: AuthorDashboard,
    canActivate: [authorGuard]
  },

  {
    path: 'admin-dashboard',
    component: AdminDashboard,
    canActivate: [adminGuard]
  },

  { path: 'posts/:id', component: PostDetails }
];