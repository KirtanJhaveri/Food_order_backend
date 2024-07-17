import express, {Request,Response,NextFunction} from 'express';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { CreateCustomerInputs, UserLoginInputs, EditCustomerProfileInputs, OrderInputs } from '../dto';
import { GenerateOtp, GeneratePassword, GenerateSalt, GenerateSignature, onRequestOtp, ValidatePassword } from '../utility';
import { Customer } from '../models/Customer';
import { Food, Order } from '../models';

export const CustomerSignUp  = async  (req: Request, res: Response, next: NextFunction) => {

    const customerInputs = plainToClass(CreateCustomerInputs, req.body)
    const inputErrors = await validate(customerInputs, { validationError: {target: true}})
    if (inputErrors.length > 0){
        return res.status(400).json(inputErrors)
    }

    const { email, phone, password} = customerInputs;

    const salt = await GenerateSalt()
    const userPassword  = await GeneratePassword(password, salt)
    const existCustomer = await Customer.findOne({email: email})        

    if (existCustomer !== null){
        return res.status(409).json({message: 'A user with this email already exists'})
    }

    const {otp, expiry} = GenerateOtp();


    const result = await Customer.create({
        email: email,
        password: userPassword,
        salt: salt,
        phone: phone,
        otp: otp,
        otp_expiry: expiry,
        firstName: '',
        lastName: '',
        address: '',
        verified: false,
        lat: 0,
        lng: 0,
        orders: []
    })

    if (result) {
        // send OTP to customer
       await onRequestOtp(otp, phone) 

        // generate the signature
        const signature = GenerateSignature({
            _id: result.id,
            email: result.email,
            verified: result.verified
            
        })
        // send the result to client
        return res.status(201).json({ signature, verified: result.verified, email: result.email})

    }

}

export const CustomerLogin  = async  (req: Request, res: Response, next: NextFunction) => {

    const loginInputs = plainToClass( UserLoginInputs, req.body);

    const loginErrors = await validate(loginInputs, {validationError: {target: false}})

    if(loginErrors.length > 0){
        return res.status(400).json(loginErrors)

    }

    const { email, password } = loginInputs
    const customer = await Customer.findOne({email: email})

    if(customer){

        const validation = await ValidatePassword(password, customer.password, customer.salt);

        if(validation){
            // console.log("validated user")
            // generate the signature
            const signature = GenerateSignature({
                _id: customer.id,
                email: customer.email,
                verified: customer.verified
                
            })
            // send the result to client
            return res.status(201).json({ signature, verified: customer.verified, email: customer.email})

        }

    }

    return res.status(404).json({ message: 'login error'})

}

export const CustomerVerify  = async  (req: Request, res: Response, next: NextFunction) => {

    const{ otp } = req.body;
    const customer = req.user;

    if(customer){
        const profile = await Customer.findById(customer._id)

        if (profile){
            if (profile.otp === parseInt(otp) && profile.otp_expiry >= new Date()){
                profile.verified = true;
                
                const updatedCustomerResponse = await profile.save();

                const signature = GenerateSignature({
                    _id: updatedCustomerResponse.id,
                    email: updatedCustomerResponse.email,
                    verified: updatedCustomerResponse.verified
                });

                return res.status(201).json({
                    signature: signature,
                    verified: updatedCustomerResponse.verified,
                    email: updatedCustomerResponse.email
                });
            }
        }
    }

    return res.status(400).json({ message: 'Error with OTP validation'})

}

export const RequestOtp  = async  (req: Request, res: Response, next: NextFunction) => {
    const customer = req.user;
    if (customer){
        const profile = await Customer.findById(customer._id)

        if (profile){
            const { otp, expiry } = GenerateOtp();
            profile.otp = otp;
            profile.otp_expiry = expiry;

            await profile.save();
            await onRequestOtp(otp, profile.phone);

            res.status(200).json({ message: 'OTP sent your registered phone number!'})

        }
    }
    
}

export const GetCustomerProfile  = async  (req: Request, res: Response, next: NextFunction) => {

    const customer = req.user;
    
    if(customer){
        const profile = await Customer.findById(customer._id)
        if(profile){

            return res.status(200).json(profile);

        }
    }


}

