import DashboardSwitcher from '../shared/components/DashboardSwitcher';
import Navbar from '../shared/components/Navbar';
import StaffSidebar from '../shared/components/StaffSidebar';

const StaffLayout = ({ children }) => {
    return (
        <div className="bg-[#f6f7f8] dark:bg-[#14181e] min-h-screen">
            <Navbar />
            <div className="flex pt-16">
                <StaffSidebar />
                <main className="flex-1 ml-64 p-8">
                    {children}
                </main>
            </div>
            <DashboardSwitcher />
        </div>
    );
};

export default StaffLayout;
