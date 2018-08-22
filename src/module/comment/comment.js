/**
 * 评论模块
 * @class module:Comment
 * 
 */
function Comment() {
    var db = new DBUtil();   // 数据库连接
    var limit = 10;
    var pagerShow = 5;
    var totalComment;

    /**
     * Comment模块初始化函数
     * @public
     * @method module:Comment#init
     * @returns {void} 
     */
    this.init = async () => {
        this.reply = new Reply(db);
        // this.reply.bind();
        this.list = new List(db, limit);
        await db.getCommentTotal().then( total => {
            totalComment = total;
            this.pager = new Pager(Math.ceil(total/limit), this.refresh, pagerShow);
            this.pager.bind();
            console.log("after await")
        });
        console.log("after pager init")
    };
    this.refresh = async page => {
        await this.list.refresh(page);
        document.querySelector("div.m-comment").innerHTML = this.render(); //使用方式
    }
    this.listen = () => {
        db.on("listchange", event => {
            this.refreshPager();
        });
    };
    this.deleteComment = function (id) {
        db.removeComment(id).then(function (data) {
            console.log("delete:", data);
        });
    };
    this.render = () => {
        console.log("render")
        return `
            <section class="g-main">
                <header class="m-header f-clear">
                    <h2>评论</h2>
                    <span class="count">共
                        <span class="total_comment">${totalComment}</span>条评论</span>
                </header>
                ${this.reply.render()}
                ${this.list.render()}
                ${this.pager.render()}
            </section>
            `;
    }
}
