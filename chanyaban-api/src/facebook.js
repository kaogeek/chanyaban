/*
 * @license Chanyaban v0.1
 * (c) 2020-2021 KaoGeek. http://kaogeek.dev
 * License: MIT. https://opensource.org/licenses/MIT
 * Author: oilNEWlio <apidech.s@absolute.co.th>
 */

const Moment = require('moment/moment');
const MomentRange = require('moment-range');
const moment = MomentRange.extendMoment(Moment);
let axios = require('axios');
let cheerio = require('cheerio');
var osmosis = require('osmosis');

axios.get('https://www.facebook.com/pg/MoveForwardPartyThailand/posts/?ref=page_internal')
    .then((response) => {
        if (response.status === 200) {
            const html = response.data;
            const $ = cheerio.load(html);
            let devtoList = [];
            // console.log($('#pagelet_timeline_main_column div._1dwg._1w_m._q7o').text());

            $('#pagelet_timeline_main_column div._1dwg._1w_m._q7o').each(function (i, elem) {
                // $('div.js-tweet-text-container').each(function (i, elem) {
                // devtoList[i] = $(this).find('a').attr('href');
                // devtoList[i] = $(this).find('a').attr('href');
                var tags = [];
                $(this).find('.text_exposed_show ._58cm').each(function (i, elem) {
                    if ($(this).text().trim() !== "") {
                        tags.push($(this).text().trim());
                    }
                    // if ($(this).text().trim().includes("#")) {
                    //     var tag = $(this).text().trim().replace("#", '');
                    //     tags.push(tag);
                    // }
                });
                var post = $(this).find('.userContent').text().trim();
                // var postSplit = post.split("\n");
                var postSplit = post.split("]");
                var title = postSplit[0] + "]";
                // if (title.length > 100) {
                //     postSplit = post.split(" ");
                //     title = postSplit[0];
                // }
                // console.log("title: ", title);
                devtoList[i] = {
                    title: title,
                    content: $(this).find('.userContent').text().trim(),
                    date: new Date(Number($(this).find('div._5pcp._5lel._2jyu._232_ abbr').attr('data-utime') * 1000)),
                    link: "https://facebook.com/" + $(this).find("a._5pcq").attr('href'),
                    tags: tags,
                }
                if (devtoList[i].date.toString() === "Invalid Date") {
                    devtoList[i].date = new Date();
                }
            });
            console.log("devtoList: ", devtoList);

        }
    }, (error) => console.log(err));
// https://www.facebook.com/MoveForwardPartyThailand/photos/a.104388194526543/149198810045481/?type=3&__tn__=-R

// osmosis
//     // Do Google search
//     .get('https://www.facebook.com/pg/MoveForwardPartyThailand/posts/?ref=page_internal')
//     // .find("#pagelet_timeline_main_column div._427x .userContentWrapper")
//     .find("#pagelet_timeline_main_column div._1dwg._1w_m._q7o")
//     .set({
//         date: 'div._5pcp._5lel._2jyu._232_ abbr@data-utime',
//         link: 'a._5pcq@href',
//         // img: '.uiScaledImageContainer img@src',
//         tags: ['.text_exposed_show ._58cm'],
//         content: '.userContent'
//     })
//     .data(news => {
//         news.keywords = {};
//         // news.source = source._id;
//         link = news.link.split("?");
//         news.link = link[0];
//         news.title = news.content.substring(0, 50);
//         news.img = "";
//         news.date = new Date(Number(news.date * 1000));
//         news.createdDate = new Date();
//         news.modifiedDate = new Date();
//         // console.log("news.date: ", news.date);
//         if (news.date.toString() === "Invalid Date") {
//             news.date = new Date();
//         }
//         console.log("news", news.link);
//     })
//     .log(console.log)
//     .error(console.log)
//     .debug(console.log)
