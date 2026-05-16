import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import ProtectedRoute from './router/ProtectedRoute';
import Sidebar from './components/Sidebar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Resume from './pages/Resume';
import Jobs from './pages/Jobs';
import Analysis from './pages/Analysis';

const queryClient = new QueryClient();

const Layout = ({ children }: { children: React.ReactNode }) => (
  <div className="flex h-screen bg-gray-100">
    <Sidebar />
    <main className="flex-1 overflow-y-auto p-6">{children}</main>
  </div>
);

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="/dashboard" element={
            <ProtectedRoute><Layout><Dashboard /></Layout></ProtectedRoute>
          }/>
          <Route path="/resume" element={
            <ProtectedRoute><Layout><Resume /></Layout></ProtectedRoute>
          }/>
          <Route path="/jobs" element={
            <ProtectedRoute><Layout><Jobs /></Layout></ProtectedRoute>
          }/>
          <Route path="/analysis/:jobId" element={
            <ProtectedRoute><Layout><Analysis /></Layout></ProtectedRoute>
          }/>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}