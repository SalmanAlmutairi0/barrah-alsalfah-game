export interface ChatMessage {
  id: number;
  playerId: number;
  playerName: string;
  message: string;
  timestamp: Date;
}
