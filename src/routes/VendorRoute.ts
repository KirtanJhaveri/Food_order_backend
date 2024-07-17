import express, {Request,Response,NextFunction} from 'express';
import { VendorLogin,GetVendorProfile, UpdateVendorProfile, UpdateVendorService, AddFood, GetFood, UpdateVendorCoverImage, GetOrderDetails, ProcessOrder, GetCurrentOrders, GetOffers, AddOffer, EditOffer, } from '../controllers';
import { Authenticate } from '../middleware';
import multer from 'multer';

const router = express.Router();

const imageStorage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, 'images')
    },
    filename: function(req, file, cb){
        const timestamp = new Date().toISOString().replace(/:/g, '-'); // Replace colons with dashes (or another character)
        cb(null, timestamp + '_' + file.originalname);
    }
})

const images = multer({storage: imageStorage}).array('images', 10)

router.post('/login',VendorLogin)

router.use(Authenticate)
router.get('/profile', GetVendorProfile)
router.patch('/profile', UpdateVendorProfile)
router.patch('/coverimage', images, UpdateVendorCoverImage)
router.patch('/service', UpdateVendorService)

router.post('/food',images, AddFood)
router.get('/food',GetFood)

//Orders
router.get('/orders', GetCurrentOrders);
router.put('/order/:id/process', ProcessOrder);
router.get('/order/:id', GetOrderDetails);

//Offers
router.get('/offers', GetOffers);
router.post('/offer', AddOffer);
router.put('/offer/:id' , EditOffer);


router.get('/',(req: Request , res: Response, next: NextFunction) => {
    res.json({ message: "Hello from Vendor" })
})


export {router as VendorRoute };