export const EditCustomerProfile  = async  (req: Request, res: Response, next: NextFunction) => {

    const customer = req.user;
    const profileInputs = plainToClass( EditCustomerProfileInputs , req.body);

    const profileErrors = await validate(profileInputs, {validationError: {target: false}})
    
    if (profileErrors.length > 0){
        return res.status(400).json(profileErrors);
    }
    const {firstName, lastName, address } = profileInputs;
    if(customer){
        const profile = await Customer.findById(customer._id)
        if(profile){
            profile.firstName = firstName;
            profile.lastName = lastName;
            profile.address = address;
            // const result = address
            await profile.save();
            res.status(200).json(profile)
        }
    }
    

}

export const AddToCart = async (req: Request, res: Response, next: NextFunction) => {

    const customer = req.user;

    if(customer){
        // console.log('customer exists')
        const profile = await Customer.findById(customer._id).populate('cart.food');
        let cartItems = Array();
        const {_id, unit} = <OrderInputs>req.body;
        const food = await Food.findById(_id);
        if(food){
            // console.log('food exists')
            if(profile != null){

                // console.log('profile exists')
                cartItems = profile.cart;
                if(cartItems.length > 0){

                    let existFoodItem = cartItems.filter((item) => item.food._id.toString() === _id);
                    if(existFoodItem.length> 0){

                        const index = cartItems.indexOf(existFoodItem[0]);
                        if(unit > 0){

                            cartItems[index] = { food, unit};

                        }else{

                            cartItems.splice(index, 1)
                        }
                    }else{
                        
                        cartItems.push({ food, unit});
                    }
                }else{
                    
                    cartItems.push({ food, unit })
                }
                if(cartItems){
                    
                    profile.cart = cartItems as any;
                    const cartresult = await profile.save();
                    return res.status(200).json(cartresult.cart);

                }
            }
        }
    }

    return res.status(400).json({message: 'Unable to create cart!'});
    

}

export const GetCart = async (req: Request, res: Response, next: NextFunction) => {

    const customer = req.user;
    if(customer){
        const profile = await Customer.findById(customer._id).populate('cart.food');
        if(profile){
            return res.status(200).json(profile.cart);
        }
    }

    return res.status(400).json({message: 'cart is empty!'})

}

export const DeleteCart = async (req: Request, res: Response, next: NextFunction) => {

    const customer = req.user;
    if(customer){
        const profile = await Customer.findById(customer._id).populate('cart.food');
        if(profile != null){
            profile.cart = [] as any;
            const cartResult = await profile.save();
            return res.status(200).json(cartResult);
        }
    }

    return res.status(400).json({message: 'cart is already empty!'})

}


export const CreateOrder = async (req: Request, res: Response, next: NextFunction) => {
    //grab current customer (logged in)
    const customer = req.user;

    if (customer){
        //create order ID
        const OrderId = `${Math.floor(Math.random() * 89999) + 1000}`;
        const profile = await Customer.findById(customer._id)!;
        if (profile){


            //Grab order items from reuqest [{id: xx, unit: xx}]
            const cart = <[OrderInputs]>req.body;

            let cartItems = Array();

            let netAmount = 0.0;
            let vendorId;

            //calculate order amount
            const foods = await Food.find().where('_id').in(cart.map(item => item._id)).exec();

            foods.map(food => {
                
                cart.map(({_id, unit}) => {
                    if (food._id == _id){
                        vendorId = food.vendorId
                        netAmount += (food.price * unit);
                        cartItems.push({food, unit})
                    }
                })
            })
            
            //Create Order with item descriptions
            if(cartItems){
                const currentOrder = await Order.create({
                    orderID: OrderId,
                    vendorId: vendorId,
                    items: cartItems,
                    totalAmount: netAmount,
                    orderDate: new Date(),
                    paidThrough: 'COD',
                    paymentResponse: '',
                    orderStatus: 'Waiting',
                    remarks: '',
                    deliveryId: '',
                    appliedOffer: false,
                    readyTime: 45,
                })
                profile.cart = [] as any;
                //Finally update order to user account
                if(currentOrder){
                    profile.orders.push(currentOrder);
                    await profile.save();
        
                    return res.status(200).json(currentOrder)
        
                }
    
            }   
        }
       
        return res.status(400).json({message: "Error while creating order"})
        
    }

    

    



}

export const GetOrders = async (req: Request, res: Response, next: NextFunction) => {

    const customer = req.user;

    if(customer){
        const profile = await Customer.findById(customer._id).populate("orders");

        if(profile){
            return res.status(200).json(profile.orders);
        }
    }

}

export const GetOrderById = async (req: Request, res: Response, next: NextFunction) => {
 
    const orderId = req.params.id;

    if(orderId){
        const order = await Order.findById(orderId).populate('items.food');

        res.status(200).json(order);

    }

}