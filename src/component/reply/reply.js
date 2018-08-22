function Reply(db) {
    this.db = db;
    this.user = this.db.getLoginUser();
    this.util = new Util();
    this.left = 140;
    
    var handleSubmit = event => {
        event.preventDefault();
        var text = leftChar();
        if (text) {
            this.db.addComment({ id: "" + Date.now(), content: text }).then(function (data) {
                console.log("add comment", data);
            }
            );
            document.querySelector("form.reply").content.value = ""; // 清空输入框
        }
    };
    var leftChar = () => {
        console.log("enter leftchar")
        var text = document.querySelector("form.reply").content.value;
        var commentChar = this.util.getLength(text);
        var leftChar = 140 - commentChar;
        var countNode = document.querySelector("form.reply .submit span.count");

        countNode.querySelector(".message").textContent = leftChar >= 0 ? "" : "已超出" + (commentChar - 140) + "字!";
        if (leftChar < 0) {
            return false;
        }
        countNode.querySelector("span").textContent = 140 - commentChar;
        return text;
    };

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
    this.bind = function () {
        var form = document.querySelector(".c-reply form.reply");
        form.addEventListener("submit", handleSubmit);
        form.content.addEventListener("input", leftChar);
    };
}