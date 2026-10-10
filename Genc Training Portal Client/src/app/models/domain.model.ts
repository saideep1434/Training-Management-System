
export interface Domain{
    domainName: string
    serialNo?: number; // Optional, typically client-side display
    domainId: number;
}

export interface DomainApiResponse {
    status: number;
    message: string;
    domainNameList?: Domain[];
    domainName?: Domain;
}