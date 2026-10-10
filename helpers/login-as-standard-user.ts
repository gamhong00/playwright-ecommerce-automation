import { type LoginPage } from '../pages/login.page';
import loginCases from '../test-data/login.json';

export async function loginAsStandardUser(loginPage: LoginPage): Promise<void> {
    // Reuse the successful login credentials from the shared test data.
    const user = loginCases.find((user) => user.expected === 'success');
    if (!user) {
        throw new Error('A successful login user is required');
    }

    await loginPage.goto();
    await loginPage.login(user.username, user.password);
}
