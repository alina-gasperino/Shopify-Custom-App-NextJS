// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
const shopify_token = ENV.LOCAL.X_Shopify_Access_Token
export default function handler(req, res) {
    async function ShopifyData(id) {
      const URL = `https://xxx.myshopify.com/admin/api/2022-01/collections/${id}.json`
    
      try {
        const response = await fetch(URL, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'X-Shopify-Access-Token': shopify_token,
          },
        });
    
        if (!response.ok) {
          throw new Error(`Error deleting collection: ${response.status} - ${response.statusText}`);
        }
    
        console.log(`Collection with ID ${collectionId} deleted successfully.`);
        return await response.json();
      } catch (error) {
        console.error('Error deleting collection:', error.message);
        throw error;
      }
    }

  const col_id = "392525512950"
    async function getAllCustomers() {
    
      const response = await ShopifyData(col_id)
      console.log(response)
    }
    getAllCustomers()
  }
  