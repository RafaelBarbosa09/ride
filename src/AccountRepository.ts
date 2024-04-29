import Account from "./Account";

interface AccountRepository {
    save(account: Account): Promise<void>;
    getById(accountId: string): Promise<Account | undefined>;
    getByEmail(email: string): Promise<Account | undefined>;
}

export default AccountRepository;