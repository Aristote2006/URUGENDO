import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import DashboardLayout from '../layouts/DashboardLayout';
import AdminLayout from '../layouts/AdminLayout';
import ProtectedRoute from './ProtectedRoute';
import SubscriptionGuard from './SubscriptionGuard';
import AdminRoute from './AdminRoute';

// Public Pages
import Home from '../pages/Home';
import Services from '../pages/Services';
import About from '../pages/About';
import Help from '../pages/Help';
import Login from '../pages/Login';
import Register from '../pages/Register';
import NotFound from '../pages/NotFound';

// Payment Flow Pages
import Payment from '../pages/payment/Payment';
import PaymentPending from '../pages/payment/PaymentPending';

// Customer Experience / Dashboard Pages
import DashboardHome from '../pages/dashboard/DashboardHome';
import Learning from '../pages/dashboard/Learning';
import LessonViewer from '../pages/dashboard/LessonViewer';
import ExercisePlayer from '../pages/dashboard/ExercisePlayer';
import MockExams from '../pages/dashboard/MockExams';
import Exercises from '../pages/dashboard/Exercises';
import Progress from '../pages/dashboard/Progress';
import Profile from '../pages/dashboard/Profile';

// Admin Pages
import AdminLogin from '../pages/admin/AdminLogin';
import AdminDashboard from '../pages/admin/AdminDashboard';
import AdminUsers from '../pages/admin/AdminUsers';
import AdminPayments from '../pages/admin/AdminPayments';
import AdminSubscriptions from '../pages/admin/AdminSubscriptions';
import AdminLearning from '../pages/admin/AdminLearning';
import AdminExercises from '../pages/admin/AdminExercises';
import AdminExerciseDetails from '../pages/admin/AdminExerciseDetails';
import AdminExerciseImport from '../pages/admin/AdminExerciseImport';
import AdminExerciseReview from '../pages/admin/AdminExerciseReview';
import AdminProfile from '../pages/admin/AdminProfile';

export default function AppRoutes() {
  return (
    <Routes>
      {/* Core Dedicated Public Pages */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="services" element={<Services />} />
        <Route path="about" element={<About />} />
        <Route path="help" element={<Help />} />

        {/* Customer Auth Pages */}
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />

        {/* 404 Catch-All for Public site */}
        <Route path="*" element={<NotFound />} />
      </Route>

      {/* Customer Payment Flow (requires logged-in customer) */}
      <Route
        path="/payment"
        element={
          <ProtectedRoute>
            <Payment />
          </ProtectedRoute>
        }
      />
      <Route
        path="/payment/pending"
        element={
          <ProtectedRoute>
            <PaymentPending />
          </ProtectedRoute>
        }
      />

      {/* Authenticated Customer Experience (requires active subscription or valid access) */}
      <Route
        element={
          <SubscriptionGuard>
            <DashboardLayout />
          </SubscriptionGuard>
        }
      >
        <Route path="/dashboard" element={<DashboardHome />} />
        <Route path="/learning" element={<Learning />} />
        <Route path="/learning/:lessonId" element={<LessonViewer />} />
        <Route path="/learning/:lessonId/exercise" element={<ExercisePlayer />} />
        <Route path="/mock-exams" element={<MockExams />} />
        <Route path="/exercises" element={<Exercises />} />
        <Route path="/progress" element={<Progress />} />
        <Route path="/profile" element={<Profile />} />
      </Route>

      {/* Admin Portal Authentication */}
      <Route path="/admin/login" element={<AdminLogin />} />

      {/* Protected Admin Experience */}
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="payments" element={<AdminPayments />} />
        <Route path="subscriptions" element={<AdminSubscriptions />} />
        <Route path="learning" element={<AdminLearning />} />
        <Route path="exercises" element={<AdminExercises />} />
        <Route path="exercises/:id" element={<AdminExerciseDetails />} />
        <Route path="exercises/:id/import" element={<AdminExerciseImport />} />
        <Route path="exercises/:id/review" element={<AdminExerciseReview />} />
        <Route path="profile" element={<AdminProfile />} />
      </Route>
    </Routes>
  );
}
