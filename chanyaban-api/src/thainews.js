/*
 * @license Chanyaban v0.1
 * (c) 2020-2021 KaoGeek. http://kaogeek.dev
 * License: MIT. https://opensource.org/licenses/MIT
 * Author: oilNEWlio <apidech.s@absolute.co.th>
 */

var osmosis = require('osmosis');
osmosis
    // Do Google search
    .get('https://tna.mcot.net/special_cat/%E0%B8%81%E0%B8%B2%E0%B8%A3%E0%B9%80%E0%B8%A1%E0%B8%B7%E0%B8%AD%E0%B8%87')
    // .find('aside.css-1xuuifk ,.eqom6ue5 > .container > .row > .col-md-3')
    // .paginate("button.pagination", 3)
    .find('.newsupdate-box > .newsupdate-item:first-of-type')
    // .find('.container, .ng-scope .newsupdate-item .col-md-3')
    // .delay(5000)
    // .find('aside')
    .set({
        'link': 'a@href',
        // 'title': '.PostBody',
        // 'date': ".footer .date"
    })
    .data(data => {
        console.log("data", data);
        // osmosis
        // // Do Google search
        // .get(data.link) 
        // // .get('http:////www.sanook.com/news/8045059/') 
        // .find('.EntryContent') 
        // .set({
        //     test: '.EntryBody'
        //     // 'title': '.title',
        //     // 'img': '.thumbnail > img@src',
        //     // 'content': ".ReaderWrap",
        //     // 'date': "time"
        // })
        // .data(data => {
        //     // Each iteration, push the data into our array
        //     console.log("data", data);

        // })
        // .log(console.log)
        // .error(console.log)
        // .debug(console.log) 
    })
    .log(console.log)
    .error(console.log)
    .debug(console.log)
