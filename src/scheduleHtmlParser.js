// scheduleHtmlParser.js
// Author: mmdjiji
// GitHub: https://github.com/mmdjiji/xiaomi-aischedule-cnu
// All rights reserved.

function weekParser(weekStr) {
  let result = [];
  let segments = weekStr.split(' ');
  for(i of segments){
    if(i.indexOf("-") != -1){
      if(i.indexOf("单") != -1){
        let arrange = i.substring(1).split("-");
        for(let j=~~arrange[0]; j<=~~arrange[1]; j++){
          if(j % 2 == 1){
            result.push(j);
          }
        }
      }else if(i.indexOf("双") != -1){
        let arrange = i.substring(1).split("-");
        for(let j=~~arrange[0]; j<=~~arrange[1]; j++){
          if(j % 2 == 0){
            result.push(j);
          }
        }
      }else{
        let arrange = i.split("-");
        for(let j=~~arrange[0]; j<=~~arrange[1]; j++){
          result.push(j);
        }
      }
    }else{
      result.push(~~i);
    }
  }
  return result;
}

function classParser(src) {
  let result = {};
  let parse = src.split("(");
  result.name = parse[0];
  result.teacher = parse[2].split(')')[0];
  if(parse[3].indexOf(',') > -1) {
    result.weeks = weekParser(parse[3].split(',')[0]);
    result.position = parse[3].split(',')[1].split(')')[0];
  } else {
    result.weeks = weekParser(parse[3].split(')')[0]);
    result.position = "未知";
  }
  return result;
}

function nextClass(src) {
  for(let i=0; i<3; i++)
    src = src.substring(src.indexOf(')')+1);
  src = src.substring(src.indexOf(';')+1);
  return src;
}

function patch(ch, str) {
  let retval = 0;
  for(i of str)
    if(i == ch)
      retval++;
  return retval;
}

function sectionCount(n, m) {
  let retval = [];
  for(let i=n; i<n+m; i++)
    retval.push({"section": i});
  return retval;
}

function scheduleHtmlParser(html) {
  // CNU section time
  const CNUstartTime = ["08:00", "08:50", "09:40", "10:40", "11:30", "13:30", "14:20", "15:10", "16:00", "16:50", "18:30", "19:20", "20:10"];
  const CNUendTime   = ["08:40", "09:30", "10:20", "11:20", "12:10", "14:10", "15:00", "15:50", "16:40", "17:30", "19:10", "20:00", "20:50"];
  let CNUsectionTime = [];
  for(let i=0; i<13; i++){
    CNUsectionTime.push({
      "section": i+1,
      "startTime": CNUstartTime[i],
      "endTime": CNUendTime[i]
    });
  }

  let result = [];
  let table = html.substring(html.indexOf("<tbody>"));
  let queue = table.split('</td>');
  let weekNow = 0, dayNow = 0;
  let arranged = [];

  for(let i=0; i<8; i++){
      arranged[i] = [];
      for(let j=0; j<14; j++)
        arranged[i][j] = false;
  }
  for(let i=0; i<queue.length; i++){
    if(queue[i].indexOf('<font size="2px">') != -1 || dayNow > 7){
      weekNow++;// = ~~(queue[i].substring(queue[i].indexOf('<font size="2px">'), queue[i].indexOf('</font>')).split(' ')[2]);
      dayNow = 0;

    }else if(queue[i].indexOf('title=') != -1){ //遍历有内容
      while(arranged[dayNow][weekNow]){ //如果占满了就往后安排
        dayNow++;
      }
      if(dayNow > 7) continue;
      
      let chapters = ~~queue[i].substring(queue[i].indexOf('rowspan=')).split('"')[1];
      let title = queue[i].substring(queue[i].indexOf('title=')).split('"')[1];
      
      for(let j=0; j<chapters; j++)
        arranged[dayNow][weekNow+j] = true;
      
      let cur = classParser(title);
      cur.day = dayNow.toString();
      cur.sections = sectionCount(weekNow, chapters);
      result.push(cur);
      //console.log(dayNow, weekNow, cur);

      if(patch('(', title) > 3){
        cur = classParser(nextClass(title));
        cur.day = dayNow.toString();
        cur.sections = sectionCount(weekNow, chapters);
        result.push(cur);
        //console.log(dayNow, weekNow, cur);
      }
    }
    dayNow++;
  }
  return {
    courseInfos: result,
    sectionTimes: CNUsectionTime
  }
}