import { type Locator, type Page } from '@playwright/test';

export class CheckoutPage {
    readonly title: Locator;
    readonly firstNameInput: Locator;
    readonly lastNameInput: Locator;
    readonly postalCodeInput: Locator;
    readonly errorMessage: Locator;
    readonly items: Locator;
    readonly subtotal: Locator;
    readonly tax: Locator;
    readonly total: Locator;
    readonly completeHeader: Locator;
    readonly completeText: Locator;
    readonly continueButton: Locator;
    readonly cancelButton: Locator;
    readonly finishButton: Locator;
    readonly backHomeButton: Locator;

    constructor(private readonly page: Page) {
        this.title = page.locator('[data-test="title"]');
        this.firstNameInput = page.getByPlaceholder('First Name');
        this.lastNameInput = page.getByPlaceholder('Last Name');
        this.postalCodeInput = page.getByPlaceholder('Zip/Postal Code');
        this.errorMessage = page.locator('[data-test="error"]');
        this.items = page.locator('[data-test="inventory-item"]');
        this.subtotal = page.locator('[data-test="subtotal-label"]');
        this.tax = page.locator('[data-test="tax-label"]');
        this.total = page.locator('[data-test="total-label"]');
        this.completeHeader = page.locator('[data-test="complete-header"]');
        this.completeText = page.locator('[data-test="complete-text"]');
        this.continueButton = page.getByRole('button', {
            name: 'Continue',
            exact: true
        });
        this.cancelButton = page.getByRole('button', {
            name: 'Cancel',
            exact: true
        });
        this.finishButton = page.getByRole('button', {
            name: 'Finish',
            exact: true
        });
        this.backHomeButton = page.getByRole('button', {
            name: 'Back Home',
            exact: true
        });
    }

    item(name: string): Locator {
        return this.items.filter({
            has: this.page.getByText(name, { exact: true })
        });
    }

    // Empty strings are allowed so tests can check required-field validation.
    async fillInformation(
        firstName: string,
        lastName: string,
        postalCode: string
    ): Promise<void> {
        await this.firstNameInput.fill(firstName);
        await this.lastNameInput.fill(lastName);
        await this.postalCodeInput.fill(postalCode);
    }

    async continue(): Promise<void> {
        await this.continueButton.click();
    }

    async cancel(): Promise<void> {
        await this.cancelButton.click();
    }

    async finish(): Promise<void> {
        await this.finishButton.click();
    }

    async backToProducts(): Promise<void> {
        await this.backHomeButton.click();
    }
}
