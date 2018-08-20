/**
 * 评论模块
 * @class module:Comment
 * 
 */
function Comment() {
    var user;   // 当前登录用户
    var db;     // 数据库连接
    var limit = 10;     // 每页数目
    var currentPage = 1;// 当前页
    var totalPage;      // 共多少页
    /**
     * 连接数据库 需引入db.js
     * @private
     * @method module:Comment#connectDB
     * @returns {void}
     */
    var connectDB = function () {
        if (!db) {
            db = new DBComment();
        }
        return db;
    };
    /**
     * 对Date格式化(yyyy-MM-dd HH:mm)
     * @private
     * @method module:Comment#formatDate
     * @param {Date} date
     * @returns {String} yyyy-MM-dd HH:mm格式化后的字符串
     */
    var formatDate = function (date) {
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
     * Comment模块初始化函数
     * @public
     * @method module:Comment#init
     * @returns {void} 
     */
    this.init = function () {
        db = connectDB();
        user = db.getLoginUser();
        var userAvatar = document.querySelector(".m-reply .w-avatar img");
        userAvatar.src = user.avatarURL;

        this.refreshPager();
        this.listen();
    };
    /**
     * 侦听处理数据库变化
     * @public
     * @method module:Comment#listen
     * @returns {void} 
     */
    this.listen = () => {
        db.on("listchange", event => {
            this.refreshPager();
        });
    };
    /**
     * 更新当前页评论列表
     * @public
     * @method module:Comment#refreshCommentList
     * @returns {void} 
     */
    this.refreshCommentList = () => {
        db.getCommentList({ page: currentPage, limit: limit }).then(list => {
            // 评论列表为空时，跳转上一页
            if (list.length === 0) {
                currentPage -= 1;
                this.refreshPager();
                return;
            }
            // render list
            var commentList = document.querySelector("ul.m-comments");
            var docFragment = document.createDocumentFragment();
            list.forEach(function (e) {
                var currentTime = new Date();
                var publishDate = new Date(e.time);
                var timeInteval = currentTime.getTime() - e.time;
                var timeText;

                if (timeInteval < 60 * 1000) {
                    timeText = Math.ceil(timeInteval / 1000) + "秒前";
                } else if (timeInteval < 60 * 60 * 1000) {
                    timeText = Math.ceil(timeInteval / (60 * 1000)) + "分前";
                } else if (timeInteval < 24 * 60 * 60 * 1000) {
                    timeText = publishDate.getHours() + ":" + publishDate.getMinutes();
                } else if (currentTime.getFullYear() === publishDate.getFullYear()) {
                    timeText =
                        publishDate.getMonth() + 1 + "月" + publishDate.getDate() + "日";
                } else {
                    timeText = formatDate(publishDate);
                }
                var li = document.createElement("li");
                li.className = "m-comment f-clear";
                li.innerHTML = `
                    <a class="w-avatar" href="#">
                        <img src="${e.user.avatarURL}" alt="${e.user.nickName}" />
                    </a>
                    <div class="reply">
                        <p><time>${timeText}</time></p>
                        <p><a href="#" onclick="deleteComment('${e.id}', event)">删除</a></p>
                    </div>
                    <div class="comment">
                        <p><a class="user" href="#">${e.user.nickName}</a>：${e.content}</p>
                    </div>
                `;
                docFragment.appendChild(li);
            });
            commentList.innerHTML = ""; // 清空评论列表
            commentList.appendChild(docFragment);   // 新评论列表内容
        });
    };
    /**
     * 页码跳转
     * @public
     * @method module:Comment#jumpPage
     * @param {String} href 跳转地址
     * @returns {void} 
     */
    this.jumpPage = function (href) {
        if (/#\/page\/next/.test(href)) {
            // 页码为最后一页，不跳页
            currentPage <= totalPage && (currentPage += 1);
        } else if (/#\/page\/previous/.test(href)) {
            // 页码为第一页，不跳页
            currentPage > 1 && (currentPage -= 1);
        } else if (/#\/page\/(\d+)/.test(href)) {
            currentPage = /#\/page\/(\d+)/.exec(href)[1] - 0; // page转成number
        }
        this.refreshPager();
    };
    /**
     * 更新分页器
     * @public
     * @method module:Comment#refreshPager
     * @returns {void} 
     */
    this.refreshPager = function () {
        db.getCommentTotal().then(function (total) {
            var commentList = document.querySelector("ul.m-pager");
            totalPage = Math.ceil(total / limit);
            var pageNumberList;
            // 总评论数
            document.querySelector(".m-header .total_comment").textContent = total;
            // 处理上/下一页是否可用
            commentList.querySelector("li.btn.prv").className =
                currentPage === 1 ? "btn prv j-disabled" : "btn prv";
            commentList.querySelector("li.btn.nxt").className =
                currentPage === totalPage ? "btn nxt j-disabled" : "btn nxt";
            // 处理省略号是否显示
            commentList.querySelectorAll("li.sep")[0].className =
                totalPage <= 5 || currentPage <= 3 ? "sep hidden" : "sep";
            commentList.querySelectorAll("li.sep")[1].className =
                totalPage <= 5 || (currentPage >= totalPage - 2) ? "sep hidden" : "sep";
            // 共显示5个页码，处理中间三个页码如何选择
            if (currentPage <= 4) {
                pageNumberList = [1, 2, 3, 4, totalPage];
            } else if (currentPage >= totalPage - 3) {
                pageNumberList = [
                    1,
                    totalPage - 3,
                    totalPage - 2,
                    totalPage - 1,
                    totalPage
                ];
            } else {
                pageNumberList = [
                    1,
                    currentPage - 1,
                    currentPage,
                    currentPage + 1,
                    totalPage
                ];
            }
            // 根据页码数组更新DOM
            pageNumberList.forEach(function (page, index) {
                var node = commentList.querySelectorAll("li.itm")[index];
                node.className = page === currentPage ? "itm j-selected" : "itm";
                var link = node.querySelector("a");
                link.textContent = page;
                link.href = "#/page/" + page;
            });
        });
        this.refreshCommentList();  // 更新评论列表
    };
    /**
     * 增加评论，只操作数据库，数据变化由this.listen方法处理
     * @public
     * @method module:Comment#addComment
     * @param {String} text 评论内容
     * @returns {void} 
     */
    this.addComment = function (text) {
        db.addComment({ id: "" + Date.now(), content: text }).then(function (data) {
                console.log("add comment", data);
            }
        );
    };
    /**
     * 删除评论，只操作数据库，数据变化由this.listen方法处理
     * @public
     * @method module:Comment#deleteComment
     * @param {String} id 被删除评论的id
     * @returns {void} 
     */
    this.deleteComment = function (id) {
        db.removeComment(id).then(function (data) {
            console.log("delete:", data);
        });
    };
}
