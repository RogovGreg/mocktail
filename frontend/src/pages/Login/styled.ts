import styled from '@emotion/styled';

export const LoginCardStyled = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  align-items: center;
  justify-content: center;
  width: 33vw;

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
