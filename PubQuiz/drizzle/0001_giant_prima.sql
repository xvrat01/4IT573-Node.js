CREATE TABLE `multipleChoiceDetails` (
	`questionId` integer PRIMARY KEY NOT NULL,
	`points` real DEFAULT 1 NOT NULL,
	`options` text NOT NULL,
	`correctAnswerIndex` integer NOT NULL,
	FOREIGN KEY (`questionId`) REFERENCES `questions`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `numberGuessDetails` (
	`questionId` integer PRIMARY KEY NOT NULL,
	`targetValue` real NOT NULL,
	`tolerance` real,
	`points` real DEFAULT 1 NOT NULL,
	FOREIGN KEY (`questionId`) REFERENCES `questions`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `openDoubleDetails` (
	`questionId` integer PRIMARY KEY NOT NULL,
	`correctText1` text NOT NULL,
	`correctText2` text NOT NULL,
	`pointsPart1` real DEFAULT 0.5 NOT NULL,
	`pointsPart2` real DEFAULT 0.5 NOT NULL,
	FOREIGN KEY (`questionId`) REFERENCES `questions`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `openSingleDetails` (
	`questionId` integer PRIMARY KEY NOT NULL,
	`correctText` text NOT NULL,
	`points` real DEFAULT 1 NOT NULL,
	FOREIGN KEY (`questionId`) REFERENCES `questions`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_gamePlayers` (
	`gameId` integer NOT NULL,
	`userId` integer NOT NULL,
	`score` real DEFAULT 0 NOT NULL,
	PRIMARY KEY(`gameId`, `userId`),
	FOREIGN KEY (`gameId`) REFERENCES `games`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_gamePlayers`("gameId", "userId", "score") SELECT "gameId", "userId", "score" FROM `gamePlayers`;--> statement-breakpoint
DROP TABLE `gamePlayers`;--> statement-breakpoint
ALTER TABLE `__new_gamePlayers` RENAME TO `gamePlayers`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
ALTER TABLE `answers` ADD `answerText1` text;--> statement-breakpoint
ALTER TABLE `answers` ADD `answerText2` text;--> statement-breakpoint
ALTER TABLE `answers` ADD `selectedOptionsKey` integer;--> statement-breakpoint
ALTER TABLE `answers` ADD `numberGuessAnswer` real;--> statement-breakpoint
ALTER TABLE `answers` ADD `isEvaluated` integer DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `answers` ADD `awardedPoints` real DEFAULT 0;--> statement-breakpoint
ALTER TABLE `answers` DROP COLUMN `correct`;--> statement-breakpoint
ALTER TABLE `questions` ADD `type` text NOT NULL;--> statement-breakpoint
ALTER TABLE `questions` ADD `mediaType` text;--> statement-breakpoint
ALTER TABLE `questions` ADD `mediaUrl` text;--> statement-breakpoint
ALTER TABLE `questions` DROP COLUMN `answerText`;