'use strict';

module.exports = {

    lengthValidator: function(val){
        if(val && val.length >= 5){
            return true;
        }
        return false;
    },

    emailValidator: function(email) {
        var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        return re.test(email)
    }

}