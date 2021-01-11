/*
 * @license Chanyaban v0.1
 * (c) 2020-2021 KaoGeek. http://kaogeek.dev
 * License: MIT. https://opensource.org/licenses/MIT
 * Author: oilNEWlio <apidech.s@absolute.co.th>
 */

var osmosis = require('osmosis');
// osmosis
//     // Do Google search
//     .get('https://www.bangkokbiznews.com/politics/list') 
//     .paginate(".pagination_block > ul > li:last(2) > a[href]",1)
//     .find('.section_6 > .read_post_list > .vertical_list > .clearfix > .scale_image_container')
//     .set({
//         'link': 'a@href', 
//         // 'date': ".footer .date"
//     })
//     .data(data => {
//                 console.log("data", data);
osmosis
    // Do Google search
    // .get(data.link)
    .get('https://www.bangkokbiznews.com/news/detail/891817?utm_source=category&utm_medium=internal_referral&utm_campaign=politics')
    .find('.content > .container')
    .set({
        // test: '.EntryBody'
        'title': 'h1.section_title_medium_var2',
        'img': '.text_post_block img@src',
        // 'content': "div.text_post_block .text-read",
        'content': ["div.text_post_block .text-read > p", "div.text_post_block .text-read > p .row p"],
        // 'content': ["div.text_post_block .text-read > p"],
        // 'content': ["div.text_post_block .text-read > p .row p"],
        'date': ".event_date",
        'tags': [".widget_tags .btn-tags"],
    })
    .data(data => {
        // Each iteration, push the data into our array
        console.log("data", data);

    })
    .log(console.log)
    .error(console.log)
    .debug(console.log)
    // })
    // .log(console.log)
    // .error(console.log)
    // .debug(console.log)
