const shopify_token = ENV.LOCAL.X_Shopify_Access_Token
import { connectToDatabase } from "../../lib/mongodb"

export default async function handler( req, res) {
    if (req.method === 'POST') {
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
                console.log("err", error)
            }
        }
        async function getCustomerData() {
            const { db } = await connectToDatabase();
            const query = `
            {
            customer(id: "${req.body.id}") {
              id
              tags
              displayName
              ordersCount
              orders(first: 50) {
                  edges {
                      node {
                          createdAt
                          lineItems(first: 2) {
                              edges {
                                  node {
                                      product {
                                          title
                                          tags
                                      }
                                      quantity
                                  }
                              }
                          }
                      }
                  }
              }
            }
          }
          `

            const response = await ShopifyData(query)
            const current_customer = response.data.customer ? response.data.customer : []
            var customer_tags = current_customer.tags;
            var available = "Not Available";
            var customer_total_orders = current_customer.orders.edges;
            var product_count = 0;
            var updated_order_num = 0;
            if(current_customer.tags.includes("Member")){
                available = "Member";
                customer_total_orders.forEach(element => {
                    if(element.node.createdAt.indexOf("2022") != -1){
                        console.log(element.node.createdAt)
                        if(element.node.lineItems.edges[0].node.product.tags.includes("Class")) {
                            product_count = product_count + parseInt(element.node.lineItems.edges[0].node.quantity);                       
                        }
                    }                    
                });
                updated_order_num = product_count % 6;
                console.log(updated_order_num)
                if(updated_order_num == 5) {
                    customer_tags.push("zero_available");
                }
                else {
                    if(customer_tags.includes("zero_available")) {
                        customer_tags.pop();
                    }
                }

                const query2 = `
                    mutation {
                        customerUpdate(input: {id: "${req.body.id}", tags: "${customer_tags}"}) {
                        customer {
                            id
                            tags
                        }
                        }
                    }
                    `
                const response2 = await ShopifyData(query2)
                const current_customers = response2.data
                res.status(200).send(updated_order_num)
            }
            else {
                res.status(200).send("0")
            }
            let user_data = {
                customer_id: current_customer.id,
                name: current_customer.displayName,
                counter: updated_order_num,
                total: product_count,
                available: available
            }
            const user_table = await db
                .collection("shopify_customers").findOne({ customer_id: user_data.customer_id }, (err, user) => {
                    if (!user) {
                        db.collection("shopify_customers").insertMany([user_data]);
                    }
                    else {
                        db.collection("shopify_customers").updateOne({ customer_id: user_data.customer_id }, [{ $set: { counter: user_data.counter } }, { $set: { total: user_data.total } }]);
                    }
                });
            return current_customer
        }
        const user = await getCustomerData()
        console.log("users", user)
    }
    else {
        res.status(200).send("Get")
    }
}