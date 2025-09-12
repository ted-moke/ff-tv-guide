import React from "react";
import { LeagueCardData } from "../useLeagueCards";
import { LeagueCardDesktop } from "./LeagueCardDesktop";
import { LeagueCardMobile } from "./LeagueCardMobile";
import { useView } from "../../view/ViewContext";

interface LeagueCardProps {
  cardData: LeagueCardData;
  onToggleExpansion: (teamId: string) => void;
  hasWeekStarted: boolean;
}

export const LeagueCard: React.FC<LeagueCardProps> = ({
  cardData,
  onToggleExpansion,
  hasWeekStarted,
}) => {
  const { isMobile } = useView();

  if (isMobile) {
    return (
      <LeagueCardMobile
        cardData={cardData}
        onToggleExpansion={onToggleExpansion}
        hasWeekStarted={hasWeekStarted}
      />
    );
  }

  return (
    <LeagueCardDesktop
      cardData={cardData}
      onToggleExpansion={onToggleExpansion}
      hasWeekStarted={hasWeekStarted}
    />
  );
};
