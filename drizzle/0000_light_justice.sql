CREATE TABLE `documents` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`content` text DEFAULT '' NOT NULL,
	`parentId` text,
	`isExpanded` integer DEFAULT 0,
	`createdAt` text NOT NULL,
	`updatedAt` text NOT NULL,
	`userId` text,
	`metadata` text,
	`sharing` text,
	FOREIGN KEY (`parentId`) REFERENCES `documents`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `idx_documents_parentId` ON `documents` (`parentId`);--> statement-breakpoint
CREATE INDEX `idx_documents_userId` ON `documents` (`userId`);--> statement-breakpoint
CREATE INDEX `idx_documents_createdAt` ON `documents` (`createdAt`);--> statement-breakpoint
CREATE TABLE `google_docs_sync` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`documentId` text NOT NULL,
	`googleDocId` text NOT NULL,
	`lastSyncedAt` text NOT NULL,
	`userId` text,
	FOREIGN KEY (`documentId`) REFERENCES `documents`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `idx_google_docs_sync_documentId` ON `google_docs_sync` (`documentId`);--> statement-breakpoint
CREATE INDEX `idx_google_docs_sync_googleDocId` ON `google_docs_sync` (`googleDocId`);--> statement-breakpoint
CREATE UNIQUE INDEX `google_docs_sync_documentId_googleDocId_unique` ON `google_docs_sync` (`documentId`,`googleDocId`);--> statement-breakpoint
CREATE TABLE `research_quotes` (
	`id` text PRIMARY KEY NOT NULL,
	`documentId` text NOT NULL,
	`text` text NOT NULL,
	`source` text,
	`author` text,
	`url` text,
	`pageNumber` text,
	`tags` text,
	`createdAt` text NOT NULL,
	FOREIGN KEY (`documentId`) REFERENCES `documents`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `idx_research_quotes_documentId` ON `research_quotes` (`documentId`);--> statement-breakpoint
CREATE INDEX `idx_research_quotes_tags` ON `research_quotes` (`tags`);