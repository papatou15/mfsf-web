import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      // Parse the webhook data (Sanity sends the document data here)
      const { name, email, message } = req.body;

      // Send email using Resend
      await resend.emails.send({
        from: 'noreply@maisonfamillestfrancois.com',  // Verified sender address
        to: ['info@maisonfamillestfrancois.com', 'antoine.ridard@hotmail.com'],      // Your client email
        subject: 'New Document Created',
        text: `A new document has been created:\n\nName: ${name}\nEmail: ${email}\nMessage: ${message}`,
      });

      res.status(200).json({ success: true });
    } catch (error) {
      console.error('Error sending email:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      res.status(500).json({ success: false, error: errorMessage });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
