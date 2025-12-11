import React, { useState, useRef, useEffect } from "react";
import styles from "./LeagueCardsSection.module.css";
import { LeagueCard } from "./LeagueCard";
import { useLeagueCards } from "../useLeagueCards";
import { useView } from "../../view/ViewContext";
import { useHorizontalSwipe } from "../../../utils/touchUtils";
import LinkButton, { LinkButtonColor } from "../../../components/ui/LinkButton";
import { Stack } from "../../../components/ui/Stack";

const ITEMS_PER_PAGE = 2;
export const LeagueCardsSection: React.FC = () => {
  const {
    leagueCardsData,
    toggleCardExpansion,
    selectedTeamId,
    portfolioData,
  } = useLeagueCards();
  const { selectedWeek, hasWeekStarted, isMobile, thruSundayDayGames } =
    useView();
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  if (!leagueCardsData || leagueCardsData.length === 0) {
    return null;
  }

  // Mobile pagination logic
  const shouldShowPagination =
    isMobile && leagueCardsData.length > ITEMS_PER_PAGE;
  const totalPages = Math.ceil(leagueCardsData.length / ITEMS_PER_PAGE);

  const displayedCards =
    shouldShowPagination && !isExpanded
      ? leagueCardsData.slice(
          currentPage * ITEMS_PER_PAGE,
          (currentPage + 1) * ITEMS_PER_PAGE
        )
      : leagueCardsData;

  const handleToggleExpansion = () => {
    setIsExpanded(!isExpanded);
    if (!isExpanded) {
      setCurrentPage(0); // Reset to first page when expanding
    }
  };

  // Touch gesture handlers using the utility
  const { onTouchStart, onTouchMove, onTouchEnd } = useHorizontalSwipe(
    // Swipe left - next page
    () => {
      if (shouldShowPagination && !isExpanded) {
        setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1));
      }
    },
    // Swipe right - previous page
    () => {
      if (shouldShowPagination && !isExpanded) {
        setCurrentPage((prev) => Math.max(prev - 1, 0));
      }
    },
    50 // threshold
  );

  // Reset to first page when switching weeks or when data changes
  useEffect(() => {
    setCurrentPage(0);
  }, [selectedWeek, leagueCardsData.length]);

  const winsIncludingTrending = portfolioData.wins + portfolioData.trendingWins;
  const lossesIncludingTrending =
    portfolioData.losses + portfolioData.trendingLosses;
  const tiesIncludingTrending = portfolioData.ties + portfolioData.trendingTies;
  const hasTrending =
    portfolioData.trendingWins > 0 ||
    portfolioData.trendingLosses > 0 ||
    portfolioData.trendingTies > 0;

  return (
    <div className={styles.leagueCardsSection} data-section="league-cards">
      {!thruSundayDayGames ? (
        <h2 className={styles.sectionTitle}>
          My Leagues - Week {selectedWeek}
        </h2>
      ) : (
        <Stack direction="row" align="center"  gap={0.5}>
          {hasTrending ? (
            <Stack direction="row" align="center" justify="start" gap={0.5} className={styles.recordContainer}>
              <h2 className={styles.sectionTitle}>This Week:</h2>
              <Stack direction="row" align="center" justify="start" gap={0.1}>
                <p>{winsIncludingTrending}</p>
                <p>-</p>
                <p>{lossesIncludingTrending}</p>
                <p>-</p>
                <p>{tiesIncludingTrending}</p>
              </Stack>
            </Stack>
          ) : (
            <Stack direction="row" align="center" justify="start" gap={0.5} className={styles.recordContainer} >
              <h2 className={styles.sectionTitle}>Complete:</h2>
              <Stack direction="row" align="center" justify="start" gap={0.1}>
                <p className={styles.recordValue}>{portfolioData.wins}</p>
                <p>-</p>
                <p className={styles.recordValue}>{portfolioData.losses}</p>
                <p>-</p>
                <p className={styles.recordValue}>{portfolioData.ties}</p>
              </Stack>
            </Stack>
          )}
        </Stack>
      )}
      <div
        ref={containerRef}
        className={`${styles.leagueCardsGrid} ${
          selectedTeamId !== null ? styles.expanded : ""
        }`}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {displayedCards.map((cardData) => (
          <LeagueCard
            selectedTeamId={selectedTeamId}
            key={cardData.team.id}
            cardData={cardData}
            onToggleExpansion={toggleCardExpansion}
            hasWeekStarted={hasWeekStarted}
          />
        ))}
      </div>
      {shouldShowPagination && (
        <div className={styles.paginationControls}>
          <div className={styles.pageIndicator}>
            {Array.from({ length: totalPages }).map((_, index) => (
              <button
                key={index}
                className={`${styles.pip} ${
                  index === currentPage ? styles.pipActive : ""
                }`}
                onClick={() => setCurrentPage(index)}
                aria-label={`Go to page ${index + 1}`}
              />
            ))}
          </div>
          <LinkButton
            color={LinkButtonColor.MUTED}
            onClick={handleToggleExpansion}
          >
            <p className={styles.expandButtonText}>
              {isExpanded ? "Collapse" : `Show All`}
            </p>
          </LinkButton>
        </div>
      )}
    </div>
  );
};
