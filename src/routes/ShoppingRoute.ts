import express, {Request, Response, NextFunction } from 'express';
import { GetFoodAvailablity, GetFoodIn30min, GetTopRestaurants, RestaurantbyId, SearchFood } from '../controllers';

const router = express.Router();

// Food Availabililty
router.get('/:pincode', GetFoodAvailablity)

//Top Restaurants
router.get('/top-restaurants/:pincode', GetTopRestaurants)

// Food available in 30 min
router.get('/food-in-30-min/:pincode', GetFoodIn30min)

// Search food
router.get('/search/:pincode', SearchFood)

// Find Resaturant by ID
router.get('/restaurant/:id', RestaurantbyId)


export { router as ShoppingRoute };