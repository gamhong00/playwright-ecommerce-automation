import { test, expect } from '../../fixtures/pages.fixture';
import { products } from '../../test-data/products';
import { loginAsStandardUser } from '../../helpers/login-as-standard-user';

test.beforeEach(async ({ loginPage, inventoryPage }) => {
    // Each test starts with a fresh session and an empty cart.
    await loginAsStandardUser(loginPage);
    await expect(inventoryPage.title).toHaveText('Products');
});

test('displays an empty cart', async ({ page, inventoryPage, cartPage }) => {
    await inventoryPage.openCart();
    await expect(page).toHaveURL('/cart.html');
    // await expect(cartPage.title).toHaveText('Your Cart');
    // Intentionally fail to verify screenshot capture.
    await expect(cartPage.title).toHaveText('Wrong title');
    await expect(cartPage.items).toHaveCount(0);
    await expect(inventoryPage.cartBadge).toHaveCount(0);
});

test('displays added products with correct prices and quantities', async ({
    inventoryPage,
    cartPage
}) => {
    const selectedProducts = products.slice(0, 2);
    for (const product of selectedProducts) {
        await inventoryPage.addToCart(product.name);
    }
    await inventoryPage.openCart();

    await expect(cartPage.items).toHaveCount(selectedProducts.length);
    await expect(inventoryPage.cartBadge).toHaveText('2');
    for (const product of selectedProducts) {
        const item = cartPage.item(product.name);
        await expect(item).toBeVisible();
        await expect(
            item.locator('[data-test="inventory-item-price"]')
        ).toHaveText(`$${product.price.toFixed(2)}`);
        await expect(item.locator('[data-test="item-quantity"]')).toHaveText(
            '1'
        );
    }
});

test('removes one product without removing the other', async ({
    inventoryPage,
    cartPage
}) => {
    const [removedProduct, remainingProduct] = products;
    await inventoryPage.addToCart(removedProduct.name);
    await inventoryPage.addToCart(remainingProduct.name);
    await inventoryPage.openCart();

    await cartPage.removeProduct(removedProduct.name);
    await expect(cartPage.item(removedProduct.name)).toHaveCount(0);
    await expect(cartPage.item(remainingProduct.name)).toBeVisible();
    await expect(cartPage.items).toHaveCount(1);
    await expect(inventoryPage.cartBadge).toHaveText('1');
});

test('continues shopping while keeping the cart contents', async ({
    page,
    inventoryPage,
    cartPage
}) => {
    const productName = products[0].name;
    await inventoryPage.addToCart(productName);
    await inventoryPage.openCart();
    await cartPage.continueShopping();

    await expect(page).toHaveURL('/inventory.html');
    await expect(inventoryPage.title).toHaveText('Products');
    await expect(inventoryPage.cartBadge).toHaveText('1');
    // Confirm the product is still in the cart after returning to inventory.
    await inventoryPage.openCart();
    await expect(cartPage.items).toHaveCount(1);
    await expect(cartPage.item(productName)).toBeVisible();
});

test('opens checkout with a product in the cart', async ({
    page,
    inventoryPage,
    cartPage,
    checkoutPage
}) => {
    await inventoryPage.addToCart(products[0].name);
    await inventoryPage.openCart();
    await cartPage.checkout();

    await expect(page).toHaveURL('/checkout-step-one.html');
    await expect(checkoutPage.title).toHaveText('Checkout: Your Information');
    await expect(checkoutPage.firstNameInput).toBeVisible();
    await expect(checkoutPage.lastNameInput).toBeVisible();
    await expect(checkoutPage.postalCodeInput).toBeVisible();
});
