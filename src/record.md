# 评论模块记录

## comment类 私有/公开 变量/函数

## 选择器优化

### 层级原生选择器
```javascript
var totalComment = document.getElementsByClassName("m-header")[0].getElementsByClassName("total_comment")[0];
var userAvatar = document.getElementsByClassName("m-reply")[0].getElementsByClassName("w-avatar")[0].getElementsByTagName("img")[0];
```
### querySelector
```javascript
var totalComment = document.querySelector(".m-header .total_comment");
var userAvatar = document.querySelector(".m-reply .w-avatar img");
```

## 列表dom操作优化

### 循环插入
### documentFragment

## 删除评论合适刷新分页器

### 总是刷新 
多操作dom
### 记录上一次总页面数目，与当前总数目不同时刷新
多请求一次数据库