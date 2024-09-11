export default function SelectInput<T>({
  value,
  setValue,
  label,
  options,
  getOptionName,
}: {
  value: T | undefined;
  setValue: (newValue: T | undefined) => void;
  label: string;
  options: T[];
  getOptionName: (item: T) => string;
}) {
  return (
    <label className="block">
      {label}
      <br />
      <select
        className="bg-slate-800 rounded-md  px-1"
        value={value ? getOptionName(value) : ""}
        onChange={(e) => {
          const optionName = e.target.value;
          const option = options.find((o) => getOptionName(o) === optionName);
          setValue(option);
        }}
      >
        <option></option>
        {options.map((o) => (
          <option key={getOptionName(o)}>{getOptionName(o)}</option>
        ))}
      </select>
    </label>
  );
}
