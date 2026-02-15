import { useState } from 'react';
import ClientNavbar from '../shared/components/ClientNavbar';
import ClientSidebar from '../shared/components/ClientSidebar';
import DashboardSwitcher from '../shared/components/DashboardSwitcher';

const ClientLayout = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="flex bg-[#f6f7f8] dark:bg-[#14181e] min-h-screen">
            <ClientSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
            <div className="flex-1">
                <ClientNavbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
                <main className="pt-16 p-4 md:p-8 md:ml-64">
                    {children}
                </main>
            </div>
            <DashboardSwitcher />
        </div>
    );
};

export default ClientLayout;
