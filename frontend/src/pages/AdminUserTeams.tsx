import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAllUserTeams } from "../features/teams/getAllUserTeams";
import { Stack } from "../components/ui/Stack";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import Button from "../components/ui/Button";

const AdminUserTeams: React.FC = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [pagination, setPagination] = useState({
    startAfter: null,
    endBefore: null,
  });
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [filters, setFilters] = useState({});

  const { data, isLoading, error } = useQuery({
    queryKey: ["userTeams", pagination],
    queryFn: () =>
      getAllUserTeams({
        startAfter: pagination.startAfter,
        endBefore: pagination.endBefore,
        limit: limit,
        sortBy: "name",
        sortOrder: "asc",
        filters: {},
      }),
  });

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div>Error: {(error as Error).message}</div>;

  console.log(data);

  return (
    <Stack gap={1}>
      <h2>User Teams</h2>
      <div>
        {data?.teams.map((team: any) => (
          <div key={`${team.userId}-${team.leagueId}`}>{team.docId}</div>
        ))}
      </div>
      <Stack direction="row" gap={1}>
        <Button disabled={!pagination.startAfter} onClick={() => {
            setPagination({
              startAfter: null,
              endBefore: data?.prevEndBefore,
            });
          }}>
          Previous {data?.prevEndBefore}
        </Button>
        <Button disabled={!data?.nextStartAfter} onClick={() => {
            setPagination({
              startAfter: data?.nextStartAfter,
              endBefore: null,
            });
          }}>
          Next {data?.nextStartAfter}
        </Button>
      </Stack>
    </Stack>
  );
};

export default AdminUserTeams;
