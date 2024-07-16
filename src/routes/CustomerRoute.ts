import express, {Request,Response,NextFunction} from 'express';
import { AddToCart, CreateOrder, CustomerLogin, CustomerSignUp, CustomerVerify, DeleteCart, EditCustomerProfile, GetCart, GetCustomerProfile, GetOrderById, GetOrders, RequestOtp } from '../controllers';
import { Authenticate } from '../middleware';

const router = express.Router();



//Signup /Create Customer
router.post('/signup', CustomerSignUp)

//login
router.post('/login', CustomerLogin)

//Authentication
router.use(Authenticate) 


// verify account
router.patch('/verify', CustomerVerify)

// OTP
router.get('/otp', RequestOtp)

//profile
router.get('/profile', GetCustomerProfile)
router.patch('/profile', EditCustomerProfile)

//cart
router.post('/cart', AddToCart);
router.get('/cart', GetCart);
router.delete('/cart', DeleteCart);


//Order
router.post('/create-order', CreateOrder);
router.get('/orders' , GetOrders);
router.get('/order/:id', GetOrderById);

//payment

export { router as CustomerRoute };