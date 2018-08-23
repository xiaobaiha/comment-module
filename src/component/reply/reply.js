/**
 * 回复组件
 * @class Component:Reply
 * 
 */
function Reply(db, totalChar) {
    this.db = db;                       // 数据库连接
    this.user = this.db.getLoginUser(); // 当前登录用户
    this.util = new Util();             // 工具类示例
    this.left = totalChar;              // 剩余输入字数
    this.totalChar = totalChar;         // 总共可输入字数

    /**
    * 处理回复提交
    * @private
    * @method Component:Reply#handleSubmit
    * @param {Object} event 点击事件
    * @returns {void}
    */
    var handleSubmit = event => {
        event.preventDefault();
        var text = leftChar();
        if (text) {
            this.db.addComment({ id: "" + Date.now(), content: text }).then(function (data) {
                console.log("add comment", data);
            });
            document.querySelector("form.reply").content.value = ""; // 清空输入框
        }
    };

    /**
    * 回复器剩余输入字数
    * @private
    * @method Component:Reply#leftChar
    * @returns {Boolean} 回复内容
    */
    var leftChar = () => {
        var text = document.querySelector("form.reply").content.value;
        var commentChar = this.util.getLength(text);
        var leftChar = totalChar - commentChar;
        var countNode = document.querySelector("form.reply .submit span.count");

        countNode.querySelector(".message").textContent = leftChar >= 0 ? "" : "已超出" + (commentChar - 140) + "字!";
        if (leftChar < 0) {
            return false;
        }
        countNode.querySelector("span").textContent = 140 - commentChar;
        return text;
    };

    /**
    * 获取回复渲染后的DOM字符串
    * @public
    * @method Component:Reply#render
    * @returns {void}
    */
    this.render = function () {
        return `
        <div class="c-reply f-clear">
            <a class="w-avatar" href="#">
                <img src="./style/${this.user.avatarURL}" alt="" />
            </a>
            <form class="reply" method="post">
                <div class="txt">
                    <textarea name="content" required placeholder="评论"></textarea>
                </div>
                <div class="submit f-clear">
                    <span class="count">
                        <span>${this.left}</span>/140
                        <span class="message"></span>
                    </span>
                    <button type="submit">评论</button>
                </div>
            </form>
        </div>`;
    };

    /**
    * 绑定回复组件事件
    * @public
    * @method Component:Reply#bind
    * @returns {void}
    */
    this.bind = function () {
        var form = document.querySelector(".c-reply form.reply");
        form.addEventListener("submit", handleSubmit);
        form.content.addEventListener("input", leftChar);
    };
}