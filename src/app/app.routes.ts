
import { Routes } from '@angular/router';
import { ReaderDashboard } from './features/dashboard/reader-dashboard/reader-dashboard';
import { Home } from './features/home/home';
import { Login } from './features/auth/login/login';
import { Register } from './features/auth/register/register';
import { PostDetails } from './features/posts/post-details/post-details';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'reader-dashboard', component: ReaderDashboard },
  { path: 'posts/:id', component: PostDetails }
];


