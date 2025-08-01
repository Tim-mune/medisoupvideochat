import React from "react";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  labelStyles?: string;
  className?: string;
  data?: any[]; // for select
  selected?: string;
  handleOnclick?: () => void;
  children?: React.ReactNode;
}

export const Input = ({
  type,
  selected,
  name,
  label,
  labelStyles,
  placeholder,
  className,
  defaultValue,
  handleOnclick,
  disabled,
  data,
  minLength,
  children,
  ...rest
}: InputProps) => {
  const baseInputClass = "input bg-white w-full rounded-md text-zinc-800";

  const baseLabelClass =
    "capitalize leading-[150%] mb-2 font-medium text-primary-dark";

  if (type === "select") {
    return (
      <div className="form-control w-full">
        {label && (
          <label className={`label ${labelStyles || baseLabelClass}`}>
            {" "}
            {label}{" "}
          </label>
        )}
        {/* @ts-ignore */}
        <select
          name={name}
          className={`select select-bordered border-primary-dark text-primary-dark bg-white ${className}`}
          disabled={disabled}
          {...rest}
        >
          {data?.map((item, index) => {
            const value = typeof item === "string" ? item : item.value;
            const displayName = typeof item === "string" ? item : item.name;
            return (
              <option key={index} value={value} selected={value === selected}>
                {displayName}
              </option>
            );
          })}
        </select>
      </div>
    );
  }

  return (
    <div className="form-control w-full">
      {label && (
        <label className={`label ${labelStyles || baseLabelClass}`}>
          {" "}
          {label}{" "}
        </label>
      )}
      <input
        type={type}
        name={name}
        defaultValue={defaultValue}
        placeholder={placeholder}
        disabled={disabled}
        minLength={minLength}
        onClick={handleOnclick}
        className={`${baseInputClass} ${className}`}
        {...rest}
      />
    </div>
  );
};
