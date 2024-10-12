import { MedusaRequest, MedusaResponse } from "@medusajs/medusa";
import { ProductService } from "@medusajs/medusa";
import axios from "axios";
import dotenv from "dotenv";

export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {

    const apiToken = process.env.API_TOKEN;
    const MEDUSA_BACKEND_URL = process.env.MEDUSA_BACKEND_URL || "http://localhost:9000";
  
    if (!apiToken) {
      res.status(500).json({ message: "API token is missing" });
    }

  let id = req.query.id as string;
  
  const productResponse = await axios.get(`${MEDUSA_BACKEND_URL}/admin/products/${id}`, {
    headers: {
      "x-medusa-access-token": apiToken, // Pass the token in the header
    },
  });

  console.log("productResponse ",productResponse)

  const allProducts = productResponse.data.product;


  res.status(200).json(allProducts);
}
