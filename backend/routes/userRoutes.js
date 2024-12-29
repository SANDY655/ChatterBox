const express=require('express');
const {protect}=require("../middleware/authMiddleware")
const { registerUser,authUser,allUsers } = require('../controllers/userControllers');
const router=express.Router()
router.route('/').post(registerUser)
router.post('/login',authUser)
router.route('/').get(protect,allUsers);
module.exports=router;