import { sqliteTable, int, real, text, uniqueIndex, primaryKey } from "drizzle-orm/sqlite-core";

export const usersTable = sqliteTable("users", {
  id: int().primaryKey({ autoIncrement: true }),
  userName: text().notNull().unique(),
  password: text().notNull(),
  role: text({ enum: ["admin", "player"] }).notNull().default("player"),
})

// -----Otázky-----
export const questionSetsTable = sqliteTable("questionSets", {
    id: int().primaryKey({ autoIncrement: true }),
    name: text().notNull().unique(),
})

export const questionsTable = sqliteTable("questions", {
    id: int().primaryKey({ autoIncrement: true }),
    setId: int().references(() => questionSetsTable.id).notNull(),
    orderInSet: int().notNull(),
    type: text({ enum: ["open_single", "open_double", "multiple_choice", "number_guess"] }).notNull(),
    questionText: text().notNull(),
    mediaType: text({ enum: ["image", "video", "audio"] }),
    mediaUrl: text(),
}, (table) => [
    uniqueIndex("unique_order_in_set").on(table.setId, table.orderInSet)
])

export const openSingleQuestionTable = sqliteTable("openSingleDetails", {
    questionId: int().references(() => questionsTable.id).notNull(),
    correctText: text().notNull(),
    points: real().notNull().default(1),
}, (table) => [
    primaryKey({ columns: [table.questionId] }),
]);

export const openDoubleQuestionTable = sqliteTable("openDoubleDetails", {
    questionId: int().references(() => questionsTable.id).notNull(),
    correctText1: text().notNull(),
    correctText2: text().notNull(),
    pointsPart1: real().notNull().default(0.5),
    pointsPart2: real().notNull().default(0.5),
}, (table) => [
    primaryKey({ columns: [table.questionId] }),
]);

export const multipleChoiceQuestionTable = sqliteTable("multipleChoiceDetails", {
    questionId: int().references(() => questionsTable.id).notNull(),
    points: real().notNull().default(1),
    options: text({ mode: "json" }).notNull(), // { 0: optionA, 1: optionB ...}
    correctAnswerIndex: int().notNull(),
}, (table) => [
    primaryKey({ columns: [table.questionId] }),
]);

export const numberGuessQuestionTable = sqliteTable("numberGuessDetails", {
    questionId: int().references(() => questionsTable.id).notNull(),
    targetValue: real().notNull(),
    tolerance: real(),
    points: real().notNull().default(1),
}, (table) => [
    primaryKey({ columns: [table.questionId] }),
]);

// -----Hry-----
export const gamesTable = sqliteTable("games", {
    id: int().primaryKey({ autoIncrement: true }),
    adminID: int().references(() => usersTable.id).notNull(),
    gamePin: text().notNull().unique(),
    maxPlayers: int().notNull(),
    currentQuestionId: int().references(() => questionsTable.id),
    status: text({ enum: [
        "waiting", "round-start", "round-finish", "round-answers",
        "question-display", "question-answering", "question-closed",
        "round-results", "final results"] }).default("waiting"),
    active: int({ mode: "boolean" }).notNull().default(false),
})

export const gameQuestionSetsTable = sqliteTable("gameQuestionSets", {
    round: int().notNull(),
    orderInRound: int().notNull(),
    gameId: int().references(() => gamesTable.id).notNull(),
    setId: int().references(() => questionSetsTable.id).notNull(),
}, (table) => [
    primaryKey({ columns: [table.gameId, table.setId] }),
    uniqueIndex("unique_set_in_round").on(table.gameId, table.round, table.orderInRound)
])

export const gamePlayersTable = sqliteTable("gamePlayers", {
    gameId: int().references(() => gamesTable.id).notNull(),
    userId: int().references(() => usersTable.id).notNull(),
    score: real().notNull().default(0),
}, (table) => [
    primaryKey({ columns: [table.gameId, table.userId] })
])

export const answersTable = sqliteTable("answers", {
    gameId: int().references(() => gamesTable.id).notNull(),
    userId: int().references(() => usersTable.id).notNull(),
    questionId: int().references(() => questionsTable.id).notNull(),
    answerText: text(), // pro otevřené otázky s jedním inputem
    answerText1: text(), // pro otevřené otázky s více částmi
    answerText2: text(),
    selectedOptionsKey: int(), // pro otázky s výběrem z možností
    numberGuessAnswer: real(), // pro otázky s odhadem čísla
    isEvaluated: int({ mode: "boolean" }).notNull().default(false),
    awardedPoints: real().default(0),
}, (table) => [
    primaryKey({ columns: [table.gameId, table.userId, table.questionId] })
])