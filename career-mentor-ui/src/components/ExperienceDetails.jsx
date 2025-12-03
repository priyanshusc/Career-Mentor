export default function ExperienceDetails({ experience }) {
  if (!experience || experience.length === 0) {
    return null;
  }

  return (
    <div className="mt-6">
      <h3 className="text-xl font-bold mb-3">Work Experience</h3>
      <div className="space-y-4">
        {experience.map((exp, index) => (
          <div key={index} className="pl-4 border-l-2">
            <h4 className="font-semibold text-lg">{exp.role}</h4>
            <p className="text-md text-gray-700">{exp.organization}</p>
            <p className="text-sm text-gray-500">{exp.duration}</p>
          </div>
        ))}
      </div>
    </div>
  );
}