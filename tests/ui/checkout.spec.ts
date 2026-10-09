import { test, expect } from '../../fixtures/pages.fixture';
import { customer, missingInformationCases } from '../../test-data/checkout';
import { products } from '../../test-data/products';
import { loginAsStandardUser } from '../../helpers/login-as-standard-user';

const selectedProducts = products.slice(0, 2);

test.beforeEach(
    async ({ loginPage, inventoryPage, cartPage, checkoutPage }) => {
        // Prepare a fresh cart with the same two products for each checkout test.
        await loginAsStandardUser(loginPage);
        await expect(inventoryPage.title).toHaveText('Products');
        for (const product of selectedProducts) {
            await inventoryPage.addToCart(product.name);
        }
        await inventoryPage.openCart();
        await cartPage.checkout();
        await expect(checkoutPage.title).toHaveText(
            'Checkout: Your Information'
        );
    }
);

for (const testCase of missingInformationCases) {
    test(`requires ${testCase.name}`, async ({ page, checkoutPage }) => {
        await checkoutPage.fillInformation(
            testCase.firstName,
            testCase.lastName,
            testCase.postalCode
        );
        await checkoutPage.continue();

        await expect(checkoutPage.errorMessage).toHaveText(testCase.error);
        await expect(page).toHaveURL('/checkout-step-one.html');
    });
}

test('displays the correct products and totals in the overview', async ({
    page,
    checkoutPage
}) => {
    await checkoutPage.fillInformation(
        customer.firstName,
        customer.lastName,
        customer.postalCode
    );
    await checkoutPage.continue();

    await expect(page).toHaveURL('/checkout-step-two.html');
    await expect(checkoutPage.title).toHaveText('Checkout: Overview');
    await expect(checkoutPage.items).toHaveCount(selectedProducts.length);

    let subtotal = 0;
    for (const product of selectedProducts) {
        const item = checkoutPage.item(product.name);
        await expect(item).toBeVisible();
        await expect(
            item.locator('[data-test="inventory-item-price"]')
        ).toHaveText(`$${product.price.toFixed(2)}`);
        await expect(item.locator('[data-test="item-quantity"]')).toHaveText(
            '1'
        );
        subtotal += product.price;
    }

    // SauceDemo applies 8% tax, rounded to two decimal places.
    const tax = Math.round(subtotal * 0.08 * 100) / 100;
    const total = subtotal + tax;
    await expect(checkoutPage.subtotal).toHaveText(
        `Item total: $${subtotal.toFixed(2)}`
    );
    await expect(checkoutPage.tax).toHaveText(`Tax: $${tax.toFixed(2)}`);
    await expect(checkoutPage.total).toHaveText(`Total: $${total.toFixed(2)}`);
});

test('completes the order and clears the cart', async ({
    page,
    checkoutPage,
    inventoryPage,
    cartPage
}) => {
    await checkoutPage.fillInformation(
        customer.firstName,
        customer.lastName,
        customer.postalCode
    );
    await checkoutPage.continue();
    await checkoutPage.finish();

    await expect(page).toHaveURL('/checkout-complete.html');
    await expect(checkoutPage.title).toHaveText('Checkout: Complete!');
    await expect(checkoutPage.completeHeader).toHaveText(
        'Thank you for your order!'
    );
    await expect(checkoutPage.completeText).toHaveText(
        'Your order has been dispatched, and will arrive just as fast as the pony can get there!'
    );

    await checkoutPage.backToProducts();
    await expect(page).toHaveURL('/inventory.html');
    await expect(inventoryPage.title).toHaveText('Products');
    await expect(inventoryPage.cartBadge).toHaveCount(0);
    await inventoryPage.openCart();
    await expect(cartPage.title).toHaveText('Your Cart');
    await expect(cartPage.items).toHaveCount(0);
});

test('cancels customer information and keeps the cart contents', async ({
    page,
    checkoutPage,
    cartPage
}) => {
    await checkoutPage.cancel();

    await expect(page).toHaveURL('/cart.html');
    await expect(cartPage.title).toHaveText('Your Cart');
    await expect(cartPage.items).toHaveCount(selectedProducts.length);
    for (const product of selectedProducts) {
        await expect(cartPage.item(product.name)).toBeVisible();
    }
});

test('cancels the overview and keeps the cart contents', async ({
    page,
    checkoutPage,
    inventoryPage,
    cartPage
}) => {
    await checkoutPage.fillInformation(
        customer.firstName,
        customer.lastName,
        customer.postalCode
    );
    await checkoutPage.continue();
    await expect(checkoutPage.title).toHaveText('Checkout: Overview');
    await checkoutPage.cancel();

    await expect(page).toHaveURL('/inventory.html');
    await expect(inventoryPage.title).toHaveText('Products');
    await expect(inventoryPage.cartBadge).toHaveText(
        String(selectedProducts.length)
    );
    await inventoryPage.openCart();
    await expect(cartPage.items).toHaveCount(selectedProducts.length);
    for (const product of selectedProducts) {
        await expect(cartPage.item(product.name)).toBeVisible();
    }
});
