import { CustomerService } from "@medusajs/medusa";
import type { MedusaRequest, MedusaResponse } from "@medusajs/medusa";

// Define a type for the request body to handle customer measurement updates
// Define a type for the request body to handle customer measurement updates and deletions
interface UpdateCustomerMeasurementRequestBody {
  customerId: string;
  customerName?: string; // Optional to handle different requests
  productName?: string; // Optional to handle different requests
  customer_product_measurement?: Record<string, Record<string, Record<string, number>>>;
}


// Helper function to check if a variable is of type Record<string, Record<string, Record<string, number>>>
function isMeasurementData(
  data: any
): data is Record<string, Record<string, Record<string, number>>> {
  return (
    typeof data === "object" &&
    data !== null &&
    Object.values(data).every(
      (customer) =>
        typeof customer === "object" &&
        customer !== null &&
        Object.values(customer).every(
          (product) =>
            typeof product === "object" &&
            product !== null &&
            Object.values(product).every((value) => typeof value === "number")
        )
    )
  );
}

// Define a GET request handler to retrieve customer measurements from metadata
export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  const customerService = req.scope.resolve<CustomerService>("customerService");

  // Extract query parameters for filtering
  const customerId = req.query.id as string;
  const customerName = req.query.customer_name as string;
  const productName = req.query.product_name as string;

  // Validate that customerId is provided
  if (!customerId) {
    res.status(400).json({ message: "Customer ID is required" });
  }

  try {
    // Retrieve the customer by ID
    const customer = await customerService.retrieve(customerId);

    // Extract the customer_product_measurement from the customer's metadata
    const measurements = customer.metadata?.customer_product_measurement;

    // Ensure measurements is of the correct type
    let filteredMeasurements:
      | Record<string, Record<string, Record<string, number>>>
      | Record<string, Record<string, number>>
      | Record<string, number> = isMeasurementData(measurements)
      ? measurements
      : {};

    // If customerName is provided, filter the measurements by customer name
    if (customerName && filteredMeasurements[customerName]) {
      filteredMeasurements = filteredMeasurements[customerName];
    }

    // If productName is provided, filter the measurements by product name
    if (productName && customerName && (filteredMeasurements as Record<string, Record<string, number>>)[productName]) {
      filteredMeasurements = (filteredMeasurements as Record<string, Record<string, number>>)[productName];
    }

    // Send the filtered measurements in the response
    res.status(200).json({
      id: customer.id,
      created_at: customer.created_at,
      updated_at: customer.updated_at,
      email: customer.email,
      first_name: customer.first_name,
      last_name: customer.last_name,
      phone: customer.phone,
      customer_product_measurement: filteredMeasurements,
    });
  } catch (error) {
    console.error("Error retrieving customer measurements:", error);
    res.status(500).json({
      message: "Failed to retrieve customer measurements",
      error: error.message,
    });
  }
}

// Define a POST request handler to update or create customer_product_measurement in metadata for a customer
export const POST = async (
  req: MedusaRequest<UpdateCustomerMeasurementRequestBody>,
  res: MedusaResponse
): Promise<void> => {
  const customerService = req.scope.resolve<CustomerService>("customerService");

  // Extract data from the request body
  const { customerId, customer_product_measurement } = req.body;

  // Perform basic validation of the request body
  if (!customerId || !customer_product_measurement) {
    res.status(400).json({
      message: "Customer ID and customer_product_measurement are required",
    });
  }

  try {
    // Retrieve the existing customer by ID
    const customer = await customerService.retrieve(customerId);

    // Initialize or merge the existing customer_product_measurement in metadata
    const existingMeasurements = isMeasurementData(customer.metadata?.customer_product_measurement)
      ? customer.metadata?.customer_product_measurement
      : {};

    // Merge the new measurement data with the existing customer_product_measurement
    const updatedMeasurementData = {
      ...existingMeasurements,
      ...customer_product_measurement,
    };

    // Update the customer metadata with the new customer_product_measurement data
    const updatedCustomer = await customerService.update(customerId, {
      metadata: {
        ...customer.metadata,
        customer_product_measurement: updatedMeasurementData,
      },
    });

    // Send the updated customer data in the response
    res.status(200).json({
      message: "Customer measurements updated successfully",
      customer: updatedCustomer,
    });
  } catch (error) {
    console.error("Error updating customer measurements:", error);
    res.status(500).json({
      message: "Failed to update customer measurements",
      error: error.message,
    });
  }
};

// Define a DELETE request handler to remove a product's measurement
export const DELETE = async (
  req: MedusaRequest<UpdateCustomerMeasurementRequestBody>,
  res: MedusaResponse
): Promise<void> => {
  const customerService = req.scope.resolve<CustomerService>("customerService");

  // Extract data from the request body
  const { customerId, customerName, productName } = req.body;

  // Perform basic validation
  if (!customerId || !customerName || !productName) {
    res.status(400).json({
      message: "Customer ID, customer name, and product name are required",
    });
    return;
  }

  try {
    // Retrieve the existing customer by ID
    const customer = await customerService.retrieve(customerId);

    // Get the current measurements from metadata
    const existingMeasurements = isMeasurementData(customer.metadata?.customer_product_measurement)
      ? customer.metadata?.customer_product_measurement
      : {};

    // Check if the specified customer and product exist in the measurements
    if (existingMeasurements[customerName] && existingMeasurements[customerName][productName]) {
      // Delete the specified product measurement
      delete existingMeasurements[customerName][productName];

      // If the customer has no other products, delete the customer entry
      if (Object.keys(existingMeasurements[customerName]).length === 0) {
        delete existingMeasurements[customerName];
      }
    } else {
      res.status(404).json({ message: "Customer or product not found in measurements" });
      return;
    }

    // Update the customer's metadata
    const updatedCustomer = await customerService.update(customerId, {
      metadata: {
        ...customer.metadata,
        customer_product_measurement: existingMeasurements,
      },
    });

    // Send the updated customer data in the response
    res.status(200).json({
      message: "Product measurement deleted successfully",
      customer: updatedCustomer,
    });
  } catch (error) {
    console.error("Error deleting product measurement:", error);
    res.status(500).json({
      message: "Failed to delete product measurement",
      error: error.message,
    });
  }
};
