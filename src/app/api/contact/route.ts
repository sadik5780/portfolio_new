import { NextResponse } from 'next/server';
import { insertLead } from '@/lib/content/leads';

export const runtime = 'nodejs';

interface ContactPayload {
  name?: string;
  email?: string;
  projectType?: string;
  budget?: string;
  message?: string;
  currency?: string;
}

function isEmail(s: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function validate(payload: ContactPayload): string | null {
  if (!payload.name || typeof payload.name !== 'string' || payload.name.trim().length < 2) {
    return 'Please provide your name.';
  }
  if (!payload.email || !isEmail(payload.email)) {
    return 'Please provide a valid email.';
  }
  if (!payload.projectType || typeof payload.projectType !== 'string') {
    return 'Please select a project type.';
  }
  if (!payload.message || typeof payload.message !== 'string' || payload.message.trim().length < 10) {
    return 'Please share a bit more about your project (min 10 characters).';
  }
  if (payload.message.length > 5000) {
    return 'Message is too long (max 5000 characters).';
  }
  return null;
}

/**
 * Sends the email via Resend if RESEND_API_KEY is configured.
 * Errors here are logged but do NOT fail the request — the lead is already
 * saved to the database, so the inquiry is not lost.
 */
async function deliverEmail(payload: Required<ContactPayload>): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return;

  const to = process.env.CONTACT_TO_EMAIL ?? 'hello@sadik.dev';
  const from = process.env.CONTACT_FROM_EMAIL ?? 'Sadik Portfolio <onboarding@resend.dev>';

  const subject = `New inquiry: ${payload.projectType} — ${payload.name}`;
  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 560px; margin: 0 auto; padding: 24px; background: #09090b; color: #fafafa; border-radius: 12px;">
      <h1 style="margin: 0 0 24px; font-size: 20px;">New project inquiry</h1>
      <table style="width: 100%; border-collapse: collapse;">
        <tr><td style="padding: 8px 0; color: #a1a1aa; width: 120px;">From</td><td><strong>${escapeHtml(payload.name)}</strong> &lt;${escapeHtml(payload.email)}&gt;</td></tr>
        <tr><td style="padding: 8px 0; color: #a1a1aa;">Project type</td><td>${escapeHtml(payload.projectType)}</td></tr>
        <tr><td style="padding: 8px 0; color: #a1a1aa;">Budget</td><td>${escapeHtml(payload.budget || '—')}</td></tr>
        <tr><td style="padding: 8px 0; color: #a1a1aa;">Currency</td><td>${escapeHtml(payload.currency)}</td></tr>
      </table>
      <hr style="border: none; border-top: 1px solid #1a1a1f; margin: 24px 0;" />
      <p style="color: #a1a1aa; margin: 0 0 8px; font-size: 12px;">MESSAGE</p>
      <div style="white-space: pre-wrap; line-height: 1.6;">${escapeHtml(payload.message)}</div>
    </div>
  `;

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: payload.email,
      subject,
      html,
    }),
  });

  if (!res.ok) {
    console.warn(`[contact] email delivery failed: ${res.status}`);
  }
}

export async function POST(request: Request) {
  let payload: ContactPayload;
  try {
    payload = (await request.json()) as ContactPayload;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const error = validate(payload);
  if (error) {
    return NextResponse.json({ error }, { status: 422 });
  }

  const clean = {
    name: payload.name!.trim(),
    email: payload.email!.trim(),
    projectType: payload.projectType!,
    budget: (payload.budget ?? '').trim(),
    message: payload.message!.trim(),
    currency: payload.currency ?? 'inr',
  };

  try {
    // 1. Persist the lead to Supabase — this is the source of truth.
    await insertLead({
      name: clean.name,
      email: clean.email,
      project_type: clean.projectType,
      budget: clean.budget,
      message: clean.message,
      currency: clean.currency,
    });

    // 2. Fire-and-forget email notification (non-blocking on failure).
    deliverEmail(clean).catch((err) =>
      console.warn('[contact] email delivery error', err),
    );

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (err) {
    console.error('[contact] error', err);
    return NextResponse.json(
      { error: 'Unable to send message right now. Please try again shortly.' },
      { status: 500 },
    );
  }
}
