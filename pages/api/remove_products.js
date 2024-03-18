// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
const shopify_token = ENV.LOCAL.X_Shopify_Access_Token
export default function handler(req, res) {
  async function ShopifyData(query, variables) {
    const URL = `https://xxx.myshopify.com/admin/api/2024-01/graphql.json`
    const options = {
      endpoint: URL,
      method: "POST",
      headers: {
        "X-Shopify-Access-Token": shopify_token,
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query, variables: variables })
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

  async function getAllProducts() {
    const query = `
      {
        products(first:10) {
          edges {
            node {
              id
            }
          }
        }
      }
    `
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

  async function getAllCustomers(id) {

    let query = `
    mutation productDelete($input: ProductDeleteInput!) {
      productDelete(input: $input) {
          deletedProductId
          }
      }
    `
    let variables = {
      "input": {
          "id": id
      }
    };
    const DeletedProducts = await ShopifyData(query, variables)
    res.status(200).json({DeletedProducts})
    return DeletedProducts
  }
  async function Remove() {
    const AllProducts = await getAllProducts()
    const deleted = AllProducts.data.products.edges
    console.log(deleted)
    const users = deleted.map(id=>getAllCustomers(id.node.id))
    return users
  }
  const data = Remove()
  console.log(data)
  // const users = id_lists.map(id=>getAllCustomers(id))
}
