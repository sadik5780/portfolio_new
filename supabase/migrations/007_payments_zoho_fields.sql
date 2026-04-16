-- ═══════════════════════════════════════════════════════════════════
-- Migration 007: add Zoho Invoice fields to public.payments
-- Paste into Supabase Dashboard → SQL Editor → Run.
-- Safe to re-run (uses IF NOT EXISTS).
-- ═══════════════════════════════════════════════════════════════════

alter table public.payments
  add column if not exists zoho_contact_id  text,
  add column if not exists zoho_invoice_id  text,
  add column if not exists zoho_invoice_number text,
  add column if not exists zoho_invoice_url text,
  add column if not exists zoho_sync_error  text;

create index if not exists payments_zoho_invoice_idx
  on public.payments (zoho_invoice_id);
