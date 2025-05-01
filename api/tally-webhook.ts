// Trigger redeploy
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const name = body.data?.Name;
  const email = body.data?.Email;

  if (!email) {
    return NextResponse.json({ error: "No email provided" }, { status: 400 });
  }

  const resendApiKey = process.env.RESEND_API_KEY;

  const resendRes = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${resendApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "Fluxx Training <YOUR_VERIFIED_EMAIL@yourdomain.com>",
      to: email,
      subject: "Thanks for signing up at HYROX!",
      html: `<p>Hey ${name},</p><p>Thanks for signing up at HYROX. We'll send your personalised plan soon!</p><p>- Fluxx Training</p>`,
    }),
  });

  const resendData = await resendRes.json();

  return NextResponse.json({ status: "Email sent", resend: resendData });
}
