import { test, expect } from '../../fixtures/pages.fixture';
import { type ProductSort } from '../../pages/inventory.page';
import { products } from '../../test-data/products';
import { loginAsStandardUser } from '../../helpers/login-as-standard-user';

test.beforeEach(async ({ loginPage, inventoryPage }) => {
    // Log in separately for each test so cart changes cannot affect another test.
    await loginAsStandardUser(loginPage);
    await expect(inventoryPage.title).toHaveText('Products');
});

test('displays the product catalog', async ({ inventoryPage }) => {
    await expect(inventoryPage.products).toHaveCount(products.length);
    for (const product of products) {
        const item = inventoryPage.product(product.name);
        await expect(item).toBeVisible();
        await expect(
            item.locator('[data-test="inventory-item-price"]')
        ).toHaveText(`$${product.price.toFixed(2)}`);
        await expect(
            item.getByRole('button', { name: 'Add to cart', exact: true })
        ).toBeVisible();
    }
});

const sortCases: {
    name: string;
    order: ProductSort;
    field: 'name' | 'price';
    descending: boolean;
}[] = [
    { name: 'name A to Z', order: 'az', field: 'name', descending: false },
    { name: 'name Z to A', order: 'za', field: 'name', descending: true },
    {
        name: 'price low to high',
        order: 'lohi',
        field: 'price',
        descending: false
    },
    {
        name: 'price high to low',
        order: 'hilo',
        field: 'price',
        descending: true
    }
];

for (const sortCase of sortCases) {
    test(`sorts products by ${sortCase.name}`, async ({ inventoryPage }) => {
        await inventoryPage.sortProducts(sortCase.order);

        // Sort a copy of the expected data to avoid changing shared test data.
        const sorted = [...products].sort((a, b) => {
            const comparison =
                sortCase.field === 'name'
                    ? a.name.localeCompare(b.name)
                    : a.price - b.price;
            return sortCase.descending ? -comparison : comparison;
        });

        if (sortCase.field === 'name') {
            await expect(inventoryPage.productNames).toHaveText(
                sorted.map((product) => product.name)
            );
        } else {
            await expect(inventoryPage.productPrices).toHaveText(
                sorted.map((product) => `$${product.price.toFixed(2)}`)
            );
        }
    });
}

test('adds and removes a product from the cart', async ({ inventoryPage }) => {
    const productName = products[0].name;
    const item = inventoryPage.product(productName);

    await expect(inventoryPage.cartBadge).toHaveCount(0);
    await inventoryPage.addToCart(productName);
    await expect(inventoryPage.cartBadge).toHaveText('1');
    await expect(
        item.getByRole('button', { name: 'Remove', exact: true })
    ).toBeVisible();

    await inventoryPage.removeFromCart(productName);
    await expect(inventoryPage.cartBadge).toHaveCount(0);
    await expect(
        item.getByRole('button', { name: 'Add to cart', exact: true })
    ).toBeVisible();
});
