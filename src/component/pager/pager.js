/**
 * 分页器组件
 * @class Component:Pager
 * 
 */
function Pager(total, refresh, showNumber) {
    var presentPage = 1;                // 当前页
    this.total = total;                 // 总页数
    this.refresh = refresh;             // 更新回调函数
    this.showNumber = showNumber || 5;  // 可见页码数目
    
    /**
    * 计算分页器显示的数组
    * @private
    * @method Component:Pager#calc
    * @param {Number} showNumber 可见页码数目
    * @param {Number} presentPage 当前页
    * @param {Number} total 总页数
    * @returns {Array} 分页器显示的数组 数组格式：[{ value: 1, disabled: true }, { value: 2, disabled: true }, ... ]
    */
    var calc = function (showNumber, presentPage, total) {
        // calc item value
        var pageArr = [];
        pageArr.push({ value: 1 });
        var interval = Math.floor(showNumber / 2) - 1;
        var left = Math.min(Math.max(2, presentPage - interval), total + 2 - showNumber);
        for (var i = 0; i < showNumber - 2; i++) {
            pageArr.push({ value: left + i });
        }
        pageArr.push({ value: total });
        // calc item visibility
        var max;
        pageArr.forEach(function(item) {
            if (max && item.value <= max) {
                item.disabled = true;
            } else {
                max = item.value;
            }
        })
        return pageArr;
    };

    /**
    * 分页器跳转
    * @private
    * @method Component:Pager#jumpPage
    * @param {Object} event 点击事件
    * @returns {void}
    */
    var jumpPage = function (event) {
        event.preventDefault();
        var page = event.target.parentNode.attributes["dataaction"].nodeValue - 0;
        presentPage = page;
        // 回调函数，将当前页码传送到上层容器
        this.refresh(presentPage);
    }.bind(this);

    /**
    * 刷新分页器组件
    * @public
    * @method Component:Pager#refreshTotal
    * @param {Number} total 总页数
    * @returns {void}
    */
    this.refreshTotal = function(total) {
        this.total = total;
        // 最后一页评论全部删除
        if(presentPage > total && presentPage > 1){
            presentPage = presentPage - 1;
            this.refresh(presentPage);
        }
    };

    /**
    * 获取分页器当前页码
    * @public
    * @method Component:Pager#getPresentPage
    * @returns {Number} 当前页
    */
    this.getPresentPage = function () {
        return presentPage;
    };

    /**
    * 获取分页器渲染后的DOM字符串
    * @public
    * @method Component:Pager#render
    * @returns {String} 分页器HTML字符串
    */
    this.render = function () {
        var pageArr = calc(this.showNumber, presentPage, this.total);
        return '<ul class="c-pager">'+
            '<li class="btn prv '+(presentPage > 1 ? '" datatype="page' : 'j-disabled') + '" dataaction="'+(presentPage - 1)+'">'+
                '<a href="#">&lt;上一页</a>'+
            '</li>'+
            '<li class="itm '+(1 === presentPage ? 'j-selected' : '" datatype="page')+ '" dataaction="1">'+
                '<a href="#">1</a>'+
            '</li>'+
            '<li class="sep '+(pageArr[0].value + 1 >= pageArr[1].value ? 'hidden' : '')+'">'+
                '<span>...</span>'+
            '</li>'+
            pageArr.slice(1, this.showNumber - 1).map(function(item){
                return '<li class="itm ' + (item.disabled ? 'hidden' : '') +' ' + (item.value === presentPage ? 'j-selected' : '" datatype="page')+'" dataaction="'+item.value+'">'+
                    '<a href="#">'+item.value+'</a>'+
                '</li>';
            }).join('')+
            '<li class="sep '+(pageArr[this.showNumber - 1].value - 1 === pageArr[this.showNumber - 2].value ? 'hidden' : '')+'">'+
                '<span>...</span>'+
            '</li>'+
            '<li class="itm '+(pageArr[this.showNumber - 1].disabled ? 'hidden' : '')+' ' +(this.total === presentPage ? 'j-selected' : '" datatype="page') + '" dataaction="'+this.total+'">'+
                '<a href="#">'+this.total+'</a>'+
            '</li>'+
            '<li class="btn nxt '+(presentPage < this.total ? '" datatype="page' : 'j-disabled')+'" dataaction="'+presentPage + 1+'">'+
                '<a href="#">下一页&gt;</a>'+
            '</li>'+
        '</ul>';
    };
    
    /**
    * 绑定分页器组件事件
    * @public
    * @method Component:Pager#bind
    * @returns {void}
    */
    this.bind = function () {
        var iter1 = document.querySelectorAll("[datatype='page']");
        var iter2 = document.querySelectorAll(".c-pager .j-selected,.j-disabled");
        for(var i = 0; i< iter1.length;i++){
            iter1[i].addEventListener("click", jumpPage);
        }
        for(var i = 0; i< iter2.length;i++){
            iter2[i].addEventListener("click", function(e) {e.preventDefault()});
        }
    };
}