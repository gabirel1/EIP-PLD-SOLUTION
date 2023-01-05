USE PldHandler;
ALTER TABLE `cards` ADD `card_status` INT NOT NULL DEFAULT 0;

-- card_status:
-- 0 - not started
-- 1 - in progress
-- 2 - done