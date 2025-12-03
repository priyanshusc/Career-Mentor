export default function EducationDetails({ education }) {
  if (!education || education.length === 0) {
    return null;
  }

  return (
    <div className="mt-6">
      <h3 className="text-xl font-bold mb-3">Education</h3>
      <div className="space-y-4">
        {education.map((edu, index) => (
          <div key={index} className="pl-4 border-l-2">
            <h4 className="font-semibold text-lg">{edu.degree}</h4>
            <p className="text-md text-gray-700">{edu.institution}</p>
            <p className="text-sm text-gray-500">
              {edu.start_year} - {edu.end_year}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}