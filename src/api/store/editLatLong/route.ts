import { CustomerService } from "@medusajs/medusa";
import type { MedusaRequest, MedusaResponse } from "@medusajs/medusa";
import { AddressCreatePayload } from "@medusajs/medusa";

// Define a POST request handler to add an address to a customer
export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  // Resolve the CustomerService from the request's scope for customer operations
  const customerService = req.scope.resolve<CustomerService>("customerService");

  // Assign req.body to a constant and ensure it has the expected structure
  const body = req.body as {
    customerId?: string;
    addressId?: string;
    newAddress?: AddressCreatePayload & { latitude?: number; longitude?: number };
  };

  // Destructure customerId, addressId, and newAddress from the request body after checking if they exist
  const { customerId, addressId, newAddress } = body;

  // Validate that customerId, addressId, and newAddress are provided
  if (!customerId) {
    return res.status(400).json({
      message: "Customer ID is required",
    });
  }

  if (!addressId) {
    return res.status(400).json({
      message: "Address ID is required",
    });
  }

  if (!newAddress) {
    return res.status(400).json({
      message: "Address details are required",
    });
  }

  // Validate that newAddress has the required fields
  const { first_name, last_name, city, country_code, address_1, postal_code, company, metadata } = newAddress;
  // if (!first_name || !last_name || !city || !country_code || !address_1 || !postal_code || !company) {
  //   return res.status(400).json({
  //     message: "Missing required fields in address",
  //   });
  // }

  // Convert metadata to match the expected type if it's provided
  const addressMetadata: Record<string, unknown> = metadata ? metadata as Record<string, unknown> : {};

  // Construct the address object to match the expected type for updateAddress
  const updatedAddressPayload = {
    ...newAddress,
    metadata: addressMetadata,
  };

  // Add the new address to the customer using the customerService
  try {
    // Make sure to pass the required arguments to updateAddress
    const updatedAddress = await customerService.updateAddress(customerId, addressId, updatedAddressPayload);

    res.status(200).json({
      message: "Address updated successfully",
      address: updatedAddress,
    });
  } catch (error) {
    console.error("Error editing address:", error);
    res.status(500).json({
      message: "Failed to edit address",
      error: error.message,
    });
  }
};
