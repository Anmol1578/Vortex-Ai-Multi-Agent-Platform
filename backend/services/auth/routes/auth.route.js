import express from 'express';
import { login, logout , updateUserPayment , getUserById , deductUserCredits} from '../controllers/auth.controller.js';

const router = express.Router();

router.post('/login', login);
router.get('/logout', logout);
router.get('/user/:userId', getUserById);
router.post('/update-plan', updateUserPayment)
router.post("/deduct-credits" , deductUserCredits)

export default router;
