import Logger from "./Logger";
import RideRepository from "./RideRepository";
import AccountRepository from "./AccountRepository";
import Ride from "./Ride";

class RequestRide {
    constructor(private rideRepository: RideRepository, private accountRepository: AccountRepository, private logger: Logger) {}

    async execute(input: Input): Promise<Output> {
        this.logger.log(`requestRide`);

        const account = await this.accountRepository.getById(input.passengerId);
        if(!account) throw new Error("Account does not exists");
        if(!account.isPassenger) throw new Error("Only passengers can request a ride");

        const activeRide = await this.rideRepository.getActiveRideByPassengerId(input.passengerId);
        if(activeRide) throw new Error("Passenger has an active ride");

        const ride = Ride.create(input.passengerId, input.fromLat, input.fromLong, input.toLat, input.toLong);
        await this.rideRepository.save(ride);

        return {
            rideId: ride.rideId
        };
    }
}

type Input = {
    passengerId: string,
    fromLat: number,
    fromLong: number,
    toLat: number,
    toLong: number
}

type Output = {
    rideId: string
}

export default RequestRide;