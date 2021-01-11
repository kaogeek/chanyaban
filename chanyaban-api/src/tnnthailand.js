/*
 * @license Chanyaban v0.1
 * (c) 2020-2021 KaoGeek. http://kaogeek.dev
 * License: MIT. https://opensource.org/licenses/MIT
 * Author: oilNEWlio <apidech.s@absolute.co.th>
 */

var osmosis = require('osmosis');
// osmosis
//     // Do Google search
//     .get('https://www.tnnthailand.com/news/politics') 
//     .find('.section-bg-white:nth-of-type(3) .content-fullwidth .item')
//     .set({
//         'link': 'a@href',
//         title: ".item-title"
//     })
//     .data(data => { 
//         if (data.link) {            
//         console.log("data", data);
osmosis
    // Do Google search
    // .get(data.link) 
    .get('https://www.tnnthailand.com/content/25845')
    .find('#content')
    .set({
        // test: '.EntryBody'
        'title': '#read-title',
        'img': '#content-detail img@src',
        'content': "#content-detail",
        'date': ".date span",
    })
    .data(data => {
        // Each iteration, push the data into our array
        console.log("data", data);

    })
    .log(console.log)
    .error(console.log)
    .debug(console.log)
    //     }
    // })
    // .log(console.log)
    // .error(console.log)
    // .debug(console.log)
