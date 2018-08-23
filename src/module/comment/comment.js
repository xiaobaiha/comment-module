/**
 * 评论模块
 * @class module:Comment
 * 
 */
function Comment() {
    var db = new DBUtil();   // 数据库连接
    var limit = 10;
    var pagerShow = 5;
    var totalChar = 140;
    var totalComment;

    /**
     * Comment模块初始化函数
     * @public
     * @method module:Comment#init
     * @returns {void} 
     */
    this.init = async () => {
        this.reply = new Reply(db, totalChar);
        this.list = new List(db, limit);
        await db.getCommentTotal().then(total => {
            totalComment = total;
            this.pager = new Pager(Math.ceil(total/limit), this.refresh, pagerShow);
        });
        this.refresh();
        this.listen();
    };
    this.refresh = async () => {
        await db.getCommentTotal().then(total => {
            totalComment = total;
            this.pager.refreshTotal(Math.ceil(total/limit));
        });
        await this.list.refresh(this.pager.getPresentPage());
        document.querySelector("div.m-comment").innerHTML = this.render(); //使用方式 <div class="m-comment"></div>
        this.reply.bind();
        this.pager.bind();
        this.list.bind();
    }
    this.listen = () => {
        db.on("listchange", event => {
            this.refresh(this.pager.getPresentPage());
        });
    };
    this.render = () => {
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
