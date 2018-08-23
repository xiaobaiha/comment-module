/**
 * 工具类
 * @class Util
 * 
 */
function Util() {
    /**
    * 获取字符串长度(1中文=2英文)
    * @public
    * @method Util#getLength
    * @param {String} str
    * @returns {Number} 字符串长度
    */
    this.getLength = function (str) {
        var realLength = 0, len = str.length, charCode = -1;
        for (var i = 0; i < len; i++) {
            charCode = str.charCodeAt(i);
            realLength += (charCode >= 0 && charCode <= 128) ? 1 : 2;
        }
        return realLength;
    };
    /**
    * 对Date格式化(yyyy-MM-dd HH:mm)
    * @public
    * @method Util#formatDate
    * @param {Date} date
    * @returns {String} yyyy-MM-dd HH:mm格式化后的字符串
    */
    this.formatDate = function (date) {
        var d = new Date(date),
            hour = "" + d.getHours(),
            minute = "" + d.getMinutes(),
            month = "" + (d.getMonth() + 1),
            day = "" + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2) month = "0" + month;
        if (day.length < 2) day = "0" + day;
        if (hour.length < 2) hour = "0" + hour;
        if (minute.length < 2) minute = "0" + minute;

        return `${year}-${month}-${day} ${hour}:${minute}`;
    };
    /**
    * 对发布时间进行格式化
    * @public
    * @method Util#formatTime
    * @param {Date} publishDate 发布时间
    * @returns {String} 格式化后的字符串
    */
    this.formatTime = function (publishDate) {
        var timeText;
        var timeInteval = Date.now() - publishDate.getTime();
        if (timeInteval < 60 * 1000) {
            timeText = Math.ceil(timeInteval / 1000) + "秒前";
        } else if (timeInteval < 60 * 60 * 1000) {
            timeText = Math.ceil(timeInteval / (60 * 1000)) + "分前";
        } else if (timeInteval < 24 * 60 * 60 * 1000) {
            timeText = publishDate.getHours() + ":" + publishDate.getMinutes();
        } else if (new Date().getFullYear() === publishDate.getFullYear()) {
            timeText = publishDate.getMonth() + 1 + "月" + publishDate.getDate() + "日";
        } else {
            timeText = this.formatDate(publishDate);
        }
        return timeText;
    };
}