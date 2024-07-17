export interface CreateVendorInput {
    name: string;
    ownerName: string;
    foodType: [string];
    pincode: string
    address: string;
    phone: string;
    email: string;
    password: string;
}

export interface EditVendorInputs{
    name: string;
    address: string;
    phone: string;
    foodTypes: [string];
}

export interface VendorLoginInputs{
    email: string;
    password: string;
}

export interface VendorPayload {
    _id: string;
    email: string;
    name: string;
    foodTypes: [string];
}

export interface CreateOfferInputs{
    offerType: string; //vendor specific / general
    vendors: [any];
    title: string; 
    description: string; // T&c
    minValue: number; //minvalue of order
    offerAmount: number; //200
    startValidity: Date;
    endValidity: Date;
    promocode: string;
    promoType: string; // user // all // Bank // card
    bank: [any];
    bins: [any];
    pincode: string;
    isActive: boolean;
}