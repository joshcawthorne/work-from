import { useState, useEffect } from "react";
import styled from "styled-components";
import { AnimateSharedLayout, motion } from "framer-motion";
import { useStoreActions, useStoreState } from "easy-peasy";
import { supabase } from "../../utils/supabaseClient";

import SidebarItem from "./sidebarItem";
import UserIndicator from "./userIndicator";

import DashboardIcon from "../../../assets/svg/icons/dashboard.svg";
import TeamsIcon from "../../../assets/svg/icons/users.svg";
import CompanyIcon from "../../../assets/svg/icons/building.svg";
import InviteIcon from "../../../assets/svg/icons/users-plus.svg";
import UserIcon from "../../../assets/svg/icons/user.svg";
import SettingsIcon from "../../../assets/svg/icons/settings.svg";
import WorkFromLogo from "../../../assets/svg/workFromLogo.svg";
import LogoutIcon from "../../../assets/svg/icons/log-out.svg";

const SidebarContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 260px;
  border-width: 0px;
  border-right-width: 1px;
  border-style: solid;
  display: flex;
  flex-direction: column;
  border-color: #5c6499;
  background-color: #040419;
  overflow-y: auto;
  z-index: 1000;
  overflow-x: hidden;
  @media (max-width: 1100px) {
    width: 80px;
  }
`;

const SidebarContent = styled.div`
  width: 100%;
  padding-left: 10px;
  padding-top: 30px;
  flex: 1 0 auto;
  @media (max-width: 1100px) {
    padding-left: 0;
  }
`;

const LogoContainer = styled.div`
  width: calc(100% - 40px);
  height: 60px;
  border-radius: 10px;
  margin-left: 10px;
  background-color: #101136;
  margin-bottom: 50px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  cursor: pointer;
  user-select: none;
  overflow: hidden;
  @media (max-width: 1100px) {
    width: 80%;
    margin: 0;
    margin-left: 10%;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 50px;
  }
`;

const LogoItem = styled.div`
  margin-left: 10px;
  @media (max-width: 1100px) {
    margin: 0;
  }
`;

const LogoTextContainer = styled.div`
  margin-left: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  @media (max-width: 1100px) {
    display: none;
  }
`;

const LogoText = styled.div`
  color: #fff;
  font-size: 18px;
  font-weight: bold;
`;

const LogoTagline = styled.div`
  color: #fff;
  background-color: #f5516c;
  border-radius: 5px;
  font-size: 11px;
  width: 37px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 8.5px;
  margin-top: 4px;
  padding-top: 1px;
  padding-bottom: 3px;
`;

const SidebarSection = styled.div`
  margin-bottom: 50px;
`;

const SidebarItems = styled(motion.div)``;

const SidebarTitle = styled.div`
  font-size: 14px;
  text-transform: uppercase;
  color: #a7aed6;
  margin-bottom: 10px;
  padding: 0px 10px;
  @media (max-width: 1100px) {
    text-align: center;
    font-size: 12px;
  }
`;

const LogoItemContainer = styled(motion.div)`
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  will-change: layout;
`;

const SidebarBottomContentContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  position: relative;
  flex-direction: column;
  bottom: 0;
  left: 0%;
  padding-bottom: 33px;
  margin: 10px 0 0px 0;
  flex-shrink: 0;
  @media (max-width: 1100px) {
    margin: 0;
  }
`;

const FooterButton = styled.div`
  width: 100%;
  padding-left: 20px;
  @media (max-width: 1100px) {
    padding: 0;
  }
`;

const LogoOneAnim = {
  standard: {
    y: 26,
    transition: {
      type: "tween",
      duration: 0,
    },
  },
  hover: {
    y: [22.5, 15, -30, -100],
    transition: {
      type: "tween",
      duration: 1.2,
      ease: "easeOut",
    },
  },
};

const LogoTwoAnim = {
  standard: {
    y: 200,
    transition: {
      type: "tween",
      duration: 0,
    },
  },
  hover: {
    y: [200, 40, -20],
    transition: {
      type: "tween",
      delay: 0.7,
      duration: 1.5,
      ease: "easeOut",
    },
  },
};

