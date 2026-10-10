export interface vertical{
    verticalId: string
    verticalName: string
    domainName: string
}

export interface verticalApiResponse {
    status: number;
    message: string;
    verticalList?: vertical[]; // For 'getAllVerticals' endpoint
    vertical?: vertical;     // For 'addVertical' or 'updateVertical' if they return the single object
}