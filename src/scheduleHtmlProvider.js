// scheduleHtmlProvider.js
// Author: mmdjiji
// GitHub: https://github.com/mmdjiji/xiaomi-aischedule-cnu
// All rights reserved.

function scheduleHtmlProvider(iframeContent = "", frameContent = "", dom = document) {
  const iframeMain = dom.getElementById("iframeMain").contentWindow;
  const table = iframeMain.document.getElementById('manualArrangeCourseTable').innerHTML;
  return table;
}