var DBUtil = (function() {
    var instance = null;
    function newDB(){
        return new DBComment();
    }
    return function(){
        if(!instance){
            return newDB();
        }
        return instance;
    }
})();