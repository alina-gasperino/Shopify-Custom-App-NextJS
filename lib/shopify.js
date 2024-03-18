const shopify_token = ENV.LOCAL.X_Shopify_Access_Token
async function ShopifyData(query) {
    const URL = `https://xxx.myshopify.com/admin/api/2024-01/graphql.json`
    const options = {
      endpoint: URL,
      method: "POST",
      headers: {
        "X-Shopify-Access-Token": shopify_token,
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query })
    }
  
    try {
      const data = await fetch(URL, options).then(response => {
        return response.json()
      })
  
      return data
    } catch (error) {
        console.log("err",error)
    }
  }
  
  export async function getAllCustomers() {
    const query = `
    {
      customers(first:15) {
        edges {
          node {
            id
            totalSpent
          }
        }
      }
    }
  `
  
    const response = await ShopifyData(query)
    console.log(response)
    const allcustomers = response.data.customers.edges ? response.data.customers.edges : []
  
    return allcustomers
  }