import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from './components/ui/AppLayout';
import Login from './pages/login';

// Lazy load components
const DashboardOverview = lazy(() => import('./pages/overview'));
const AutomationDashboard = lazy(() => import('./pages/automation'));
const ApplicationList = lazy(() => import('./pages/application'));
const APIList = lazy(() => import('./pages/api'));
const TestRun = lazy(()=> import('./pages/testrun'));
const APIMonitoringDashboard = lazy(() => import('./pages/monitoring'));
const DeviceManager  = lazy(() => import('./pages/devicemanagement'))
const DeviceList = lazy(()=> import('./pages/device'))
const PerformanceMetrics = lazy(() => import('./pages/performance'));
const QASettings = lazy(() => import('./components/ui/settings'));
import { ThemeProvider } from "@/components/theme-provider";
import { ModeToggle } from './components/mode-toggle';
import { GenericProvider } from './GenericContex';

const App: React.FC = () => {

  const isLoggedIn = false;//Boolean(localStorage.getItem('authToken'));
  
  return (
    <GenericProvider>
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <ModeToggle />
      <BrowserRouter>
        <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading...</div>}>
          <Routes>
            <Route path="login" element={isLoggedIn ? <Navigate to="/dashboard" replace /> : <Login />} />
            <Route path="/" element={<AppLayout />}>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<DashboardOverview />} />
              <Route path='devices'>
                <Route index element={<DeviceList/>}/>
                <Route path='/devices/manage' element={<DeviceManager/>}/>
              </Route>
              <Route path='devices' element={<DeviceList/>}/>
              <Route path="automation">
                <Route index element={<ApplicationList />} />
                <Route path="systems" element={<ApplicationList />} />
                <Route path="systems/runs/" element={<TestRun />} />
                <Route path="systems/runs/results" element={<AutomationDashboard />} />
                <Route path="apis" element={<APIList />} />
              </Route>
              <Route path="performance" element={<PerformanceMetrics />} />
              <Route path="settings" element={<QASettings />} />
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
    </ThemeProvider>
    </GenericProvider>
  );
};

export default App;
