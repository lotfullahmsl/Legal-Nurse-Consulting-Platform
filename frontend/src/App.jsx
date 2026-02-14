import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
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
                <Route path="/settings" element={<AdminLayout><Settings /></AdminLayout>} />

                {/* Add more routes as we create components */}
            </Routes>
        </Router>
    );
}

export default App;

