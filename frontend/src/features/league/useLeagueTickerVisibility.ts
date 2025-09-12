import { useState, useEffect } from "react";

export const useLeagueTickerVisibility = () => {
  const [isTickerVisible, setIsTickerVisible] = useState(false);

  useEffect(() => {
    let lastExecuted = 0;
    const throttleDelay = 16; // ~60fps
    
    const handleScroll = () => {
    // const handleScroll = (event?: Event) => {
      const now = Date.now();
      
      // Throttle: only execute if enough time has passed since last execution
      if (now - lastExecuted >= throttleDelay) {
        lastExecuted = now;
        // console.log('🔄 Scroll event triggered!', {
        //   target: event?.target,
        //   currentTarget: event?.currentTarget,
        //   scrollY: window.scrollY,
        //   scrollTop: (event?.target as Element)?.scrollTop
        // });
        
        const leagueCardsSection = document.querySelector('[data-section="league-cards"]') || 
                                   document.querySelector('.leagueCardsSection');
        
        if (!leagueCardsSection) {
          // console.log('❌ League cards section not found, showing ticker');
          setIsTickerVisible(true);
          return;
        }

        const rect = leagueCardsSection.getBoundingClientRect();
        // const windowHeight = window.innerHeight;
        
        // Hide ticker when league cards are visible (within 100px of top)
        // Show ticker when user has scrolled past the league grid
        // If the bottom of the league cards section is above the viewport (scrolled past), show ticker
        // If the league cards section is still visible in the viewport, hide ticker
        const shouldShowTicker = rect.bottom < 100;
        
        // console.log('📊 Scroll check:', {
        //   rectTop: rect.top,
        //   rectBottom: rect.bottom,
        //   rectHeight: rect.height,
        //   windowHeight,
        //   threshold: 100,
        //   shouldShowTicker,
        //   currentTickerVisible: isTickerVisible,
        //   scrollTop: contentArea?.scrollTop || 0
        // });
        
        setIsTickerVisible(shouldShowTicker);
      }
    };

    // Initial check with a small delay to ensure DOM is rendered
    setTimeout(handleScroll, 500);

    // Add scroll listeners to both window and content area
    const contentArea = document.getElementById('layout-content');
    
    // Listen to content area scroll (this is the main scrolling container)
    if (contentArea) {
      // console.log('✅ Found content area, adding scroll listener');
      contentArea.addEventListener('scroll', handleScroll, { passive: true });
    } else {
      // console.log('❌ Content area not found, falling back to window scroll');
      window.addEventListener('scroll', handleScroll, { passive: true });
    }
    
    // Add MutationObserver to detect when league cards change size
    const leagueCardsSection = document.querySelector('[data-section="league-cards"]') || 
                               document.querySelector('.leagueCardsSection');
    
    let mutationObserver: MutationObserver | null = null;
    if (leagueCardsSection) {
      mutationObserver = new MutationObserver(() => {
        // console.log('🔍 League cards section changed, rechecking visibility');
        handleScroll();
      });
      
      mutationObserver.observe(leagueCardsSection, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['class', 'style']
      });
    }
    
    // Cleanup
    return () => {
      if (contentArea) {
        contentArea.removeEventListener('scroll', handleScroll);
      } else {
        window.removeEventListener('scroll', handleScroll);
      }
      if (mutationObserver) {
        mutationObserver.disconnect();
      }
    };
  }, []);

  return isTickerVisible;
};
