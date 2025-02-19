import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const { name, email, message } = await req.json();

    await resend.emails.send({
      from: 'noreply@maisonfamillestfrancois.com',  // Verified sender address
      to: ['info@maisonfamillestfrancois.com', 'antoine.ridard@hotmail.com'], // Recipients
      subject: 'Nouvelle question sur Sanity',
      text: `Une nouvelle question a été posée:\n\nNom: ${name}\nCourriel: ${email}\nMessage: ${message}`,
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
