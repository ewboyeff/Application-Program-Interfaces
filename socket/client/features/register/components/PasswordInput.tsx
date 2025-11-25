import { ChangeEvent, Dispatch, SetStateAction } from "react";

type PasswordCheckerPropsType = {
  password: string;
  setPassword: Dispatch<SetStateAction<string>>;
};

function PasswordInput({ password, setPassword }: PasswordCheckerPropsType) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  return (
    <div>
      <label className="block text-white text-sm font-semibold mb-2">
        Password
      </label>
      <input
        type="password"
        name="password"
        value={password}
        onChange={handleChange}
        required
        // placeholder="••••••••"
        className="w-full px-4 py-3 rounded-xl bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-400"
      />
    </div>
  );
}

export default PasswordInput;
