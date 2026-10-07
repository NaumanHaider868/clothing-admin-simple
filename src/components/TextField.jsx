export function TextField({ label, error, ...props }) {
  return (
    <label className="block">
      <span className="block font-medium font-[monospace] mb-1">{label}</span>
      <input
        {...props}
        className={`w-full py-3 pl-4 pr-4 bg-transparent border-b border-black focus:outline-none ${
          error ? "border-red-500" : ""
        }`}
      />
      {error ? <span className="text-red-500 text-sm">{error}</span> : null}
    </label>
  );
}
