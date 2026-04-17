import { NextResponse } from 'next/server';
import { insertLead } from '@/lib/content/leads';

export const runtime = 'nodejs';

interface LeadPayload {
  service?: string;
  timeline?: string;
  budget?: string;
  name?: string;
  contact?: string;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

async function sendEmail(to: string, subject: string, html: string) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return;

  const from = process.env.CONTACT_FROM_EMAIL ?? 'Sadik Studio <onboarding@resend.dev>';

  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({ from, to: [to], subject, html }),
  });
}

export async function POST(request: Request) {
  let payload: LeadPayload;
  try {
    payload = (await request.json()) as LeadPayload;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const name = (payload.name ?? '').trim();
  const contact = (payload.contact ?? '').trim();
  const service = (payload.service ?? '').trim();
  const timeline = (payload.timeline ?? '').trim();
  const budget = (payload.budget ?? '').trim();

  if (!name || !contact) {
    return NextResponse.json({ error: 'Name and contact required' }, { status: 422 });
  }

  try {
    await insertLead({
      name,
      email: contact.includes('@') ? contact : '',
      project_type: service,
      budget,
      message: `[Chat Widget] Service: ${service} | Timeline: ${timeline} | Budget: ${budget} | Contact: ${contact}`,
      currency: 'usd',
    });
  } catch {
    // Lead save failed — still send emails
  }

  const ownerEmail = process.env.CONTACT_TO_EMAIL ?? 'sadik5780@gmail.com';

  // Email 1: Notify owner
  sendEmail(
    ownerEmail,
    `New lead: ${service} — ${name}`,
    `
    <div style="font-family:-apple-system,sans-serif;max-width:560px;margin:0 auto;padding:24px;background:#000;color:#f5f5f7;border-radius:12px;">
      <h2 style="margin:0 0 20px;font-size:18px;color:#2997ff;">New Lead from Chat Widget</h2>
      <table style="width:100%;border-collapse:collapse;">
        <tr><td style="padding:8px 0;color:#86868b;width:100px;">Name</td><td><strong>${escapeHtml(name)}</strong></td></tr>
        <tr><td style="padding:8px 0;color:#86868b;">Contact</td><td>${escapeHtml(contact)}</td></tr>
        <tr><td style="padding:8px 0;color:#86868b;">Service</td><td>${escapeHtml(service)}</td></tr>
        <tr><td style="padding:8px 0;color:#86868b;">Timeline</td><td>${escapeHtml(timeline)}</td></tr>
        <tr><td style="padding:8px 0;color:#86868b;">Budget</td><td>${escapeHtml(budget)}</td></tr>
      </table>
    </div>
    `,
  ).catch(() => {});

  // Email 2: Auto-reply to lead (only if they gave an email)
  if (contact.includes('@')) {
    sendEmail(
      contact,
      `Got your request — ${escapeHtml(name)}`,
      `
      <div style="font-family:-apple-system,sans-serif;max-width:560px;margin:0 auto;padding:24px;background:#000;color:#f5f5f7;border-radius:12px;">
        <h2 style="margin:0 0 16px;font-size:20px;">Hey ${escapeHtml(name.split(' ')[0])},</h2>
        <p style="color:#86868b;line-height:1.7;margin:0 0 20px;">
          Thanks for reaching out about your <strong style="color:#f5f5f7;">${escapeHtml(service)}</strong> project.
          I'll review your requirements and get back with a fixed quote within a few hours.
        </p>
        <p style="color:#86868b;line-height:1.7;margin:0 0 20px;">
          In the meantime, a few quick questions that help me scope accurately:
        </p>
        <ul style="color:#f5f5f7;line-height:2;margin:0 0 24px;padding-left:20px;">
          <li>Do you have any reference sites or apps in mind?</li>
          <li>Is this a new build or adding to an existing product?</li>
          <li>Any hard deadline (investor demo, launch date)?</li>
        </ul>
        <p style="color:#86868b;line-height:1.7;margin:0 0 20px;">
          Or if you'd prefer to talk live, grab a slot:
        </p>
        <a href="https://www.sadikstudio.in/contact" style="display:inline-block;padding:12px 24px;background:#0071e3;color:white;text-decoration:none;border-radius:980px;font-weight:600;font-size:14px;">
          Book a Call
        </a>
        <hr style="border:none;border-top:1px solid #1d1d1f;margin:28px 0;" />
        <p style="color:#6e6e73;font-size:12px;margin:0;">
          Sadik Shaikh · Sadik Studio<br/>
          sadikstudio.in
        </p>
      </div>
      `,
    ).catch(() => {});
  }

  return NextResponse.json({ ok: true });
}
