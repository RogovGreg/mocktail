import { FC, ReactNode, useMemo } from 'react';

export type TCustomInputProps = Readonly<{
  name: string;

  helperText?: string | ReactNode;
  label?: string | ReactNode;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  specificInputProps?: React.InputHTMLAttributes<HTMLInputElement>;
  type?: React.HTMLInputTypeAttribute;
  value?: string;

  rewriteWrapperClassName?: boolean;
  wrapperClassName?: string;
  wrapperStyle?: React.CSSProperties;

  labelClassName?: string;
  labelStyle?: React.CSSProperties;
  rewriteLabelClassName?: boolean;

  inputClassName?: string;
  inputStyle?: React.CSSProperties;
  rewriteInputClassName?: boolean;

  helperTextClassName?: string;
  helperTextStyle?: React.CSSProperties;
  rewriteHelperTextClassName?: boolean;
}>;

export const CustomInput: FC<TCustomInputProps> = props => {
  const {
    name,

    helperText,
    label,
    onChange,
    placeholder,
    required,
    specificInputProps,
    type = 'text',
    value,

    rewriteWrapperClassName,
    wrapperClassName,
    wrapperStyle,

    labelClassName,
    labelStyle,
    rewriteLabelClassName,

    inputClassName,
    inputStyle,
    rewriteInputClassName,

    helperTextClassName,
    helperTextStyle,
    rewriteHelperTextClassName,
  } = props;

  const wrapperClasses = useMemo<string>(() => {
    const baseClass: string = 'fieldset';

    if (wrapperClassName) {
      if (rewriteWrapperClassName) {
        return wrapperClassName;
      }

      return `${baseClass} ${wrapperClassName}`;
    }

    return baseClass;
  }, [rewriteWrapperClassName, wrapperClassName]);

  const labelClasses = useMemo<string>(() => {
    const baseClass: string = 'fieldset-legend';

    if (labelClassName) {
      if (rewriteLabelClassName) {
        return labelClassName;
      }

      return `${baseClass} ${labelClassName}`;
    }

    return baseClass;
  }, [labelClassName, rewriteLabelClassName]);

  const inputClasses = useMemo<string>(() => {
    const baseClass: string = 'input';

    if (inputClassName) {
      if (rewriteInputClassName) {
        return inputClassName;
      }

      return `${baseClass} ${inputClassName}`;
    }

    return baseClass;
  }, [inputClassName, rewriteInputClassName]);

  const helperTextClasses = useMemo<string>(() => {
    const baseClass: string = 'helper-text';

    if (helperTextClassName) {
      if (rewriteHelperTextClassName) {
        return helperTextClassName;
      }

      return `${baseClass} ${helperTextClassName}`;
    }

    return baseClass;
  }, [helperTextClassName, rewriteHelperTextClassName]);

  const labelElement = useMemo<ReactNode>(() => {
    if (!label) return null;

    if (typeof label === 'string') {
      return (
        <legend className={labelClasses} style={labelStyle}>
          {label}
        </legend>
      );
    }

    return label;
  }, [label, labelClasses, labelStyle]);

  const helperTextElement = useMemo<ReactNode>(() => {
    if (!helperText) return null;

    if (typeof helperText === 'string') {
      return (
        <p className={helperTextClasses} style={helperTextStyle}>
          {helperText}
        </p>
      );
    }

    return helperText;
  }, [helperText, helperTextClasses, helperTextStyle]);

  return (
    <fieldset className={wrapperClasses} style={wrapperStyle}>
      {labelElement}
      <input
        className={inputClasses}
        name={name}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        style={inputStyle}
        type={type}
        value={value}
        {...specificInputProps}
      />
      {helperTextElement}
    </fieldset>
  );
};
