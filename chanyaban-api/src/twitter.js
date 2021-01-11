/*
 * @license Chanyaban v0.1
 * (c) 2020-2021 KaoGeek. http://kaogeek.dev
 * License: MIT. https://opensource.org/licenses/MIT
 * Author: oilNEWlio <apidech.s@absolute.co.th>
 */

const moment = require('moment/moment');
var osmosis = require('osmosis');
let axios = require('axios');
let cheerio = require('cheerio');

// async function runScrapingTwitter(source) {
//     return new Promise((resolve, reject) => {
//         let listNews = [];
//         axios.get(source.link).then(async (response) => {
//             if (response.status === 200) {
//                 const html = response.data;
//                 const $ = cheerio.load(html);
//                 console.log($.html);
//                 $('div.tweet').each(function (i, elem) {
//                     var tags = [];
//                     $(this).find('div.js-tweet-text-container a').each(function (i, elem) {
//                         if ($(this).text().trim().includes("#")) {
//                             var tag = $(this).text().trim().replace("#", '');
//                             tags.push(tag);
//                         }
//                     });
//                     var post = $(this).find('div.js-tweet-text-container p').text().trim();
//                     var postSplit = post.split("\n");
//                     var title = postSplit[0];
//                     if (title.length > 100) {
//                         title = post.substring(0, 100);
//                     }
//                     listNews.push({
//                         title: title,
//                         content: $(this).find('div.js-tweet-text-container p').text().trim().replace("\n", ""),
//                         date: new Date(Number($(this).find('a.tweet-timestamp.js-permalink.js-nav.js-tooltip').find('span').attr('data-time-ms'))),
//                         link: "https://twitter.com/" + $(this).find("a.tweet-timestamp.js-permalink.js-nav.js-tooltip").attr('href'),
//                         tags: tags,
//                         keywords: {},
//                         img: "",
//                         source: source._id,
//                         createdDate: new Date(),
//                         modifiedDate: new Date()
//                     });
//                 });
//                 console.log("listNews: ", listNews);
//                 await Source.findByIdAndUpdate(source._id, { isScraping: false });
//                 for (const news of listNews) {
//                     if (news.link) {
//                         await AddNews(news);
//                     }
//                 }
//                 console.log("final done.");
//                 resolve(listNews);
//             } else {
//                 reject(response.status);
//             }
//         }, async (error) => {
//             console.log(error);
//             await Source.findByIdAndUpdate(source._id, { isScraping: false });
//             reject(error);
//         });
//     });
// }

// axios.get('https://twitter.com/MFPThailand')
//     .then((response) => {
//         if (response.status === 200) {
//             const html = response.data;
//             const $ = cheerio.load(html);
//             console.log($.html());
//             let devtoList = [];
//             $('div').each(function(i, elem) {
//                 console.log($(this).text());
//             });
//             // $('div.tweet').each(function (i, elem) {
//             //     // $('div.js-tweet-text-container').each(function (i, elem) {
//             //     // devtoList[i] = $(this).find('a').attr('href');
//             //     // devtoList[i] = $(this).find('a').attr('href');
//             //     var tags = [];
//             //     $(this).find('div.js-tweet-text-container a').each(function (i, elem) {
//             //         if ($(this).text().trim().includes("#")) {
//             //             var tag = $(this).text().trim().replace("#", '');
//             //             tags.push(tag);
//             //         }
//             //     });
//             //     var post = $(this).find('div.js-tweet-text-container p').text().trim();
//             //     var postSplit = post.split("\n");
//             //     var title = postSplit[0];
//             //     if (title.length > 100) {
//             //         postSplit = post.split(" ");
//             //         title = postSplit[0];
//             //     }
//             //     // console.log("title: ",title);
//             //     devtoList[i] = {
//             //         title: title,
//             //         content: $(this).find('div.js-tweet-text-container p').text().trim().replace("\n", ""),
//             //         date: new Date(Number($(this).find('a.tweet-timestamp.js-permalink.js-nav.js-tooltip').find('span').attr('data-time-ms'))),
//             //         link: "https://twitter.com/"+$(this).find("a.tweet-timestamp.js-permalink.js-nav.js-tooltip").attr('href'), 
//             //         tags: tags,
//             //     }
//             // });
//             console.log("devtoList: ", devtoList);

//         }
//     }, (error) => console.log(err));

// osmosis
//     // Do Google search
//     .get('https://twitter.com/MFPThailand')
//     .find('body table.tweet')
//     .set({
//         'content': '.tweet-container .tweet-text',
//         'date': '.tweet-header .timestamp',
//         'link': '.tweet-header .timestamp > a@href',
//         'tags': ['.tweet-container .tweet-text a.twitter-hashtag']
//     })
//     .data(data => {
//         var contentSplit = data.content.split("\n");
//         data.title = contentSplit[0];
//         if (data.title.length > 100) {
//             data.title = data.content.substring(0, 100);
//         }
//         data.link = "https://twitter.com/" + data.link;
//         console.log("data", data);
//     })
//     .log(console.log)
//     .error(console.log)
//     .debug(console.log)

osmosis
    // Do Google search
    .get('https://twitter.com/MFPThailand')
    .find('body table.tweet')
    .set({
        'link': '.tweet-header .timestamp > a@href',
    })
    .follow('.tweet-header .timestamp > a@href')
    .set({
        'link': '.main-tweet .tweet-header .timestamp > a@href',
        'content': '.main-tweet .tweet-content .tweet-text',
        'date': '.main-tweet div.metadata',
        'tags': ['.main-tweet .tweet-content .tweet-text a.twitter-hashtag']
    })
    .data(data => {
        var contentSplit = data.content.split("\n");
        data.title = contentSplit[0];
        if (data.title.length > 100) {
            data.title = data.content.substring(0, 100);
        }
        data.link = "https://twitter.com/" + data.link;
        if (data.date) {
            data.dateFormat = moment(data.date, "hh:mm a - DD MMM YYYY").toDate();
        }
        console.log("data", data);
    })
    .log(console.log)
    .error(console.log)
    .debug(console.log)

// osmosis.config('keep_data', true)
// osmosis
// // .get('https://twitter.com/MFPThailand')
// .get('https://twitter.com/Chaithawat_MFP/status/1273806321494589440')
// .then(function(context, data, next) {
//   console.log("osmosis");
// //   console.log(data);
//   console.log(context.response.data);
// //   console.log(next);
// })
