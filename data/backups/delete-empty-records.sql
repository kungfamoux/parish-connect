-- SQL to delete the two empty records (ID 11776 and 11777)
-- These are the empty records after the last valid record

-- First, let's check what these empty records contain
SELECT id, "S_NO", "BAPTISM_NAME", "SURNAME" 
FROM "baptism_records" 
WHERE id IN (11776, 11777) 
ORDER BY id;

-- Delete the empty records
DELETE FROM "baptism_records" 
WHERE id IN (11776, 11777);

-- Verify deletion
SELECT COUNT(*) as deleted_count FROM "baptism_records" 
WHERE id IN (11776, 11777);

-- Check the highest S_NO after deletion to confirm sequence
SELECT id, "S_NO", "BAPTISM_NAME", "SURNAME" 
FROM "baptism_records" 
ORDER BY "S_NO" DESC 
LIMIT 5;
