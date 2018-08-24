/**
 * 列表组件
 * @class Component:List
 * 
 */
function List(db, limit) {
    this.db = db;           // 数据库连接
    this.limit = limit;     // 每页条目数
    this.util = new Util(); // 工具类示例

    /**
    * 处理评论删除
    * @private
    * @method Component:List#handleDelete
    * @param {Object} e 点击事件
    * @returns {void}
    */
    var handleDelete = function (e) {
        e.preventDefault();
        db.removeComment(e.target.attributes["dataid"].nodeValue).then(function (data) {
            console.log("delete:", data);
        });
    };

    /**
    * 刷新列表组件
    * @public
    * @method Component:List#refresh
    * @param {Number} 当前页码
    * @returns {void}
    */
    this.refresh = function(currentPage, callback) {
        db.getCommentList({ page: currentPage, limit: this.limit }).then(function( list ) {
            if (list.length === 0) {
                callback();
            }
            // render list
            this.liList = list.map(function(e){
                return "<li class=\"c-comment f-clear\">"+
                    "<a class=\"w-avatar\" href=\"#\">"+
                        "<img src=\"./style/"+e.user.avatarURL+"\" alt=\""+e.user.nickName+"\" />"+
                    "</a>"+
                    "<div class=\"reply\">"+
                        "<p><time>"+this.util.formatTime(new Date(e.time))+"</time></p>"+
                        "<p><a href=\"#\" datatype=\"delete\" dataid=\""+e.id+"\">删除</a></p>"+
                    "</div>"+
                    "<div class=\"comment\">"+
                        "<p><a class=\"user\" href=\"#\">"+e.user.nickName+"</a>："+e.content+"</p>"+
                    "</div>"+
                "</li>"}.bind(this)).join('');
            callback();
        }.bind(this));
    };
    
    /**
    * 获取列表渲染后的DOM字符串
    * @public
    * @method Component:List#render
    * @returns {String} 列表HTML字符串
    */
    this.render = function () {
        return '<ul class="m-comments">'+
            this.liList+
        '</ul>';
    };

    /**
    * 绑定列表组件事件
    * @public
    * @method Component:List#bind
    * @returns {void}
    */
    this.bind = function () {
        var iter = document.querySelectorAll(".c-comment .reply a[datatype='delete']");
        for(var i = 0; i< iter.length;i++){
            iter[i].addEventListener("click", handleDelete);
        }
    };
}