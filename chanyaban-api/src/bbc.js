var osmosis = require('osmosis');
osmosis
    // Do Google search
    .get('https://www.bbc.com/thai?xtor=SEC-3-[GOO]_A42B40C44D38E42F39G38wsmktgsmp-[77568793344]-[350979171353]-S-[%2B%E0%B8%81%E0%B8%B2%E0%B8%A3%E0%B9%80%E0%B8%A1%E0%B8%B7%E0%B8%AD%E0%B8%87]')
    // .find('aside.css-1xuuifk ,.eqom6ue5 > .container > .row > .col-md-3')
    // .paginate("button.pagination", 3)
    .find('.FirstSectionTopMargin-sc-1t555e8-0 .StoryPromoWrapper-sc-1dvfmi3-0 .Headline-sc-1dvfmi3-3')
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
        // // .get(data.link) 
        // .get('https://www.khaosod.co.th/politics/news_3684164') 
        // .find('main.content > article') 
        // .set({
        //     // test: '.EntryBody'
        //     'title': 'h1',
        //     'img': '.udsg__featured-image@src',
        //     'content': ".udsg__content p",
        //     'date': ".udsg__meta-wrap > .udsg__meta-left > udsg__meta",
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
