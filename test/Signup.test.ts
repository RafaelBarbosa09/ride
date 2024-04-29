import Signup from "../src/Signup";
import GetAccount from "../src/GetAccount";
import sinon, {spy} from "sinon";
import AccountRepository from "../src/AccountRepository";
import Logger from "../src/Logger";
import AccountRepositoryDatabase from "../src/AccountRepositoryDatabase";
import LoggerConsole from "../src/LoggerConsole";
import accountDAO from "../src/AccountRepository";
import logger from "../src/Logger";
import Account from "../src/Account";

let signup: Signup;
let getAccount: GetAccount;

beforeEach(() => {
    const accountDAO = new AccountRepositoryDatabase();
    const logger = new LoggerConsole();
    signup = new Signup(accountDAO, logger);
    getAccount = new GetAccount(accountDAO);
})

test("Deve criar uma conta para o passageiro com stub", async () => {
    const stubAccountDAOSave = sinon.stub(AccountRepositoryDatabase.prototype, "save").resolves();
    const stubAccountDAOGetByEmail = sinon.stub(AccountRepositoryDatabase.prototype, "getByEmail").resolves(undefined);

    const inputSignup = {
        name: "John Doe",
        email: `john.doe${Math.random()}@gmail.com`,
        cpf: "97456321558",
        isPassenger: true,
        password: "123456"
    };

    const outputSignup = await signup.execute(inputSignup);
    expect(outputSignup.accountId).toBeDefined();

    const stubAccountDAOGetById = sinon.stub(AccountRepositoryDatabase.prototype, "getById").resolves(Account.create(inputSignup.name, inputSignup.email, inputSignup.cpf, "", inputSignup.isPassenger, false));
    const outputGetAccount = await getAccount.execute(outputSignup.accountId);
    expect(outputGetAccount!!.name).toBe(inputSignup.name);
    expect(outputGetAccount!!.email).toBe(inputSignup.email);

    stubAccountDAOSave.restore();
    stubAccountDAOGetByEmail.restore();
    stubAccountDAOGetById.restore();
});

test("Deve criar uma conta para o passageiro com fake", async () => {
    const inputSignup = {
        name: "John Doe",
        email: `john.doe${Math.random()}@gmail.com`,
        cpf: "97456321558",
        isPassenger: true,
        password: "123456"
    };

    const accountDAO: AccountRepository = {
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

    const getAccount = new GetAccount(accountDAO);

    const signup = new Signup(accountDAO, logger);

    const outputSignup = await signup.execute(inputSignup);
    expect(outputSignup.accountId).toBeDefined();

    const outputGetAccount = await getAccount.execute(outputSignup.accountId);
    expect(outputGetAccount!!.name).toBe(inputSignup.name);
    expect(outputGetAccount!!.email).toBe(inputSignup.email);
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
    expect(outputGetAccount!!.name).toBe(inputSignup.name);
    expect(outputGetAccount!!.email).toBe(inputSignup.email);
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