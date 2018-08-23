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
    var handleDelete = e => {
        e.preventDefault();
        console.log(e.target.dataset.id)
        db.removeComment(e.target.dataset.id).then(function (data) {
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
                        <p><time>${this.util.formatTime(new Date(e.time))}</time></p>
                        <p><a href="#" data-type="delete" data-id="${e.id}">删除</a></p>
                    </div>
                    <div class="comment">
                        <p><a class="user" href="#">${e.user.nickName}</a>：${e.content}</p>
                    </div>
                </li>
                `).join('');
        });
    };
    
    /**
    * 获取列表渲染后的DOM字符串
    * @public
    * @method Component:List#render
    * @returns {String} 列表HTML字符串
    */
    this.render = function () {
        return `
        <ul class="m-comments">
            ${this.liList}
        </ul>`;
    };

    /**
    * 绑定列表组件事件
    * @public
    * @method Component:List#bind
    * @returns {void}
    */
    this.bind = function () {
        document.querySelectorAll(".c-comment .reply a[data-type='delete']").forEach(e => e.addEventListener("click", handleDelete));
    };
}