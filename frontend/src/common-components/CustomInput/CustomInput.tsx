import { FC } from 'react';

export type TCustomInputProps = Readonly<{
  wrapperProps?: React.HTMLAttributes<HTMLFieldSetElement>;
  formItemProps?: Record<string, unknown>;
  inputProps?: Record<string, unknown>;

  name: string;
  label?: string;
  placeholder?: string;
  helperText?: string;
}>;

export const CustomInput: FC<TCustomInputProps> = props => {
  const { wrapperProps, inputProps, label, placeholder, helperText, name } =
    props;

  return (
    <fieldset className='fieldset' {...wrapperProps}>
      {label ? <legend className='fieldset-legend'>{label}</legend> : null}
      <input
        name={name}
        type='text'
        className='input'
        placeholder={placeholder}
        {...inputProps}
      />
      {helperText && <p className='helper-text'>{helperText}</p>}
    </fieldset>
  );
};
