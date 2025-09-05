export type ChatMessage = {
  id: number;
  playerID: number;
  playerName: string;
  message: string;
  roundID: number;
  createdAt: Date | null;
};
