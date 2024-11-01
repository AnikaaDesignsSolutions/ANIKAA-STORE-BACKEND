// Import necessary types from Medusa and other utilities for working with the file system and forms.
import type { MedusaRequest, MedusaResponse } from "@medusajs/medusa";
import formidable from "formidable"; // For parsing form data, including file uploads.
import path from "path"; // Provides utilities for working with file and directory paths.
import fs from "fs/promises"; // File System module with Promise-based API for working with the file system.
import dotenv from "dotenv";

dotenv.config();

// Function to handle file reading from a request with optional saving to a local directory.
const readFile = (req: MedusaRequest, saveLocally?: boolean): Promise<{ fields: formidable.Fields; files: formidable.Files }> => {
    const options: formidable.Options = {}; // Formidable options.

    if (saveLocally) {
        // Set the directory where files should be uploaded.
        options.uploadDir = "C://Users//Roshini//Downloads//ANIKAA//anikaa_backend//uploads";

        // Define how uploaded files are named.
        options.filename = (name, ext, path, form) => {
            return Date.now().toString() + "_" + path.originalFilename; // Unique filename based on the timestamp.
        };
    }

    // Initialize Formidable with the specified options.
    const form = formidable(options);

    // Parse the incoming form data.
    return new Promise((resolve, reject) => {
        form.parse(req, (err, fields, files) => {
            if (err) reject(err); // Reject the promise on error.
            resolve({ fields, files }); // Resolve with the parsed fields and files.
        });
    });
};

// Global variable to cache directory contents, demonstrating a basic caching strategy.
let dirsCache = [];

// Helper function to generate file URL
const generateFileUrl = (filePath: string) => {
    return `${process.env.MEDUSA_BACKEND_URL}/uploads/${path.basename(filePath)}`;
};

// Main function for handling the POST request for video upload.
export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
    console.log('POST method at videoUpload');
    // Define the media directory where files will be uploaded.
    const mediaDir = "C://Users//Roshini//Downloads//ANIKAA//anikaa_backend//uploads";

    try {
        // Attempt to read the directory, which will throw an error if it doesn't exist.
        await fs.readdir(mediaDir);
    } catch (error) {
        // If the directory doesn't exist, create it including any necessary parent directories.
        await fs.mkdir(mediaDir, { recursive: true });
    }

    try {
        // Read and process the uploaded files.
        const { files, fields } = await readFile(req, true);

        // Prepare responses for each uploaded file (image, audio, or video)
        const response = {
            done: "ok",
            files: {} as Record<string, any>,
            dirs: dirsCache,
        };

        // Process video fields dynamically
        const videoFileFields = Object.keys(files).filter((field) => field.startsWith('video-'));

        for (const field of videoFileFields) {
            const uploadedFiles = files[field]; // Assuming multiple files can be uploaded for each field

            // Initialize an array to store multiple file URLs for this field
            response.files[field] = [];

            // Process each video in the array
            for (const file of uploadedFiles) {
                const filePath = file.filepath;

                // Ensure the file exists
                await fs.stat(filePath);

                // Store the file information for each file
                response.files[field].push({
                    path: filePath,
                    url: generateFileUrl(filePath),
                    size: file.size,
                    type: file.mimetype,
                });
            }
        }

        // Send the response including details about the uploaded files
        res.json(response);

    } catch (error) {
        console.error('Error uploading video files:', error);
        // Send an error response including details of the failure.
        res.status(500).json({
            error: "Video file upload failed",
            details: error.message,
            dirs: dirsCache, // Include cached directory information even in error responses.
        });
    }
};
