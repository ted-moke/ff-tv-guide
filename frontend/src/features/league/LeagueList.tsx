import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getLeaguesPaginated, syncLeague } from './leagueAPI';
import Button from '../../components/ui/Button';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import styles from './LeagueList.module.css';

const LeagueList: React.FC = () => {
  const [page, setPage] = useState(1);
  const [startAfter, setStartAfter] = useState<string | undefined>(undefined);
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ['leagues', page, startAfter],
    queryFn: () => getLeaguesPaginated(page, 10, startAfter),
  });

  const syncMutation = useMutation({
    mutationFn: syncLeague,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leagues'] });
    },
  });

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div>Error: {(error as Error).message}</div>;

  return (
    <div className={styles.leagueList}>
      <h2>Leagues</h2>
      <div className={styles.leagueCards}>
        {data.leagues.map((league: any) => (
          <div key={league.id} className={styles.leagueCard}>
            <div className={styles.leagueInfo}>
              <h4>{league.name}</h4>
              <p>
                Last modified: {new Date(league.lastModified).toLocaleString()}
              </p>
            </div>
            <Button 
              onClick={() => syncMutation.mutate(league.id)}
              disabled={syncMutation.isPending}
            >
              {syncMutation.isPending ? 'Syncing...' : 'Sync'}
            </Button>
          </div>
        ))}
      </div>
      {data.hasNextPage && (
        <Button 
          onClick={() => {
            setPage(prev => prev + 1);
            setStartAfter(data.nextStartAfter);
          }}
          className={styles.loadMoreButton}
        >
          Load More
        </Button>
      )}
    </div>
  );
};

export default LeagueList;