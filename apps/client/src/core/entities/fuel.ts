export interface FuelPrice {
    id: number;
    stationName: string;
    fuelType: string;
    price: number | string;
    currency: string;
    location: string;
    address: string;
    scrapedAt: string;
    createdAt: string;
    updatedAt: string;
}

export interface FuelStation {
    stationName: string;
    location: string;
}
