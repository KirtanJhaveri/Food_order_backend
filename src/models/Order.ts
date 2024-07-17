import mongoose, { Schema, Document } from 'mongoose';

export interface OrderDoc extends Document {
    orderID: Number,
    vendorId: string,
    items: [{ food: mongoose.Types.ObjectId, unit: number }],
    totalAmount: number,
    orderDate: Date,
    paidThrough: string,
    paymentResponse: string,
    orderStatus: string,
    remarks: string,
    deliveryId: string,
    appliedOffers: boolean,
    offerId: string,
    readyTime: number, // max 60 min
}

const OrderSchema = new Schema({
    orderID: { type: Number, require: true },
    vendorId: {type: String, require: true},
    items: [{
        food: { type: Schema.Types.ObjectId, ref: 'food', require: true },
        unit: { type: Number, require: true }
    }],
    totalAmount: { type: Number, require: true },
    orderDate: { type: Date, default: Date.now, require: true }, // Change type to Date
    paidThrough: { type: String },
    paymentResponse: { type: String },
    orderStatus: { type: String },
    remarks: { type: String },
    deliveryId: { type: String },
    appliedOffers: { type: Boolean },
    offerId: { type: String },
    readyTime: { type: Number },
}, {
    toJSON: {
        transform(doc, ret) {
            delete ret.__v;
            delete ret.createdAt;
            delete ret.updatedAt;
        }
    },
    timestamps: true
});

const Order = mongoose.model<OrderDoc>('order', OrderSchema);

export { Order };
