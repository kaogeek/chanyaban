var osmosis = require('osmosis');
osmosis
    // Do Google search
    .get('http://www.lokwannee.com/web2013/?cat=164') 
    .find('.home-widget') 
    .set({
        test: "h3"
        // 'link': '.category3-text a@href',
        // title: ".main-headline"
    })
    .data(data => { 
        if (data.link) {            
//         console.log("data", data);
        osmosis
        // Do Google search
        .get(data.link) 
        // .get('https://www.tnnthailand.com/content/25845') 
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
        }
    })
    .log(console.log)
    .error(console.log)
    .debug(console.log)
