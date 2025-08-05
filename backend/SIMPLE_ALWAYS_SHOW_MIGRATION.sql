-- Add always_show column to both tables
ALTER TABLE variable_mapping_rr ADD COLUMN IF NOT EXISTS always_show BOOLEAN DEFAULT FALSE;
ALTER TABLE variable_mapping_br ADD COLUMN IF NOT EXISTS always_show BOOLEAN DEFAULT FALSE;

-- Update RR: Set TRUE for specific row_ids
UPDATE variable_mapping_rr SET always_show = TRUE WHERE row_id IN (240,241,242,243,247,248,252,256,257,258,266,267,268,274,275,276,277,279);

-- Update BR: Set TRUE for specific row_ids  
UPDATE variable_mapping_br SET always_show = TRUE WHERE row_id IN (310,311,313,339,340,362,363,365,366,367,368,369,370,371,376,377,379,380,381,382,417);

-- Verify: Show count of TRUE values
SELECT 'RR TRUE count' as table_name, COUNT(*) as count FROM variable_mapping_rr WHERE always_show = TRUE;
SELECT 'BR TRUE count' as table_name, COUNT(*) as count FROM variable_mapping_br WHERE always_show = TRUE;