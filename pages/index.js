import { getAllCustomers } from "../lib/shopify";
import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';

export default function Home({ products }) {

  return (
    <div className="bg-white">
      <div className="max-w-2xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8">
        <h1 style={{'textAlign': 'center'}}>
          Customers
        </h1>
        <Box sx={{ width: '100%' }}>
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
         {
            products.map(product => (
              <Grid item xs={3} key={product.node.id}>
              <Card>
                <CardContent>
                  {/* <Typography gutterBottom variant="h5" component="div">
                  {product.node.id}
                  </Typography> */}
                  <Typography variant="body1" color="text.secondary">
                  {product.node.id}
                  </Typography>

                  <Typography variant="body1" color="text.secondary">
                  {product.node.orders_count}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small">Details</Button>
                </CardActions>
              </Card>
              </Grid>
            ))
          }
          </Grid>
       </Box>
      </div>
    </div>
  )
}

export async function getStaticProps() {
  const products = await getAllCustomers()

  return {
    props: { products }, // will be passed to the page component as props
  }
}