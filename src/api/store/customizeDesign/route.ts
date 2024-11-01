import { LineItemService } from "@medusajs/medusa";
import type { MedusaRequest, MedusaResponse } from "@medusajs/medusa";

// Extend the request body to include new fields for updating line items
interface UpdateLineItemRequestBody {
  id: string;
  material_image_url: string;
  design_preference?: string;
  design_images?: string[];
  measurement_values?: Record<string, number>;
  measurement_dress_images?: string[]; // New field for dress images
  attach_lining?: boolean; // New field for attach_lining checkbox
  design_preference_audio?: string | null; // New field for audio URL
  design_preference_video?: string | null; // New field for video URL
}

// Extend the input type to handle material_design_data structure
type MaterialDesignData = {
  design_preference?: string;
  design_images?: string[];
  measurement_values?: Record<string, number>;
  measurement_dress_images?: string[];
  attach_lining?: boolean;
  design_preference_audio?: string | null; // New field for audio URL
  design_preference_video?: string | null; // New field for video URL
};

// Define a POST request handler to update line items
export const POST = async (req: MedusaRequest<UpdateLineItemRequestBody>, res: MedusaResponse) => {
  // Resolve the LineItemService from the request's scope for line item operations
  const lineItemService = req.scope.resolve<LineItemService>("lineItemService");

  try {
    // Extract data from the request body
    const {
      id,
      material_image_url,
      design_preference,
      design_images,
      measurement_values,
      measurement_dress_images,
      attach_lining,
      design_preference_audio,
      design_preference_video
    } = req.body;

    console.log("id: ", id);
    console.log("material_image_url: ", material_image_url);
    console.log("design_preference: ", design_preference);
    console.log("design_images: ", design_images);
    console.log("measurement_values: ", measurement_values);
    console.log("measurement_dress_images: ", measurement_dress_images);
    console.log("attach_lining: ", attach_lining);
    console.log("design_preference_audio: ", design_preference_audio);
    console.log("design_preference_video: ", design_preference_video);

    // Prepare the material design data object
    const updateMaterialData: MaterialDesignData = {};

    if (design_preference !== undefined) {
      updateMaterialData.design_preference = design_preference;
    }

    if (design_images !== undefined) {
      updateMaterialData.design_images = design_images;
    }

    if (measurement_values !== undefined) {
      updateMaterialData.measurement_values = measurement_values;
    }

    if (measurement_dress_images !== undefined) {
      updateMaterialData.measurement_dress_images = measurement_dress_images;
    }

    if (attach_lining !== undefined) {
      updateMaterialData.attach_lining = attach_lining;
    }

    if (design_preference_audio !== undefined) {
      updateMaterialData.design_preference_audio = design_preference_audio;
    }

    if (design_preference_video !== undefined) {
      updateMaterialData.design_preference_video = design_preference_video;
    }

    let lineItem;

    // If id is provided, retrieve a specific line item and update it
    if (id) {
      try {
        // Retrieve the existing line item by id
        lineItem = await lineItemService.retrieve(id);

        // Merge the new material design data into the existing material_design_data field
        const currentMaterialDesignData = lineItem.material_design_data || {};

        // Update or insert data for the provided material_image_url
        currentMaterialDesignData[material_image_url] = {
          ...(currentMaterialDesignData[material_image_url] || {}), // Keep existing data if available
          ...updateMaterialData // Override or add new fields
        };

        // Prepare the full update object for the line item
        const updateData = {
          material_design_data: currentMaterialDesignData
        };

        // Update the line item with the modified material_design_data
        const updatedLineItem = await lineItemService.update(id, updateData as any);  // <-- Cast updateData as any

        console.log("updatedLineItem: ", updatedLineItem);
        lineItem = updatedLineItem; // Update the response to return the updated line item
      } catch (error) {
        return res.status(404).json({ message: "Line item not found" });
      }
    } else {
      // If no id is provided, retrieve all line items (without updating anything)
      lineItem = await lineItemService.list({});
    }

    // Return the line item(s) in the response
    res.status(200).json({
      lineItem,
    });
  } catch (error) {
    // Handle errors, such as database issues or service retrieval failures
    console.error("Error fetching or updating line items:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
