import React, { useRef } from "react";
import styles from "./MatchupCarousel.module.css";
import { LuArrowBigLeft, LuArrowBigRight } from "react-icons/lu";
import GameInfoBox from "./GameInfoBox";
import { format24HourTo12Hour } from "../../utils/timeUtils";
import { formatDateToDay } from "../../utils/dateUtils";

interface MatchupCarouselProps {
  games: any[]; // Replace 'any' with the correct type for your games
}

const MatchupCarousel: React.FC<MatchupCarouselProps> = ({ games }) => {
  const carouselRef = useRef<HTMLDivElement>(null);

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

  return (
    <div className={styles.carouselContainer}>
      <button onClick={scrollLeft} className={styles.carouselButton}>
        <LuArrowBigLeft />
      </button>
      <div className={styles.carousel} ref={carouselRef}>
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
          />
        ))}
      </div>
      <button onClick={scrollRight} className={styles.carouselButton}>
        <LuArrowBigRight />
      </button>
    </div>
  );
};

export default MatchupCarousel;