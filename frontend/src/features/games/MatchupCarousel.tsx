import React, { useRef } from "react";
import styles from "./MatchupCarousel.module.css";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";
import GameInfoBox from "./GameInfoBox";
import { format24HourTo12Hour } from "../../utils/timeUtils";
import { formatDateToDay } from "../../utils/dateUtils";
import { useView } from "../view/ViewContext";
import { ProcessedGame } from "../../hooks/useProcessedSchedule";
import IconButton from "../../components/IconButton";

interface MatchupCarouselProps {
  games: ProcessedGame[];
}

const MatchupCarousel: React.FC<MatchupCarouselProps> = ({ games }) => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const { isMobile, scrollToElement } = useView();

  const scrollLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -200, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: 200, behavior: "smooth" });
    }
  };

  const handleMatchupClick = (game: ProcessedGame) => {
    scrollToElement(`matchup-${game.awayTeam?.code}-${game.homeTeam?.code}`);
  };

  return (
    <div className={`${styles.carouselContainer}`}>
      {!isMobile && <IconButton icon={<LuChevronLeft />} onClick={scrollLeft} />}
      <div className={`${styles.carousel} ${styles.scrollbar} ${styles.scrollbarInvisible}`} ref={carouselRef}>
        {games.map((game) => (
          <GameInfoBox
            key={`${game.awayTeam?.code}-${game.homeTeam?.code}`}
            awayCode={game.awayTeam?.code || ""}
            homeCode={game.homeTeam?.code || ""}
            time={format24HourTo12Hour(game.time)}
            day={formatDateToDay(game.date)}
            starters={game.totals.self.starters}
            opponentStarters={game.totals.opponent.starters}
            isTopGame={game.isTopGame}
            onClick={() => handleMatchupClick(game)}
          />
        ))}
      </div>
      {!isMobile && <IconButton icon={<LuChevronRight />} onClick={scrollRight} />}
    </div>
  );
};

export default MatchupCarousel;
