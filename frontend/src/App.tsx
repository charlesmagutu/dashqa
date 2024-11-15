import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from './components/ui/AppLayout';

// Lazy load components
const DashboardOverview = lazy(() => import('./components/ui/overview'));
const AutomationDashboard = lazy(() => import('./components/ui/automation'));
const ApplicationList = lazy(() => import('./components/ui/application'));
const ApplicationDetails = lazy(() => import('./components/ui/application'));
const APIMonitoringDashboard = lazy(() => import('./components/ui/monitoring'));
const PerformanceMetrics = lazy(() => import('./components/ui/performance'));
const QASettings = lazy(() => import('./components/ui/settings'));

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading...</div>}>
        <Routes>
          <Route path="/" element={<AppLayout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<DashboardOverview />} />
            <Route path="automation">
              <Route index element={<AutomationDashboard />} />
              <Route path="systems" element={<ApplicationList />} />
              <Route path="systems/runs/:id" element={<AutomationDashboard />} />
              <Route path="apis" element={<APIMonitoringDashboard />} />
            </Route>
            <Route path="performance" element={<PerformanceMetrics />} />
            <Route path="settings" element={<QASettings />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default App;