import { CustomerService } from "@medusajs/medusa";
import type { MedusaRequest, MedusaResponse } from "@medusajs/medusa";
import { AddressPayload } from "@medusajs/medusa";

// Define a POST request handler to update the billing address of a customer
export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  // Resolve the CustomerService from the request's scope for customer operations
  const customerService = req.scope.resolve<CustomerService>("customerService");

  // Assign req.body to a constant and ensure it has the expected structure
  const body = req.body as {
    customerId?: string;
    addressId?: string;
    newAddress?: AddressPayload & { latitude?: number; longitude?: number };
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
  const { first_name, last_name, city, country_code, address_1, postal_code, company, metadata, latitude, longitude } = newAddress;

  // Convert metadata to match the expected type if it's provided
  const addressMetadata: Record<string, unknown> = metadata ? metadata as Record<string, unknown> : {};

  // Construct the address object with latitude and longitude
  const updatedAddressPayload = {
    ...newAddress,
    metadata: addressMetadata,
    latitude,
    longitude,
  };

  try {
    // Fetch the customer using the customerService
    const customer = await customerService.retrieve(customerId, {
      relations: ["billing_address"],
    });

    // Use updateBillingAddress_ method to update the billing address with latitude and longitude
    await customerService.updateBillingAddress_(customer, updatedAddressPayload);

    // Return the updated address in the response
    res.status(200).json({
      message: "Billing address updated successfully",
      address: updatedAddressPayload,
    });
  } catch (error) {
    console.error("Error updating billing address:", error);
    res.status(500).json({
      message: "Failed to update billing address",
      error: error.message,
    });
  }
};
