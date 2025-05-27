import styled from '@emotion/styled';

type THeaderStyledProps = Readonly<{
  isAuthorized: boolean;
}>;

type THeaderNavigationItemStyledProps = Readonly<{
  isActive?: boolean;
}>;

export const HeaderStyled = styled.header<THeaderStyledProps>`
  height: ${props => (props.isAuthorized ? '50px' : '70px')};

  transition: all 1s ease;

  position: fixed;
  top: 0;
  display: flex;
  justify-content: space-between;
  width: 100%;
  background-color: var(--mt-color-1);

  div {
    display: flex;
  }

  h1 {
    font-size: ${props => (props.isAuthorized ? '24px' : '42px')};
  }
`;

export const HeaderNavigationPanelStyled = styled.div`
  display: flex;
  padding: 0 10px;
`;

export const HeaderNavigationItemStyled = styled.button<THeaderNavigationItemStyledProps>`
  text-transform: uppercase;
  height: 100%;
  background-color: transparent;
  border-radius: 0;
  border: 0;
  font-weight: 600;

  &:hover,
  &:focus,
  &:active {
    color: var(--mt-color-tail);
    border: 0;
    outline: none;
  }

  &:hover {
    background-color: #1A1B1F;
    color: var(--mt-color-tail);
    border: 0;
    outline: none;
  }

  &:active {
    background-color: #FF5900;
    color: #0B0C10;
    transform: translateY(1px);
    border: 0;
    outline: none;
  }

  &:focus-visible {
    border: 0;
    outline: 2px solid #FF5900;
    outline-offset: 2px;
  }
}
`;
