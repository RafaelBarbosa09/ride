import Signup from "../src/Signup";
import GetAccount from "../src/GetAccount";
import AccountRepositoryDatabase from "../src/AccountRepositoryDatabase";
import LoggerConsole from "../src/LoggerConsole";
import RequestRide from "../src/RequestRide";
import GetRide from "../src/GetRide";
import RideRepositoryDatabase from "../src/RideRepositoryDatabase";
import AcceptRide from "../src/AcceptRide";
import StartRide from "../src/StartRide";

let signup: Signup;
let getAccount: GetAccount;
let requestRide: RequestRide;
let getRide: GetRide;
let acceptRide: AcceptRide;
let startRide: StartRide;

beforeEach(() => {
    const accountRepository = new AccountRepositoryDatabase();
    const rideRepository = new RideRepositoryDatabase();
    const logger = new LoggerConsole();
    signup = new Signup(accountRepository, logger);
    getAccount = new GetAccount(accountRepository);
    requestRide = new RequestRide(rideRepository, accountRepository,logger);
    getRide = new GetRide(rideRepository, logger);
    acceptRide = new AcceptRide(rideRepository, accountRepository);
    startRide = new StartRide(rideRepository);
})

test("Deve iniciar uma corrida", async () => {
    const inputSignupPassenger = {
        name: "John Doe",
        email: `john.doe${Math.random()}@gmail.com`,
        cpf: "97456321558",
        isPassenger: true,
        password: "123456"
    };
    const outputSignupPassenger = await signup.execute(inputSignupPassenger);

    const inputRequestRide = {
        passengerId: outputSignupPassenger.accountId,
        fromLat: -27.584905257808835,
        fromLong: -48.545022195325124,
        toLat: -27.496887588317275,
        toLong: -48.522234807851476
    }
    const outputRequestRide = await requestRide.execute(inputRequestRide);

    const inputSignupDriver = {
        name: "John Doe",
        email: `john.doe${Math.random()}@gmail.com`,
        cpf: "97456321558",
        isDriver: true,
        carPlate: "AAA9999",
        password: "123456"
    };
    const outputSignupDriver = await signup.execute(inputSignupDriver);

    const inputAcceptRide = {
        rideId: outputRequestRide.rideId,
        driverId: outputSignupDriver.accountId
    }
    await acceptRide.execute(inputAcceptRide);

    const inputStartRide = {
        rideId: outputRequestRide.rideId,
    }
    await startRide.execute(inputStartRide);

    const outputGetRide = await getRide.execute(outputRequestRide.rideId);
    expect(outputGetRide.status).toBe("in_progress");
});