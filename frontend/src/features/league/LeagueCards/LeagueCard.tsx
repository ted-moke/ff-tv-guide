import React from "react";
import { LeagueCardData } from "../useLeagueCards";
import { LeagueCardDesktop } from "./LeagueCardDesktop";
import { LeagueCardMobile } from "./LeagueCardMobile";
import { useView } from "../../view/ViewContext";
import { LeagueCardWeekRemaining } from "./LeagueCardWeekRemaining";

interface LeagueCardProps {
  cardData: LeagueCardData;
  onToggleExpansion: (teamId: string) => void;
  hasWeekStarted: boolean;
  selectedTeamId: string | null;
}

export const LeagueCard: React.FC<LeagueCardProps> = ({
  selectedTeamId,
  cardData,
  onToggleExpansion,
  hasWeekStarted,
}) => {
  const { isMobile } = useView();

  return <LeagueCardWeekRemaining data={cardData} />

  if (isMobile) {
    return (
      <LeagueCardMobile
        cardData={cardData}
        onToggleExpansion={onToggleExpansion}
        hasWeekStarted={hasWeekStarted}
        selectedTeamId={selectedTeamId}
      />
    );
  }

  return (
    <LeagueCardDesktop
      cardData={cardData}
      onToggleExpansion={onToggleExpansion}
      hasWeekStarted={hasWeekStarted}
      selectedTeamId={selectedTeamId}
    />
  );
};
