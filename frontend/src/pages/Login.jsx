import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [role, setRole] = useState('admin');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Import auth service
            const authService = (await import('../services/auth.service')).default;

            // Call login API
            const response = await authService.login({
                email,
                password
            });

            if (response.success) {
                const user = response.data.user;

                // Show success alert
                alert(`✅ Login successful! Welcome back, ${user.fullName}!`);

                // Redirect based on user role from backend
                if (user.role === 'admin' || user.role === 'attorney') {
                    navigate('/dashboard');
                } else if (user.role === 'consultant') {
                    navigate('/staff-dashboard');
                } else if (user.role === 'client') {
                    navigate('/client/dashboard');
                }
            }
        } catch (error) {
            console.error('Login error:', error);
            alert(error.response?.data?.message || 'Login failed. Please check your credentials.');
            setLoading(false);
        }
    };

    return (
        <main className="w-full min-h-screen flex flex-col md:flex-row">
            {/* Left Side: Branding & Visuals */}
            <section className="hidden md:flex md:w-1/2 lg:w-3/5 relative flex-col justify-between p-12 text-white"
                style={{
                    backgroundColor: '#0f172a',
                    backgroundImage: 'radial-gradient(at 0% 0%, rgba(43, 108, 238, 0.15) 0px, transparent 50%), radial-gradient(at 100% 100%, rgba(43, 108, 238, 0.1) 0px, transparent 50%)'
                }}>
                <div className="z-10">
                    <div className="flex items-center gap-3">
                        <div className="bg-[#2b6cee] p-2 rounded-lg">
                            <span className="material-icons-outlined text-3xl">balance</span>
                        </div>
                        <span className="text-2xl font-bold tracking-tight">
                            MedLegal <span className="text-[#2b6cee]">Pro</span>
                        </span>
                    </div>
                </div>

                <div className="z-10 flex flex-col items-center text-center max-w-md mx-auto">
                    <div className="relative mb-8">
                        <div className="w-64 h-64 bg-[#2b6cee]/10 rounded-full flex items-center justify-center relative">
                            <div className="absolute inset-0 border-2 border-[#2b6cee]/20 rounded-full animate-pulse"></div>
                            <span className="material-icons-outlined text-[120px] text-[#2b6cee] opacity-80">health_and_safety</span>
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
                                <span className="material-icons-outlined text-[80px] text-white">balance</span>
                            </div>
                        </div>
                    </div>
                    <h1 className="text-4xl font-bold mb-4">Bridging Medical Expertise with Legal Strategy</h1>
                    <p className="text-slate-400 text-lg">Secure, HIPAA-compliant consulting for the nation's leading attorneys and medical experts.</p>
                </div>

                <div className="z-10 flex items-center justify-between border-t border-white/10 pt-8">
                    <div className="flex items-center gap-2">
                        <span className="material-icons-outlined text-[#2b6cee]">verified_user</span>
                        <span className="text-sm font-medium text-slate-300 uppercase tracking-widest">HIPAA Compliant</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="material-icons-outlined text-[#2b6cee]">lock</span>
                        <span className="text-sm font-medium text-slate-300 uppercase tracking-widest">AES-256 Encrypted</span>
                    </div>
                </div>

                <div className="absolute inset-0 opacity-20 overflow-hidden pointer-events-none">
                    <img
                        alt="Abstract medical and legal textures"
                        className="w-full h-full object-cover"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuBm37arFPOQEMUZmyJA0yHSS9d-lovilgrt0jeZ271engOpDEMQyNwE4_SC4eSaZE7-q-8gQC_1XI97XN5xlF8Dkgz-wlB6PtKPxK1ZW9EPY9oLR0tNdn_7i7frUPpw43KkZ-G21FtYx0kLY39zdaewL_vmz2mEQz1CkKLbnKELAzY8i2fbkrc-uAKCBdCtsauCDpJ0qlG5g1T1y0SHyKzL1MWm7vz-bBe6EN1wADPbe7agDpJ5R7b4ah2Ee6Ol5AVHZXQczQZWGrw"
                    />
                </div>
            </section>

            {/* Right Side: Login Form */}
            <section className="w-full md:w-1/2 lg:w-2/5 bg-white dark:bg-[#101622] flex flex-col justify-center px-8 md:px-16 lg:px-24 py-12">
                <div className="mb-10 text-center md:text-left">
                    <div className="md:hidden flex justify-center mb-8">
                        <div className="flex items-center gap-2">
                            <div className="bg-[#2b6cee] p-2 rounded-lg">
                                <span className="material-icons-outlined text-2xl text-white">balance</span>
                            </div>
                            <span className="text-xl font-bold dark:text-white">
                                MedLegal <span className="text-[#2b6cee]">Pro</span>
                            </span>
                        </div>
                    </div>
                    <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Welcome Back</h2>
                    <p className="text-slate-500 dark:text-slate-400">Please enter your credentials to access the secure portal.</p>
                </div>

                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2" htmlFor="email">
                            Email Address
                        </label>
                        <div className="relative">
                            <span className="material-icons-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">mail</span>
                            <input
                                className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-[#2b6cee] focus:border-transparent outline-none transition-all dark:text-white"
                                id="email"
                                placeholder="attorney@firm.com"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300" htmlFor="password">
                                Password
                            </label>
                            <a className="text-xs font-semibold text-[#2b6cee] hover:underline" href="#">
                                Forgot Password?
                            </a>
                        </div>
                        <div className="relative">
                            <span className="material-icons-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">lock</span>
                            <input
                                className="w-full pl-10 pr-10 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-[#2b6cee] focus:border-transparent outline-none transition-all dark:text-white"
                                id="password"
                                placeholder="••••••••"
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <button
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                <span className="material-icons-outlined text-xl">
                                    {showPassword ? 'visibility' : 'visibility_off'}
                                </span>
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center">
                        <input
                            className="w-4 h-4 text-[#2b6cee] bg-slate-100 border-slate-300 rounded focus:ring-[#2b6cee]"
                            id="remember"
                            type="checkbox"
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                        />
                        <label className="ml-2 text-sm text-slate-600 dark:text-slate-400" htmlFor="remember">
                            Remember this device for 30 days
                        </label>
                    </div>

                    {/* Role Selection for Demo */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2" htmlFor="role">
                            Login As (Demo Mode)
                        </label>
                        <select
                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-[#2b6cee] focus:border-transparent outline-none transition-all dark:text-white"
                            id="role"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                        >
                            <option value="admin">Admin/Attorney Dashboard</option>
                            <option value="staff">Staff Dashboard</option>
                            <option value="client">Client Portal</option>
                        </select>
                    </div>
                    <button
                        className="w-full bg-[#2b6cee] hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold py-3.5 rounded-lg transition-colors shadow-lg shadow-[#2b6cee]/25 flex items-center justify-center gap-2"
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <span className="material-icons-outlined text-xl animate-spin">refresh</span>
                                Signing In...
                            </>
                        ) : (
                            <>
                                <span className="material-icons-outlined text-xl">login</span>
                                Sign In to Portal
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-800">
                    <div className="text-center">
                        <p className="text-slate-500 dark:text-slate-400 text-sm mb-4">
                            Don't have an account?
                        </p>
                        <button
                            onClick={() => navigate('/register')}
                            className="inline-flex items-center gap-2 px-6 py-2 border-2 border-[#2b6cee]/20 hover:border-[#2b6cee] text-[#2b6cee] font-semibold rounded-full transition-all group"
                        >
                            Create Account
                            <span className="material-icons-outlined text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
                        </button>
                    </div>
                </div>
                <footer className="mt-auto pt-10 text-center">
                    <p className="text-xs text-slate-400 dark:text-slate-500 mb-2">
                        © 2024 MedLegal Pro Platform. All Rights Reserved.
                    </p>
                    <div className="flex justify-center gap-4 text-xs font-medium text-slate-500 dark:text-slate-400">
                        <a className="hover:text-[#2b6cee]" href="/terms">Terms of Service</a>
                        <span>•</span>
                        <a className="hover:text-[#2b6cee]" href="/privacy">Privacy Policy</a>
                        <span>•</span>
                        <a className="hover:text-[#2b6cee]" href="/security">Security</a>
                    </div>
                </footer>
            </section>
        </main>
    );
};

export default Login;
