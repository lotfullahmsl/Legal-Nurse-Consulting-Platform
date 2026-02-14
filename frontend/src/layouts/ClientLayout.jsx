import DashboardSwitcher from '../shared/components/DashboardSwitcher';

const ClientLayout = ({ children }) => {
    return (
        <div className="bg-[#f6f7f8] dark:bg-[#14181e] min-h-screen">
            {children}
            <DashboardSwitcher />
        </div>
    );
};

export default ClientLayout;
