/*
 * @license Chanyaban v0.1
 * (c) 2020-2021 KaoGeek. http://kaogeek.dev
 * License: MIT. https://opensource.org/licenses/MIT
 * Author: oilNEWlio <apidech.s@absolute.co.th>
 */

var osmosis = require('osmosis');
osmosis
    // Do Google search
    .get('https://www.posttoday.com/politic')
    // .find('aside.css-1xuuifk ,.eqom6ue5 > .container > .row > .col-md-3')
    .paginate("a.page-link[href]", 1)
    .find('.section-all .list-article .box-list-news')
    // .find('.container, .ng-scope .newsupdate-item .col-md-3')
    // .delay(5000)
    // .find('aside')
    .set({
        'link': 'a@href',
        // 'title': '.PostBody',
        // 'date': ".footer .date"
    })
    .data(data => {
        // console.log("data", data);
        osmosis
            // Do Google search
            .get(data.link)
            // .get('https://www.posttoday.com/politic/news/616585') 
            .find('.section-article > article')
            .set({
                // test: '.EntryBody'
                'title': 'h2',
                'img': '.img-full img@src',
                'content': ".article-content",
                'date': " ",
            })
            .data(data => {
                // Each iteration, push the data into our array
                console.log("data", data);

            })
            .log(console.log)
            .error(console.log)
            .debug(console.log)
    })
    .log(console.log)
    .error(console.log)
    .debug(console.log)
