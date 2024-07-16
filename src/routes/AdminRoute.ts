import express, {Request,Response,NextFunction} from 'express';
import { CreateVendor, GetVendor, GetVendorById } from '../controllers';

const router = express.Router();

router.post('/vendor', CreateVendor)

router.get('/vendor', GetVendor)

router.get('/vendor/:id', GetVendorById)

router.get('/',(req: Request , res: Response, next: NextFunction) => {
    res.json({ message: "Hello from Admin" })
})

export {router as AdminRoute };
