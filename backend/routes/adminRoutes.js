import express from 'express';
import { getAllUsers, deleteUser, updateUserRole } from '../controllers/adminController.js';

const router = express.Router();

router.get('/users', getAllUsers);
router.delete('/user/:id', deleteUser);
router.put('/user/:id/role', updateUserRole);

export default router;