import Signup from "../src/application/usecase/Signup";
import GetAccount from "../src/application/usecase/GetAccount";
import sinon, {spy} from "sinon";
import AccountRepository from "../src/application/repository/AccountRepository";
import Logger from "../src/application/logger/Logger";
import AccountRepositoryDatabase from "../src/infra/repository/AccountRepositoryDatabase";
import LoggerConsole from "../src/infra/logger/LoggerConsole";
import Account from "../src/domain/Account";
import PostgresAdapter from "../src/infra/database/PostgresAdapter";
import DatabaseConnection from "../src/infra/database/DatabaseConnection";

let signup: Signup;
let getAccount: GetAccount;
let databaseConnection: DatabaseConnection;

beforeEach(() => {
    databaseConnection = new PostgresAdapter();
    const accountRepository = new AccountRepositoryDatabase(databaseConnection);
    const logger = new LoggerConsole();
    signup = new Signup(accountRepository, logger);
    getAccount = new GetAccount(accountRepository);
})

test("Deve criar uma conta para o passageiro com stub", async () => {
    const stubAccountRepositorySave = sinon.stub(AccountRepositoryDatabase.prototype, "save").resolves();
    const stubAccountRepositoryGetByEmail = sinon.stub(AccountRepositoryDatabase.prototype, "getByEmail").resolves(undefined);

    const inputSignup = {
        name: "John Doe",
        email: `john.doe${Math.random()}@gmail.com`,
        cpf: "97456321558",
        isPassenger: true,
        password: "123456"
    };

    const outputSignup = await signup.execute(inputSignup);
    expect(outputSignup.accountId).toBeDefined();

    const stubAccountRepositoryGetById = sinon.stub(AccountRepositoryDatabase.prototype, "getById").resolves(Account.create(inputSignup.name, inputSignup.email, inputSignup.cpf, "", inputSignup.isPassenger, false));
    const outputGetAccount = await getAccount.execute(outputSignup.accountId);
    expect(outputGetAccount?.name).toBe(inputSignup.name);
    expect(outputGetAccount?.email).toBe(inputSignup.email);

    stubAccountRepositorySave.restore();
    stubAccountRepositoryGetByEmail.restore();
    stubAccountRepositoryGetById.restore();
});

test("Deve criar uma conta para o passageiro com fake", async () => {
    const inputSignup = {
        name: "John Doe",
        email: `john.doe${Math.random()}@gmail.com`,
        cpf: "97456321558",
        isPassenger: true,
        password: "123456"
    };

    const accountRepository: AccountRepository = {
        async getByEmail(email: string): Promise<any> {
            return undefined;
        },
        async getById(accountId: string): Promise<any> {
            return inputSignup;
        },
        async save(account: any): Promise<void> {}
    }

    const logger: Logger = {
        log(message: string): void {}
    }

    const getAccount = new GetAccount(accountRepository);

    const signup = new Signup(accountRepository, logger);

    const outputSignup = await signup.execute(inputSignup);
    expect(outputSignup.accountId).toBeDefined();

    const outputGetAccount = await getAccount.execute(outputSignup.accountId);
    expect(outputGetAccount?.name).toBe(inputSignup.name);
    expect(outputGetAccount?.email).toBe(inputSignup.email);
});

test("Não deve criar uma conta se o nome for inválido", async () => {
    const inputSignup = {
        name: "John",
        email: `john.doe${Math.random()}@gmail.com`,
        cpf: "97456321558",
        isPassenger: true,
        password: "123456"
    };
    await expect(() => signup.execute(inputSignup)).rejects.toThrow(new Error("Invalid name"));
});

test("Não deve criar uma conta se o email for inválido", async () => {
    const inputSignup = {
        name: "John Doe",
        email: `john.doe${Math.random()}`,
        cpf: "97456321558",
        isPassenger: true,
        password: "123456"
    };
    await expect(() => signup.execute(inputSignup)).rejects.toThrow(new Error("Invalid email"));
});

test("Não deve criar uma conta se o cpf for inválido", async () => {
    const inputSignup = {
        name: "John Doe",
        email: `john.doe${Math.random()}@gmail.com`,
        cpf: "11111111111",
        isPassenger: true,
        password: "123456"
    };
    await expect(() => signup.execute(inputSignup)).rejects.toThrow(new Error("Invalid cpf"));
});

test("Não deve criar uma conta se o email for duplicado", async () => {
    const inputSignup = {
        name: "John Doe",
        email: `john.doe${Math.random()}@gmail.com`,
        cpf: "97456321558",
        isPassenger: true,
        password: "123456"
    };
    await signup.execute(inputSignup);
    await expect(() => signup.execute(inputSignup)).rejects.toThrow(new Error("Duplicated account"));
});

test("Deve criar uma conta para o motorista", async () => {
    const spyLoggerLog = sinon.spy(LoggerConsole.prototype, "log")

    const inputSignup = {
        name: "John Doe",
        email: `john.doe${Math.random()}@gmail.com`,
        cpf: "97456321558",
        carPlate: "AAA9999",
        isPassenger: false,
        isDriver: true,
        password: "123456"
    };
    const outputSignup = await signup.execute(inputSignup);
    const outputGetAccount = await getAccount.execute(outputSignup.accountId);

    expect(outputSignup.accountId).toBeDefined();
    expect(outputGetAccount?.name).toBe(inputSignup.name);
    expect(outputGetAccount?.email).toBe(inputSignup.email);
    expect(spyLoggerLog.calledOnce).toBeTruthy();
    expect(spyLoggerLog.calledWith("signup John Doe")).toBeTruthy();
});

test("Não deve criar uma conta para o motorista com a placa inválida", async () => {
    const inputSignup = {
        name: "John Doe",
        email: `john.doe${Math.random()}@gmail.com`,
        cpf: "97456321558",
        carPlate: "AAA999",
        isPassenger: false,
        isDriver: true,
        password: "123456"
    };
    await expect(() => signup.execute(inputSignup)).rejects.toThrow(new Error("Invalid car plate"));
});

afterEach(async () => {
    await databaseConnection.close();
})