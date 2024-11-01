import { MedusaRequest, MedusaResponse } from "@medusajs/medusa";
import { CustomerService } from "@medusajs/medusa";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

interface UpdatePasswordRequestBody {
  email: string;
  password_body: string;
   // Include other properties you expect to receive in the request body
}

export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  const customerService = req.scope.resolve<CustomerService>("customerService");

  // Get phone number from query and trim spaces
  let phoneNo = (req.query.phoneNo as string).trim();

  // Add '+' statically in front of the phone number if it doesn't already have it
  if (!phoneNo.startsWith('+')) {
    phoneNo = `+${phoneNo}`;
  }

  console.log("phoneNo with + added: ", phoneNo);

  try {
    // Retrieve customer by phone number
    const customer = await customerService.retrieveByPhone(phoneNo);
    console.log("customer: ", customer);

    res.status(200).json({
      customer,
    });
  } catch (error) {
    // Handle error if phone number is not found
    console.error("Error retrieving customer:", error);
    res.status(200).json({ message: "Customer not found" });
  }
}


export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  // Resolve the CustomerService from the request's scope
  const customerService = req.scope.resolve<CustomerService>("customerService");
 
  // Extract the email from the request body
  const { email, password_body } = req.body as UpdatePasswordRequestBody;
  console.log("email at body ", email)
  
  // Retrieve all customers
  const customers = await customerService.list({})
  console.log("customers at password ", customers)
  
  // Find the specific customer with the matching email
  const customer = customers.find(customer => customer.email === email);
  console.log("customer found ", customer)
  const customerId = customer.id;
  console.log("customer found id", customerId)
 
  // Basic validation of the request body
  if (!customerId || !password_body) {
    // Throw an error if the customer ID or password is missing
    throw new Error("Missing customer ID or password in request body");
  }
  
  // Update the customer's password and active status
  const customerUpdate = await customerService.update(
    customerId,
    { password: password_body }
  );
  
  console.log("customer Update ", customerUpdate)
  // Return the updated customer details in the response
  res.json({
    customerUpdate,
  });
 }
 