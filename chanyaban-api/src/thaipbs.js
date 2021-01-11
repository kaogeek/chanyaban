/*
 * @license Chanyaban v0.1
 * (c) 2020-2021 KaoGeek. http://kaogeek.dev
 * License: MIT. https://opensource.org/licenses/MIT
 * Author: oilNEWlio <apidech.s@absolute.co.th>
 */

var osmosis = require('osmosis');
// osmosis
//     // Do Google search
//     .get('https://news.thaipbs.or.th/politics')
//     // .find('section.news-section article.news-block')
//     // .find('#other-news-block article.news-block, .has-detail, .media-only-icon, .media-left-sm, .with-padding, .news-item-list, .news-other-block, .media-img-lg, .meta-text-left, .col-xs-12')
//     .find('#other-news-block article.news-block')
//     .set({
//         'link': 'a@href',
//         title: "h2"
//     })
//     .data(data => { 
//         if (data.link) {            
// console.log("data", data);
osmosis
    // Do Google search
    // .get(data.link) 
    .get('https://news.thaipbs.or.th/content/289462')
    .find('#content .content-article-detail > div.container > div.row > div.col-md-8')
    .set({
        // test: '.EntryBody'
        'title': 'h1.content-title',
        'img': '.img-responsive@src',
        'content': ".content-article-content, .entry-content",
        'date': ".content-meta",
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
