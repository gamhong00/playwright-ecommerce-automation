import { type Locator, type Page } from '@playwright/test';

export type ProductSort = 'az' | 'za' | 'lohi' | 'hilo';

export class InventoryPage {
    readonly title: Locator;
    readonly products: Locator;
    readonly productNames: Locator;
    readonly productPrices: Locator;
    readonly sortSelect: Locator;
    readonly cartBadge: Locator;

    constructor(private readonly page: Page) {
        this.title = page.locator('[data-test="title"]');
        this.products = page.locator('[data-test="inventory-item"]');
        this.productNames = this.products.locator(
            '[data-test="inventory-item-name"]'
        );
        this.productPrices = this.products.locator(
            '[data-test="inventory-item-price"]'
        );
        this.sortSelect = page.locator('[data-test="product-sort-container"]');
        this.cartBadge = page.locator('[data-test="shopping-cart-badge"]');
    }

    // Scope actions to the product with this exact name, not a similar product.
    product(name: string): Locator {
        return this.products.filter({
            has: this.page.getByText(name, { exact: true })
        });
    }

    async sortProducts(order: ProductSort): Promise<void> {
        await this.sortSelect.selectOption(order);
    }

    async openCart(): Promise<void> {
        await this.page.locator('[data-test="shopping-cart-link"]').click();
    }

    async addToCart(name: string): Promise<void> {
        await this.product(name)
            .getByRole('button', { name: 'Add to cart', exact: true })
            .click();
    }

    async removeFromCart(name: string): Promise<void> {
        await this.product(name)
            .getByRole('button', { name: 'Remove', exact: true })
            .click();
    }
}
