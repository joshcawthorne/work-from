import { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import Image from "next/image";
import { useStoreActions, useStoreState } from "easy-peasy";

import { supabase } from "src/services/supabaseClient";
import OnboardingCard from "src/layouts/onboardingCard";
import ArrowRight from "src/assets/svg/icons/arrowRight.svg";
import LunaDeskLogo from "src/assets/svg/logoCollapsed.svg";

const InnerTitle = styled.div`
  font-size: 28px;
  text-align: center;
  span {
    font-weight: 600;
  }
`;

const InnerDesc = styled.div`
  font-size: 14px;
  text-align: center;
  font-weight: 500;
  opacity: 0.6;
  margin: auto;
  margin-bottom: 24px;
  margin-top: 8px;
  max-width: 360px;
  letter-spacing: 0.5px;
`;

const AvatarContainer = styled.div`
  width: 100%;
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 25px;
  margin-top: 10px;
`;

const CompanyLogo = styled.div`
  height: 60px;
  width: 60px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #25262a;
  border-color: #25262a;
  border-style: solid;
  border-width: 2px;
`;

const UserAvatarContainer = styled.div`
  height: 60px;
  width: 60px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  border-color: #25262a;
  border-style: solid;
  border-width: 2px;
`;

const ArrowContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 10px;
  height: 100%;
`;

const UserAvatar = styled(Image)`
  width: 100%;
  height: 100%;
  object-fit: cover;
  overflow: hidden;
`;

function JoinCompany({ setOnboardingPosition }) {
  const [loading, setLoading] = useState(false);
  const [avatarSrc, setAvatarSrc] = useState("");
  const [loadedAvatar, setLoadedAvatar] = useState(false);

  const { userAvatarUrl } = useStoreState((state) => state.user);
  function handleBack() {
    setOnboardingPosition(1);
  }

  function handleJoin() {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setOnboardingPosition(4);
    }, 1500);
  }

  useEffect(() => {
    downloadImage();
  }, []);

  async function downloadImage(path) {
    try {
      const { data, error } = await supabase.storage
        .from("user-avatars")
        .download(userAvatarUrl);
      if (error) {
        throw error;
      }
      const url = URL.createObjectURL(data);
      setAvatarSrc(url);

      console.log(url);

      setLoadedAvatar(true);
    } catch (error) {
      console.log("Error downloading image: ", error.message);
    }
  }

  console.log();

  return (
    <OnboardingCard
      description={""}
      buttonText={"Continue"}
      buttonActive={true}
      buttonAction={handleJoin}
      buttonLoading={loading}
      subButton
      subButtonText={"Cancel"}
      subButtonActive
      subButtonDanger
      subButtonAction={handleBack}
    >
      <AvatarContainer>
        <UserAvatarContainer>
          {loadedAvatar && (
            <>
              <UserAvatar
                src={avatarSrc}
                width={"100%"}
                height={"100%"}
                fill={"cover"}
              />
            </>
          )}
        </UserAvatarContainer>

        <ArrowContainer>
          <ArrowRight stroke={"#130F26"} width={"25px"} />
        </ArrowContainer>
        <CompanyLogo>
          <LunaDeskLogo width={"30px"} fill={"#fff"} />
        </CompanyLogo>
      </AvatarContainer>
      <InnerTitle>
        Join <span>LunaDesk Incoporated</span>?
      </InnerTitle>
      <InnerDesc>
        If this isn't the right company, hit the back button and let your
        company administrator know.
      </InnerDesc>
    </OnboardingCard>
  );
}

export default JoinCompany;
