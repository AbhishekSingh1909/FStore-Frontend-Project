import {
  Box,
  Button,
  CircularProgress,
  Container,
  InputBase,
  Pagination,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  IconButton,
  Tooltip
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ImageIcon from '@mui/icons-material/Image';
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAppDispatch } from "../app/hooks/useAppDispatch";
import { useAppSelector } from "../app/hooks/useAppSelector";
import { getAllProductsAsync } from "../redux/reducers/product/productReducer";
import ErrorMessage from "../components/ErrorMessage";
import UpdateProductModel from "../components/product/Model/UpdateProductModel";
import { DeleteProductModel } from "../components/product/Model/DeleteProductModel";
import { CreateProductModel } from "../components/product/Model/CreateProductModel";
import Product from "../types/Product";
import getFilteredProducts from "../selectors/getFilteredProducts";
import { getProductCategoriesAsync } from "../redux/reducers/category/getProductCategoriesAsync";
import { authenticateUserAsync } from "../redux/reducers/userAuthentication/authenticateUserAsync";
import { NotAuthorized } from "./NotAuthorizedUser";
import Login from "./Login";

const ProductTableList = () => {
  const [page, setPage] = useState(1);
  const [data, setData] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [debounceSearch, setDebouncedSearch] = useState("");
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const access_token = localStorage.getItem("access_token");

  const { products, error, loading } = useAppSelector(
    (state) => state.productReducer
  );
  const { user } = useAppSelector((state) => state.authReducer);

  useEffect(() => {
    if (access_token !== null) {
      dispatch(authenticateUserAsync(access_token));
      dispatch(getAllProductsAsync());
      dispatch(getProductCategoriesAsync());
    }
  }, [access_token]);

  useEffect(() => {
    const timeOutId = setTimeout(() => {
      setDebouncedSearch(search);
    }, 100);

    return () => clearTimeout(timeOutId);
  }, [search]);

  const handleNavigateBack = () => {
    navigate(-1);
  };

  const { pageCount, filterProducts } = useMemo(() => {
    const filterProducts = getFilteredProducts(products, debounceSearch);
    const pageCount = Math.ceil(filterProducts.length / 10);
    const data = filterProducts?.slice(0, 10);
    setData(data);
    return { pageCount, filterProducts };
  }, [products, debounceSearch]);

  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);

    // show the count at per page
    // 0 - 10
    // 11 - 20
    const startIndex = (value - 1) * 10;

    const data = filterProducts?.slice(startIndex, value * 10);
    setData(data);
  };

  const handleSeachChange = (search: string) => {
    setSearch(search);
  };

  const handleImageClick = () => {

  }

  if (user && user && user.role !== "Admin") {
    return <NotAuthorized />;
  }
  if (!user) {
    return <Login />;
  }

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginTop: "100px",
        }}
      >
        <CircularProgress size={64} color="secondary" />
      </Box>
    );
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }
  return (
    <Container>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          margin: "2em",
        }}
      >
        <Box>
          <Button variant="contained" onClick={handleNavigateBack}>
            Back
          </Button>
        </Box>
        <Box>
          <CreateProductModel />
        </Box>
      </Box>
      <Container maxWidth="xs" sx={{ marginTop: "20px" }}>
        <Paper
          component="form"
          sx={{
            p: "2px 4px",
            display: "flex",
            alignItems: "center",
            width: 400,
          }}
        >
          <InputBase
            sx={{ ml: 1, flex: 1 }}
            placeholder="Search Prodcut by title"
            onChange={(e) => handleSeachChange(e.target.value)}
          />
          <IconButton type="button" sx={{ p: "10px" }} aria-label="search">
            <SearchIcon />
          </IconButton>
        </Paper>
      </Container>
      <Typography variant="h4" gutterBottom>
        Product List
      </Typography>
      <Paper elevation={3} style={{ marginTop: "20px" }}>
        <TableContainer>
          <Table aria-label="Products table">
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data &&
                data.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>{product.title}</TableCell>
                    <TableCell>{product.description}</TableCell>
                    <TableCell>{`${product.price}€`}</TableCell>
                    <TableCell>
                      {user?.role === "Admin" && (
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "row",
                            gap: "10",
                            margin: "1em"
                          }}
                        >
                          <Stack sx={{ marginTop: "0.25em" }}>
                            <UpdateProductModel product={product} />
                          </Stack>
                          <Stack >
                            <DeleteProductModel product={product} />
                          </Stack>
                          <Stack>
                            <Tooltip title="Image">
                              <IconButton component={Link} to={`./productImage/${product.id}`} color="secondary" size="large">
                                <ImageIcon />
                              </IconButton>
                            </Tooltip>
                          </Stack>
                        </Box>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      {data && (
        <Stack
          spacing={2}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography>Page: {page}</Typography>
          <Pagination
            count={pageCount}
            page={page}
            onChange={handleChange}
            color="primary"
            sx={{ margin: "20px", padding: "20px" }}
          />
        </Stack>
      )}
    </Container>
  );
};
export default ProductTableList;
