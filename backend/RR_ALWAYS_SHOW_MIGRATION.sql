-- Add always_show column to variable_mapping_rr if it doesn't exist
ALTER TABLE variable_mapping_rr ADD COLUMN IF NOT EXISTS always_show BOOLEAN DEFAULT FALSE;

-- Update RR always_show values based on your table
UPDATE variable_mapping_rr SET always_show = TRUE WHERE row_id = 240; -- Resultaträkning
UPDATE variable_mapping_rr SET always_show = TRUE WHERE row_id = 241; -- Rörelseresultat
UPDATE variable_mapping_rr SET always_show = TRUE WHERE row_id = 242; -- Rörelseintäkter, lagerförändringar m.m.
UPDATE variable_mapping_rr SET always_show = TRUE WHERE row_id = 243; -- Nettoomsättning
UPDATE variable_mapping_rr SET always_show = FALSE WHERE row_id = 244; -- Förändringar av lager av produkter i arbete, färdiga varor och pågående arbeten för annans räkning
UPDATE variable_mapping_rr SET always_show = FALSE WHERE row_id = 245; -- Aktiverat arbete för egen räkning
UPDATE variable_mapping_rr SET always_show = FALSE WHERE row_id = 246; -- Övriga rörelseintäkter
UPDATE variable_mapping_rr SET always_show = TRUE WHERE row_id = 247; -- Summa rörelseintäkter, lagerförändringar m.m.
UPDATE variable_mapping_rr SET always_show = TRUE WHERE row_id = 248; -- Rörelsekostnader
UPDATE variable_mapping_rr SET always_show = FALSE WHERE row_id = 249; -- Råvaror och förnödenheter
UPDATE variable_mapping_rr SET always_show = FALSE WHERE row_id = 250; -- Handelsvaror
UPDATE variable_mapping_rr SET always_show = FALSE WHERE row_id = 251; -- Övriga externa kostnader
UPDATE variable_mapping_rr SET always_show = TRUE WHERE row_id = 252; -- Personalkostnader
UPDATE variable_mapping_rr SET always_show = FALSE WHERE row_id = 253; -- Av- och nedskrivningar av materiella och immateriella anläggningstillgångar
UPDATE variable_mapping_rr SET always_show = FALSE WHERE row_id = 254; -- Nedskrivningar av omsättningstillgångar utöver normala nedskrivningar
UPDATE variable_mapping_rr SET always_show = FALSE WHERE row_id = 255; -- Övriga rörelsekostnader
UPDATE variable_mapping_rr SET always_show = TRUE WHERE row_id = 256; -- Summa rörelsekostnader
UPDATE variable_mapping_rr SET always_show = TRUE WHERE row_id = 257; -- Rörelseresultat
UPDATE variable_mapping_rr SET always_show = TRUE WHERE row_id = 258; -- Finansiella poster
UPDATE variable_mapping_rr SET always_show = FALSE WHERE row_id = 259; -- Resultat från andelar i koncernföretag
UPDATE variable_mapping_rr SET always_show = FALSE WHERE row_id = 260; -- Resultat från andelar i intresseföretag och gemensamt styrda företag
UPDATE variable_mapping_rr SET always_show = FALSE WHERE row_id = 261; -- Resultat från övriga företag som det finns ett ägarintresse i
UPDATE variable_mapping_rr SET always_show = FALSE WHERE row_id = 262; -- Resultat från övriga finansiella anläggningstillgångar
UPDATE variable_mapping_rr SET always_show = FALSE WHERE row_id = 263; -- Övriga ränteintäkter och liknande resultatposter
UPDATE variable_mapping_rr SET always_show = FALSE WHERE row_id = 264; -- Nedskrivningar av finansiella anläggningstillgångar och kortfristiga placeringar
UPDATE variable_mapping_rr SET always_show = FALSE WHERE row_id = 265; -- Räntekostnader och liknande resultatposter
UPDATE variable_mapping_rr SET always_show = TRUE WHERE row_id = 266; -- Summa finansiella poster
UPDATE variable_mapping_rr SET always_show = TRUE WHERE row_id = 267; -- Resultat efter finansiella poster
UPDATE variable_mapping_rr SET always_show = TRUE WHERE row_id = 268; -- Bokslutsdispositioner
UPDATE variable_mapping_rr SET always_show = FALSE WHERE row_id = 269; -- Erhållna koncernbidrag
UPDATE variable_mapping_rr SET always_show = FALSE WHERE row_id = 270; -- Lämnade koncernbidrag
UPDATE variable_mapping_rr SET always_show = FALSE WHERE row_id = 271; -- Förändring av periodiseringsfonder
UPDATE variable_mapping_rr SET always_show = FALSE WHERE row_id = 272; -- Förändring av överavskrivningar
UPDATE variable_mapping_rr SET always_show = FALSE WHERE row_id = 273; -- Övriga bokslutsdispositioner
UPDATE variable_mapping_rr SET always_show = TRUE WHERE row_id = 274; -- Summa bokslutsdispositioner
UPDATE variable_mapping_rr SET always_show = TRUE WHERE row_id = 275; -- Resultat före skatt
UPDATE variable_mapping_rr SET always_show = TRUE WHERE row_id = 276; -- Skatter
UPDATE variable_mapping_rr SET always_show = TRUE WHERE row_id = 277; -- Skatt på årets resultat
UPDATE variable_mapping_rr SET always_show = FALSE WHERE row_id = 278; -- Övriga skattekostnader
UPDATE variable_mapping_rr SET always_show = TRUE WHERE row_id = 279; -- Årets resultat

-- Verify the updates
SELECT row_id, row_title, always_show 
FROM variable_mapping_rr 
WHERE row_id BETWEEN 240 AND 279 
ORDER BY row_id;