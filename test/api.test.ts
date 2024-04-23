import axios from "axios"

axios.defaults.validateStatus = function () {
    return true;
}

test("Deve criar uma conta para o passageiro pela api", async () => {
    // given
    const inputSignup = {
        name: "John Doe",
        email: `john.doe${Math.random()}@gmail.com`,
        password: "123456",
        cpf:"97456321558",
        isPassenger: true
    };
    // when
    const responseSignup = await axios.post("http://localhost:3333/signup", inputSignup);
    const outputSignup = responseSignup.data;
    const responseGetAccount = await axios.get(`http://localhost:3333/accounts/${outputSignup.accountId}`);
    const outputGetAccount = responseGetAccount.data;
    // then
    expect(outputSignup.accountId).toBeDefined();
    expect(outputGetAccount.name).toBe(inputSignup.name);
    expect(outputGetAccount.email).toBe(inputSignup.email);
})

test("Não deve criar uma conta se o nome for inválido", async () => {
    // given
    const inputSignup = {
        name: "John",
        email: `john.doe${Math.random()}@gmail.com`,
        password: "123456",
        cpf: "24964063046",
        isPassenger: true
    };
    // when
    const responseSignup = await axios.post("http://localhost:3333/signup", inputSignup);
    expect(responseSignup.status).toBe(422)
    expect(responseSignup.data.message).toBe("Invalid name")
});

test("Deve criar uma conta para o motorista", async () => {
    // given
    const inputSignup = {
        name: "John Doe",
        email: `john.doe${Math.random()}@gmail.com`,
        password: "123456",
        cpf: "24964063046",
        isPassenger: false,
        isDriver: true,
        carPlate: "AAA9999"
    };
    // when
    const responseSignup = await axios.post("http://localhost:3333/signup", inputSignup);
    const responseGetAccount = await axios.get( `http://localhost:3333/accounts/${responseSignup.data.accountId}`)
    // then
    expect(responseSignup.data.accountId).toBeDefined();
    expect(responseGetAccount.data.name).toBe(inputSignup.name);
    expect(responseGetAccount.data.email).toBe(inputSignup.email);
});

test("Não deve criar uma conta para o motorista com a placa inválida", async () => {
    // given
    const inputSignup = {
        name: "John Doe",
        email: `john.doe${Math.random()}@gmail.com`,
        password: "123456",
        cpf: "24964063046",
        isPassenger: false,
        isDriver: true,
        carPlate: ""
    };
    // when
    await axios.post("http://localhost:3333/signup", inputSignup);
    const responseSignup = await axios.post("http://localhost:3333/signup", inputSignup);
    expect(responseSignup.status).toBe(422)
    expect(responseSignup.data.message).toBe("Invalid car plate")
});