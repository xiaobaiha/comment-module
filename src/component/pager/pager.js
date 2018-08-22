// [{ value: 1, disabled: true }, { value: 1, disabled: true }, { disabled: true }, {}, {}, {}]

function Pager() {
    var pageArr = [];
    var presentPage = 1;
    /**
     * 初始化分页器数组
     * @public
     * @param {Number} show 显示多少页页码
     * @param {Number} total 总共多少页
     */
    this.init = function(show, total){
        pageArr.push({value: 1});
        var left = Math.max()
    };
    var calc = function() {

    };
    this.render = function () {
        return `
        <ul class="c-pager">
            <li class="btn prv j-disabled">
                <a href="#/page/previous">&lt;上一页</a>
            </li>
            <li class="itm">
                <a href="#"></a>
            </li>
            <li class="sep">
                <span>...</span>
            </li>
            <li class="itm">
                <a href="#"></a>
            </li>
            <li class="itm j-selected">
                <a href=""></a>
            </li>
            <li class="itm">
                <a href="#"></a>
            </li>
            <li class="sep">
                <span>...</span>
            </li>
            <li class="itm">
                <a href="#"></a>
            </li>
            <li class="btn nxt">
                <a href="#/page/next">下一页&gt;</a>
            </li>
        </ul>`;
    }
}