import * as React from 'react';
import { getAllCustomers } from "../lib/shopify"
import Stack from '@mui/material/Stack';
import TablePagination from '@mui/material/TablePagination';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

export default function PaginationControlled({ products }) {
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [new_products, setNew_Products] = React.useState(products.slice(0, 10));

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
        setNew_Products(products.slice(newPage * rowsPerPage, (newPage + 1) * rowsPerPage))
    };

    const handleChangeRowsPerPage = (event) => {
        const perPage = parseInt(event.target.value)
        setRowsPerPage(perPage);
        setPage(0);
        setNew_Products(products.slice(page * perPage, (page + 1) * perPage))
    };

    const StyledTableCell = styled(TableCell)(({ theme }) => ({
        [`&.${tableCellClasses.head}`]: {
          backgroundColor: theme.palette.common.black,
          color: theme.palette.common.white,
        },
        [`&.${tableCellClasses.body}`]: {
          fontSize: 14,
        },
      }));
      
      const StyledTableRow = styled(TableRow)(({ theme }) => ({
        '&:nth-of-type(odd)': {
          backgroundColor: theme.palette.action.hover,
        },
        '&:last-child td, &:last-child th': {
          border: 0,
        },
      }));

    return (
        <Stack spacing={2}>
            <h2 style={{'textAlign': 'center'}}>Our Customers</h2>
            <TablePagination
                component="div"
                count={200}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
                    <TableHead>
                        <TableRow>
                            <StyledTableCell>Name</StyledTableCell>
                            <StyledTableCell align="right">Free Courses</StyledTableCell>
                            <StyledTableCell align="right">Counter</StyledTableCell>
                            <StyledTableCell align="right">Total Order Number</StyledTableCell>
                            <StyledTableCell align="right">Customer Tags</StyledTableCell>
                            <StyledTableCell align="right">Available Member?</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {new_products.map((product) => (
                            <StyledTableRow key={product.node.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                <StyledTableCell component="th" scope="row">{product.node.displayName}</StyledTableCell>
                                {
                                    product.node.tags.indexOf("Member") != -1 ? (<StyledTableCell align="right">{parseInt(product.node.ordersCount / 6, 10)}</StyledTableCell>) : (<StyledTableCell align="right">Disabled</StyledTableCell>)
                                }
                                {
                                    product.node.tags.indexOf("Member") != -1 ? (<StyledTableCell align="right">{product.node.ordersCount % 6}</StyledTableCell>) : (<StyledTableCell align="right">Disabled</StyledTableCell>)
                                }
                                <StyledTableCell align="right">{product.node.ordersCount}</StyledTableCell>
                                <StyledTableCell align='right'>{product.node.tags.map((customer_tag, index) => (<span key={index}>{customer_tag},  </span>))}</StyledTableCell>
                                {
                                    product.node.tags.indexOf("Member") != -1 ? (<StyledTableCell align="right">Available</StyledTableCell>) : (<StyledTableCell align="right">Not available</StyledTableCell>)
                                }
                            </StyledTableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Stack>
    );
}

export async function getStaticProps() {
    const products = await getAllCustomers()

    return {
        props: { products },
    }
}
