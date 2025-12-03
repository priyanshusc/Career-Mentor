import ATSWarnings from './ATSWarnings';
import SkillsList from './SkillsList';
import ExperienceDetails from './ExperienceDetails';
import EducationDetails from './EducationDetails';

export default function AnalysisReport({ result }) {
  if (!result) return null;

  const { ats_warnings, parsed_json } = result;

  // Safe parsing logic
  let parsedData = {};
  try {
    parsedData = typeof parsed_json === 'string' ? JSON.parse(parsed_json) : parsed_json;
  } catch (error) {
    return <div className="p-4 text-red-500 bg-red-50 rounded-lg">Error parsing resume data.</div>;
  }

  const { skills, experience, education } = parsedData;

  return (
    <div className="flex flex-col gap-8 p-6 sm:p-8">
      
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Resume Analysis</h2>
        <p className="text-slate-500 text-sm mt-1">Here is what our AI extracted from your profile.</p>
      </div>

      {/* 1. Critical Warnings (High Priority) */}
      {ats_warnings && ats_warnings.length > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
            <h3 className="text-lg font-bold text-amber-800 mb-4 flex items-center gap-2">
                ⚠️ ATS Improvements Needed
            </h3>
            <div className="pl-4">
                <ATSWarnings warnings={ats_warnings} />
            </div>
          </div>
      )}

      {/* 2. Skills Section (Badges) */}
      <section>
        <h3 className="text-lg font-semibold text-slate-700 mb-4 flex items-center gap-2">
            <span className="bg-indigo-100 text-indigo-600 p-1.5 rounded-lg text-xs">🛠</span> Skills Detected
        </h3>
        <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
             <div className="flex flex-wrap gap-2">
                {/* Wrapping SkillsList to ensure layout consistency */}
                <SkillsList skills={skills} />
             </div>
        </div>
      </section>

      {/* 3. Experience Section (Timeline feel) */}
      <section>
        <h3 className="text-lg font-semibold text-slate-700 mb-4 flex items-center gap-2">
            <span className="bg-emerald-100 text-emerald-600 p-1.5 rounded-lg text-xs">💼</span> Professional Experience
        </h3>
        <div className="space-y-4">
            <ExperienceDetails experience={experience} />
        </div>
      </section>

      {/* 4. Education Section */}
      <section>
        <h3 className="text-lg font-semibold text-slate-700 mb-4 flex items-center gap-2">
            <span className="bg-blue-100 text-blue-600 p-1.5 rounded-lg text-xs">🎓</span> Education
        </h3>
        <EducationDetails education={education} />
      </section>
    </div>
  );
}