import { MedusaRequest, MedusaResponse } from "@medusajs/medusa";
import { PriceListService, ProductService } from "@medusajs/medusa";

export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  try {
    const pricelistService = req.scope.resolve<PriceListService>("priceListService");
    const productService = req.scope.resolve<ProductService>("productService");

    // Retrieve all price lists
    const prices = await pricelistService.list({});

    if (!prices.length) {
      res.status(404).json({ message: "No price lists found." });
    }

    const results = await Promise.all(
      prices.map(async (priceList) => {
        const priceListId = priceList.id;

        // Retrieve variants associated with the price list
        const [variants] = await pricelistService.listVariants(priceListId);

        // Filter variants to find those with more than one price entry in the prices array
        const relevantVariants = await Promise.all(
          variants
            .filter((variant) => variant.prices.length > 1)
            .map(async (variant) => {
              const relevantPrices = variant.prices.map((price) => ({
                amount: price.amount,
                price_list_id: price.price_list_id,
              }));

              // Fetch the product title by using productService with variant.product_id
              const product = await productService.retrieve(variant.product_id);

              return {
                product_id: variant.product_id,
                product_title: product.title,  
                product_thumbnail: product.thumbnail,  
                prices: relevantPrices,
              };
            })
        );

        return {
          price_list_id: priceListId,
          variants: relevantVariants,
        };
      })
    );

    // Send the collected results as JSON response
    res.status(200).json(results);
  } catch (error) {
    console.error("Error fetching product variants:", error);
    res.status(500).json({ error: "An error occurred while fetching product variants." });
  }
}
