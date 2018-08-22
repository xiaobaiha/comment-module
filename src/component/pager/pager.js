// [{ value: 1, disabled: true }, { value: 1, disabled: true }, { disabled: true }, {}, {}, {}]

function Pager() {
    var pageArr = [];
    var presentPage = 1;
    var total;
    var showNumber;
    /**
     * 初始化分页器数组
     * @public
     * @param {Number} showNumber 显示多少页页码
     * @param {Number} total 总共多少页
     */
    this.init = (total, showNumber) => {
        this.total = total;
        this.showNumber = showNumber || 5;
    };
    var calc = function(showNumber, presentPage, total) {
        // calc item value
        var pageArr = [];
        pageArr.push({value: 1});
        var interval = Math.floor(showNumber / 2) - 1;
        var left = Math.min(Math.max(2, presentPage - interval), total + 2 - showNumber);
        for(var i = 0; i < showNumber - 2; i++){
            pageArr.push({value: left + i});
        }
        pageArr.push({value: total});
        // calc item visibility
        var max;
        pageArr.forEach(item => {
            if(max && item.value <= max){
                item.disabled = true;
            } else {
                max = item.value;
            }
        })
        return pageArr;
    };
    this.render = function () {
        pageArr = calc(this.showNumber, presentPage, this.total);
        return `
        <ul class="c-pager">
            <li class="btn prv ${presentPage>1?'':'j-disabled'}" data-action="${presentPage - 1}">
                <a href="#">&lt;上一页</a>
            </li>
            <li class="itm ${1 === presentPage?'j-selected': ''}" data-action="1">
                <a href="#">1</a>
            </li>
            <li class="sep ${pageArr[0].value+1>=pageArr[1].value?'hidden':''}">
                <span>...</span>
            </li>
            ${pageArr.slice(1, this.showNumber-1).map(item => `
            <li class="itm ${item.disabled?'hidden':''} ${item.value === presentPage?'j-selected': ''}" data-action="${item.value}">
                <a href="">${item.value}</a>
            </li>`
            ).join('')}
            <li class="sep ${pageArr[this.showNumber-1].value-1===pageArr[this.showNumber-2].value?'hidden':''}">
                <span>...</span>
            </li>
            <li class="itm ${this.total === presentPage?'j-selected': ''} ${pageArr[this.showNumber-1].disabled?'hidden':''}" data-action="${this.total}">
                <a href="#">${this.total}</a>
            </li>
            <li class="btn nxt ${presentPage<this.total?'':'j-disabled'}" data-action="${presentPage + 1}">
                <a href="#">下一页&gt;</a>
            </li>
        </ul>`;
    };
    this.bind = function(){

    };
}