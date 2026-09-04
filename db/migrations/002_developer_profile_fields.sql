ALTER TABLE developers
  ADD COLUMN document_id TEXT,
  ADD COLUMN phone TEXT,
  ADD COLUMN notify_before_expiration BOOLEAN NOT NULL DEFAULT true;
