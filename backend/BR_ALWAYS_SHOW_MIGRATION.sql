-- Add always_show column to variable_mapping_br if it doesn't exist
ALTER TABLE variable_mapping_br ADD COLUMN IF NOT EXISTS always_show BOOLEAN DEFAULT FALSE;

-- Update BR always_show values based on your table
UPDATE variable_mapping_br SET always_show = TRUE WHERE row_id = 310; -- Balansräkning
UPDATE variable_mapping_br SET always_show = TRUE WHERE row_id = 311; -- Tillgångar
UPDATE variable_mapping_br SET always_show = FALSE WHERE row_id = 312; -- Tecknat men ej inbetalt kapital
UPDATE variable_mapping_br SET always_show = TRUE WHERE row_id = 313; -- Anläggningstillgångar
UPDATE variable_mapping_br SET always_show = FALSE WHERE row_id = 314; -- Immateriella anläggningstillgångar
UPDATE variable_mapping_br SET always_show = FALSE WHERE row_id = 315; -- Koncessioner, patent, licenser, varumärken samt liknande rättigheter
UPDATE variable_mapping_br SET always_show = FALSE WHERE row_id = 316; -- Hyresrätter och liknande rättigheter
UPDATE variable_mapping_br SET always_show = FALSE WHERE row_id = 317; -- Goodwill
UPDATE variable_mapping_br SET always_show = FALSE WHERE row_id = 318; -- Förskott avseende immateriella anläggningstillgångar
UPDATE variable_mapping_br SET always_show = FALSE WHERE row_id = 319; -- Summa immateriella anläggningstillgångar
UPDATE variable_mapping_br SET always_show = FALSE WHERE row_id = 320; -- Materiella anläggningstillgångar
UPDATE variable_mapping_br SET always_show = FALSE WHERE row_id = 321; -- Byggnader och mark
UPDATE variable_mapping_br SET always_show = FALSE WHERE row_id = 322; -- Maskiner och andra tekniska anläggningar
UPDATE variable_mapping_br SET always_show = FALSE WHERE row_id = 323; -- Inventarier, verktyg och installationer
UPDATE variable_mapping_br SET always_show = FALSE WHERE row_id = 324; -- Förbättringsutgifter på annans fastighet
UPDATE variable_mapping_br SET always_show = FALSE WHERE row_id = 325; -- Övriga materiella anläggningstillgångar
UPDATE variable_mapping_br SET always_show = FALSE WHERE row_id = 326; -- Pågående nyanläggningar och förskott avseende materiella anläggningstillgångar
UPDATE variable_mapping_br SET always_show = FALSE WHERE row_id = 327; -- Summa materiella anläggningstillgångar
UPDATE variable_mapping_br SET always_show = FALSE WHERE row_id = 328; -- Finansiella anläggningstillgångar
UPDATE variable_mapping_br SET always_show = FALSE WHERE row_id = 329; -- Andelar i koncernföretag
UPDATE variable_mapping_br SET always_show = FALSE WHERE row_id = 330; -- Fordringar hos koncernföretag
UPDATE variable_mapping_br SET always_show = FALSE WHERE row_id = 331; -- Andelar i intresseföretag och gemensamt styrda företag
UPDATE variable_mapping_br SET always_show = FALSE WHERE row_id = 332; -- Fordringar hos intresseföretag och gemensamt styrda företag
UPDATE variable_mapping_br SET always_show = FALSE WHERE row_id = 333; -- Ägarintressen i övriga företag
UPDATE variable_mapping_br SET always_show = FALSE WHERE row_id = 334; -- Fordringar hos övriga företag som det finns ett ägarintresse i
UPDATE variable_mapping_br SET always_show = FALSE WHERE row_id = 335; -- Andra långfristiga värdepappersinnehav
UPDATE variable_mapping_br SET always_show = FALSE WHERE row_id = 336; -- Lån till delägare eller närstående
UPDATE variable_mapping_br SET always_show = FALSE WHERE row_id = 337; -- Andra långfristiga fordringar
UPDATE variable_mapping_br SET always_show = FALSE WHERE row_id = 338; -- Summa finansiella anläggningstillgångar
UPDATE variable_mapping_br SET always_show = TRUE WHERE row_id = 339; -- Summa anläggningstillgångar
UPDATE variable_mapping_br SET always_show = TRUE WHERE row_id = 340; -- Omsättningstillgångar
UPDATE variable_mapping_br SET always_show = FALSE WHERE row_id = 341; -- Varulager m.m.
UPDATE variable_mapping_br SET always_show = FALSE WHERE row_id = 342; -- Råvaror och förnödenheter
UPDATE variable_mapping_br SET always_show = FALSE WHERE row_id = 343; -- Varor under tillverkning
UPDATE variable_mapping_br SET always_show = FALSE WHERE row_id = 344; -- Färdiga varor och handelsvaror
UPDATE variable_mapping_br SET always_show = FALSE WHERE row_id = 345; -- Övriga lagertillgångar
UPDATE variable_mapping_br SET always_show = FALSE WHERE row_id = 346; -- Pågående arbete för annans räkning
UPDATE variable_mapping_br SET always_show = FALSE WHERE row_id = 347; -- Förskott till leverantörer
UPDATE variable_mapping_br SET always_show = FALSE WHERE row_id = 348; -- Summa varulager m.m.
UPDATE variable_mapping_br SET always_show = FALSE WHERE row_id = 349; -- Kortfristiga fordringar
UPDATE variable_mapping_br SET always_show = FALSE WHERE row_id = 350; -- Kundfordringar
UPDATE variable_mapping_br SET always_show = FALSE WHERE row_id = 351; -- Fordringar hos koncernföretag
UPDATE variable_mapping_br SET always_show = FALSE WHERE row_id = 352; -- Fordringar hos intresseföretag och gemensamt styrda företag
UPDATE variable_mapping_br SET always_show = FALSE WHERE row_id = 353; -- Fordringar hos övriga företag som det finns ett ägarintresse i
UPDATE variable_mapping_br SET always_show = FALSE WHERE row_id = 354; -- Övriga fordringar
UPDATE variable_mapping_br SET always_show = FALSE WHERE row_id = 355; -- Upparbetad men ej fakturerad intäkt
UPDATE variable_mapping_br SET always_show = FALSE WHERE row_id = 356; -- Förutbetalda kostnader och upplupna intäkter
UPDATE variable_mapping_br SET always_show = FALSE WHERE row_id = 357; -- Summa kortfristiga fordringar
UPDATE variable_mapping_br SET always_show = FALSE WHERE row_id = 358; -- Kortfristiga placeringar
UPDATE variable_mapping_br SET always_show = FALSE WHERE row_id = 359; -- Andelar i koncernföretag
UPDATE variable_mapping_br SET always_show = FALSE WHERE row_id = 360; -- Övriga kortfristiga placeringar
UPDATE variable_mapping_br SET always_show = FALSE WHERE row_id = 361; -- Summa kortfristiga placeringar
UPDATE variable_mapping_br SET always_show = TRUE WHERE row_id = 362; -- Kassa och bank
UPDATE variable_mapping_br SET always_show = TRUE WHERE row_id = 363; -- Kassa och bank
UPDATE variable_mapping_br SET always_show = FALSE WHERE row_id = 364; -- Redovisningsmedel
UPDATE variable_mapping_br SET always_show = TRUE WHERE row_id = 365; -- Summa kassa och bank
UPDATE variable_mapping_br SET always_show = TRUE WHERE row_id = 366; -- Summa omsättningstillgångar
UPDATE variable_mapping_br SET always_show = TRUE WHERE row_id = 367; -- Summa tillgångar
UPDATE variable_mapping_br SET always_show = TRUE WHERE row_id = 368; -- Eget kapital och skulder
UPDATE variable_mapping_br SET always_show = TRUE WHERE row_id = 369; -- Eget kapital
UPDATE variable_mapping_br SET always_show = TRUE WHERE row_id = 370; -- Bundet eget kapital
UPDATE variable_mapping_br SET always_show = TRUE WHERE row_id = 371; -- Aktiekapital
UPDATE variable_mapping_br SET always_show = FALSE WHERE row_id = 372; -- Ej registrerat aktiekapital
UPDATE variable_mapping_br SET always_show = FALSE WHERE row_id = 373; -- Bunden överkursfond
UPDATE variable_mapping_br SET always_show = FALSE WHERE row_id = 374; -- Uppskrivningsfond
UPDATE variable_mapping_br SET always_show = FALSE WHERE row_id = 375; -- Reservfond
UPDATE variable_mapping_br SET always_show = TRUE WHERE row_id = 376; -- Summa bundet eget kapital
UPDATE variable_mapping_br SET always_show = TRUE WHERE row_id = 377; -- Fritt eget kapital
UPDATE variable_mapping_br SET always_show = FALSE WHERE row_id = 378; -- Fri överkursfond
UPDATE variable_mapping_br SET always_show = TRUE WHERE row_id = 379; -- Balanserat resultat
UPDATE variable_mapping_br SET always_show = TRUE WHERE row_id = 380; -- Årets resultat
UPDATE variable_mapping_br SET always_show = TRUE WHERE row_id = 381; -- Summa fritt eget kapital
UPDATE variable_mapping_br SET always_show = TRUE WHERE row_id = 382; -- Summa eget kapital
UPDATE variable_mapping_br SET always_show = FALSE WHERE row_id = 383; -- Obeskattade reserver
UPDATE variable_mapping_br SET always_show = FALSE WHERE row_id = 384; -- Periodiseringsfonder
UPDATE variable_mapping_br SET always_show = FALSE WHERE row_id = 385; -- Ackumulerade överavskrivningar
UPDATE variable_mapping_br SET always_show = FALSE WHERE row_id = 386; -- Övriga obeskattade reserver
UPDATE variable_mapping_br SET always_show = FALSE WHERE row_id = 387; -- Summa obeskattade reserver
UPDATE variable_mapping_br SET always_show = FALSE WHERE row_id = 388; -- Avsättningar
UPDATE variable_mapping_br SET always_show = FALSE WHERE row_id = 389; -- Avsättningar för pensioner och liknande förpliktelser enligt lagen om tryggande av pensionsutfästelse m.m.
UPDATE variable_mapping_br SET always_show = FALSE WHERE row_id = 390; -- Övriga avsättningar för pensioner och liknande förpliktelser exklusive avsättningar enligt tryggandelagen
UPDATE variable_mapping_br SET always_show = FALSE WHERE row_id = 391; -- Övriga avsättningar
UPDATE variable_mapping_br SET always_show = FALSE WHERE row_id = 392; -- Summa avsättningar
UPDATE variable_mapping_br SET always_show = FALSE WHERE row_id = 393; -- Långfristiga skulder
UPDATE variable_mapping_br SET always_show = FALSE WHERE row_id = 394; -- Obligationslån
UPDATE variable_mapping_br SET always_show = FALSE WHERE row_id = 395; -- Checkräkningskredit
UPDATE variable_mapping_br SET always_show = FALSE WHERE row_id = 396; -- Övriga skulder till kreditinstitut
UPDATE variable_mapping_br SET always_show = FALSE WHERE row_id = 397; -- Skulder till koncernföretag
UPDATE variable_mapping_br SET always_show = FALSE WHERE row_id = 398; -- Skulder till intresseföretag och gemensamt styrda företag
UPDATE variable_mapping_br SET always_show = FALSE WHERE row_id = 399; -- Skulder till övriga företag som det finns ett ägarintresse i
UPDATE variable_mapping_br SET always_show = FALSE WHERE row_id = 400; -- Övriga skulder
UPDATE variable_mapping_br SET always_show = FALSE WHERE row_id = 401; -- Summa långfristiga skulder
UPDATE variable_mapping_br SET always_show = FALSE WHERE row_id = 402; -- Kortfristiga skulder
UPDATE variable_mapping_br SET always_show = FALSE WHERE row_id = 403; -- Checkräkningskredit
UPDATE variable_mapping_br SET always_show = FALSE WHERE row_id = 404; -- Övriga skulder till kreditinstitut
UPDATE variable_mapping_br SET always_show = FALSE WHERE row_id = 405; -- Förskott från kunder
UPDATE variable_mapping_br SET always_show = FALSE WHERE row_id = 406; -- Pågående arbete för annans räkning
UPDATE variable_mapping_br SET always_show = FALSE WHERE row_id = 407; -- Fakturerad men ej upparbetad intäkt
UPDATE variable_mapping_br SET always_show = FALSE WHERE row_id = 408; -- Leverantörsskulder
UPDATE variable_mapping_br SET always_show = FALSE WHERE row_id = 409; -- Växelskulder
UPDATE variable_mapping_br SET always_show = FALSE WHERE row_id = 410; -- Skulder till koncernföretag
UPDATE variable_mapping_br SET always_show = FALSE WHERE row_id = 411; -- Skulder till intresseföretag och gemensamt styrda företag
UPDATE variable_mapping_br SET always_show = FALSE WHERE row_id = 412; -- Skulder till övriga företag som det finns ett ägarintresse i
UPDATE variable_mapping_br SET always_show = FALSE WHERE row_id = 413; -- Skatteskulder
UPDATE variable_mapping_br SET always_show = FALSE WHERE row_id = 414; -- Övriga skulder
UPDATE variable_mapping_br SET always_show = FALSE WHERE row_id = 415; -- Upplupna kostnader och förutbetalda intäkter
UPDATE variable_mapping_br SET always_show = FALSE WHERE row_id = 416; -- Summa kortfristiga skulder
UPDATE variable_mapping_br SET always_show = TRUE WHERE row_id = 417; -- Summa eget kapital och skulder

-- Verify the updates
SELECT row_id, row_title, always_show 
FROM variable_mapping_br 
WHERE row_id BETWEEN 310 AND 417 
ORDER BY row_id;