export const validateStock = (availableStock: any, requiredProducts: any) => {
  let missingProductStock = [];

  for (let i = 0; i < availableStock.length; i++) {
    const requiredProduct = requiredProducts.find(
      (product: any) => product.id === availableStock[i].id
    );
    // Verificar si el producto requerido existe y si hay suficiente stock
    if (
      availableStock[i].stock === 0 ||
      availableStock[i].stock < requiredProduct.quantity
    ) {
      missingProductStock.push(availableStock[i]);
    }
  }

  return missingProductStock;
};

export const validateStockShopCart = (cartItems: any) => {
  let missingProductStock: any = [];

  // console.log("itemssssssssssssssssss", cartItems);

  for (let i = 0; i < cartItems.length; i++) {
    console.log(cartItems);
    if (
      cartItems[i].product_stock < cartItems[i].customer_required_stock ||
      cartItems[i].product_stock === 0
    ) {
      missingProductStock.push(cartItems[i]);
    }
  }
  console.log(missingProductStock);
  return missingProductStock;
};
