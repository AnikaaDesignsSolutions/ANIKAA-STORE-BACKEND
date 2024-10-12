import { CustomerService } from "@medusajs/medusa";
import type { MedusaRequest, MedusaResponse } from "@medusajs/medusa";
import { AddressCreatePayload } from "@medusajs/medusa";

// Define a POST request handler to add an address to a customer
export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  // Resolve the CustomerService from the request's scope for customer operations
  const customerService = req.scope.resolve<CustomerService>("customerService");

  // Assign req.body to a constant and ensure it has the expected structure
  const body = req.body as { customerId?: string; newAddress?: AddressCreatePayload & { latitude?: number; longitude?: number } };

  // Destructure customerId and newAddress from the request body after checking if they exist
  const { customerId, newAddress } = body;

  // Validate that both customerId and newAddress are provided
  if (!customerId) {
    return res.status(400).json({
      message: "Customer ID is required",
    });
  }

  if (!newAddress) {
    return res.status(400).json({
      message: "Address details are required",
    });
  }

  // Validate that newAddress has the required fields
  const { first_name, last_name, city, country_code, address_1, postal_code, company } = newAddress;
  if (!first_name || !last_name || !city || !country_code || !address_1 || !postal_code || !company) {
    return res.status(400).json({
      message: "Missing required fields in address",
    });
  }

  // Add the new address to the customer using the customerService
  try {
    const customerFound = await customerService.addAddress(customerId, newAddress);
    res.status(200).json({
      message: "Address added successfully",
      customer: customerFound,
    });
  } catch (error) {
    console.error("Error adding address:", error);
    res.status(500).json({
      message: "Failed to add address",
      error: error.message,
    });
  }
};
