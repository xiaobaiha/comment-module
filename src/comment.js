function Comment(){
    var user;
    var db;
    var limit = 10;
    var currentPage = 1;
    var connectDB = function(){
        if(!db){
            db = new DBComment();
        }
        return db;
    };
    var formatDate = function (date) {
        var d = new Date(date),
            hour = '' + d.getHours(),
            minute = '' + d.getMinutes(),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();
    
        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;
        if (hour.length < 2) hour = '0' + hour;
        if (minute.length < 2) minute = '0' + minute;
    
        return `${year}-${month}-${day} ${hour}:${minute}`;
    }
    this.init = function(){
        db = connectDB();
        user = db.getLoginUser();
        var userAvatar = document.querySelector(".m-reply .w-avatar img");
        userAvatar.src = user.avatarURL;

        this.refreshPager();
        this.listen();
    };
    this.listen = () => {
        db.on('listchange', event => {
            console.log(event.action,event.data);
            this.refreshPager();
        });
    };
    this.refreshCommentList = () => {
        db.getCommentList({page:currentPage,limit:limit}).then(list => {
            if(list.length === 0){
                currentPage -= 1;
                this.refreshPager();
                return;
            }
            // render list
            var commentList = document.querySelector("ul.m-comments");
            var docFragment = document.createDocumentFragment();
            list.forEach(function (e){
                var currentTime = new Date();
                var publishDate = new Date(e.time);
                var timeInteval = currentTime.getTime() - e.time;
                var timeText;
                if (timeInteval < 60 * 1000) {
                    timeText = Math.round(timeInteval / 60) + '秒前';
                } else if (timeInteval < 60 * 60 * 1000) {
                    timeText = Math.round(timeInteval / (60 * 60)) + '分前';
                } else if (timeInteval < 24 * 60 * 60 * 1000) {
                    timeText = publishDate.getHours() + ':' + publishDate.getMinutes();
                } else if (currentTime.getFullYear() === publishDate.getFullYear()){
                    timeText = publishDate.getMonth() + 1 + '月' + publishDate.getDate() + '日';
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
            commentList.innerHTML = '';
            commentList.appendChild(docFragment);
        });
    };
    this.jumpPage = function(href) {
        if(/#\/page\/next/.test(href)){
            currentPage += 1;
        } else if(/#\/page\/previous/.test(href)){
            currentPage -= 1;
        } else{
            currentPage = /#\/page\/(\d+)/.exec(href)[1] - 0; // page转成number
        }
        
        this.refreshPager();
    };
    this.refreshPager = function() {
        db.getCommentTotal().then(function (total) {
            var commentList = document.querySelector("ul.m-pager");
            var totalPage = Math.ceil(total / limit);
            var pageNumberList;
            var totalComment = document.querySelector(".m-header .total_comment");

            totalComment.textContent = total;
            // if(this.totalPage === totalPage)
            // this.totalPage = totalPage;
            // 处理上/下一页是否可用
            commentList.querySelector("li.btn.prv").className = currentPage === 1?"btn prv j-disabled":"btn prv";
            commentList.querySelector("li.btn.nxt").className = currentPage === totalPage?"btn nxt j-disabled":"btn nxt";
            // 处理省略号是否显示
            commentList.querySelectorAll("li.sep")[0].className = (totalPage <= 5 || currentPage <= 3)?"sep hidden":"sep";
            commentList.querySelectorAll("li.sep")[1].className = (totalPage <= 5 || currentPage >= totalPage - 2)?"sep hidden":"sep";

            if(currentPage<=4){
                pageNumberList = [1,2,3,4,totalPage];
            } else if(currentPage>=totalPage - 3){
                pageNumberList = [1,totalPage-3,totalPage-2,totalPage-1,totalPage]
            } else {
                pageNumberList = [1,currentPage-1,currentPage,currentPage+1,totalPage];
            }
            pageNumberList.forEach(function(page, index){
                var node = commentList.querySelectorAll("li.itm")[index];
                node.className = page===currentPage?"itm j-selected":"itm";
                var link = node.querySelector('a');
                link.textContent = page;
                link.href = "#/page/"+page;
            })
        });
        this.refreshCommentList();
    };
    this.addComment = function(){
        // get id & content
        // add comment item
        db.addComment({id:id,content:'这是评论内容'}).then(function (data) {
            console.log("add comment", data);
        });
        // clear content
    };
    this.deleteComment = function(id) {
        db.removeComment(id).then(function(data) {
            // modal tip
            console.log("delete:", data);
        });
    };
}