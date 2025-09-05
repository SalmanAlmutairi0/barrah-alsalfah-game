import {
  boolean,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const playerTable = pgTable("players", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  roomID: integer("room_id"),
  score: integer("score").default(0).notNull(),
  isHost: boolean("is_host"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const roomTable = pgTable("rooms", {
  id: serial("id").primaryKey(),
  hostID: integer("host_id").references(() => playerTable.id),
  status: text("status"),
  roundNumber: integer("round_number").default(1),
  roomKey: text("room_key"),
  selectedCatagory: integer("selected_catagory").references(
    () => catagoryTable.id
  ), // add foreign key to catagory table
  createdAt: timestamp("created_at").defaultNow(),
});

export const catagoryTable = pgTable("catagories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  icon: text("icon").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const wordsTable = pgTable("words", {
  id: serial("id").primaryKey(),
  word: text("word"),
  catagoryID: integer("catagory_id").references(() => catagoryTable.id),
  createdAt: timestamp("created_at").defaultNow(),
});

export const roundsTable = pgTable("rounds", {
  id: serial("id").primaryKey(),
  imposterID: integer("imposter_id").references(() => playerTable.id).notNull(),
  roomID: integer("room_id").references(() => roomTable.id),
  secretWord: text("secret_word").notNull(),
  categoryID: integer("category_id").references(() => catagoryTable.id),
  startedAt: timestamp("started_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const votesTable = pgTable("votes", {
  id: serial("id").primaryKey(),
  roundID: integer("round_id").references(() => roundsTable.id).notNull(),
  voterID: integer("voter_id").references(() => playerTable.id).notNull(),
  targetID: integer("target_id").references(() => playerTable.id).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const messagesTable = pgTable("messages", {
  id: serial("id").primaryKey(),
  playerID: integer("player_id").references(() => playerTable.id).notNull(),
  roundID: integer("round_id").references(() => roundsTable.id).notNull(),
  playerName: text("player_name").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});
