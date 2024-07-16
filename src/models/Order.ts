import mongoose, { Schema, Document } from 'mongoose';

export interface OrderDoc extends Document {
    orderID: Number,
    items: [{ food: mongoose.Types.ObjectId, unit: number }],
    totalAmount: number,
    orderDate: Date,
    paidThrough: string,
    paymentResponse: string,
    orderStatus: string
}

const OrderSchema = new Schema({
    orderID: { type: Number, required: true },
    items: [{
        food: { type: Schema.Types.ObjectId, ref: 'food', required: true },
        unit: { type: Number, required: true }
    }],
    totalAmount: { type: Number, required: true },
    orderDate: { type: Date, default: Date.now, required: true }, // Change type to Date
    paidThrough: { type: String },
    paymentResponse: { type: String },
    orderStatus: { type: String }
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
