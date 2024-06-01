import Account from "../src/domain/Account";

test("Deve criar uma conta", () => {
    const account = Account.create("John Doe", "jhon.doe@gmail.com", "97456321558", "", true, false);
    expect(account.accountId).toBeDefined()
    expect(account.name).toBe("John Doe");
    expect(account.email).toBe("jhon.doe@gmail.com");
    expect(account.cpf).toBe("97456321558");
})