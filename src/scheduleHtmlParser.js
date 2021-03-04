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
  // Generate CNU section time table
  let sectionTime = [];
  const startTime = ["08:00", "08:50", "09:40", "10:40", "11:30", "13:30", "14:20", "15:10", "16:00", "16:50", "18:30", "19:20", "20:10"];
  const endTime   = ["08:40", "09:30", "10:20", "11:20", "12:10", "14:10", "15:00", "15:50", "16:40", "17:30", "19:10", "20:00", "20:50"];
  for(let i=0; i<13; i++){
    sectionTime.push({
      "section": i + 1,
      "startTime": startTime[i],
      "endTime": endTime[i]
    });
  }

  // Parse html
  let result = [];
  let table = html.substring(html.indexOf("<tbody>"));
  let queue = table.split('</td>');

  for(i of queue) {
    // console.log(i);
    if(i.indexOf('id="') > -1  && i.indexOf('title="') > -1) {
      let td = i.split('id="')[1].split('"')[0]; // TD12_0
      let id = ~~td.split('TD')[1].split('_')[0]; // 12
      let chapters = ~~i.split('rowspan="')[1].split('"')[0];
      let title = i.split('title="')[1].split('"')[0];
      // console.log(~~ (id / 13) + 1, id % 13 + 1, chapters, title);
      let ans = classParser(title);
      let lastPosition = ans.position;
      ans.day = (~~ (id / 13) + 1).toString();
      ans.sections = sectionCount(id % 13 + 1, chapters);
      console.log(ans);
      result.push(ans);

      // Complicated Courses
      while(patch('(', title) > 3){
        title = nextClass(title);
        let ans = classParser(title);
        if(ans.position == "未知" && lastPosition != "未知") {
          ans.position =  lastPosition;
        }
        ans.day = (~~ (id / 13) + 1).toString();
        ans.sections = sectionCount(id % 13 + 1, chapters);
        console.log(ans);
        result.push(ans);
      }
    }
  }
  return {
    courseInfos: result,
    sectionTimes: sectionTime
  }
}