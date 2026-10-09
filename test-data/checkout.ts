export const customer = {
    firstName: 'Test',
    lastName: 'Customer',
    postalCode: '10000'
};

export const missingInformationCases = [
    { name: 'first name', firstName: '', lastName: 'Customer', postalCode: '10000', error: 'Error: First Name is required' },
    { name: 'last name', firstName: 'Test', lastName: '', postalCode: '10000', error: 'Error: Last Name is required' },
    { name: 'postal code', firstName: 'Test', lastName: 'Customer', postalCode: '', error: 'Error: Postal Code is required' }
];
