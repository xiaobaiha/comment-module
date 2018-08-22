// [{ value: 1, disabled: true }, { value: 1, disabled: true }, { disabled: true }, {}, {}, {}]

function Pager(total, refresh, showNumber) {
    var presentPage = 1;
    /**
     * 初始化分页器
     * @public
     * @param {Number} total 总共多少页
     * @param {Object} refresh 分页器更新后的回调函数
     * @param {Number} showNumber 显示多少页页码
     */
    this.total = total;
    this.refresh = refresh;
    this.showNumber = showNumber || 5;

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
        pageArr.forEach(item => {
            if (max && item.value <= max) {
                item.disabled = true;
            } else {
                max = item.value;
            }
        })
        return pageArr;
    };
    var jumpPage = (event) => {
        event.preventDefault();
        var page = event.target.parentNode.dataset.action - 0;
        presentPage = page;
        this.refresh(presentPage);
    }
    this.goPrevious = () => {
        if(presentPage > 1){
            presentPage = presentPage - 1;
            this.refresh(presentPage);
        }
    }
    this.render = function () {
        var pageArr = calc(this.showNumber, presentPage, this.total);
        return `
        <ul class="c-pager">
            <li class="btn prv ${presentPage > 1 ? '" data-type="page' : 'j-disabled'}" data-action="${presentPage - 1}">
                <a href="#">&lt;上一页</a>
            </li>
            <li class="itm ${1 === presentPage ? 'j-selected' : '" data-type="page'}" data-action="1">
                <a href="#">1</a>
            </li>
            <li class="sep ${pageArr[0].value + 1 >= pageArr[1].value ? 'hidden' : ''}">
                <span>...</span>
            </li>
            ${pageArr.slice(1, this.showNumber - 1).map(item => `
            <li class="itm ${item.disabled ? 'hidden' : ''} ${item.value === presentPage ? 'j-selected' : '" data-type="page'}" data-action="${item.value}">
                <a href="">${item.value}</a>
            </li>`
            ).join('')}
            <li class="sep ${pageArr[this.showNumber - 1].value - 1 === pageArr[this.showNumber - 2].value ? 'hidden' : ''}">
                <span>...</span>
            </li>
            <li class="itm ${pageArr[this.showNumber - 1].disabled ? 'hidden' : ''} ${this.total === presentPage ? 'j-selected' : '" data-type="page'}" data-action="${this.total}">
                <a href="#">${this.total}</a>
            </li>
            <li class="btn nxt ${presentPage < this.total ? '" data-type="page' : 'j-disabled'}" data-action="${presentPage + 1}">
                <a href="#">下一页&gt;</a>
            </li>
        </ul>`;
    };
    this.bind = function () {
        document.querySelectorAll("[data-type='page']").forEach(item => item.addEventListener("click", jumpPage));
        document.querySelectorAll(".c-pager .j-selected").forEach(item => item.addEventListener("click", e => e.preventDefault()));
    };
}