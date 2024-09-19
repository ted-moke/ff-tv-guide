import React from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import Button from "../ui/Button";
import styles from "./AdminUserTeams.module.css";

const API_URL = import.meta.env.VITE_API_URL;

const AdminUserTeams: React.FC = () => {
  const {
    data: duplicatesData,
    isLoading: isLoadingDuplicates,
    error: duplicatesError,
  } = useQuery({
    queryKey: ["userTeamDuplicates"],
    queryFn: async () => {
      const response = await fetch(`${API_URL}/user-teams/duplicates`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch duplicates");
      }
      return response.json();
    },
  });

  const removeDuplicatesMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`${API_URL}/user-teams/remove-duplicates`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to remove duplicates");
      }
      return response.json() as Promise<{ message: string }>;
    },
  });

  return (
    <div className={styles.adminUserTeams}>
      <Button
        onClick={() => removeDuplicatesMutation.mutate()}
        disabled={removeDuplicatesMutation.isPending}
        color="danger"
      >
        {removeDuplicatesMutation.isPending
          ? "Removing Duplicates..."
          : "Remove UserTeam Duplicates"}
      </Button>
      {removeDuplicatesMutation.isError && (
        <div className={styles.error}>
          Error: {(removeDuplicatesMutation.error as Error).message}
        </div>
      )}
      {removeDuplicatesMutation.isSuccess && (
        <div className={styles.success}>Duplicates removed successfully.</div>
      )}
      <h2>Duplicate User Teams</h2>
      {isLoadingDuplicates ? (
        <p>Loading duplicates...</p>
      ) : duplicatesError ? (
        <p>Error loading duplicates: {(duplicatesError as Error).message}</p>
      ) : duplicatesData?.duplicates && duplicatesData.duplicates.length < 1 ? (
        <p>No duplicates found</p>
      ) : (
        <ul>
          {duplicatesData.duplicates.map((duplicate: any, index: number) => (
            <li
              key={index}
            >{`User ID: ${duplicate.userId}, Team ID: ${duplicate.teamId}`}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AdminUserTeams;
