import { FC } from 'react';
import { FormItemProps, Input, InputProps } from 'antd';

import { FormItemStyled } from './styled';

export type TCustomInputProps = Readonly<{
  wrapperProps?: React.HTMLAttributes<HTMLDivElement>;
  formItemProps: FormItemProps;
  inputProps: InputProps;
}>;

export const CustomInput: FC<TCustomInputProps> = props => {
  const { wrapperProps, formItemProps, inputProps } = props;

  return (
    <div {...wrapperProps}>
      <FormItemStyled {...formItemProps}>
        <Input {...inputProps} />
      </FormItemStyled>
    </div>
  );
};
