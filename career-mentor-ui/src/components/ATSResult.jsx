import React from 'react';
import ReactMarkdown from 'react-markdown';

export default function ATSResult({ result }) {
  if (!result) return null;

  const { score, matching_skills = [], missing_skills = [], roadmap = "" } = result;

  // Dynamic colors based on score
  const getScoreColor = (s) => {
    if (s >= 80) return "text-emerald-600 from-emerald-50 to-emerald-100 ring-emerald-500";
    if (s >= 50) return "text-amber-600 from-amber-50 to-amber-100 ring-amber-500";
    return "text-red-600 from-red-50 to-red-100 ring-red-500";
  };

  return (
    <div className="flex flex-col gap-6">
      
      {/* Circular Score Card */}
      <div className={`relative bg-gradient-to-br ${getScoreColor(score)} rounded-2xl p-8 border border-white/50 shadow-sm flex flex-col items-center justify-center text-center overflow-hidden`}>
        <div className="absolute top-0 right-0 p-3 opacity-10">
            <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
        </div>
        
        <h3 className="text-sm font-bold uppercase tracking-widest opacity-70 mb-2">ATS Match Score</h3>
        <div className="text-7xl font-black tracking-tighter drop-shadow-sm mb-2">
            {score}%
        </div>
        <div className="inline-block px-3 py-1 bg-white/60 rounded-full text-xs font-bold backdrop-blur-sm shadow-sm">
            {score >= 80 ? "Excellent Match" : score >= 50 ? "Needs Optimization" : "Weak Match"}
        </div>
      </div>

      {/* Skills Gap Analysis */}
      <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-bold text-slate-800">Skill Gap Analysis</h4>
            <span className="text-xs text-slate-400 bg-slate-100 px-2 py-1 rounded">Based on JD</span>
          </div>
          
          <div className="space-y-4">
              {/* Missing */}
              <div>
                 <p className="text-xs font-bold text-red-500 uppercase tracking-wider mb-2">Missing Skills</p>
                 <div className="flex flex-wrap gap-2">
                    {missing_skills.length > 0 ? missing_skills.map((skill, i) => (
                        <span key={i} className="px-2 py-1 bg-red-50 text-red-700 border border-red-100 rounded-md text-xs font-medium">
                            {skill}
                        </span>
                    )) : <span className="text-sm text-slate-400 italic">No critical skills missing.</span>}
                 </div>
              </div>

              {/* Matched */}
              <div>
                 <p className="text-xs font-bold text-green-600 uppercase tracking-wider mb-2">Matched Skills</p>
                 <div className="flex flex-wrap gap-2">
                    {matching_skills.length > 0 ? matching_skills.map((skill, i) => (
                        <span key={i} className="px-2 py-1 bg-green-50 text-green-700 border border-green-100 rounded-md text-xs font-medium">
                            {skill}
                        </span>
                    )) : <span className="text-sm text-slate-400 italic">No matches found.</span>}
                 </div>
              </div>
          </div>
      </div>

      {/* Roadmap - NOW FIXED AND STYLED */}
      <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6">
        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            🗺️ Personalized Roadmap
        </h3>
        
        <div className="prose prose-sm prose-indigo max-w-none text-slate-600 bg-slate-50 p-4 rounded-xl border border-slate-200">
           {typeof roadmap === 'string' ? (
               <ReactMarkdown>{roadmap}</ReactMarkdown>
           ) : (
               <p className="italic text-slate-500">Structured roadmap view coming soon.</p>
           )}
        </div>
      </div>
    </div>
  );
}