-- Insert Parish Pastoral Council Members
-- This script adds the initial pastoral council members to the database

INSERT INTO "parish_pastoral_council" ("S_NO", "NAME", "ZONE", "POSITION", "IS_ACTIVE", "CREATED_AT", "UPDATED_AT") VALUES
(1, 'Very Rev. Msgr. A. Anijielo', NULL, 'Parish Priest Chairman', true, NOW(), NOW()),
(2, 'Rev. Fr. Chinoso Odoh', NULL, 'Vicar Member', true, NOW(), NOW()),
(3, 'Dr Ifendu Ohabuike', NULL, 'DDL Member', true, NOW(), NOW()),
(4, 'Mr Paul Agu', 'Zone 12', '1st Vice Chairman', true, NOW(), NOW()),
(5, 'Chief (Sir) O.O. Apiakason', 'Zone 1', '2nd Vice Chairman', true, NOW(), NOW()),
(6, 'Dr Ifeanyi Ugwu', 'Zone 8', 'Secretary', true, NOW(), NOW()),
(7, 'Mrs Rose Ozodiegwu', 'Zone 7', 'Asst. Secretary', true, NOW(), NOW()),
(8, 'Chief Mrs. J. I. Obi', 'Zone 11', 'Fin. Secretary', true, NOW(), NOW()),
(9, 'Amb. Paulinus Eze', 'Zone 3', 'Treasurer', true, NOW(), NOW()),
(10, 'Mr Emmanuel Chime', 'Zone 13', 'P.R.O', true, NOW(), NOW());

-- Verify the insert
SELECT COUNT(*) as total_members FROM "parish_pastoral_council";
