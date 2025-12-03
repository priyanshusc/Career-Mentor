export default function SkillsList({ skills }) {
  if (!skills || skills.length === 0) {
    return null;
  }

  return (
    <div className="mt-6">
      <h3 className="text-xl font-bold mb-3">Technical Skills</h3>
      <div className="flex flex-wrap gap-2">
        {skills.map((skill, index) => (
          <span
            key={index}
            className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full"
          >
            {skill}
          </span>
        ))}
      </div>
    </div>
  );
}