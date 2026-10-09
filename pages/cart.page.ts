import { type Locator, type Page } from '@playwright/test';

export class CartPage {
    readonly title: Locator;
    readonly items: Locator;
    readonly continueShoppingButton: Locator;
    readonly checkoutButton: Locator;

    constructor(private readonly page: Page) {
        this.title = page.locator('[data-test="title"]');
        this.items = page.locator('[data-test="inventory-item"]');
        this.continueShoppingButton = page.getByRole('button', {
            name: 'Continue Shopping',
            exact: true
        });
        this.checkoutButton = page.getByRole('button', {
            name: 'Checkout',
            exact: true
        });
    }

    // Scope actions to the cart item containing this exact product name.
    item(name: string): Locator {
        return this.items.filter({
            has: this.page.getByText(name, { exact: true })
        });
    }

    async removeProduct(name: string): Promise<void> {
        await this.item(name)
            .getByRole('button', { name: 'Remove', exact: true })
            .click();
    }

    async continueShopping(): Promise<void> {
        await this.continueShoppingButton.click();
    }

    async checkout(): Promise<void> {
        await this.checkoutButton.click();
    }
}
