// import styled from '@emotion/styled';

// type THeaderStyledProps = Readonly<{
//   isAuthorized: boolean;
//   darkMode: boolean;
// }>;

// type THeaderNavigationItemStyledProps = Readonly<{
//   isActive: boolean;
//   darkMode: boolean;
// }>;

// export const HeaderStyled = styled.header<THeaderStyledProps>`
//   height: ${props => (props.isAuthorized ? '40px' : '50px')};

//   transition: all 1s ease;

//   position: fixed;
//   top: 0;
//   display: flex;
//   justify-content: space-between;
//   width: 100%;
//   background-color: ${({ darkMode }) =>
//     darkMode ? 'var(--mt-color-tertiary-1)' : 'var(--mt-color-tertiary-8)'};

//   div {
//     display: flex;
//   }

//   h1 {
//     font-size: ${props => (props.isAuthorized ? '24px' : '42px')};
//   }
// `;

// export const HeaderNavigationPanelStyled = styled.div`
//   display: flex;
//   padding: 0 10px;
// `;

// export const HeaderNavigationItemStyled = styled.button<THeaderNavigationItemStyledProps>`
//   text-transform: uppercase;
//   height: 100%;
//   background-color: transparent;
//   border-radius: 0;
//   border: 0;
//   color: ${props => (props.isActive ? 'var(--mt-color-primary-1)' : 'inherit')};
//   font-weight: 900;
//   font-size: 16px;
//   cursor: pointer;
//   box-sizing: border-box;
//   border: 2px solid transparent;

//   &:hover,
//   &:focus,
//   &:active {
//     color: var(--mt-color-primary-1);
//     border: 2px solid transparent;
//     outline: none;
//   }

//   &:hover {
//     color: var(--mt-color-primary-1);
//     background-color: ${props => (props.darkMode ? 'var(--mt-color-tertiary-0)' : 'var(--mt-color-tertiary-7)')};
//   }

//   &:active {
//     color: var(--mt-color-primary-2);
//   }

//   &:focus-visible {
//     border: 2px solid var(--mt-color-primary-1);
//     outline-offset: 2px;
//   }
// }
// `;
