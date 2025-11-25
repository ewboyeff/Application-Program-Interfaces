type StrengthIndicatorType = {
  passwordStrength: "weak" | "medium" | "strong";
};

function StrengthIndicator({ passwordStrength }: StrengthIndicatorType) {
  const color = {
    weak: "bg-red-500",
    medium: "bg-orange-500",
    strong: "bg-green-500",
  };

  const size = {
    weak: "30%",
    medium: "60%",
    strong: "100%",
  };

  return (
    <div className="w-full bg-gray-300 rounded-full h-2 mt-2">
      <div
        className={`${color[passwordStrength]} h-2 rounded-full`}
        style={{ width: size[passwordStrength] }}
      ></div>
    </div>
  );
}

export default StrengthIndicator;
