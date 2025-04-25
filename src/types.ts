export interface Animal {
    id: number;
    name: string;
    sciName: string;
    description: string[];
    images: string[];
    events: EventDetails[];
    createdByUser?: number;
}

export interface EventDetails {
    name: string;
    date: string;
    url: string;
}

export interface User {
    id: number;
    hash: string;
    name: string;
}
