import { useContext } from "react";
import { VotesContext } from "@/context/votesContext";

export function useVotes() {
  const context = useContext(VotesContext);
  if (context === undefined) {
    throw new Error("useVotes must be used within a VotesProvider");
  }
  return context;
}
