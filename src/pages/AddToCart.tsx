import {
  Box,
  Button,
  CardActions,
  CardMedia,
  Container,
  CssBaseline,
  Grid,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { Link, useNavigate } from "react-router-dom";

import { Wrapper } from "../custom-component/AddToCartPrimaryBox";
import { useAppSelector } from "../app/hooks/useAppSelector";
import { SecondryBox } from "../custom-component/SecondryBox";
import { useAppDispatch } from "../app/hooks/useAppDispatch";
import {
  clearCart,
  decreaseQunatity,
  detetFromCart,
  increaseQuantity,
} from "../redux/reducers/cart/cartReducer";
import { CartItem } from "../types/CartItem";
import { Fragment } from "react";

import { CheckOut } from "./OrderCheckOut";


export const AddtoCart = () => {
  const { cartItems } = useAppSelector((state) => state.cartReducer);
  const { user } = useAppSelector((state) => state.authReducer);
  const dispatch = useAppDispatch();
  const navigate = useNavigate()

  const addToCart = async (id: string) => {
    await dispatch(increaseQuantity(id));
  };

  const removeFromCart = (id: string) => {
    dispatch(decreaseQunatity(id));
  };

  const emptyCart = () => {
    dispatch(clearCart());
  };

  const handleNavigateBack = () => {
    navigate(-1);
  };

  const handleDeleteItem = (id: string) => {
    dispatch(detetFromCart(id));
  };
  const calculateTotal = (items: CartItem[]) =>
    items.reduce((acc, item) => Math.round((acc + item.quantity * item.price) * 100) / 100, 0);

  return (
    <Fragment>
      <Container maxWidth="xs">
        <CssBaseline />
        <Wrapper>

          {cartItems.length > 0 && (
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Box sx={{ marginTop: "auto" }}>
                <Button variant="contained" onClick={handleNavigateBack}>
                  Back
                </Button>
              </Box>
              <Box sx={{ marginTop: "auto" }}>
                <Button
                  size="medium"
                  variant="contained"
                  disableElevation
                  sx={{ display: "flex", marginTop: "10px", marginLeft: "auto" }}
                  onClick={() => emptyCart()}
                >
                  Clear Cart
                </Button>
              </Box>
            </Box>
          )}
          <Box sx={{ margin: "2%" }}>
            <Typography variant="h4">Your Cart</Typography>
          </Box>

          {cartItems.length === 0 && (
            <Grid>
              <Typography variant="h6">No items in cart.</Typography>
              <Button
                component={Link}
                to="../products"
                sx={{
                  marginLeft: "auto",
                  borderRadius: "10px",
                  width: "20%",
                  paddingLeft: "0%",
                }}
              >
                Go for Shopping
              </Button>
            </Grid>
          )}

          <Box sx={{ marginTop: "10px", padding: "10px" }}>
            {cartItems.map((item) => (
              <SecondryBox>
                <Box sx={{ flex: "1" }} key={item?.id}>
                  {item?.title && (
                    <Typography variant="h6"> {item?.title}</Typography>
                  )}

                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Typography>Price: {item?.price} €</Typography>
                    <Typography>
                      Total:{Math.round((item?.price * item?.quantity) * 100) / 100} €
                    </Typography>
                  </Box>
                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Button
                      size="medium"
                      variant="contained"
                      disableElevation
                      sx={{ marginTop: "10px" }}
                      onClick={() => removeFromCart(item?.id)}
                    >
                      -
                    </Button>
                    <Typography sx={{ marginTop: "20px" }}>
                      {item?.quantity}
                    </Typography>
                    <Button
                      size="medium"
                      variant="contained"
                      disableElevation
                      sx={{ marginTop: "10px" }}
                      onClick={() => addToCart(item?.id)}
                    >
                      +
                    </Button>
                  </Box>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    maxWidth: 345,
                    margin: "20px",
                  }}
                >
                  <CardMedia
                    component="img"
                    alt={item?.title}
                    height="194"
                    image={item?.images[0]}
                    sx={{
                      maxWidth: "100px",
                      objectFit: "cover",
                      marginLeft: "40px",
                    }}
                  />
                  <CardActions>
                    <Stack
                      direction="row"
                      alignItems="center"
                      sx={{
                        maxWidth: "100px",
                        objectFit: "cover",
                        marginLeft: "40px",
                      }}
                    >
                      <IconButton
                        aria-label="delete"
                        color="secondary"
                        size="medium"
                        onClick={() => handleDeleteItem(item?.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Stack>
                  </CardActions>
                </Box>
              </SecondryBox>
            ))}
          </Box>
          {cartItems.length > 0 && (
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Typography variant="h4">
                Total: {calculateTotal(cartItems)} €
              </Typography>
              <CheckOut cartItems={cartItems} />

            </Box>
          )}
        </Wrapper>
      </Container>
    </Fragment>
  );
};
