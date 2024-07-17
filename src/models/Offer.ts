import mongoose, { Schema, Document } from 'mongoose';

export interface OfferDoc extends Document {
    
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

const OfferSchema = new Schema({

    offertype: { type: String },
    vendors: [
        {
            type: Schema.Types.ObjectId, ref: 'vendor'
        }
    ],
    title: { type: String, required: true },
    description: { type: String},
    minValue: { type: String, required: true },
    offerAmount: { type: Number, require: true },
    startValidity: { type: Date },
    endValidity: { type: Date },
    promocode: { type: String , require: true},
    promoType: { type: String , require: true},
    bank: [
        { type: String }
    ],
    bins: [{
         type: Number 
    }],
    pincode: { type: String, require: true},
    isActive: {type: Boolean}
},{
    toJSON: {
        transform(doc, ret){
            delete ret.__v
        }
    },
    timestamps: true
})

const Offer = mongoose.model<OfferDoc>('offer', OfferSchema);

export { Offer };
