import { OAuth2Client } from 'google-auth-library';
import { MedusaRequest, MedusaResponse } from '@medusajs/medusa';

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID; // Google client ID
const client = new OAuth2Client(CLIENT_ID);

export async function POST(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  try {
    const { token } = req.body as {
      token: string;
    };

    // Verify the token using Google's OAuth2Client
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload) {
      res.status(401).json({ message: 'Invalid Google token' });
      return;
    }

    // Extract user information from the token
    const { sub, email, name, picture } = payload;

    // Here, you would normally create or find the user in your database
    const user = {
      googleId: sub,
      email,
      name,
      picture,
    };

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Failed to verify Google token' });
  }
}
