import Signup from "../src/Signup";
import GetAccount from "../src/GetAccount";
import AccountRepositoryDatabase from "../src/AccountRepositoryDatabase";
import LoggerConsole from "../src/LoggerConsole";
import RequestRide from "../src/RequestRide";
import GetRide from "../src/GetRide";
import RideRepositoryDatabase from "../src/RideRepositoryDatabase";

let signup: Signup;
let getAccount: GetAccount;
let requestRide: RequestRide;
let getRide: GetRide;

beforeEach(() => {
    const accountDAO = new AccountRepositoryDatabase();
    const rideDAO = new RideRepositoryDatabase();
    const logger = new LoggerConsole();
    signup = new Signup(accountDAO, logger);
    getAccount = new GetAccount(accountDAO);
    requestRide = new RequestRide(rideDAO, accountDAO,logger);
    getRide = new GetRide(rideDAO, logger);
})

test("Deve solicitar uma corrida", async () => {
    const inputSignup = {
        name: "John Doe",
        email: `john.doe${Math.random()}@gmail.com`,
        cpf: "97456321558",
        isPassenger: true,
        password: "123456"
    };

    const outputSignup = await signup.execute(inputSignup);
    const inputRequestRide = {
        passengerId: outputSignup.accountId,
        fromLat: -27.584905257808835,
        fromLong: -48.545022195325124,
        toLat: -27.496887588317275,
        toLong: -48.522234807851476
    }
    const outputRequestRide = await requestRide.execute(inputRequestRide);
    expect(outputRequestRide.rideId).toBeDefined();
    const outputGetRide = await getRide.execute(outputRequestRide.rideId);
    expect(outputGetRide.status).toBe("requested");
});

test("Não deve solicitar uma corrida se a conta não for de um passageiro", async () => {
    const inputSignup = {
        name: "John Doe",
        email: `john.doe${Math.random()}@gmail.com`,
        cpf: "97456321558",
        carPlate: "AAA9999",
        isDriver: true,
        password: "123456"
    };

    const outputSignup = await signup.execute(inputSignup);
    const inputRequestRide = {
        passengerId: outputSignup.accountId,
        fromLat: -27.584905257808835,
        fromLong: -48.545022195325124,
        toLat: -27.496887588317275,
        toLong: -48.522234807851476
    }
    await expect(() => requestRide.execute(inputRequestRide)).rejects.toThrow(new Error("Only passengers can request a ride"));
});

test("Não deve solicitar uma corrida se o passageiro já tiver uma corrida ativa", async () => {
    const inputSignup = {
        name: "John Doe",
        email: `john.doe${Math.random()}@gmail.com`,
        cpf: "97456321558",
        isPassenger: true,
        password: "123456"
    };

    const outputSignup = await signup.execute(inputSignup);
    const inputRequestRide = {
        passengerId: outputSignup.accountId,
        fromLat: -27.584905257808835,
        fromLong: -48.545022195325124,
        toLat: -27.496887588317275,
        toLong: -48.522234807851476
    }
    await requestRide.execute(inputRequestRide);
    await expect(() => requestRide.execute(inputRequestRide)).rejects.toThrow(new Error("Passenger has an active ride"));
});

test("Não deve solicitar uma corrida se a conta não existir", async () => {
    const inputRequestRide = {
        passengerId: "db4baab8-21b6-4564-a393-bbe7e142978f",
        fromLat: -27.584905257808835,
        fromLong: -48.545022195325124,
        toLat: -27.496887588317275,
        toLong: -48.522234807851476
    }
    await expect(() => requestRide.execute(inputRequestRide)).rejects.toThrow(new Error("Account does not exists"));
});