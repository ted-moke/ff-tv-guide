
const API_URL = import.meta.env.VITE_API_URL;

export const getAllUserTeams = async ({
  startAfter,
  endBefore,
  limit,
  sortBy,
  sortOrder,
}: {
  startAfter: string | null;
  endBefore: string | null;
  limit: number;
  sortBy: string;
  sortOrder: string;
}) => {
  const url = new URL(`${API_URL}/user-teams`);
  url.searchParams.append("limit", limit.toString());
  url.searchParams.append("sortBy", sortBy);
  url.searchParams.append("sortOrder", sortOrder);
  if (startAfter) {
    url.searchParams.append("startAfter", startAfter);
  }
  if (endBefore) {
    url.searchParams.append("endBefore", endBefore);
  }
  const response = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("authToken")}`,
    },
  });
  return response.json();
};
