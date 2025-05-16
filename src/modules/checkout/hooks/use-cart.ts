import { useCartStore } from "../store/use-card-store";

export const useCart = (tenantSlug: string) => {
  const {
    getCartByTenant,
    removeProduct,
    addProduct,
    clearAllCarts,
    clearCart
  } = useCartStore();

  const productIds = getCartByTenant(tenantSlug);

  const toggleProduct = (productId: string) => {
    if (productIds.includes(productId)) {
      removeProduct(tenantSlug, productId);
    } else {
      addProduct(tenantSlug, productId);
    }
  };

  const isProductInCart = (productId: string) => {
    return productIds.includes(productId);
  };

  return {
    productIds,
    addProduct: (productId: string) => addProduct(tenantSlug, productId),
    removeProduct: (productId: string) => removeProduct(tenantSlug, productId),
    clearCart: clearAllCarts,
    clearAllCarts,
    toggleProduct,
    isProductInCart,
    totalItems: productIds.length
  };
};
