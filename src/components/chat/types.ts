export interface ChatMessage {
  id: number;
  player_id: number;
  player_name: string;
  message: string;
  round_id: number;
  created_at: string;
}
