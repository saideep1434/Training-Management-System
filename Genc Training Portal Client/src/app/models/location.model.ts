

export interface Location {
    locationId : number
    location: string
}

export interface LocationApiResponse {
    status: number;
    message: string;
    locationList?: Location[];
}