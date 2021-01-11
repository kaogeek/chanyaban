/*
 * @license Chanyaban v0.1
 * (c) 2020-2021 KaoGeek. http://kaogeek.dev
 * License: MIT. https://opensource.org/licenses/MIT
 * Author: oilNEWlio <apidech.s@absolute.co.th>
 */

var osmosis = require('osmosis');
// osmosis
//     // Do Google search
//     .get('https://www.ryt9.com/politics')
//     .find('div.content .is-three-fifths-tablet .list-block')
//     .set({
//         'link': 'a@href',
//         'details': '.desc'
//         // 'title': '.PostBody',
//         // 'date': ".footer .date"
//     })
//     .data(data => { 
//                 console.log("data", data);
osmosis
    // Do Google search
    // .get(data.link)
    .get('https://www.ryt9.com/s/cabt/3101940')
    .find('.section > .container')
    .set({
        'title': 'h1.title',
        // 'img': '.td-post-featured-image img@src',
        'content': ".content",
        'date': ".date-time",
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
