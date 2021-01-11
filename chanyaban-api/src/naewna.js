/*
 * @license Chanyaban v0.1
 * (c) 2020-2021 KaoGeek. http://kaogeek.dev
 * License: MIT. https://opensource.org/licenses/MIT
 * Author: oilNEWlio <apidech.s@absolute.co.th>
 */

var osmosis = require('osmosis');
osmosis
    .get('https://www.naewna.com/politics')
    // .find('#showNewsList .hotnews .col-sm-6') 
    .find('.contents:nth-of-type(1)')
    .set({
        test: "#showNewsList"
        // 'link': 'a@href',
        // title: "h3"
    })
    .data(data => {
        // if (data.link) {            
        console.log("data", data);
        // osmosis 
        // .get(data.link) 
        // // .get('https://news.ch7.com/detail/398355') 
        // .find('body') 
        // .set({ 
        //     'title': '#myHeader h1',
        //     'img': 'img@src',
        //     'content': ".main-description", 
        //     'date': '#myHeader .card-footer .det-date'
        // })
        // .data(data => {
        //     // Each iteration, push the data into our array
        //     console.log("data", data);

        // })
        // .log(console.log)
        // .error(console.log)
        // .debug(console.log)
        // }
    })
    .log(console.log)
    .error(console.log)
    .debug(console.log)
