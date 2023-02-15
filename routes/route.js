const express = require('express');

const router = express.Router();

const { register_user, add_food_items, edit_food_items, delete_food_items, login, place_order, get_status, update_status, get_menu, get_order_history } = require("../controllers/index_controller.js");

const { check_token } = require('../middleware/auth.js')  
//router.post('/users/admin_login',admin_getAuth);  


//admin

router.patch('/edit_food/',check_token, edit_food_items);            // worked
router.post('/add_food',check_token, add_food_items);                //worked
router.delete('/delete_food',check_token, delete_food_items);        // worked  

//user


router.post('/register', register_user);                             // worked 
router.post('/login', login)                                         //worked
router.post('/place_order', check_token, place_order);               //worked
router.get('/get_status', check_token, get_status);                  //worked
router.patch('/update_status',check_token, update_status);           // worked
router.get('/order_history',get_order_history);

router.get('/menu', get_menu);
module.exports ={router};