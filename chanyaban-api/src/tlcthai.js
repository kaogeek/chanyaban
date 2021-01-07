var osmosis = require('osmosis');
osmosis
    // Do Google search
    .get('https://news.tlcthai.com/category/politics') 
    .find('#main .row .col-12:nth-of-type(2) .content-card') 
    .set({ 
        // test: ".panel-heading"
        'link': 'a@href',
        title: "a@title"
    })
    .data(data => { 
        if (data.link) {            
        // console.log("data", data);
        osmosis
        // Do Google search
        .get(data.link) 
        // .get('https://news.tlcthai.com/politics/1008731.html') 
        .find('#main') 
        .set({ 
            'title': '.entry-header h1',
            'img': '.entry-content img@src',
            'content': ".entry-content",
            'date': "time.entry-date",
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
