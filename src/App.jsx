import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './components/common/Toast';
import ErrorBoundary from './components/common/ErrorBoundary';
import ProtectedRoute from './components/common/ProtectedRoute';
import BackToTop from './components/common/BackToTop';
import Layout from './components/layout/Layout';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Unauthorized from './pages/auth/Unauthorized';
import NotFound from './pages/notfound/NotFound';

// Main Pages
import Dashboard from './pages/dashboard/Dashboard';
import MarksPage from './pages/marks/MarksPage';
import CoursesPage from './pages/courses/CoursesPage';
import FeesPage from './pages/fees/FeesPage';
import StudentsPage from './pages/students/StudentsPage';
import UsersPage from './pages/users/UsersPage';
import ProfilePage from './pages/profile/ProfilePage';
import SettingsPage from './pages/settings/SettingsPage';
import ReportsPage from './pages/reports/ReportsPage';
import SchedulePage from './pages/schedule/SchedulePage';
import AttendancePage from './pages/attendance/AttendancePage';

import './App.css';
import './index.css';

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <ThemeProvider>
          <AuthProvider>
            <ToastProvider>
              <Routes>
                {/* Public Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/unauthorized" element={<Unauthorized />} />

                {/* Protected Routes */}
                <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
                  {/* All Roles */}
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/settings" element={<SettingsPage />} />

                  {/* Admin Only */}
                  <Route path="/users" element={
                    <ProtectedRoute allowedRoles={['ADMIN']}>
                      <UsersPage />
                    </ProtectedRoute>
                  } />

                  {/* Admin & Faculty */}
                  <Route path="/students" element={
                    <ProtectedRoute allowedRoles={['ADMIN', 'FACULTY']}>
                      <StudentsPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/courses" element={
                    <ProtectedRoute allowedRoles={['ADMIN', 'FACULTY']}>
                      <CoursesPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/reports" element={
                    <ProtectedRoute allowedRoles={['ADMIN', 'FACULTY']}>
                      <ReportsPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/attendance" element={
                    <ProtectedRoute allowedRoles={['ADMIN', 'FACULTY']}>
                      <AttendancePage />
                    </ProtectedRoute>
                  } />

                  {/* Student & Faculty specific */}
                  <Route path="/my-courses" element={<CoursesPage />} />
                  <Route path="/marks" element={<MarksPage />} />
                  <Route path="/my-marks" element={<MarksPage />} />
                  <Route path="/fees" element={<FeesPage />} />
                  <Route path="/my-fees" element={<FeesPage />} />
                  <Route path="/schedule" element={<SchedulePage />} />
                  <Route path="/my-attendance" element={<AttendancePage />} />

                  {/* Parent */}
                  <Route path="/student-performance" element={<MarksPage />} />
                  <Route path="/fee-status" element={<FeesPage />} />
                </Route>

                {/* Default & 404 */}
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
              <BackToTop />
            </ToastProvider>
          </AuthProvider>
        </ThemeProvider>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
