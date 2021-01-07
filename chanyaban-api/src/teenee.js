var osmosis = require('osmosis');

const moment = require('moment/moment');

let test= moment("วันเสาร์ ที่ 22 กุมภาพันธ์ 63 เวลา 02:10 น.","dddd ที่ DD MMMM YY เวลา HH:mm",'th').toDate();
console.log(test);
console.log(moment(test).locale("th").format("dddd ที่ D MMMM YY เวลา HH:mm น."));
console.log(moment(test).fromNow());
// osmosis
//     .get('http://tnews.teenee.com/index.htm?catid=1&foldername=politic&cat_name=%E0%B8%82%E0%B9%88%E0%B8%B2%E0%B8%A7%E0%B8%81%E0%B8%B2%E0%B8%A3%E0%B9%80%E0%B8%A1%E0%B8%B7%E0%B8%AD%E0%B8%87')
//     // .find('#showNewsList .hotnews .col-sm-6') 
//     .find('#fh5co-main .item')
//     .set({
//         // test: "#showNewsList"
//         'link': '.animate-box a@href',
//         // title: ".animate-box a@title"
//     })
//     .data(data => {
//         if (data.link) {
//             // console.log("data", data);
//             osmosis
//                 .get(encodeURI(data.link))
//                 // .get(encodeURI('http://tnews.teenee.com/politic/มงคลกิตติ์-ชง-บุ๋ม-ปนัดดา-นั่งที่ปรึกษากมธ.วิสามัญ-ป้องกันข่มขืนฯ--ชี้+157966')) 
//                 .find('.container > div.col-xs-12:nth-of-type(1)')
//                 .set({
//                     'title': '#main h1.entry-title',
//                     'img': '#main .img-responsive@src',
//                     'content': "#main #Blog1 > div:nth-of-type(3)",
//                     'date': 'abbr.published'
//                 })
//                 .data(data => {
//                     // Each iteration, push the data into our array
//                     data.img = "http://tnews.teenee.com/politic/" + data.img;
//                     console.log("data", data);

//                 })
//                 .log(console.log)
//                 .error(console.log)
//                 .debug(console.log)
//         }
//     })
//     .log(console.log)
//     .error(console.log)
//     .debug(console.log)

// // osmosis
// //     // Do Google search
// //     .get(encodeURI('http://tnews.teenee.com/index.htm?catid=1&foldername=politic&cat_name=ข่าวการเมือง'))
// //     // .paginate(".wp-pagenavi a.nextpostslink[href]", 100)
// //     .find('#fh5co-main .item')
// //     .set({
// //         'link': '.animate-box a@href'
// //     })
// //     // .follow(encodeURI(".animate-box a@href"))
// //     // .find('.container > div.col-xs-12:nth-of-type(1)')
// //     // .set({
// //     //     'title': '#main h1.entry-title',
// //     //     'img': '#main .img-responsive@src',
// //     //     'content': "#main #Blog1 > div:nth-of-type(3)",
// //     //     'date': 'abbr.published'
// //     // })
// //     .data(data => { 
// //         console.log(data);
// //         console.log("done.");
// //     })
// //     // .log(console.log)
// //     .error(console.log)
// //     .debug(console.log)