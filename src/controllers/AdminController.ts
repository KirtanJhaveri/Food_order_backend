import express, {Request,Response,NextFunction} from 'express';
import { CreateVendorInput } from "../dto";
import { DeliveryUser, Transaction, Vendor } from '../models';
import { GeneratePassword, GenerateSalt } from '../utility';

export const FindVendor = async (id: string | undefined, email?: string) => {
    if (email){
        return await Vendor.findOne({email: email})
    } else {
        return await Vendor.findById(id)
    }
}

export const CreateVendor = async (req: Request, res: Response, next: NextFunction) =>{
    const { name, address, pincode, foodType, email, password, ownerName, phone} = <CreateVendorInput>req.body;

    const existinVendor = await FindVendor('', email);

    if (existinVendor !== null){
        return res.json({"message": "A vendor with this email Id already exists"})
    }

    //generate a salt
    //encrypt the password using the salt
    const salt = await GenerateSalt()
    const userPassword = await GeneratePassword(password, salt);   

    const createdVendor = await Vendor.create({
        name: name,
        address: address,
        pincode: pincode,
        foodType: foodType,
        email: email,
        password: userPassword,
        salt: salt,
        ownerName: ownerName,
        phone: phone,
        rating: 0,
        serviceAvailable: false,
        coverImages: [],
        foods: []
    })

    return res.json(createdVendor)


}


export const GetVendor = async (req: Request, res: Response, next: NextFunction) =>{
    const vendors = await Vendor.find()
    if (vendors !== null){
        return res.json(vendors)
    }
    return res.json({"message": "vendor's data is not available"})
}

export const GetVendorById = async (req: Request, res: Response, next: NextFunction) =>{

        const vendorId  = req.params.id;

        const vendor = await FindVendor(vendorId);

        if (vendor !== null){
            return res.json(vendor);

        }

        return res.json({"message": "This vendor's data is not available"})
}

export const GetTransactions = async (req: Request, res: Response, next: NextFunction) =>{
    const transactions = await Transaction.find();

    if(transactions){
        return res.status(200).json(transactions);
    }
    return res.json({"message": "Transactions not available!"})

}

export const GetTransactionById = async (req: Request, res: Response, next: NextFunction) =>{
    const id = req.params.id;
    const transaction = await Transaction.findById(id);

    if(transaction){
        return res.status(200).json(transaction);
    }
    return res.json({"message": "Transaction not available!"})

}

export const VerifyDeliveryUser = async (req: Request, res: Response, next: NextFunction) => {

    const _id = req.body.id;
    const status = req.body.status

    if(_id){

        const profile = await DeliveryUser.findById(_id);
        if(profile){
            profile.verified = status;
            const result = await profile.save();

            return res.status(200).json(result);
        }
    }

    return res.json({ message: 'Unable to verify Delivery User'});
}

export const GetDeliveryUsers = async (req: Request, res: Response, next: NextFunction) => {

    const deliveryUsers = await DeliveryUser.find();

    if(deliveryUsers){
        return res.status(200).json(deliveryUsers);
    }
    
    return res.json({ message: 'Unable to get Delivery Users'});
}