-- Este script encuentra los números españoles a los que se les añadió el "549" por error
-- y los corrige automáticamente cortando el "549" del principio.

UPDATE sales_leads
SET phone = SUBSTRING(phone FROM 4)
WHERE phone LIKE '54934%' AND LENGTH(phone) >= 13;
