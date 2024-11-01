import { MedusaRequest, MedusaResponse } from "@medusajs/medusa";
import Medusa from "@medusajs/medusa-js";
import dotenv from "dotenv";
import { CustomerService } from "@medusajs/medusa";

// Load environment variables from .env file
dotenv.config();

export async function POST(
  req: MedusaRequest & { body: { id: string; email: string } }, // Add 'email' to req.body type
  res: MedusaResponse
): Promise<void> {
  const medusa = new Medusa({ baseUrl: process.env.MEDUSA_BACKEND_URL, maxRetries: 3 });

  try {
    // Retrieve the API token from environment variables
    const apiToken = process.env.API_TOKEN;

    if (!apiToken) {
      // If the API token is missing, respond with an error message
      res.status(500).json({ message: "API token is missing" });
      return; // Stop further execution if the token is missing
    }

    // Get the customerId and email from req.body
    const { id: customerId, email } = req.body;

    if (!customerId) {
      // If no customerId is provided, return an error message
      res.status(400).json({ message: "Customer ID is missing" });
      return;
    }

    if (!email) {
      // If no email is provided, return an error message
      res.status(400).json({ message: "Email is missing" });
      return;
    }

    // Use the CustomerService to retrieve and update the customer
    const customerService = req.scope.resolve<CustomerService>("customerService");

    // Retrieve the customer first to ensure it exists
    const customer = await customerService.retrieve(customerId);

    // Update the customer with the new email
    const updatedCustomer = await customerService.update(customerId, { email });

    // Respond with the updated customer data
    res.status(200).json({ customer: updatedCustomer });
  } catch (error) {
    // Catch and log any errors that occur during the process.
    console.error("Error:", error);
    // Respond with a 500 Internal Server Error status and an error message.
    res.status(500).json({ error: "Internal Server Error" });
  }
}
