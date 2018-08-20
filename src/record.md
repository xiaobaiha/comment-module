# 评论模块记录

## comment类 私有/公开 变量/函数

## 选择器优化

- 层级原生选择器  
```javascript
var totalComment = document.getElementsByClassName("m-header")[0].getElementsByClassName("total_comment")[0];
var userAvatar = document.getElementsByClassName("m-reply")[0].getElementsByClassName("w-avatar")[0].getElementsByTagName("img")[0];
```
- querySelector  
```javascript
var totalComment = document.querySelector(".m-header .total_comment");
var userAvatar = document.querySelector(".m-reply .w-avatar img");
```

## 列表dom操作优化

- 循环插入  
- documentFragment

## 删除评论合适刷新分页器

- 总是刷新  
多操作dom
- 记录上一次总页面数目，与当前总数目不同时刷新  
多请求一次数据库

## 分页器绑定点击事件

- 绑定在可见页码以及上一页和下一页的按钮上   
重复绑定多次相同事件
- 绑定在分页器父级组件  
判断不可点击字内容并处理
```javascript
// 省略号不进行跳页
e.target.href && comment.jumpPage(e.target.href);
```
```javascript
if (/#\/page\/next/.test(href)) {
    // 页码为最后一页，不跳页
    currentPage <= totalPage && (currentPage += 1);
} else if (/#\/page\/previous/.test(href)) {
    // 页码为第一页，不跳页
    currentPage > 1 && (currentPage -= 1);
} else {
    currentPage = /#\/page\/(\d+)/.exec(href)[1] - 0; // page转成number
}
```