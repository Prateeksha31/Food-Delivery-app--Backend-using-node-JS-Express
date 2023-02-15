const {  insert_order, insert_order_details, register , add_food,get_user_by_email, edit_food, delete_food , get_status, update_status, get_menu, get_order_history} = require('../models.js');

const { sign } = require('jsonwebtoken');
const {hashSync, genSaltSync, compareSync } = require('bcrypt');
require("dotenv").config();
module.exports = {

    register_user :(req,res)=>{
        const body = req.body;
        const salt =genSaltSync(10);
        body.password = hashSync(body.password, salt);
        console.log(body.password);
        register(body, (err, results)=>{
            if(err){
                console.log(err);
                return res.status(500).json({
                    success:0,
                    message : "Registration unsuccessful"
                });
            }
            return res.status(200).json({
                success:1,
                message: "Registration successful",
                data:results
            });
        });
        

    },

    add_food_items: (req,res)=>{
        add_food(req.body, (err, results)=>{
            if (err){
                console.log(err);
                res.status(500).json({
                    status:500,
                    meassage: "Unable to add food items"
                });
            }
            return res.status(200).json({
                success:1, 
                message: "Food item added successfully",
                data: results
            })
        })
    },

    edit_food_items: (req, res)=>{
        edit_food(req.body, (err, results)=>{
            if(err){
                res.status(500).json({
                    status: 500, message : "Unable to Edit the food"
                })
            }
            return res.status(200).json({
                status:200,
                message: "Edit Completed Successfully",
                data : results
            })
        })
    },

    delete_food_items: (req, res)=>{
        delete_food (req.body, (err, results)=>{
            if(err){
                res.status(500).json({
                    status: 500, message : "Unable to Delete the food"
                })
            }
            return res.status(200).json({
                status:200,
                message: "Deletion Completed Successfully",
                data : results
            })
        })
        
    },

    place_order: (req, res)=>{
        insert_order (req.body, (err, results)=>{
            if(err){
                res.send(500).json({
                    status: 500, message : "Unable to insert order"
                })
            }
            else{
                console.log("From index controller else part");
                console.log(results);
                console.log("Order Inserted");
                insert_order_details(req.body, results.insertId, (err, results)=>{
                    if(err){
                        res.status(500).json({
                            status: 500, message : "Unable to record order details"
                        })
                    }

                    return res.status(200).json({
                        status:200,
                        message: "Order details updated Successfully",
                        data : results
                    })
                })
            }
        })
    },
 
    login:(req, res)=>{
        const body =req.body;
        get_user_by_email(body,(err,results)=>
        {
            if(err){
                res.sendStatus(500).json({
                    status: 500, message : "Invalid"
                })
            }
            console.log("From login index controller");
            console.log(results);
            if (!results){
                return res.json({
                    success: 0,
                    message: "Invalid email or password"
                })
            }
            console.log(body.password);
            console.log(results[0].hashed_password);
            const result = compareSync(body.password, results[0].hashed_password);
            if(result){
                console.log("matched");
                results.password=undefined;
                const jsontoken = sign({ result : results}, process.env.TOKEN_SECRET, {
                    expiresIn: "10h"
                });
                return res.json({
                    success :1,
                    meassage :"Login successful..!!",
                    token : jsontoken
                });
            }else{
                return res.json({
                    success: 0,
                    data: "Invalid email or password"
                })
            }
        })

    },

    get_status: (req, res)=>{
        get_status(req.body, (err, results)=>{
            if(err){
                res.json({
                    status: 500, message : "Unable to get status", data:err
                })
            }
            res.json({
                status:200,
                message: "status received",
                data : {results}
            })
        })
    },

    update_status: (req, res)=>{
        update_status(req.body, (err, results)=>{
            if(err){
                res.json({
                    status: 500, message : "Unable to update status..Try again!!", data:err
                })
            }
            res.json({
                status:200,
                message: "status updated..!!",
                data : {results}
            })
        })
    },

    get_menu: (req, res)=>{
        get_menu(req, (err, results)=>{
            if(err){
                res.json({
                    status: 500, message : "Unable to retrieve menu..Try again!!", data:err
                })
            }
            res.json({
                status:200,
                message:  "menu received..!!",
                data : {results}
            })
        })
    },

    get_order_history :(req, res)=>{
        console.log("entered ic");
        get_order_history(req.body, (err, results)=>{
            if(err){
                res.json({
                    status: 500, message : "Unable to retrieve order history..Try again!!", data:err
                })
            }
            res.json({
                status:200,
                message:  "order history received..!!",
                data : {results}
            })
        })
    }


    

        
    

}