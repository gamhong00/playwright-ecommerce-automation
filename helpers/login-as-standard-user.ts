import { type LoginPage } from '../pages/login.page';
import users from '../test-data/users.json';

export async function loginAsStandardUser(loginPage: LoginPage): Promise<void> {
    // Reuse the successful login credentials from the shared test data.
    const user = users.find((user) => user.expected === 'success');
    if (!user) {
        throw new Error('A successful login user is required');
    }

    await loginPage.goto();
    await loginPage.login(user.username, user.password);
}
