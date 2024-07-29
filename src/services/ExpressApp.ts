import express, { Application } from 'express';
import bodyParser from 'body-parser';

import path from 'path';

import { AdminRoute,VendorRoute,ShoppingRoute, CustomerRoute } from '../routes';
import { DeliveryRoute } from '../routes/DeliveryRoute';


export default async(app: Application)=> {

    

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: true}))

    const imagePath = path.join(__dirname, '../images')

    app.use('/images', express.static(imagePath))

    app.use('/admin', AdminRoute);
    app.use('/vendor', VendorRoute);
    app.use('/customer', CustomerRoute);
    app.use('/s',ShoppingRoute);
    app.use('/delivery',DeliveryRoute)

    return app

}


