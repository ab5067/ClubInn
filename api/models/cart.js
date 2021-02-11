
var jwt_decode = require('jwt-decode');
const jwt = require('jsonwebtoken');

module.exports = function Cart() {

    function generateToken(totalPrice, totalQty, itemsList, cart) {
        token = jwt.sign({
            user: {
                name: cart.user.name,
                email: cart.user.email,
                id: cart.user.id
            },
            items : itemsList,
            total_price: totalPrice,
            total_Qty : totalQty
        }, 
        process.env.JWT_KEY,
        {
            expiresIn: "24h"
        });
        return token; 
    };

    this.add = function(token, item, id) {

        var cart = jwt_decode(token, process.env.JWT_KEY);
        var itemsArray = [];

        if(cart.items !== "items") {
            for(var x of cart.items) {
                itemsArray.push(x);
            }
        }

        if(itemsArray[0] === undefined) {
            itemsArray.push({
                name: item.name,
                id: id,
                price: item.price,
                productType: item.productType,
                qty: 1
            });
            return generateToken(itemsArray[0].price, itemsArray[0].qty, itemsArray, cart);

        } else {
            for(var i = 0; i < itemsArray.length; i++) {
                if(itemsArray[i].id == id) {
                    itemsArray[i].qty++; 
                    var price = cart.total_price + itemsArray[i].price;
                    var totalQty = cart.total_Qty + 1; 
                    return generateToken(price, totalQty, itemsArray, cart);
                }
            }
            itemsArray.push({
                name: item.name,
                id: id,
                price: item.price,
                productType: item.productType,
                qty: 1
            });
            price = cart.total_price + item.price;
            totalQty = cart.total_Qty + 1;
            return generateToken(price, totalQty, itemsArray, cart);

        }
    }; 
  
  this.delete = function(token, item, id) {
    var cart = jwt_decode(token, process.env.JWT_KEY);
    var itemsArray = [];

    if(cart.items !== "items"){
        for(var x of cart.items) {
            itemsArray.push(x);
        }
    }

    for(var i = 0; i < itemsArray.length; i++) {
        if(itemsArray[i].id == id && itemsArray[i].qty > 1) {
            itemsArray[i].qty--; 
            var price = cart.total_price - itemsArray[i].price;
            var totalQty = cart.total_Qty - 1; 
            return generateToken(price, totalQty, itemsArray, cart);
        } else if(itemsArray[i].id == id) {
            var price = cart.total_price - itemsArray[i].price;
            var totalQty = cart.total_Qty - 1; 
            itemsArray.splice(i, 1)
            return generateToken(price, totalQty, itemsArray, cart);
        }
    }

  }
};