import ClientNavbar from '../shared/components/ClientNavbar';
import ClientSidebar from '../shared/components/ClientSidebar';
import DashboardSwitcher from '../shared/components/DashboardSwitcher';

const ClientLayout = ({ children }) => {
    return (
        <div className="flex bg-[#f6f7f8] dark:bg-[#14181e] min-h-screen">
            <ClientSidebar />
            <div className="flex-1">
                <ClientNavbar />
                <main className="pt-16 p-8">
                    {children}
                </main>
            </div>
            <DashboardSwitcher />
        </div>
    );
};

export default ClientLayout;
