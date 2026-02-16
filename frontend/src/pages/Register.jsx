import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Register = () => {
    const navigate = useNavigate();
    const [selectedRole, setSelectedRole] = useState('attorney');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        password: '',
        agreeToTerms: false
    });

    const roles = [
        { id: 'attorney', icon: 'balance', label: 'Attorney' },
        { id: 'consultant', icon: 'health_and_safety', label: 'Consultant' },
        { id: 'client', icon: 'business', label: 'Client' }
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.agreeToTerms) {
            alert('Please agree to the Terms of Service and HIPAA Compliance Policy');
            return;
        }

        setLoading(true);

        try {
            // Import auth service
            const authService = (await import('../services/auth.service')).default;

            // Prepare data for API
            const registrationData = {
                fullName: formData.fullName,
                email: formData.email,
                phone: formData.phone,
                password: formData.password,
                role: selectedRole
            };

            console.log('Attempting registration with:', registrationData);

            // Call register API
            const response = await authService.register(registrationData);

            console.log('Registration response:', response);

            if (response.success) {
                // Show success alert
                alert(`✅ Registration successful! Welcome, ${response.data.user.fullName}!`);

                // Redirect based on role
                if (selectedRole === 'attorney' || selectedRole === 'admin') {
                    navigate('/dashboard');
                } else if (selectedRole === 'consultant') {
                    navigate('/staff-dashboard');
                } else {
                    navigate('/client/dashboard');
                }
            } else {
                alert('Registration failed: ' + (response.message || 'Unknown error'));
                setLoading(false);
            }
        } catch (error) {
            console.error('Registration error:', error);
            console.error('Error response:', error.response);

            // Get detailed error message
            let errorMessage = 'Registration failed. Please try again.';

            if (error.response?.data?.errors) {
                // Validation errors array
                errorMessage = error.response.data.errors.map(err => err.msg).join(', ');
            } else if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            } else if (error.message) {
                errorMessage = error.message;
            }

            alert('❌ ' + errorMessage);
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    return (
        <div
            className="min-h-screen flex items-center justify-center p-6 relative"
            style={{
                backgroundImage: 'linear-gradient(rgba(30, 58, 95, 0.94), rgba(30, 58, 95, 0.94)), url(https://lh3.googleusercontent.com/aida-public/AB6AXuCJDXHna50ncK3LIZRFB6dyt1TBFGuidiKeMxIHUF-n0PeVNbf9xVqLX5IRZQxfU3w-xSo344wTcGXpRSS2mHM7aGB0pRUT3DummfSw3H3S80608M20A7pT9uC7nT8Muw55JfBPxJv84vpuMM9XajUa143MyNTpyiCMbrJEPTulz8LD5hOlcdGYMG2HqAAWHUBLF48jw-iwTlVdM_hzrvOIGlx7Sln9foVzEVzwXRGRcvXxzBV3uD-ilcT9RMg2Di6EWpXnkpBUr8o)',
                backgroundSize: 'cover',
                backgroundPosition: 'center'
            }}
        >
            <div className="w-full max-w-xl">
                {/* Logo / Brand Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-[#088eaf] rounded-xl mb-4 shadow-lg">
                        <span className="material-icons text-white text-3xl">gavel</span>
                        <span className="material-icons text-white text-xl -ml-2 mb-4">medical_services</span>
                    </div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">LegalMed Connect</h1>
                    <p className="text-[#088eaf]/80 font-medium mt-2">Unified Portal Registration</p>
                    <div className="mt-2 flex items-center justify-center gap-2 text-xs font-semibold text-white/60 uppercase tracking-widest">
                        <span className="material-icons text-sm">verified_user</span>
                        HIPAA-Compliant Platform
                    </div>
                </div>

                {/* Role Selection */}
                <div className="grid grid-cols-3 gap-2 mb-6 p-1 bg-[#1e3a5f]/50 rounded-xl border border-white/10">
                    {roles.map((role) => (
                        <button
                            key={role.id}
                            type="button"
                            onClick={() => setSelectedRole(role.id)}
                            className={`flex flex-col items-center gap-2 py-4 rounded-lg transition-all ${selectedRole === role.id
                                ? 'bg-[#088eaf] text-white shadow-md'
                                : 'hover:bg-white/10 text-white/70'
                                }`}
                        >
                            <span className="material-icons text-2xl">{role.icon}</span>
                            <span className="text-xs font-semibold uppercase tracking-wide">{role.label}</span>
                        </button>
                    ))}
                </div>

                {/* Registration Card */}
                <div
                    className="rounded-xl shadow-2xl overflow-hidden border border-white/20"
                    style={{
                        backdropFilter: 'blur(8px)',
                        backgroundColor: 'rgba(255, 255, 255, 0.98)'
                    }}
                >
                    <div className="p-8">
                        <div className="mb-8">
                            <h2 className="text-xl font-bold text-[#1e3a5f]">Create Your Account</h2>
                            <p className="text-slate-500 text-sm mt-1">Please provide your professional information to get started.</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Full Name */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-[#1e3a5f]/60 uppercase tracking-wider px-1">
                                    Full Name
                                </label>
                                <div className="relative">
                                    <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl">
                                        person_outline
                                    </span>
                                    <input
                                        type="text"
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleChange}
                                        className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#088eaf] focus:border-[#088eaf] transition-all text-[#1e3a5f] outline-none"
                                        placeholder="e.g. John Doe, Esq."
                                        required
                                    />
                                </div>
                            </div>

                            {/* Professional Email */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-[#1e3a5f]/60 uppercase tracking-wider px-1">
                                    Professional Email
                                </label>
                                <div className="relative">
                                    <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl">
                                        alternate_email
                                    </span>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#088eaf] focus:border-[#088eaf] transition-all text-[#1e3a5f] outline-none"
                                        placeholder="name@firm-name.com"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Grid for Phone and Password */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                {/* Phone Number */}
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-[#1e3a5f]/60 uppercase tracking-wider px-1">
                                        Phone Number
                                    </label>
                                    <div className="relative">
                                        <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl">
                                            phone_iphone
                                        </span>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#088eaf] focus:border-[#088eaf] transition-all text-[#1e3a5f] outline-none"
                                            placeholder="+1 (555) 000-0000"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Password */}
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-[#1e3a5f]/60 uppercase tracking-wider px-1">
                                        Password
                                    </label>
                                    <div className="relative">
                                        <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl">
                                            lock_outline
                                        </span>
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            className="w-full pl-11 pr-11 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#088eaf] focus:border-[#088eaf] transition-all text-[#1e3a5f] outline-none"
                                            placeholder="••••••••"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#088eaf]"
                                        >
                                            <span className="material-icons text-xl">
                                                {showPassword ? 'visibility_off' : 'visibility'}
                                            </span>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Compliance */}
                            <div className="flex items-start gap-3 p-4 bg-[#088eaf]/5 rounded-lg border border-[#088eaf]/10 mt-2">
                                <input
                                    type="checkbox"
                                    name="agreeToTerms"
                                    id="compliance"
                                    checked={formData.agreeToTerms}
                                    onChange={handleChange}
                                    className="mt-1 w-5 h-5 rounded text-[#088eaf] focus:ring-[#088eaf] bg-white border-slate-300"
                                    required
                                />
                                <label htmlFor="compliance" className="text-sm text-slate-600 leading-relaxed">
                                    I agree to the{' '}
                                    <a href="/terms" className="text-[#088eaf] font-semibold hover:underline">
                                        Terms of Service
                                    </a>{' '}
                                    and{' '}
                                    <a href="/hipaa-policy" className="text-[#088eaf] font-semibold hover:underline">
                                        HIPAA Compliance Policy
                                    </a>
                                    . I understand my data is protected by industry-standard encryption.
                                </label>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-4 bg-[#088eaf] hover:bg-[#088eaf]/90 disabled:bg-[#088eaf]/50 text-white font-bold rounded-lg shadow-lg shadow-[#088eaf]/30 transition-all flex items-center justify-center gap-2 mt-4 text-lg"
                            >
                                {loading ? (
                                    <>
                                        <span className="material-icons animate-spin">refresh</span>
                                        <span>Creating Account...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Create My Account</span>
                                        <span className="material-icons">arrow_forward</span>
                                    </>
                                )}
                            </button>
                        </form>

                        {/* Footer */}
                        <div className="mt-8 pt-6 border-t border-slate-100 text-center">
                            <p className="text-slate-500">
                                Already have an account?{' '}
                                <Link to="/login" className="text-[#088eaf] font-bold hover:underline ml-1">
                                    Sign In
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Accessibility/Help Footer */}
                <div className="flex flex-wrap justify-between items-center mt-8 px-2 text-white/50 text-xs">
                    <div className="flex gap-4">
                        <a href="/privacy" className="hover:text-white transition-colors">Privacy Center</a>
                        <a href="/security" className="hover:text-white transition-colors">Security Standards</a>
                        <a href="/support" className="hover:text-white transition-colors">Support</a>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="material-icons text-sm">lock</span>
                        256-bit AES Encryption Active
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
