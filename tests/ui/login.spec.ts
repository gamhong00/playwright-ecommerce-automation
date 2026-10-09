import { test, expect } from '../../fixtures/pages.fixture';
import loginCases from '../../test-data/users.json';

for (const loginCase of loginCases) {
    test(loginCase.name, async ({ page, loginPage }) => {
        // Reject unknown outcomes before interacting with the page so data typos fail clearly.
        if (!['success', 'locked', 'invalid'].includes(loginCase.expected)) {
            throw new Error(`Unknown expected value: ${loginCase.expected}`);
        }

        await loginPage.goto();
        await loginPage.login(loginCase.username, loginCase.password);

        // A successful login must open the inventory page and display its title.
        if (loginCase.expected === 'success') {
            await expect(page).toHaveURL(/inventory\.html/);
            await expect(
                page.getByText('Products', { exact: true })
            ).toBeVisible();
            return;
        }

        // Rejected logins must display the error message for the specified outcome.
        await expect(loginPage.errorMessage).toBeVisible();

        if (loginCase.expected === 'locked') {
            await expect(loginPage.errorMessage).toContainText('locked out');
        } else if (loginCase.expected === 'invalid') {
            await expect(loginPage.errorMessage).toContainText(
                'Username and password do not match'
            );
        }
    });
}
