import { useState } from 'react';

const SearchPage = () => {
    const [searchTerm, setSearchTerm] = useState('atrial fibrillation');
    const [searchMode, setSearchMode] = useState('exact');
    const [selectedResult, setSelectedResult] = useState(0);

    const searchResults = [
        {
            id: 1,
            file: 'EMR_DISCHARGE_SUMMARY_V2.pdf',
            title: 'Discharge Summary - Page 14',
            match: 98,
            date: 'Oct 12, 2023',
            excerpt: '...patient presented with acute onset of atrial fibrillation with rapid ventricular response. History of hypertension and chronic renal insufficiency...',
            active: true
        },
        {
            id: 2,
            file: 'CARDIOLOGY_CONSULT.pdf',
            title: 'Cardiology Notes - Page 3',
            match: 82,
            date: 'Oct 14, 2023',
            excerpt: '...recommend rate control for paroxysmal atrial fibrillation via Metoprolol. Monitoring required for subsequent stroke risk assessment...',
            active: false
        },
        {
            id: 3,
            file: 'LAB_RESULTS_QUARTERLY.pdf',
            title: 'Lab Results - Page 42',
            match: 75,
            date: 'Sep 30, 2023',
            excerpt: '...INR levels monitored weekly due to anticoagulation therapy for atrial fibrillation. Recent labs show therapeutic range of 2.4...',
            active: false
        },
        {
            id: 4,
            file: 'HOSPITAL_ADMISSION_001.pdf',
            title: 'Admission Record - Page 1',
            match: 64,
            date: 'Oct 12, 2023',
            excerpt: '...Prior medical history includes permanent atrial fibrillation, pacemaker insertion (2019), and GERD...',
            active: false
        },
        {
            id: 5,
            file: 'MISC_NURSING_NOTES.pdf',
            title: 'Nursing Notes - Page 8',
            match: 42,
            date: 'Oct 13, 2023',
            excerpt: '...complaining of heart racing, potential episode of atrial fib. Physician notified...',
            active: false
        }
    ];

    return (
        <div className="flex flex-col h-screen -m-8">
            {/* Header */}
            <header className="bg-[#1f3b61] text-white px-6 py-3 flex items-center justify-between shadow-md z-30">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <span className="material-icons text-white">shield</span>
                        <span className="font-bold text-lg tracking-tight">MED-SEARCH PRO</span>
                    </div>
                    <div className="h-6 w-px bg-white/20 mx-2"></div>
                    <div className="text-sm font-medium text-white/80">
                        Case: <span className="text-white">Doe v. General Hospital (2024-8842)</span>
                    </div>
                </div>
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2 text-xs bg-white/10 px-3 py-1.5 rounded-full border border-white/20">
                        <span className="material-icons text-[14px] text-green-400">lock</span>
                        <span>HIPAA COMPLIANT SESSION</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="text-right">
                            <p className="text-xs font-semibold">Sarah Jenkins, RN</p>
                            <p className="text-[10px] text-white/70">Legal Nurse Consultant</p>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center border border-white/40">
                            <span className="material-icons text-sm">person</span>
                        </div>
                    </div>
                </div>
            </header>

            {/* Top Search Bar */}
            <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-4 shadow-sm z-20">
                <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-4 items-center">
                    <div className="relative flex-1 w-full">
                        <span className="material-icons absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">search</span>
                        <input
                            type="text"
                            className="w-full pl-12 pr-32 py-3 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-[#1f3b61] focus:border-[#1f3b61] transition-all text-sm"
                            placeholder="Search medical records (e.g., 'atrial fibrillation', 'warfarin dosage')..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-2">
                            <button
                                onClick={() => setSearchMode('fuzzy')}
                                className={`px-2 py-1 text-[10px] font-bold rounded ${searchMode === 'fuzzy'
                                    ? 'bg-[#1f3b61] text-white'
                                    : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                                    }`}
                            >
                                FUZZY
                            </button>
                            <button
                                onClick={() => setSearchMode('exact')}
                                className={`px-2 py-1 text-[10px] font-bold rounded ${searchMode === 'exact'
                                    ? 'bg-[#1f3b61] text-white'
                                    : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                                    }`}
                            >
                                EXACT
                            </button>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 w-full lg:w-auto">
                        <button className="flex items-center gap-2 px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                            <span className="material-icons text-sm">filter_list</span>
                            Filters
                        </button>
                        <button className="bg-[#1f3b61] hover:bg-[#1f3b61]/90 text-white px-8 py-3 rounded-xl font-semibold text-sm transition-all flex items-center gap-2 shadow-lg shadow-[#1f3b61]/20">
                            Run Intelligent Search
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <main className="flex-1 flex overflow-hidden">
                {/* Results Sidebar */}
                <aside className="w-1/3 min-w-[400px] max-w-[500px] border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col">
                    <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
                        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">24 Matches Found</h2>
                        <div className="flex gap-2">
                            <select className="text-xs bg-transparent border-none focus:ring-0 cursor-pointer font-medium text-[#1f3b61]">
                                <option>Sort by Relevance</option>
                                <option>Sort by Date</option>
                                <option>Sort by Page</option>
                            </select>
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        {searchResults.map((result) => (
                            <div
                                key={result.id}
                                onClick={() => setSelectedResult(result.id)}
                                className={`p-4 border-b border-slate-100 dark:border-slate-800 cursor-pointer transition-colors ${result.active
                                        ? 'bg-[#1f3b61]/5 dark:bg-[#1f3b61]/10 border-l-4 border-l-[#1f3b61]'
                                        : 'hover:bg-slate-50 dark:hover:bg-slate-800'
                                    }`}
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${result.active
                                                ? 'text-[#1f3b61] bg-[#1f3b61]/10'
                                                : 'text-slate-500 bg-slate-100 dark:bg-slate-800'
                                            }`}>
                                            {result.file}
                                        </span>
                                        <h3 className="font-semibold text-sm mt-1">{result.title}</h3>
                                    </div>
                                    <div className="text-right">
                                        <span className={`text-xs font-bold ${result.match >= 80 ? 'text-green-600 dark:text-green-400' : 'text-slate-600 dark:text-slate-400'
                                            }`}>
                                            {result.match}% Match
                                        </span>
                                        <p className="text-[10px] text-slate-400">{result.date}</p>
                                    </div>
                                </div>
                                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed italic">
                                    {result.excerpt.split('atrial fibrillation').map((part, i, arr) => (
                                        <span key={i}>
                                            {part}
                                            {i < arr.length - 1 && (
                                                <span className="bg-yellow-200 px-0.5 rounded font-semibold text-slate-900">
                                                    atrial fibrillation
                                                </span>
                                            )}
                                        </span>
                                    ))}
                                </p>
                            </div>
                        ))}
                    </div>
                </aside>

                {/* Document Preview Pane */}
                <section className="flex-1 bg-slate-200 dark:bg-slate-950 flex flex-col relative overflow-hidden">
                    {/* Document Toolbar */}
                    <div className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-4 py-2 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 z-10">
                        <button className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded">
                            <span className="material-icons text-lg">zoom_out</span>
                        </button>
                        <span className="text-xs font-bold px-2">100%</span>
                        <button className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded">
                            <span className="material-icons text-lg">zoom_in</span>
                        </button>
                        <div className="w-px h-4 bg-slate-300 dark:bg-slate-700 mx-2"></div>
                        <button className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded">
                            <span className="material-icons text-lg">chevron_left</span>
                        </button>
                        <span className="text-xs font-bold px-1 whitespace-nowrap">Page 14 / 82</span>
                        <button className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded">
                            <span className="material-icons text-lg">chevron_right</span>
                        </button>
                        <div className="w-px h-4 bg-slate-300 dark:bg-slate-700 mx-2"></div>
                        <button className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded">
                            <span className="material-icons text-lg">print</span>
                        </button>
                        <button className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded">
                            <span className="material-icons text-lg">download</span>
                        </button>
                        <div className="w-px h-4 bg-slate-300 dark:bg-slate-700 mx-2"></div>
                        <button className="bg-[#1f3b61] text-white text-[10px] font-bold px-3 py-1.5 rounded-lg flex items-center gap-1">
                            <span className="material-icons text-xs">add_comment</span>
                            ANNOTATE
                        </button>
                    </div>

                    {/* PDF Simulator Container */}
                    <div className="flex-1 overflow-auto flex justify-center p-8 pt-20">
                        <div className="bg-white dark:bg-slate-100 w-full max-w-[850px] shadow-2xl min-h-[1100px] p-12 relative text-slate-800">
                            {/* Page Header */}
                            <div className="flex justify-between items-start mb-12 border-b-2 border-slate-900 pb-4">
                                <div>
                                    <h1 className="text-2xl font-bold uppercase tracking-tighter">Memorial Health System</h1>
                                    <p className="text-xs font-medium uppercase">1200 Medical Center Drive, Metropolis, ST 12345</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-bold">RECORD #662-901</p>
                                    <p className="text-xs">DOE, JOHN (MRN: 1120448)</p>
                                </div>
                            </div>

                            {/* Medical Content */}
                            <div className="space-y-6">
                                <div className="flex border-b border-slate-200 pb-2">
                                    <div className="w-40 text-[10px] font-bold uppercase text-slate-500">Service Date</div>
                                    <div className="text-sm font-medium">October 12, 2023 - 14:32 EST</div>
                                </div>
                                <div className="flex border-b border-slate-200 pb-2">
                                    <div className="w-40 text-[10px] font-bold uppercase text-slate-500">Provider</div>
                                    <div className="text-sm font-medium">Elena Rodriguez, MD (Cardiology)</div>
                                </div>
                                <div className="pt-4">
                                    <h2 className="text-sm font-bold uppercase mb-3 bg-slate-100 px-2 py-1 inline-block">Chief Complaint</h2>
                                    <p className="text-sm leading-relaxed mb-6">
                                        Patient is a 68-year-old male who presented to the Emergency Department via EMS after experiencing sudden onset palpations and dizziness while at rest. Patient describes feeling "a thumping in my chest" accompanied by mild shortness of breath.
                                    </p>
                                    <h2 className="text-sm font-bold uppercase mb-3 bg-slate-100 px-2 py-1 inline-block">Assessment & Plan</h2>
                                    <p className="text-sm leading-relaxed mb-4">
                                        1. <span className="bg-yellow-200 ring-2 ring-yellow-400 font-bold px-1 rounded">Atrial Fibrillation</span> with Rapid Ventricular Response (RVR). Initial EKG confirms rhythm with heart rate fluctuating between 145-160 bpm.
                                    </p>
                                    <p className="text-sm leading-relaxed mb-4">
                                        2. Hemodynamic Stability: Patient is currently normotensive. Will proceed with pharmacological rate control rather than immediate cardioversion at this stage.
                                    </p>
                                    <p className="text-sm leading-relaxed mb-4">
                                        3. Anticoagulation: Given CHADS2VASC score of 4, initiate Heparin drip per hospital protocol pending transition to oral anticoagulants.
                                    </p>
                                    <div className="mt-8 border-2 border-slate-900 p-4 relative overflow-hidden">
                                        <span className="absolute top-0 right-0 bg-slate-900 text-white text-[10px] font-bold px-2 py-0.5">
                                            DOC_INTELLIGENCE_LAYER
                                        </span>
                                        <h3 className="text-xs font-bold mb-2 text-slate-500">OCR DATA OVERLAY:</h3>
                                        <p className="text-xs text-slate-400 font-mono italic">
                                            [OCR_SCAN_CONFIDENCE: 99.8%] [ENTITY_EXTRACTED: CONDITION_AFIB] [MAPPED_ICD10: I48.0]
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Page Footer */}
                            <div className="mt-20 flex justify-between items-center text-[10px] text-slate-400 border-t border-slate-100 pt-4">
                                <span>CONFIDENTIAL - FOR LEGAL REVIEW ONLY</span>
                                <span>DOE_DISCHARGE_023.PDF - Page 14 of 82</span>
                            </div>
                        </div>
                    </div>

                    {/* Floating Jump Controls */}
                    <div className="absolute bottom-6 right-6 flex flex-col gap-2">
                        <button className="w-12 h-12 bg-white dark:bg-slate-800 rounded-full shadow-xl flex items-center justify-center text-[#1f3b61] border border-slate-200 dark:border-slate-700 hover:scale-105 transition-transform">
                            <span className="material-icons">arrow_upward</span>
                        </button>
                        <div className="bg-[#1f3b61] text-white text-[10px] font-bold px-2 py-1 rounded-md text-center">4 / 24</div>
                        <button className="w-12 h-12 bg-[#1f3b61] text-white rounded-full shadow-xl flex items-center justify-center hover:scale-105 transition-transform">
                            <span className="material-icons">arrow_downward</span>
                        </button>
                    </div>
                </section>
            </main>

            {/* Footer Status */}
            <footer className="bg-slate-100 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 px-6 py-2 flex justify-between items-center text-[11px] font-medium text-slate-500">
                <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span> OCR Engine: Online
                    </span>
                    <span className="flex items-center gap-1">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span> Database: Encrypted
                    </span>
                </div>
                <div className="flex items-center gap-4">
                    <span>Server Latency: 12ms</span>
                    <span>Document ID: 002-XC-9921</span>
                    <span className="text-[#1f3b61] font-bold cursor-pointer">HELP CENTER</span>
                </div>
            </footer>
        </div>
    );
};

export default SearchPage;
