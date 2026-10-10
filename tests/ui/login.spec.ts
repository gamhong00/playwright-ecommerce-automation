import { test, expect } from '../../fixtures/pages.fixture';
import loginCases from '../../test-data/login.json';

for (const loginCase of loginCases) {
    test(loginCase.name, async ({ page, loginPage }) => {
        await loginPage.goto();
        await loginPage.login(loginCase.username, loginCase.password);

        // A successful login must open the inventory page and display its title.
        if (loginCase.expected === 'success') {
            await expect(page).toHaveURL('/inventory.html');
            await expect(
                page.getByText('Products', { exact: true })
            ).toBeVisible();
        } else {
            // Error cases must show the message specified in the test data.
            await expect(loginPage.errorMessage).toHaveText(
                loginCase.errorMessage
            );
            await expect(page).toHaveURL('/');
            await expect(loginPage.loginButton).toBeVisible();
        }
    });
}
