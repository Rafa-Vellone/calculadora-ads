interface InputFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  type?: string;
  prefix?: string;
  suffix?: string;
  info?: string;
}

const InputField = ({ 
  label, 
  value, 
  onChange, 
  placeholder, 
  type = "text",
  prefix,
  suffix,
  info
}: InputFieldProps) => {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-foreground">
        {label}
        {info && (
          <span className="ml-2 text-xs text-muted-foreground font-normal">
            ({info})
          </span>
        )}
      </label>
      <div className="relative">
        {prefix && (
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
            {prefix}
          </span>
        )}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`input-custom ${prefix ? 'pl-10' : ''} ${suffix ? 'pr-12' : ''}`}
        />
        {suffix && (
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground">
            {suffix}
          </span>
        )}
      </div>
    </div>
  );
};

export default InputField;
