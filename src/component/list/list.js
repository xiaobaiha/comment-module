function List(db, limit) {
    this.db = db;
    this.limit = limit;
    this.util = new Util();

    this.refresh = async currentPage => {
        await db.getCommentList({ page: currentPage, limit: this.limit }).then(async list => {
            // 评论列表为空时，跳转上一页
            if (list.length === 0) {
                // currentPage -= 1;
                // this.refreshPager();
                // return;
            }
            // render list
            this.liList = await list.map(e => `
                <li class="c-comment f-clear">
                    <a class="w-avatar" href="#">
                        <img src="./style/${e.user.avatarURL}" alt="${e.user.nickName}" />
                    </a>
                    <div class="reply">
                        <p><time>${this.util.formatTime(new Date(e.time), Date.now() - e.time)}</time></p>
                        <p><a href="#" onclick="deleteComment('${e.id}', event)">删除</a></p>
                    </div>
                    <div class="comment">
                        <p><a class="user" href="#">${e.user.nickName}</a>：${e.content}</p>
                    </div>
                </li>
                `).join('');
            return new Promise(resolve => resolve(this.render()))
        });
        console.log("after refresh list")
    };
    this.render = function() {
        return `
        <ul class="m-comments">
            ${this.liList}
        </ul>`;
    }
}