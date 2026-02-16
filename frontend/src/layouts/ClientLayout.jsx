import { useState } from 'react';
import ClientNavbar from '../shared/components/ClientNavbar';
import ClientSidebar from '../shared/components/ClientSidebar';
import DashboardSwitcher from '../shared/components/DashboardSwitcher';

const ClientLayout = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="bg-[#f6f7f8] dark:bg-[#14181e] min-h-screen">
            <ClientNavbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
            <div className="flex pt-16">
                <ClientSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
                <main className="flex-1 md:ml-64 p-4 md:p-8">
                    {children}
                </main>
            </div>
            <DashboardSwitcher />
        </div>
    );
};

export default ClientLayout;
