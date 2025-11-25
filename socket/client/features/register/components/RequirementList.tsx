import {
  hasLength,
  hasMixedCase,
  hasNumber,
  hasSymbol,
} from "../helpers/ValidationPasword";

function RequirementList({ password }: { password: string }) {
  const reqList = [
    {
      label: "minimum 8 characters",
      passed: hasLength(password),
    },
    {
      label: "symbol",
      passed: hasSymbol(password),
    },
    {
      label: "uppercase & lowercase",
      passed: hasMixedCase(password),
    },
    {
      label: "number",
      passed: hasNumber(password),
    },
  ];

  return (
    <div>
      {reqList.map((l) => (
        <p
          key={l.label}
          className={`${l.passed ? "text-green-800" : "text-red-900"}`}
        >
          {l.passed ? "🚀" : "💀"} {l.label}
        </p>
      ))}
    </div>
  );
}

export default RequirementList;
