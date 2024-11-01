import { MedusaRequest, MedusaResponse } from "@medusajs/medusa";
import { sendOtpEmail } from "./handleEmail";

export async function POST(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  try {
    // Extract email and OTP from the request body
    const { email, otp } = req.body as { email: string; otp: string };

    // Validate if email and otp are present
    if (!email || !otp) {
      res.status(400).json({ message: "Email and OTP are required" });
      return;
    }

    // Call the sendOtpEmail function
    await sendOtpEmail(email, otp);

    // Send success response
    res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error("Error sending OTP:", error);
    res.status(500).json({ message: "Error sending OTP", error: error.toString() });
  }
}
