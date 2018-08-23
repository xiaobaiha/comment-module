function List(db, limit) {
    this.db = db;
    this.limit = limit;
    this.util = new Util();

    this.refresh = async currentPage => {
        await db.getCommentList({ page: currentPage, limit: this.limit }).then(async list => {
            if (list.length === 0) {
                return;
            }
            // render list
            this.liList = await list.map(e => `
                <li class="c-comment f-clear">
                    <a class="w-avatar" href="#">
                        <img src="./style/${e.user.avatarURL}" alt="${e.user.nickName}" />
                    </a>
                    <div class="reply">
                        <p><time>${this.util.formatTime(new Date(e.time), Date.now() - e.time)}</time></p>
                        <p><a href="#" data-type="delete" data-id="${e.id}">删除</a></p>
                    </div>
                    <div class="comment">
                        <p><a class="user" href="#">${e.user.nickName}</a>：${e.content}</p>
                    </div>
                </li>
                `).join('');
            return new Promise(resolve => resolve(this.render()))
        });
    };
    this.render = function() {
        return `
        <ul class="m-comments">
            ${this.liList}
        </ul>`;
    };
    var handleDelete = e => {
        e.preventDefault();
        console.log(e.target.dataset.id)
        db.removeComment(e.target.dataset.id).then(function (data) {
            console.log("delete:", data);
        });
    }
    this.bind = function() {
        document.querySelectorAll(".c-comment .reply a[data-type='delete']").forEach(e=>e.addEventListener("click", handleDelete));
    }
}