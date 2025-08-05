-- Add block_group column to both RR and BR mapping tables
-- This allows us to group related items together for better visibility control

-- Add block_group to RR table
ALTER TABLE variable_mapping_rr 
ADD COLUMN block_group TEXT;

-- Add block_group to BR table  
ALTER TABLE variable_mapping_br 
ADD COLUMN block_group TEXT;

-- Update RR mappings with block groups
-- Group 1: Rörelseintäkter
UPDATE variable_mapping_rr SET block_group = 'roreseintakter' WHERE row_id BETWEEN 10 AND 29;

-- Group 2: Rörelsekostnader  
UPDATE variable_mapping_rr SET block_group = 'rorelsekostnader' WHERE row_id BETWEEN 30 AND 59;

-- Group 3: Finansiella poster
UPDATE variable_mapping_rr SET block_group = 'finansiella_poster' WHERE row_id BETWEEN 60 AND 79;

-- Group 4: Skatt och resultat
UPDATE variable_mapping_rr SET block_group = 'skatt_resultat' WHERE row_id BETWEEN 80 AND 99;

-- Update BR mappings with block groups
-- Group 1: Immateriella anläggningstillgångar
UPDATE variable_mapping_br SET block_group = 'immateriella_anlaggningar' WHERE row_id BETWEEN 310 AND 329;

-- Group 2: Materiella anläggningstillgångar  
UPDATE variable_mapping_br SET block_group = 'materiella_anlaggningar' WHERE row_id BETWEEN 330 AND 349;

-- Group 3: Finansiella anläggningstillgångar
UPDATE variable_mapping_br SET block_group = 'finansiella_anlaggningar' WHERE row_id BETWEEN 350 AND 359;

-- Group 4: Varulager
UPDATE variable_mapping_br SET block_group = 'varulager' WHERE row_id BETWEEN 360 AND 369;

-- Group 5: Kortfristiga fordringar
UPDATE variable_mapping_br SET block_group = 'kortfristiga_fordringar' WHERE row_id BETWEEN 370 AND 379;

-- Group 6: Eget kapital
UPDATE variable_mapping_br SET block_group = 'eget_kapital' WHERE row_id BETWEEN 380 AND 389;

-- Group 7: Obeskattade reserver
UPDATE variable_mapping_br SET block_group = 'obeskattade_reserver' WHERE row_id BETWEEN 390 AND 399;

-- Group 8: Avsättningar
UPDATE variable_mapping_br SET block_group = 'avsattningar' WHERE row_id BETWEEN 400 AND 409;

-- Group 9: Långfristiga skulder
UPDATE variable_mapping_br SET block_group = 'langfristiga_skulder' WHERE row_id BETWEEN 410 AND 419;

-- Group 10: Kortfristiga skulder
UPDATE variable_mapping_br SET block_group = 'kortfristiga_skulder' WHERE row_id BETWEEN 420 AND 439;