function Sidebar() {
  const [activePage, setActivePage] = useState("dashboard");
  const [logoHovered, setLogoHovered] = useState(false);

  const userActions = useStoreActions((actions) => actions.user);
  const { setSession, setLoggedIn, setUserDetails } = userActions;

  const SIDEBAR_CONTENT = [
    {
      section: "Home",
      items: [
        {
          title: "Mission Control",
          link: "/dashboard",
          id: "dashboard",
          Icon: DashboardIcon,
        },
        {
          title: "Teams",
          link: "/teams",
          id: "teams",
          Icon: TeamsIcon,
          disabled: true,
          label: "Coming Soon!",
        },
        { title: "Company", link: "/teams", id: "company", Icon: CompanyIcon },
      ],
    },
    {
      section: "Invite",
      items: [
        {
          title: "Invite Colleagues",
          link: "/invite",
          id: "invite",
          Icon: InviteIcon,
        },
      ],
    },
    {
      section: "Manage",
      items: [
        {
          title: "Manage Team",
          link: "/dashboard",
          id: "userSettings",
          Icon: UserIcon,
        },
        {
          title: "Manage Company",
          link: "/dashboard",
          id: "companySettings",
          Icon: SettingsIcon,
        },
      ],
    },
  ];

  function handleLogout() {
    setUserDetails({
      id: null,
      fullName: null,
      onboarded: null,
      email: null,
      company: null,
      avatar: null,
    });
    setLoggedIn(false);
    setSession(null);
    supabase.auth.signOut();
  }

  function handleHover() {
    if (!logoHovered) {
      setLogoHovered(true);
      setTimeout(() => {
        setLogoHovered(false);
      }, 2300);
    }
  }

  return (
    <SidebarContainer>
      <SidebarContent>
        <LogoContainer onMouseOver={() => handleHover()}>
          <LogoItem>
            <LogoItemContainer
              variants={LogoOneAnim}
              initial="hover"
              animate={logoHovered ? "hover" : "standard"}
            >
              <WorkFromLogo height={"46px"} width={"40px"} />
            </LogoItemContainer>
            <LogoItemContainer
              variants={LogoTwoAnim}
              initial="hover"
              animate={logoHovered ? "hover" : "standard"}
            >
              <div>
                <WorkFromLogo height={"46px"} width={"40px"} />
              </div>
            </LogoItemContainer>
          </LogoItem>
          <LogoTextContainer>
            <LogoText>Work From</LogoText>
            <LogoTagline>Beta</LogoTagline>
          </LogoTextContainer>
        </LogoContainer>

        <SidebarItems layout>
          <AnimateSharedLayout>
            {SIDEBAR_CONTENT.map((sidebarItem, i) => (
              <SidebarSection key={i}>
                <SidebarTitle>{sidebarItem.section}</SidebarTitle>
                <SidebarItems>
                  {sidebarItem.items.map((item, k) => (
                    <SidebarItem
                      key={k}
                      title={item.title}
                      active={activePage === item.id}
                      Icon={item.Icon}
                      id={item.id}
                      setActivePage={setActivePage}
                      disabled={item.disabled}
                      label={item.label}
                    />
                  ))}
                </SidebarItems>
              </SidebarSection>
            ))}
          </AnimateSharedLayout>
        </SidebarItems>
      </SidebarContent>
      <SidebarBottomContentContainer>
        <UserIndicator />
        <FooterButton>
          <SidebarItem
            title={"User Settings"}
            Icon={SettingsIcon}
            id={"settings"}
            width={"calc(100% - 40px)"}
            setActivePage={setActivePage}
          />
          <SidebarItem
            title={"Logout"}
            Icon={LogoutIcon}
            id={"logout"}
            action={handleLogout}
            width={"calc(100% - 40px)"}
          />
        </FooterButton>
      </SidebarBottomContentContainer>
    </SidebarContainer>
  );
}

export default Sidebar;
