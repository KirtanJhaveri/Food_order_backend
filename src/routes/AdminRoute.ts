import express, {Request,Response,NextFunction} from 'express';
import { CreateVendor, GetDeliveryUsers, GetTransactionById, GetTransactions, GetVendor, GetVendorById, VerifyDeliveryUser } from '../controllers';

const router = express.Router();

router.post('/vendor', CreateVendor)

router.get('/vendor', GetVendor)

router.get('/vendor/:id', GetVendorById)

router.get('/transactions', GetTransactions)

router.get('/transaction/:id', GetTransactionById)

router.put('/delivery/verify', VerifyDeliveryUser)
router.get('/delivery/users', GetDeliveryUsers);

router.get('/',(req: Request , res: Response, next: NextFunction) => {
    res.json({ message: "Hello from Admin" })
})

export {router as AdminRoute };
