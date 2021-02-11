var jwt_decode = require('jwt-decode');
const jwt = require('jsonwebtoken');

module.exports = function PackageIntegration() {

    function generateToken(token, itemsArray, cart) {
        token = jwt.sign({
            user: {
                name: cart.user.name,
                email: cart.user.email,
                id: cart.user.id
            },
            items : itemsArray,
            total_price: cart.total_price,
            total_Qty : cart.total_Qty
        }, 
        process.env.JWT_KEY,
        {
            expiresIn: "24h"
        });
        return token;
    };

    this.add = function(token, package) {
        var cart = jwt_decode(token, process.env.JWT_KEY);
        cart.total_price = package.price
        var itemsArray = [];

        if(cart.items !== "items") {
            for(var x of cart.items) {
                x.bundle = 'packages'
                x.bundleName = package.name
                itemsArray.push(x);
                if(x.productType == 'Place') {
                    cart.total_price += x.price - (package['details']['PLACE'][0]['discount']);
                }
            }
        }
        return generateToken(token, itemsArray, cart);
    };

    this.remove = function(token) {
        var cart = jwt_decode(token, process.env.JWT_KEY);
        cart.total_price = 0; 
        for(var i = 0; i < cart.items.length; i++) {
            var product = cart.items[i];
            cart.total_price += (product.price * product.qty); 
            if(cart.items[i].bundle === 'packages') {
                delete product['bundle'];
                delete product['bundleName'];
            }
        }
        return generateToken(token, cart.items, cart);
    }

}