import RideRepository from "./RideRepository";
import Logger from "./Logger";

class GetRide {
    constructor(private rideRepository: RideRepository, private logger: Logger) {}

    async execute(rideId: string): Promise<Output> {
        this.logger.log(`Get Ride`);

        const ride = await this.rideRepository.getById(rideId);
        if(!ride) throw new Error("Ride not found");

        return {
            rideId: ride.rideId,
            status: ride.getStatus(),
            driverId: ride.getDriverId(),
            passengerId: ride.passengerId
        };
    }
}

type Output = {
    rideId: string;
    status: string;
    driverId: string;
    passengerId: string;
}

export default GetRide;