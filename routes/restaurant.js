//-- GET - /restaurant
//  Secret restaurant page
const express = require("express");
const router = express.Router();
let { tempDB, restaurantMsg, confirmOrder } = require("../server");
// let { getUserOrder } = require("../restaurant_db")

const { Pool } = require('pg');

const pool = new Pool({
  user: 'labber',
  password: 'labber',
  host: 'localhost',
  database: 'midterm'
});

const getUserOrder = function() {
  return pool
  .query(`
  SELECT order_id, menu_items.name, quantity, menu_items.price
  FROM order_items
  JOIN menu_items ON menu_items.id = menu_id
  ORDER BY order_id ASC;
  `)
  .then((result) => { 
    return result.rows;
  })
}


// const getUserOrder = function(orderID) {
//   return pool
//   .query(`
//   SELECT menu_items.name, quantity, menu_items.price
//   FROM order_items
//   JOIN menu_items ON menu_items.id = menu_id
//   WHERE order_id = $1;
//   `, [orderID])
//   .then((result) => { 
//     return result.rows;
//   })
// }


// THIS IS SOME TEST HARDCODED DATABASES

// let newOrder = [
//   { name: 'Nacho Chips', quantity: 3, price: 700 },
//   { name: 'Bun Cha', quantity: 1, price: 1299 }
// ];

// let otherOrder = [
//   { order_id: 1, name: 'Nacho Chips', quantity: 3, price: 700 },
//   { order_id: 1, name: 'Bun Cha', quantity: 1, price: 1299 },
//   { order_id: 2, name: 'Empanada', quantity: 4, price: 1650 }
// ]

module.exports = (db) => {
  router.get("/", (req, res) => {
    getUserOrder()
      .then((totalOrders) => {
        
        let tempId = 0;
        let arrObj = [[]];
        let arrObjIndex=0;
        let flag = true;
        
        for (let objId of totalOrders) {
          if (flag) {
            tempId = objId['order_id'];
            flag = false;
           }
          
          if (tempId === objId['order_id']) {
            arrObj[arrObjIndex].push(objId);
          } else {
            arrObjIndex +=1;
            arrObj.push([]);
            arrObj[arrObjIndex].push(objId);
            tempId = objId['order_id']
          }   
        }

        res.render("restaurant", {  arrObj });
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });
  return router;
};


//THIS PART OF THE CODE SETS FOOD ORDERS DATABASE INTO AN ARRAY
// let tempId = 0;
// let arrObj = [[]];
// let arrObjIndex=0;
// let flag = true;

// for (let objId of otherOrder) {
	
//   //if (objId['order_id'] === temp
//   if (flag) {
//   	tempId = objId['order_id'];
//     flag = false;
//    }
	
//   if (tempId === objId['order_id']) {
//   	arrObj[arrObjIndex].push(objId);
// 	} else {
//     arrObjIndex +=1;
//     arrObj.push([]);
//     arrObj[arrObjIndex].push(objId);
//     tempId = objId['order_id']
//   }   
// }

// console.log(arrObj[1])