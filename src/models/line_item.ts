import { Column, Entity } from "typeorm";
import { LineItem as MedusaLineItem } from "@medusajs/medusa";

// Define an interface for the object that stores design preferences, images, measurements, etc.
interface MaterialDesignData {
  design_preference: string;
  design_images: string[]; // Existing design images array
  measurement_values: Record<string, number>; // Existing measurements object
  measurement_dress_images: string[]; // New: Stores URLs for dress images
  attach_lining: boolean; // New: Checkbox to determine if lining is attached
}

@Entity()
export class LineItem extends MedusaLineItem {
  // New column to store material_image_url as key and its corresponding design data
  @Column("jsonb", { nullable: true })
  material_design_data: Record<string, MaterialDesignData>;

  // Example usage:
  // material_design_data = {
  //   "https://example.com/material1.jpg": {
  //     design_preference: "Custom Design",
  //     design_images: [
  //       "https://example.com/image1.jpg",
  //       "https://example.com/image2.jpg"
  //     ],
  //     measurement_values: {
  //       chest: 38,
  //       waist: 32,
  //       length: 42
  //     },
  //     measurement_dress_images: [
  //       "https://example.com/dress1.jpg",
  //       "https://example.com/dress2.jpg"
  //     ],
  //     attach_lining: true // Indicates that lining is attached
  //   },
  //   "https://example.com/material2.jpg": {
  //     design_preference: "Another Design",
  //     design_images: [
  //       "https://example.com/image3.jpg"
  //     ],
  //     measurement_values: {
  //       chest: 40,
  //       waist: 34
  //     },
  //     measurement_dress_images: [],
  //     attach_lining: false // No lining attached
  //   }
  // };
}
