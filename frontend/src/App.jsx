import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import CasesList from './modules/crm-case-intake/pages/CasesList';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Settings from './pages/Settings';

// Layouts
import AdminLayout from './layouts/AdminLayout';

function App() {
    return (
        <Router>
            <Routes>
                {/* Public Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/client-login" element={<Login />} />

                {/* Admin/Attorney Routes */}
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={<AdminLayout><Dashboard /></AdminLayout>} />
                <Route path="/cases" element={<AdminLayout><CasesList /></AdminLayout>} />
                <Route path="/cases/:id" element={<AdminLayout><CaseDetail /></AdminLayout>} />
                <Route path="/cases/new" element={<AdminLayout><CreateCase /></AdminLayout>} />
                <Route path="/clients" element={<AdminLayout><ClientsList /></AdminLayout>} />
                <Route path="/law-firms" element={<AdminLayout><LawFirmsList /></AdminLayout>} />
                <Route path="/search" element={<AdminLayout><SearchPage /></AdminLayout>} />
                <Route path="/settings" element={<AdminLayout><Settings /></AdminLayout>} />

                {/* Add more routes as components are created */}
            </Routes>
        </Router>
    );
}

export default App;

