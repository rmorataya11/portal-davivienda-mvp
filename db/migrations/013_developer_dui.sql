-- DUI de la persona responsable. El NIT de la empresa queda en document_id y no se edita.
ALTER TABLE developers
  ADD COLUMN IF NOT EXISTS dui TEXT;
