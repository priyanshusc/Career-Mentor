export default function ATSWarnings({ warnings }) {
  // This new section prepares the warnings and handles the data type issue.
  let warningsArray = [];
  if (typeof warnings === 'string' && warnings.length > 2) {
    // This is a simple way to parse a string that looks like a Python list of strings.
    // It removes the outer brackets and quotes `['...']` and then splits it.
    warningsArray = warnings.slice(2, -2).split("', '");
  } else if (Array.isArray(warnings)) {
    // If it's already an array, just use it.
    warningsArray = warnings;
  }

  // If there are no warnings after parsing, don't render anything.
  if (warningsArray.length === 0 || !warningsArray[0]) {
    return null;
  }

  return (
    <div className="mb-6 p-4 border-l-4 border-yellow-500 bg-yellow-50">
      <h3 className="text-xl font-bold text-yellow-800 mb-2">ATS Warnings</h3>
      <ul className="list-disc list-inside space-y-1 text-yellow-700">
        {/* We now map over the corrected warningsArray */}
        {warningsArray.map((warning, index) => (
          <li key={index}>{warning}</li>
        ))}
      </ul>
    </div>
  );
}