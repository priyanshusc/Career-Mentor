import { Link } from 'react-router-dom';

export default function HomePage() {
    return (
        <div className="flex flex-col min-h-screen bg-white text-slate-800">
            
            {/* 1. HERO SECTION */}
            <section className="relative flex flex-col items-center justify-center text-center pt-20 pb-32 px-6 bg-gradient-to-tr from-blue-50 via-white to-indigo-100 overflow-hidden">
                {/* Background Decor */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                    <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl"></div>
                    <div className="absolute top-1/2 -left-24 w-72 h-72 bg-indigo-200/30 rounded-full blur-3xl"></div>
                </div>

                <div className="relative z-10 max-w-4xl mx-auto">
                    {/* <div className="inline-block px-4 py-1.5 mb-6 text-sm font-semibold text-indigo-700 bg-indigo-50 border border-indigo-100 rounded-full shadow-sm">
                        ✨ Now powered by Gemini 1.5 AI
                    </div> */}
                    <h1 className="text-5xl md:text-7xl font-extrabold leading-tight mb-6 tracking-tight text-slate-900">
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-indigo-600">Future-Proof</span> Your Career
                    </h1>
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-600 mb-8">
                        Your AI-Powered Career Mentor is Here 🚀
                    </h2>
                    <p className="text-lg md:text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
                        Stop guessing what recruiters want. Get personalized resume analysis, 
                        real-time ATS scoring, and a custom learning roadmap to land your dream job.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
  <Link
    to="/login"
    className="bg-amber-500 text-white font-bold text-lg px-8 py-4 rounded-full shadow-xl shadow-amber-400/40 hover:bg-amber-500/90 hover:px-12 transition-all duration-300"
  >
    Start Your Journey Free
  </Link>
</div>
                </div>
            </section>

            {/* 2. KEY FEATURES SECTION */}
            <section className="pb-24 pt-10 px-6 bg-white">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-10">
                        {/* <h3 className="text-indigo-600 font-bold tracking-wide uppercase text-sm mb-3">Core Capabilities</h3> */}
                        <h2 className="text-4xl font-extrabold text-slate-800">Everything You Need to Get Hired</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {/* Feature 1 */}
                        <div className="p-8 rounded-2xl bg-gray-200 border border-slate-100 hover:shadow-xl hover:shadow-indigo-100/50 transition-all duration-300 group">
                            <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform">
                                📜
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">Smart Resume Parsing</h3>
                            <p className="text-slate-600 leading-relaxed">
                                Our AI extracts every skill, project, and experience detail to understand your professional profile instantly.
                            </p>
                        </div>

                        {/* Feature 2 */}
                        <div className="p-8 rounded-2xl bg-gray-200 border border-slate-100 hover:shadow-xl hover:shadow-indigo-100/50 transition-all duration-300 group">
                            <div className="w-14 h-14 bg-indigo-100 rounded-xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform">
                                🎯
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">ATS Score Checker</h3>
                            <p className="text-slate-600 leading-relaxed">
                                Paste a job description and see exactly how well you match. Get a score and a list of missing keywords.
                            </p>
                        </div>

                        {/* Feature 3 */}
                        <div className="p-8 rounded-2xl bg-gray-200 border border-slate-100 hover:shadow-xl hover:shadow-indigo-100/50 transition-all duration-300 group">
                            <div className="w-14 h-14 bg-amber-100 rounded-xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform">
                                🗺️
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">Custom Roadmaps</h3>
                            <p className="text-slate-600 leading-relaxed">
                                Don't just see the gaps—fill them. We generate a week-by-week learning plan tailored to your missing skills.
                            </p>
                        </div>

                        {/* Feature 4 */}
                        <div className="p-8 rounded-2xl bg-gray-200 border border-slate-100 hover:shadow-xl hover:shadow-indigo-100/50 transition-all duration-300 group">
                            <div className="w-14 h-14 bg-emerald-100 rounded-xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform">
                                💡
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">Project Ideas</h3>
                            <p className="text-slate-600 leading-relaxed">
                                Need to prove a skill? We suggest specific, impressive mini-projects you can build to boost your portfolio.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. HOW IT WORKS SECTION */}
            <section className="py-24 bg-slate-900 text-white overflow-hidden relative">
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20 pointer-events-none">
                     <div className="absolute top-20 right-20 w-96 h-96 bg-blue-500 rounded-full blur-3xl"></div>
                     <div className="absolute bottom-20 left-20 w-96 h-96 bg-indigo-500 rounded-full blur-3xl"></div>
                </div>

                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="text-center mb-20">
                        <h2 className="text-3xl md:text-5xl font-extrabold mb-6">From Resume to Offer Letter</h2>
                        <p className="text-slate-400 text-lg max-w-2xl mx-auto">Three simple steps to supercharge your job search.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
                        <div className="relative">
                            <div className="w-20 h-20 mx-auto bg-slate-800 rounded-full flex items-center justify-center text-3xl font-bold text-blue-400 border-4 border-slate-700 mb-6 relative z-10">
                                1
                            </div>
                            {/* Connector Line */}
                            <div className="hidden md:block absolute top-10 left-1/2 w-full h-1 bg-slate-800 -z-0"></div>
                            
                            <h3 className="text-xl font-bold mb-3">Upload Resume</h3>
                            <p className="text-slate-400 px-4">Simply upload your PDF or DOCX. Our parser breaks it down instantly.</p>
                        </div>

                        <div className="relative">
                            <div className="w-20 h-20 mx-auto bg-slate-800 rounded-full flex items-center justify-center text-3xl font-bold text-indigo-400 border-4 border-slate-700 mb-6 relative z-10">
                                2
                            </div>
                            <div className="hidden md:block absolute top-10 left-1/2 w-full h-1 bg-slate-800 -z-0"></div>

                            <h3 className="text-xl font-bold mb-3">Match Job Description</h3>
                            <p className="text-slate-400 px-4">Paste the JD of the job you want. We analyze the gap between you and the role.</p>
                        </div>

                        <div className="relative">
                            <div className="w-20 h-20 mx-auto bg-slate-800 rounded-full flex items-center justify-center text-3xl font-bold text-emerald-400 border-4 border-slate-700 mb-6 relative z-10">
                                3
                            </div>
                            <h3 className="text-xl font-bold mb-3">Get Your Plan</h3>
                            <p className="text-slate-400 px-4">Receive a tailored roadmap and project suggestions to close the gap and get hired.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 4. FINAL CTA SECTION */}
            <section className="py-24 px-6 bg-gradient-to-br from-indigo-50 to-blue-50">
                <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden border border-indigo-50 flex flex-col md:flex-row items-center">
                    <div className="p-10 md:w-2/3">
                        <h2 className="text-3xl font-bold text-slate-900 mb-4">Ready to upgrade your career?</h2>
                        <p className="text-slate-600 text-lg mb-8">
                            Join hundreds of developers using AI Career Mentor to optimize their resumes and learn faster.
                        </p>
                        <Link
                            to="/signup"
                            className="inline-block bg-indigo-600 text-white font-bold text-lg px-8 py-3 rounded-xl shadow-lg hover:bg-indigo-700 transition-colors"
                        >
                            Get Started for Free
                        </Link>
                    </div>
                    <div className="md:w-1/3 bg-indigo-100 h-full min-h-[200px] flex items-center justify-center">
                        <span className="text-8xl">🚀</span>
                    </div>
                </div>
            </section>
        </div>
    );
}