/**
 * 评论模块
 * @class Module:Comment
 * 使用方法：
 * 1. 引入依赖
 *      - Component (js & css)
 *        List
 *        Pager
 *        Reply
 *      - Util
 *        db
 *        DBUtil
 *        Util
 * 2. HTML中定义<div class="m-comment"></div>容器
 * 3. new Comment().init();
 */
function Comment() {
    var db = new DBUtil();  // 数据库连接
    var limit = 10;         // 列表每页评论数
    var pagerShow = 5;      // 分页器总共显示的页码
    var totalChar = 140;    // 回复器总共可输入字符数
    var totalComment;       // 评论总数

    /**
     * Comment模块初始化函数
     * @public
     * @method module:Comment#init
     * @returns {void} 
     */
    this.init = function() {
        this.reply = new Reply(db, totalChar);
        this.list = new List(db, limit);
        db.getCommentTotal().then(function(total) {
            totalComment = total;
            this.pager = new Pager(Math.ceil(total/limit), this.refresh, pagerShow);
            this.refresh();
            this.listen();
        }.bind(this));
    };

    /**
     * 刷新评论模块
     * @public
     * @method module:Comment#refresh
     * @returns {void} 
     */
    this.refresh = function() {
        db.getCommentTotal().then(function(total) {
            totalComment = total;
            this.pager.refreshTotal(Math.ceil(total/limit));
            this.list.refresh(this.pager.getPresentPage(), function(){
                document.querySelector("div.m-comment").innerHTML = this.render();
                this.reply.bind();
                this.pager.bind();
                this.list.bind();
            }.bind(this));
        }.bind(this));
        
    }.bind(this);

    /**
     * Comment模块侦听数据变化
     * @public
     * @method module:Comment#listen
     * @returns {void} 
     */
    this.listen = function () {
        db.on("listchange", function(event) {
            this.refresh(this.pager.getPresentPage());
        }.bind(this));
    };

    /**
     * 获取评论模块渲染后的DOM字符串
     * @public
     * @method module:Comment#render
     * @returns {void} 
     */
    this.render = function () {
        return '<section class="g-main">'+
                '<header class="m-header f-clear">'+
                    '<h2>评论</h2>'+
                    '<span class="count">共'+
                        '<span class="total_comment">'+totalComment+'</span>条评论</span>'+
                '</header>'+
                this.reply.render()+
                this.list.render()+
                this.pager.render()+
            '</section>';
    };
}
