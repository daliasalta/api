import { Router } from "express";
import getProducts from "./product/getProducts";
import postProduct from "./product/postProduct";
import postCategory from "./category/postCategory";
import postImage from "./product/postImage";
import getProductById from "./product/getProductById";
import getPrimaryCategories from "./category/getPrimaryCategories";
import getSecondaryCategories from "./category/getSecondaryCategories";
import getCategoryProducts from "./category/getCategoryProducts";
import patchProduct from "./product/patchProduct";
import deleteProduct from "./product/deleteProduct";
import postShopCart from "./shop_cart/postShopCart";
import getShopCarts from "./shop_cart/getShopCarts";
import getShopCartById from "./shop_cart/getShopCartById";
import getManyProducts from "./product/getManyProducts";
import deleteCategory from "./category/deleteCategory";
import getProductByName from "./product/getProductByName";
import validateProductstock from "./shop_cart/validateProductStock";
import patchShopCart from "./shop_cart/patchShopCart";
import postCouponCode from "./coupon_code/postCouponCode";
import validateCoupon from "./coupon_code/validateCoupon";
import getFeaturedProducts from "./product/getFeaturedProducts";
import getDiscountProducts from "./product/getDiscountProducts";
import getCategories from "./category/getCategories";
import patchCategory from "./category/patchCategory";
import getCategoriesPopulated from "./category/getCategoriesPopulated";
import getAllProducts from "./product/getAllProducts";
import postDollarPrice from "./dollar_price/postDollarPrice";
import filterExactCategories from "./category/filterExactCategories";
import getShippingMethods from "./shipping/getShippingMethods";
import postShippingMethod from "./shipping/postShippingMethod";
import patchShippingMethod from "./shipping/patchShippingMethod";
import deleteShippingMethod from "./shipping/deleteShippingMethod";
import getShopCartByOrderNumber from "./shop_cart/getShopCartByOrderNumber";

const router = Router();

// PRODUCTS
router.use("/get-product", getProductById);
router.use("/get-many-products", getManyProducts);
router.use("/get-products", getProducts);
router.use("/get-product-by-name", getProductByName);
router.use("/post-product", postProduct);
router.use("/patch-product", patchProduct);
router.use("/delete-product", deleteProduct);
router.use("/get-featured-products", getFeaturedProducts);
router.use("/get-discount-products", getDiscountProducts);
router.use("/get-all-products", getAllProducts);

// CATEGORIES
router.use("/post-category", postCategory);
router.use("/get-primary-categories", getPrimaryCategories);
router.use("/get-secondary-categories", getSecondaryCategories);
router.use("/get-category-products", getCategoryProducts);
router.use("/get-categories", getCategories);
router.use("/delete-category", deleteCategory);
router.use("/patch-category", patchCategory);
router.use("/get-categories-populated", getCategoriesPopulated);
router.use("/filter-exact-categories", filterExactCategories);

// SHOP CARTS
router.use("/validate-stock", validateProductstock);
router.use("/get-shopcarts", getShopCarts);
router.use("/post-shopcart", postShopCart);
router.use("/get-shopcart", getShopCartById);
router.use("/patch-shopcart", patchShopCart);
router.use("/get-by-order-number", getShopCartByOrderNumber);

// CLOUDINARY
router.use("/upload-image", postImage);

// SHIPPING METHODS
router.use("/post-shipping-method", postShippingMethod);
router.use("/get-shipping-method", getShippingMethods);
router.use("/patch-shipping-method", patchShippingMethod);
router.use("/delete-shipping-method", deleteShippingMethod);

// COUPON CODES
router.use("/post-coupon-code", postCouponCode);
router.use("/coupon-validate", validateCoupon);

// DOLLAR PRICE
router.use("/post-dollar-price", postDollarPrice);

export default router;
