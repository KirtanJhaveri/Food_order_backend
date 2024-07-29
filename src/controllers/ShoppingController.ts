import express, {Request, Response, NextFunction } from 'express';
import { FoodDoc, Vendor } from '../models';
import { Offer } from '../models/Offer';

export const GetFoodAvailablity = async (req: Request, res: Response, next: NextFunction) => {

    const pincode = req.params.pincode;

    const result = await Vendor.find({ pincode: pincode, serviceAvailable: false})
    .sort([['rating', 'descending']])
    .populate("foods")
    // console.log(result)

    if (result.length > 0){
        return res.status(200).json(result)
    }

    return res.status(400).json({message: "Data Not Found!"})

}


export const GetTopRestaurants = async (req: Request, res: Response, next: NextFunction) => {
    
    const pincode = req.params.pincode;

    const result = await Vendor.find({ pincode: pincode, serviceAvailable: false})
    .sort([['rating', 'descending']])
    .limit(1)
    // console.log(result)

    if (result.length > 0){
        return res.status(200).json(result)
    }

    return res.status(400).json({message: "Data Not Found!"})

}

export const GetFoodIn30min = async (req: Request, res: Response, next: NextFunction) => {
    
    const pincode = req.params.pincode;

    const result = await Vendor.find({ pincode: pincode, serviceAvailable: false})
    .populate("foods")
    // console.log(result)

    if (result.length > 0){
        let foodresult: any = [];
        result.map(vendor => {
            const foods = vendor.foods as [FoodDoc]
            
            foodresult.push(...foods.filter(food => food.readyTime <= 30));

        })
        return res.status(200).json(foodresult)
    }

    return res.status(400).json({message: "Data Not Found!"})

}

export const SearchFood = async (req: Request, res: Response, next: NextFunction) => {
    const pincode = req.params.pincode;

    const result = await Vendor.find({ pincode: pincode, serviceAvailable: false})
    .populate("foods")

    if (result.length > 0){
        let foodresult: any = [];
        result.map(item => foodresult.push(...item.foods));
        return res.status(200).json(foodresult)

        
    }

    return res.status(400).json({message: "Data Not Found!"})
    

}

export const RestaurantbyId = async (req: Request, res: Response, next: NextFunction) => {

    
    const id = req.params.id;

    const result = await Vendor.findById(id).populate("foods")
    // console.log(result)

    if (result){
        return res.status(200).json(result)
    }

    return res.status(400).json({message: "Data Not Found!"})
    
}

export const GetAvailableOffers = async (req: Request, res: Response, next: NextFunction) => {

    const pincode = req.params.pincode;

    const offers = await Offer.find({ pincode: pincode, isActive: true});

    if(offers){

        return res.status(200).json(offers);

    }

    return res.status(400).json({message: "Offers Not Found!"});

}