import { Dispatch, SetStateAction } from "react";
import PasswordInput from "./components/PasswordInput";
import RequirementList from "./components/RequirementList";
import StrengthIndicator from "./components/StrengthIndicator";
import { evaluatePasswordStrength } from "./utils/utils";

type PasswordCheckerPropsType = {
  password: string;
  setPassword: Dispatch<SetStateAction<string>>;
};

function PasswordChecker({ password, setPassword }: PasswordCheckerPropsType) {
  const passwordStrength = evaluatePasswordStrength(password);

  return (
    <div className="flex flex-col gap-3">
      <PasswordInput password={password} setPassword={setPassword} />
      <StrengthIndicator passwordStrength={passwordStrength} />
      <RequirementList password={password} />
    </div>
  );
}

export default PasswordChecker;
