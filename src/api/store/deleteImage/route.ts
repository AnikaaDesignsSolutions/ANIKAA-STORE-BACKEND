// Import necessary types from Medusa and utilities for working with the file system
import type { MedusaRequest, MedusaResponse } from "@medusajs/medusa";
import path from "path"; // Provides utilities for working with file and directory paths.
import fs from "fs/promises"; // File System module with Promise-based API for working with the file system.
import dotenv from "dotenv";

dotenv.config();

// Helper function to get the file path from the image URL
const getFilePathFromUrl = (imageUrl: string) => {
  // Extract the file name from the URL
  const fileName = path.basename(imageUrl);
  // Return the full file path in the uploads directory
  return path.resolve("C://Users//Roshini//Downloads//ANIKAA//anikaa_backend//uploads", fileName);
};

// Main function for handling the DELETE request.
export const DELETE = async (req: MedusaRequest, res: MedusaResponse) => {
    console.log('DELETE method at imageDelete');
  
    try {
      // Extract the image_urls from the request body (expecting an array)
      const { image_urls } = req.body as { image_urls: string[] };
  
      if (!Array.isArray(image_urls) || image_urls.length === 0) {
        // If no image URLs or invalid format, return a 400 status with an error message
        return res.status(400).json({ error: "An array of image URLs is required" });
      }
  
      const deleteResults = []; // To store the result of each deletion
  
      // Iterate over each image URL
      for (const image_url of image_urls) {
        const filePath = getFilePathFromUrl(image_url);

        try {
          // Check if the file exists
          await fs.stat(filePath);
          
          // Delete the file from the file system
          await fs.unlink(filePath);
          
          // Add success message for this file
          deleteResults.push({ image_url, status: 'success', message: "File deleted successfully" });
        } catch (error) {
          // Add failure message if file not found or deletion failed
          deleteResults.push({ image_url, status: 'failed', message: "File not found or deletion failed", details: error.message });
        }
      }
  
      // Respond with the results of deletion for each file
      res.status(200).json({ results: deleteResults });
    } catch (error) {
      console.error('Error deleting files:', error);
      // Send a 500 error response if something went wrong
      res.status(500).json({
        error: "File deletion failed",
        details: error.message,
      });
    }
};
