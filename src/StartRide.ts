import crypto from "crypto";
import RideRepository from "./RideRepository";
import AccountRepository from "./AccountRepository";

class StartRide {
    constructor(private rideDAO: RideRepository) {}

    async execute(input: any) {
        const ride = await this.rideDAO.getById(input.rideId);
        if(!ride) throw new Error("Ride not found");
        ride.start();
        await this.rideDAO.update(ride);
    }
}

export default StartRide;