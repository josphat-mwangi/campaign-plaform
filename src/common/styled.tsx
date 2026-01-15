import styled from "@emotion/styled";
import { Box, Fab as Cta } from "@mui/material";

export const SideNav = styled(Box)`
  position: fixed;
  top: 0;
  bottom: 0;
  width: 250px;
  height: calc(100vh);
  border-top: 1px solid #e2e2e2;
  border-right: 1px solid #e2e2e2;
  background-color: #ffffff;
  z-index: 100;
  transition: left 0.5s ease-in-out;

  @media (max-width: 600px) {
    left: -250px;
  }
`;

export const SideNavHeader = styled(Box)`
  width: 250px;
  height: 60px;
  font-size: 1.5rem;
  display: flex;
  justify-content: space-between;
  font-weight: 600;
  align-items: center;
  padding: 0 30px;
  color: ${({ theme }) => theme.palette.primary.main};
  border-right: 1px solid #e2e2e2;
  border-bottom: 1px solid #e2e2e2;
  cursor: pointer;
`;

export const SideNavBody = styled(Box)`
  width: 250px;
  height: calc(100vh - 60px);
  overflow-y: auto;
`;

export const SideNavGroup = styled(Box)`
  width: 100%;
  height: auto;
  padding: 5px 0;
  display: flex;
  flex-direction: column;
  border-bottom: 1px solid #e2e2e2;
`;

export const SideNavGroupHeader = styled(Box)`
  font-size: 0.8rem;
  padding: 5px 30px;
  color: #555;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  svg {
    font-size: 1rem;
  }
`;

export const SideNavGroupBody = styled(Box)`
  width: 100%;
  max-height: 0;
  padding: 0;
  overflow-y: hidden;
  transition: max-height 1s ease-in-out;
  transition: padding 0.5s ease-in-out;
  &.open {
    max-height: 500px;
    padding: 10px 0;
  }
  .item {
    width: 80%;
    height: 30px;
    display: flex;
    align-items: center;
    align-content: center;
    justify-content: flex-start;
    padding: 20px 10px;
    margin: 0 auto;
    font-size: 0.85rem;
    border-radius: 10px;
    cursor: pointer;
    text-decoration: none !important;
    color: #333333 !important;
    &:hover {
      background-color: #ebebeb;
    }
    &.active {
      background-color: ${({ theme }) => theme.palette.primary.light};
      color: ${({ theme }) => theme.palette.primary.contrastText} !important;
    }
    svg {
      margin-right: 20px;
    }
  }
`;

export const PageBody = styled(Box)`
  position: fixed;
  width: calc(100% - 250px);
  left: 250px;
  top: 0;
  overflow-y: auto;
  border-top: 1px solid #e0e0e0;

  @media (max-width: 600px) {
    left: 0;
    width: 100%;
  }
`;

export const PageAppBar = styled(Box)`
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 30px;
  border-bottom: 1px solid #e0e0e0;
  background-color: #ffffff;
  & a {
    color: inherit;
    text-decoration: none;
  }

  @media (max-width: 600px) {
    padding: 0 10px;
  }
`;

export const PageContent = styled(Box)`
  padding: 10px 30px 30px 30px;
  width: 100%;
  height: calc(100vh - 60px);
  overflow-y: auto;
  background-color: #f5f5f5;

  @media (max-width: 600px) {
    padding: 10px;
  }

  & .content {
    animation: slideIn 0.5s ease-in-out;
  }

  & .content2 {
    animation: flyIn 0.5s ease-in-out;
  }

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateX(10%);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @keyframes flyIn {
    from {
      opacity: 0;
      transform: translateY(10%);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

export const SmoothBox = styled(Box)`
  position: relative;
  background-color: #ffffff;
  border-radius: 1rem;
  box-shadow: 0 2px 10px 4px #4e4e4e21;
  overflow: hidden;

  @media (max-width: 600px) {
    box-shadow: 0 2px 5px 2px #4e4e4e21;
  }
`;

export const Fab = styled(Cta)`
  position: absolute;
  bottom: 1.5rem;
  right: 1rem;
  z-index: 0;
`;
