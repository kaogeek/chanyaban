var osmosis = require('osmosis');
osmosis 
    .get('https://news.ch7.com/label/%E0%B8%82%E0%B9%88%E0%B8%B2%E0%B8%A7%E0%B8%81%E0%B8%B2%E0%B8%A3%E0%B9%80%E0%B8%A1%E0%B8%B7%E0%B8%AD%E0%B8%87') 
    .find('.start-cat-list .category-list-container .shadow-sm') 
    .set({ 
        // test: ".panel-heading"
        'link': 'a@href',
        title: "a@title"
    })
    .data(data => { 
        if (data.link) {            
//         console.log("data", data);
        osmosis 
        .get(data.link) 
        // .get('https://news.ch7.com/detail/398355') 
        .find('body') 
        .set({ 
            'title': '#myHeader h1',
            'img': 'img@src',
            'content': ".main-description", 
            'date': '#myHeader .card-footer .det-date'
        })
        .data(data => {
            // Each iteration, push the data into our array
            console.log("data", data);
    
        })
        .log(console.log)
        .error(console.log)
        .debug(console.log)
        }
    })
    .log(console.log)
    .error(console.log)
    .debug(console.log)
