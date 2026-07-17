/**
数据库的常用命令：
1.查看数据库 show databases;
2.查看当前数据库 select database();
3.创建数据库 create database 数据库名;
4.创建数据库 create database 数据库名 character set utf8mb4 collate utf8mb4_unicode_ci;
5.删除数据库 drop database 数据库名;
6.使用数据库 use 数据库名;
7.查看表 show tables;
8.查看表结构 describe 表名;
9.查看表数据 select * from 表名;
10.插入表数据 insert into 表名 （字段1，字段2，字段3）values (值1，值2，值3);
11.更新表数据 update 表名 set 字段1 = 值1 where 条件;
12.删除表数据 delete from 表名 where 条件;
13.创建表 create table 表名 (字段 类型 约束);
14.删除表 drop table 表名;
15.创建索引 create index 索引名 on 表名 (字段);
16.删除索引 drop index 索引名 on 表名;
17.创建视图 create view 视图名 as select * from 表名;
18.删除视图 drop view 视图名;
*/