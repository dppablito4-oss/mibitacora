BEGIN;
SET LOCAL "request.jwt.claim.sub" = '245be142-8def-4efd-a3f7-6b8e0bf0133a';
SET LOCAL "request.jwt.claim.role" = 'authenticated';
SELECT * FROM public.cotizaciones WHERE cliente_id = '245be142-8def-4efd-a3f7-6b8e0bf0133a';
COMMIT;

