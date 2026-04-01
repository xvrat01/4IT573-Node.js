CREATE TABLE `answers` (
	`gameId` integer NOT NULL,
	`userId` integer NOT NULL,
	`questionId` integer NOT NULL,
	`answerText` text,
	`correct` integer DEFAULT false NOT NULL,
	PRIMARY KEY(`gameId`, `userId`, `questionId`),
	FOREIGN KEY (`gameId`) REFERENCES `games`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`questionId`) REFERENCES `questions`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `gamePlayers` (
	`gameId` integer NOT NULL,
	`userId` integer NOT NULL,
	`score` integer DEFAULT 0 NOT NULL,
	PRIMARY KEY(`gameId`, `userId`),
	FOREIGN KEY (`gameId`) REFERENCES `games`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `gameQuestionSets` (
	`round` integer NOT NULL,
	`orderInRound` integer NOT NULL,
	`gameId` integer NOT NULL,
	`setId` integer NOT NULL,
	PRIMARY KEY(`gameId`, `setId`),
	FOREIGN KEY (`gameId`) REFERENCES `games`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`setId`) REFERENCES `questionSets`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `unique_set_in_round` ON `gameQuestionSets` (`gameId`,`round`,`orderInRound`);--> statement-breakpoint
CREATE TABLE `games` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`adminID` integer NOT NULL,
	`gamePin` text NOT NULL,
	`maxPlayers` integer NOT NULL,
	`currentQuestionId` integer,
	`status` text DEFAULT 'waiting',
	`active` integer DEFAULT false NOT NULL,
	FOREIGN KEY (`adminID`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`currentQuestionId`) REFERENCES `questions`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `games_gamePin_unique` ON `games` (`gamePin`);--> statement-breakpoint
CREATE TABLE `questionSets` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `questionSets_name_unique` ON `questionSets` (`name`);--> statement-breakpoint
CREATE TABLE `questions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`orderInSet` integer NOT NULL,
	`setId` integer NOT NULL,
	`questionText` text NOT NULL,
	`answerText` text NOT NULL,
	FOREIGN KEY (`setId`) REFERENCES `questionSets`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `unique_order_in_set` ON `questions` (`setId`,`orderInSet`);--> statement-breakpoint
CREATE TABLE `users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`userName` text NOT NULL,
	`password` text NOT NULL,
	`role` text DEFAULT 'player' NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_userName_unique` ON `users` (`userName`);