import { useLocation } from 'react-router-dom';

const Navbar = () => {
    const location = useLocation();

    return (
        <header className="fixed top-0 left-0 right-0 h-16 bg-[#1f3b61] text-white flex items-center justify-between px-6 z-50">
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                    <span className="material-icons text-[#0891b2]">gavel</span>
                    <span className="font-bold text-xl tracking-tight uppercase">
                        LegalNurse<span className="text-[#0891b2]">Portal</span>
                    </span>
                </div>
                <div className="ml-8 hidden md:flex items-center bg-white/10 rounded-lg px-3 py-1.5 w-80">
                    <span className="material-icons text-white/60 text-sm">search</span>
                    <input
                        className="bg-transparent border-none focus:ring-0 text-sm w-full placeholder-white/60 text-white"
                        placeholder="Search cases, medical records..."
                        type="text"
                    />
                </div>
            </div>
            <div className="flex items-center gap-6">
                <div className="flex items-center gap-1.5 bg-green-500/20 px-3 py-1 rounded-full border border-green-500/30">
                    <span className="material-icons text-green-400 text-xs">shield</span>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-green-400">
                        HIPAA Compliant Session
                    </span>
                </div>
                <div className="relative cursor-pointer">
                    <span className="material-icons text-white/80 hover:text-white">notifications</span>
                    <span className="absolute -top-1 -right-1 bg-red-500 text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                        3
                    </span>
                </div>
                <div className="flex items-center gap-3 pl-4 border-l border-white/20">
                    <div className="text-right hidden sm:block">
                        <p className="text-xs font-medium">Sarah Jenkins, RN</p>
                        <p className="text-[10px] text-white/60">Admin/Lead Consultant</p>
                    </div>
                    <img
                        alt="Profile"
                        className="w-10 h-10 rounded-full object-cover border-2 border-[#0891b2]/30 cursor-pointer"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuAqQ3LU6AbhnGP5x2FNqf8gYQioAErp1QnHIf7YRBv6ulMh3nL3Q2DpXk8CznObXWR_uvfCxBtLoJviCDiUL13Cp3pxj58t8qymzCrP8k4Zyh9KQyIm57qJYaXL3bC_l2Y1hjLDTOfUvSao14RdxFoVc4bJX4qLrmD7LpYXqikamHEhSJgbGfPmCopGPYEExxecXp8CJk9csi64GVq9Gm-F0anV8U1Tv7FaDQfjpKczNp1wR09--3XwAVPZ2EigXatUnUJCHuSpeWc"
                    />
                </div>
            </div>
        </header>
    );
};

export default Navbar;
