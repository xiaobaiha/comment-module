// Promise polyfill
// https://github.com/stefanpenner/es6-promise
function DBComment() {
    // rand string as mock id
    var mock_chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz';
    var mock_string = function(len){
        len = len||10;
        var ret = [];
        for(var i=0,idx;i<len;++i){
            idx = Math.floor(
                Math.random()*mock_chars.length
            );
            ret.push(mock_chars.charAt(idx));
        }
        return ret.join('');
    };
    // mock user data
    var mockUser = function (user) {
        return Object.assign({
            id: mock_string(),
            nickName: mock_string(),
            avatarURL: 'img/avatar'+(+new Date%10)+'.png'
        },user||{});
    };
    // mock comment data
    var mockComment = function (comment) {
        return Object.assign({
            id: mock_string(),
            user: mockUser(),
            content: mock_string(500),
            time: +new Date
        },comment||{});
    };

    // mock current login user and comment list
    var mock_time = new Date(2018,2,1);
    var mock_user = mockUser();
    var mock_comment_list = [];
    for(var i=0;i<1000;i++){
        mock_time -= 12*60*60*1000;
        mock_comment_list.push(
            mockComment({
                time: mock_time
            })
        );
    }

    var event_list = {};
    /**
     * 添加指定类型的事件
     *
     * @example
     *
     * ```
     * db.on('listchange', function(event){
     *      // event.data - 事件数据
     *      // event.type - 事件类型
     *      // TODO something
     * });
     * ```
     *
     * @param  {String}   type     - 事件类型
     * @param  {Function} listener - 事件回调
     * @return {void}
     */
    this.on = function (type, listener) {
        var list = event_list[type];
        if (!list){
            list = [];
            event_list[type] = list;
        }
        list.push(listener);
    };

    /**
     * 触发指定类型的事件
     *
     * @param  {String} type - 事件类型
     * @return {void}
     */
    this.emit = function (type, event) {
        var list = event_list[type];
        if (!list||!list.length){
            return;
        }
        event.type = type;
        for(var i=0,l=list.length;i<l;i++){
            list[i](event);
        }
    };

    /**
     * 获取当前登陆用户
     *
     * @example
     *
     * ```
     * // user.id           - 用户标识
     * // user.nickName     - 用户昵称
     * // user.avatarURL    - 用户头像地址
     * var user = db.getLoginUser();
     * ```
     *
     * @return {Object} 当前登陆用户信息，同评论中用户信息
     */
    this.getLoginUser = function () {
        return mock_user;
    };

    /**
     * 获取评论总数
     *
     * @example
     *
     * ```
     * db.getCommentTotal().then(function(ret){
     *      // ret - 数值，评论总数
     *      // TODO something
     * });
     * ```
     *
     * @return {Promise} 评论总数加载 Promise，完成后将给定页评论总数作为回调输入参数
     */
    this.getCommentTotal = function () {
        var mock = {page:1,limit:1};
        return this.getCommentList(mock).then(function () {
            return mock_comment_list.length;
        });
    };

    /**
     * 获取评论列表
     *
     * @example
     *
     * ```
     * var opt = {
     *      page: 2,
     *      limit: 10
     * };
     * db.getCommentList(opt).then(function(ret){
     *      // ret - 数组，当前页评论列表
     *      // TODO something
     * });
     * ```
     *
     * @param  {Object} opt - 配置参数
     * @param  {Number} opt.page  - 当前页码，从 1 开始
     * @param  {Number} opt.limit - 每页显示数量
     * @return {Promise} 评论列表加载 Promise，完成后将给定页评论列表作为回调输入参数
     */
    this.getCommentList = function (opt) {
        return new Promise(function (resolve) {
            var offset = (opt.page-1)*opt.limit;
            var list = mock_comment_list.slice(
                offset, offset+opt.limit
            );
            resolve(list);
        });
    };

    /**
     * 添加评论项
     *
     * @example
     *
     * ```
     * var data = {
     *      content: 'comment content'
     * };
     * db.addComment(data).then(function(ret){
     *      // ret - 对象，添加的评论项数据
     *      // TODO something
     * });
     * ```
     *
     * @param  {Object} data - 评论数据项
     * @param  {String} data.content - 评论内容
     * @return {Promise} 评论添加 Promise，完成后将添加的评论对象作为回调输入参数
     */
    this.addComment = function (data) {
        var self = this;
        return new Promise(function (resolve) {
            data.user = mock_user;
            var comment = mockComment(data);
            mock_comment_list.unshift(comment);
            self.emit('listchange', {
                data: comment,
                action: 'add'
            });
            resolve(comment);
        });
    };

    /**
     * 删除评论项
     *
     * @example
     *
     * ```
     * db.removeComment('454545').then(function(ret){
     *      // ret - 对象，删除的评论项数据
     *      // TODO something
     * });
     * ```
     *
     * @param  {String} id - 评论项标识
     * @return {Promise} 评论删除 Promise，完成后将删除的评论对象作为回调输入参数
     */
    this.removeComment = function (id) {
        var self = this;
        return new Promise(function (resolve) {
            // get comment index by id
            var index = -1;
            for(var i=0,l=mock_comment_list.length;i<l;i++){
                if (mock_comment_list[i].id===id){
                    index = i;
                    break;
                }
            }
            // remove comment from list
            var comment = null;
            if (index>=0){
                comment = mock_comment_list.splice(
                    index, 1
                );
                self.emit('listchange', {
                    data: comment,
                    action: 'remove'
                });
            }
            resolve(comment);
        });
    };
}
