import Navbar from '../shared/components/Navbar';
import Sidebar from '../shared/components/Sidebar';

const AdminLayout = ({ children }) => {
    return (
        <div className="bg-[#f6f7f8] dark:bg-[#14181e] min-h-screen">
            <Navbar />
            <div className="flex pt-16">
                <Sidebar />
                <main className="flex-1 ml-64 p-8">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
