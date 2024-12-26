import styled from '@emotion/styled';

export const LoginCardStyled = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 24px;

  > div {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  label {
    color: white !important;
  }

  svg {
    width: 24px;
    height: 24px;
  }
`;