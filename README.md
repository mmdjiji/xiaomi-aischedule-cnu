# 小米小爱课程表适配-首都师范大学

[官方开发文档](https://ldtu0m3md0.feishu.cn/docs/doccnhZPl8KnswEthRXUz8ivnhb) 

![avatar](https://img.shields.io/badge/dynamic/json?color=blueviolet&label=%E4%BD%BF%E7%94%A8%E4%BA%BA%E6%95%B0&query=%24.usedNum&url=https%3A%2F%2Fopen-schedule.ai.xiaomi.com%2Fapi%2Fcoder%3Ftb_id%3D35887)

本项目在于为首都师范大学适配小爱课程表，支持从教务系统一键导入课表。

Author: [mmdjiji](https://mmdjiji.com). All rights reserved.

## src
[scheduleHtmlProvider](src/scheduleHtmlProvider.js)函数的作用是对课程页面进行预处理，截取课程信息的HTML片段，提供给[scheduleHtmlParser](src/scheduleHtmlParser.js)函数，它的返回值应该是一个小于 `1MB` 的字符串。

[scheduleHtmlParser](src/scheduleHtmlParser.js)函数的作用是从字符串中提取课程信息，它的返回值是一个符合约定格式的JSON字符串。