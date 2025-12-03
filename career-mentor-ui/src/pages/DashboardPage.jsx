import { useState } from 'react';
import axiosInstance from '../axiosInstance';
import Navbar from '../components/Navbar';
import AnalysisReport from '../components/AnalysisReport';
import ATSResult from '../components/ATSResult';
import ProjectSuggestions from '../components/ProjectSuggestions';

export default function DashboardPage() {
    // State Management
    const [selectedFile, setSelectedFile] = useState(null);
    const [jobDescription, setJobDescription] = useState('');
    
    const [analysisResult, setAnalysisResult] = useState(null); // Step 1 Result
    const [atsResult, setAtsResult] = useState(null);           // Step 2 Result
    
    const [isLoading, setIsLoading] = useState(false);
    const [step, setStep] = useState(1); // 1: Upload, 2: Analysis View
    const [error, setError] = useState('');

    // --- Handlers ---

    const handleFileChange = (e) => {
        if (e.target.files.length > 0) {
            setSelectedFile(e.target.files[0]);
            setError('');
        }
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!selectedFile) return setError('Please select a file first.');

        setIsLoading(true);
        setError('');
        
        const formData = new FormData();
        formData.append('file', selectedFile);

        try {
            const response = await axiosInstance.post('/resume/upload/', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setAnalysisResult(response.data);
            setStep(2); // Move to dashboard view
        } catch (err) {
            setError(err.response?.data?.detail || 'Upload failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleATSAnalysis = async () => {
        if (!analysisResult?.id || !jobDescription) {
            return setError('Please enter a job description.');
        }

        setIsLoading(true);
        setError('');

        try {
            const response = await axiosInstance.post(
                `/resume/${analysisResult.id}/ats-score-roadmap/`,
                { job_description: jobDescription }
            );
            setAtsResult(response.data);
        } catch (err) {
            setError('ATS analysis failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    // --- UI Components ---

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-800 pb-20">
            

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
                
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl mb-4">
                        Be the best for Your Career
                    </h1>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                        Optimize your resume, discover skill gaps, and get a personalized roadmap to your dream job.
                    </p>
                </div>

                {/* Error Banner */}
                {error && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8 rounded-r-lg max-w-3xl mx-auto animate-pulse">
                        <div className="flex">
                            <div className="flex-shrink-0">⚠️</div>
                            <div className="ml-3">
                                <p className="text-sm text-red-700">{error}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* STEP 1: Upload Section (Hidden if analyzed) */}
                {step === 1 && (
                    <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
                        <div className="p-8">
                            <h2 className="text-2xl font-bold text-slate-800 mb-6">Start by uploading your resume</h2>
                            <form onSubmit={handleUpload} className="space-y-6">
                                <div className="flex items-center justify-center w-full">
                                    <label className={`flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-300 ${selectedFile ? 'border-indigo-500 bg-indigo-50' : 'border-slate-300 hover:bg-slate-50'}`}>
                                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                            <svg className={`w-10 h-10 mb-3 ${selectedFile ? 'text-indigo-500' : 'text-slate-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                                            <p className="text-sm text-slate-500">
                                                {selectedFile ? <span className="font-semibold text-indigo-600">{selectedFile.name}</span> : <span><span className="font-semibold">Click to upload</span> or drag and drop</span>}
                                            </p>
                                            <p className="text-xs text-slate-400 mt-1">PDF or DOCX (MAX. 5MB)</p>
                                        </div>
                                        <input type="file" className="hidden" onChange={handleFileChange} accept=".pdf,.docx" />
                                    </label>
                                </div>
                                <button
                                    type="submit"
                                    disabled={isLoading || !selectedFile}
                                    className={`w-full py-4 px-6 rounded-xl text-white font-bold text-lg shadow-lg transition-all transform hover:scale-[1.02] active:scale-95 ${isLoading || !selectedFile ? 'bg-slate-300 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-500/30'}`}
                                >
                                    {isLoading ? 'Analyzing Resume...' : 'Analyze My Resume 🚀'}
                                </button>
                            </form>
                        </div>
                    </div>
                )}

                {/* STEP 2: Dashboard View */}
                {step === 2 && analysisResult && (
                    <div className="animate-fade-in space-y-8">
                        
                        {/* Action Bar */}
                        <div className="flex flex-col sm:flex-row justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-slate-200">
                            <div className="flex items-center gap-3 mb-4 sm:mb-0">
                                <div className="h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold">
                                    RN
                                </div>
                                <div>
                                    <p className="text-sm text-slate-500">Analyzing</p>
                                    <p className="font-semibold text-slate-900 truncate max-w-[200px]">{selectedFile?.name}</p>
                                </div>
                            </div>
                            <button onClick={() => { setStep(1); setAnalysisResult(null); setAtsResult(null); }} className="text-sm text-slate-500 hover:text-indigo-600 font-medium transition-colors">
                                Upload Different Resume
                            </button>
                        </div>

                        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                            
                            {/* LEFT COLUMN: ATS & Job Match (Sticky on Desktop) */}
                            <div className="xl:col-span-1 space-y-8">
                                
                                {/* 1. Job Match Card */}
                                <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden relative">
                                    <div className="bg-gradient-to-r from-slate-800 to-slate-900 p-6 text-white">
                                        <h3 className="text-xl font-bold flex items-center gap-2">
                                            🎯 Job Match
                                        </h3>
                                        <p className="text-slate-300 text-sm mt-1">Paste a JD to get your ATS Score</p>
                                    </div>
                                    <div className="p-6">
                                        <textarea
                                            value={jobDescription}
                                            onChange={(e) => setJobDescription(e.target.value)}
                                            placeholder="Paste the full job description here..."
                                            className="w-full h-40 p-4 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none text-sm transition-all"
                                        />
                                        <button
                                            onClick={handleATSAnalysis}
                                            disabled={isLoading || !jobDescription}
                                            className={`w-full mt-4 py-3 rounded-xl font-bold text-white shadow-md transition-all ${isLoading ? 'bg-slate-400' : 'bg-green-600 hover:bg-green-700 hover:shadow-green-500/30'}`}
                                        >
                                            {isLoading ? 'Calculating...' : 'Get ATS Score'}
                                        </button>
                                    </div>
                                </div>

                                {/* 2. ATS Result (Shows after calculation) */}
                                {atsResult && (
                                    <div className="animate-slide-up">
                                        <ATSResult result={atsResult} />
                                    </div>
                                )}
                                
                                {/* 3. Project Suggestions (Only if we have missing skills) */}
                                {atsResult && atsResult.missing_skills?.length > 0 && (
                                    <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
                                         <div className="p-6 border-b border-slate-100">
                                            <h3 className="font-bold text-slate-800">🚀 Recommended Projects</h3>
                                         </div>
                                         <div className="p-0">
                                            {/* Ensure ProjectSuggestions handles its own internal layout cleanly */}
                                            <ProjectSuggestions 
                                                missingSkills={atsResult.missing_skills} 
                                                jobGoal="Software Engineer" 
                                            />
                                         </div>
                                    </div>
                                )}
                            </div>

                            {/* RIGHT COLUMN: Resume Deep Dive */}
                            <div className="xl:col-span-2 space-y-8">
                                <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-1">
                                    <AnalysisReport result={analysisResult} />
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}