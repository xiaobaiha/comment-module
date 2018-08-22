function Util(){
    this.getLength = function (str) {
        var realLength = 0, len = str.length, charCode = -1;
        for (var i = 0; i < len; i++) {
            charCode = str.charCodeAt(i);
            realLength += (charCode >= 0 && charCode <= 128) ? 1 : 2;
        }
        return realLength;
    };
}