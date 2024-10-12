// Import LineItemService from MedusaJS for handling line item operations
import { LineItemService } from "@medusajs/medusa";
import type { MedusaRequest, MedusaResponse } from "@medusajs/medusa";

// Extend the request body to include the fields needed for deleting material image records
interface DeleteMaterialImageRequestBody {
  id: string; // Line item ID
  material_image_url: string; // The material image URL to be deleted
}

// Define a DELETE request handler to delete material image records
export const DELETE = async (req: MedusaRequest<DeleteMaterialImageRequestBody>, res: MedusaResponse) => {
  // Resolve the LineItemService from the request's scope for line item operations
  const lineItemService = req.scope.resolve<LineItemService>("lineItemService");

  try {
    // Extract data from the request body
    const { id, material_image_url } = req.body;

    console.log("id: ", id);
    console.log("material_image_url: ", material_image_url);

    let lineItem;

    // If id is provided, retrieve a specific line item and update it
    if (id) {
      try {
        // Retrieve the existing line item by id
        lineItem = await lineItemService.retrieve(id);

        // Get the current material_design_data from the line item
        const currentMaterialDesignData = lineItem.material_design_data || {};

        // Check if the material_image_url exists in the current design data
        if (currentMaterialDesignData[material_image_url]) {
          // Delete the material_image_url entry from the material_design_data object
          delete currentMaterialDesignData[material_image_url];

          // Prepare the update data with the modified material_design_data
          const updateData = {
            material_design_data: currentMaterialDesignData,
          };

          // Update the line item with the modified material_design_data
          const updatedLineItem = await lineItemService.update(id, updateData as any); // <-- Cast updateData as any

          console.log("updatedLineItem after deletion: ", updatedLineItem);
          lineItem = updatedLineItem; // Set the response to return the updated line item
        } else {
          // If material_image_url does not exist in material_design_data, return a 404 response
          return res.status(404).json({
            message: `Material image URL '${material_image_url}' not found in line item.`,
          });
        }
      } catch (error) {
        return res.status(404).json({ message: "Line item not found" });
      }
    } else {
      // If no id is provided, return an error
      return res.status(400).json({ message: "Line item ID is required" });
    }

    // Return the updated line item in the response
    res.status(200).json({
      message: "Material image URL record deleted successfully",
      lineItem,
    });
  } catch (error) {
    // Handle errors, such as database issues or service retrieval failures
    console.error("Error deleting material image record:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
