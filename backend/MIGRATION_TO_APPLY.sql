-- ======================================================================
-- MIGRATION: Add block_group column to RR and BR mapping tables
-- ======================================================================
-- Execute this SQL in your Supabase SQL Editor (Dashboard > SQL Editor)
-- This adds block_group column to the left of the style column for better organization

-- Step 1: Add block_group column to RR table
ALTER TABLE variable_mapping_rr 
ADD COLUMN block_group TEXT;

-- Step 2: Add block_group column to BR table
ALTER TABLE variable_mapping_br 
ADD COLUMN block_group TEXT;

-- Step 3: Update RR mappings with block groups
-- Group 1: Rörelseintäkter (H2 + content + sum)
UPDATE variable_mapping_rr SET block_group = 'rorelseintakter' WHERE row_id BETWEEN 242 AND 247;

-- Group 2: Rörelsekostnader (H2 + content + sum)
UPDATE variable_mapping_rr SET block_group = 'rorelsekostnader' WHERE row_id BETWEEN 248 AND 256;

-- Group 3: Finansiella poster (H1 + content + sum)
UPDATE variable_mapping_rr SET block_group = 'finansiella_poster' WHERE row_id BETWEEN 258 AND 266;

-- Group 4: Bokslutsdispositioner (H1 + content + sum)
UPDATE variable_mapping_rr SET block_group = 'bokslutsdispositioner' WHERE row_id BETWEEN 268 AND 274;

-- Group 5: Skatter (H1 + content)
UPDATE variable_mapping_rr SET block_group = 'skatter' WHERE row_id BETWEEN 276 AND 278;

-- Step 4: Update BR mappings with block groups
-- Group 1: Immateriella anläggningstillgångar (H3 + content + sum)
UPDATE variable_mapping_br SET block_group = 'immateriella_anlaggningar' WHERE row_id BETWEEN 314 AND 319;

-- Group 2: Materiella anläggningstillgångar (H3 + content + sum)  
UPDATE variable_mapping_br SET block_group = 'materiella_anlaggningar' WHERE row_id BETWEEN 320 AND 327;

-- Group 3: Finansiella anläggningstillgångar (H3 + content + sum)
UPDATE variable_mapping_br SET block_group = 'finansiella_anlaggningar' WHERE row_id BETWEEN 328 AND 338;

-- Group 4: Varulager m.m. (H3 + content + sum)
UPDATE variable_mapping_br SET block_group = 'varulager' WHERE row_id BETWEEN 341 AND 348;

-- Group 5: Kortfristiga fordringar (H3 + content + sum)
UPDATE variable_mapping_br SET block_group = 'kortfristiga_fordringar' WHERE row_id BETWEEN 349 AND 357;

-- Group 6: Kortfristiga placeringar (H3 + content + sum)
UPDATE variable_mapping_br SET block_group = 'kortfristiga_placeringar' WHERE row_id BETWEEN 358 AND 361;

-- Group 7: Kassa och bank (H3 + content + sum)
UPDATE variable_mapping_br SET block_group = 'kassa_bank' WHERE row_id BETWEEN 362 AND 365;

-- Group 8: Bundet eget kapital (H3 + content + sum)
UPDATE variable_mapping_br SET block_group = 'bundet_eget_kapital' WHERE row_id BETWEEN 370 AND 376;

-- Group 9: Fritt eget kapital (H3 + content + sum)
UPDATE variable_mapping_br SET block_group = 'fritt_eget_kapital' WHERE row_id BETWEEN 377 AND 381;

-- Group 10: Obeskattade reserver (H2 + content + sum)
UPDATE variable_mapping_br SET block_group = 'obeskattade_reserver' WHERE row_id BETWEEN 383 AND 387;

-- Group 11: Avsättningar (H2 + content + sum)
UPDATE variable_mapping_br SET block_group = 'avsattningar' WHERE row_id BETWEEN 388 AND 392;

-- Group 12: Långfristiga skulder (H2 + content + sum)
UPDATE variable_mapping_br SET block_group = 'langfristiga_skulder' WHERE row_id BETWEEN 393 AND 401;

-- Group 13: Kortfristiga skulder (H2 + content + sum)
UPDATE variable_mapping_br SET block_group = 'kortfristiga_skulder' WHERE row_id BETWEEN 402 AND 416;

-- ======================================================================
-- VERIFICATION QUERIES (Optional - run these to verify the migration)
-- ======================================================================

-- Check RR block groups
SELECT block_group, COUNT(*) as count, MIN(row_id) as start_id, MAX(row_id) as end_id
FROM variable_mapping_rr 
WHERE block_group IS NOT NULL
GROUP BY block_group 
ORDER BY MIN(row_id);

-- Check BR block groups  
SELECT block_group, COUNT(*) as count, MIN(row_id) as start_id, MAX(row_id) as end_id
FROM variable_mapping_br 
WHERE block_group IS NOT NULL
GROUP BY block_group 
ORDER BY MIN(row_id);

-- ======================================================================
-- MIGRATION COMPLETE
-- ======================================================================