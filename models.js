const pool = require("./database");
const { compareSync } = require('bcrypt');
require("dotenv").config();

module.exports = {
 

    register: (data,callback)=>{
        pool.query( `insert into users(name, phone_number, email, hashed_password) values(?,?,?,?)`,
        [
            data.name,
            data.phone_number,
            data.email,
            data.password
        ],
        (error, results, fields)=>{
            if(error){
                 return callback(error);
            }
            return callback(null, results)
        })
    }, 


    add_food: (data, callback)=>{
        pool.query(`insert into foods( name, description,  price) values (?,?,?)`,
        [
            data.name,
            data.description, 
            data.price
        ],(err, results,fields)=>{
            if(err){
                return callback(err);
           }
           return callback(null, results)
        })
    }, 

    edit_food: (data, callback)=>{
        pool.query(`update  foods set price =? where id= ?`,
        [
            data.price,           
            data.id
        ],(err, results)=>{
            if(err){
                return callback(err);
           }
           return callback(null, results)
        })
    },

    delete_food: (data, callback)=>{
        pool.query(`delete from foods where id =?`,[data.id],
        (err, results)=>{
            if(err){
                return callback(err);
            }
            return callback(null, results);
        })
    },

    get_user_by_email: (data, callback)=>{ 
        console.log("get user entered");
        console.log(data);
        pool.query(`select * from users where email =? ; `, [data.email],
        (err, results)=>{
            if(err){
                return callback(err);
            }
            console.log(results);
            return callback(null, results);
        })
    },


    insert_order :(data, callback)=>{
        
        pool.query(`insert into orders (customer_id, orderdate, total_amount, status) values (?,?,?,?)`, 
        [data.user_id, data.date_timestamp, data.total_amount, 1], (err, results)=>{
            if(err){
                return callback(err);
            }
            //console.log(results);
           // console.log(results.fieldCount);
            //insert_id=results[0].insertId;
            return callback(null, results);
        });

    }, 

    insert_order_details: (data, orderId, callback)=>{
        const orders= data.orders;        
        total_amount=0;
        res=[]
        console.log("order details entered");
        for (i=0; i<orders.length; i++)
        {
            console.log("entered loop");
            var item= orders[i];
            total_amount+=item.amount;
            pool.query(`insert into order_Details (order_id, food_id, quantity, price, total_amount) values (?,?,?,?,?)`,
            [
                orderId,
                item.food_id,
                item.quantity,
                item.price,
                data.total_amount
            ]),(err, results)=>{
                if(err){ return callback (err);}
                res.append(results);
                console.log(res);
            };

        }
        return callback(null, res);
    }, 
    
    get_status: (data, callback)=>{
        pool.query(`select status from orders where id=?`, [data.id], (err, results)=>{
            if(err){
                return callback(err);
            }
            return callback(null, results);
        })
    },

    update_status: (data, callback)=>{
        pool.query(`update orders set status =? where id =?`, [
            data.status, data.id
        ], (err, results)=>{
            if(err){
                return callback(err);
            }
            return callback(null, results);
        })
    },

    get_menu: (data, callback)=>{
        console.log("entered model");
        pool.query(`select * from foods;`, (err, results)=>{
            if(err){
                return callback(err);
            }
            console.log(results);
            return callback(null, results);
        })
    },

    get_order_history: (data, callback)=>{
        const id= data.id;
        console.log("entered models : data is",id )
        pool.query(`select * from orders inner join order_Details  on orders.id = order_Details.order_id where orders.customer_id = ?`,
         [id], (err, results)=>{
            if(err){
                console.log("ERROR : ", err);
                return callback(err);
            }
            console.log(results);
            return callback(null, results);
        })
    }

    /* DATA FORMAT


        {"user_id":12
            "mail": prat@gmail.com,
        "date_timestamp" :now(),
        "order":{
            food_id: 
            quantity:
            price:
            amount}
        "orders" :[{

            },
       {

            }]
        "total amount": 800


        }}

    }

    */
}



