import styled from '@emotion/styled';

export type THorizontalSidebarProps = {
  side: 'left' | 'right';
  active: boolean;
  width?: string;
};

type TOverlayProps = {
  visible: boolean;
};

type TPageContainerStyledProps = Readonly<{
  isAuthorized: boolean;
}>;

export const PageContainerStyled = styled.div<TPageContainerStyledProps>`
  position: relative;

  main {
    align-items: center;
    box-sizing: border-box;
    display: flex;
    height: 100vh;
    justify-content: center;
    flex-direction: column;
    padding-top: ${({ isAuthorized }) => (isAuthorized ? '50px' : '70px')};
    min-height: calc(100vh - 50px);

    > div:first-child {
      flex: 1;
      margin-top: 0;
    }
  }

  footer {
    width: 100%;
    position: absolute;
    bottom: 0;
    height: 25px;
    background-color: var(--mt-color-1);
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 12px;
  }
`;

export const HorizontalSidebar = styled.aside<THorizontalSidebarProps>`
  position: fixed;
  top: 0;
  z-index: 1000;
  ${({ side }) => (side === 'left' ? 'left: 0' : 'right: 0')};

  height: 100vh;
  width: ${({ active, width }) => (active ? width || '33vw' : '0')};
  overflow: hidden;
  transition: width 0.5s ease;

  background-color: #242424;
`;

export const Overlay = styled.div<TOverlayProps>`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(2px);

  opacity: ${({ visible }) => (visible ? 1 : 0)};
  pointer-events: ${({ visible }) => (visible ? 'auto' : 'none')};
  transition: opacity 0.3s ease;

  z-index: 998;
`;
