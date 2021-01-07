var osmosis = require('osmosis');
osmosis
    // Do Google search
    .get('https://www.treasury.go.th/th/demo-rss-feeds/view/MDY1cDBzNnM0NHIyb3Ezc3E2NnEyNDk0cDRyOTQzcjQ0') 
    .find('.panel-group-continuous > div.panel') 
    .set({ 
        // test: ".panel-heading"
        'link': '.media-body a@href'
        // title: ".main-headline"
    })
    .data(data => { 
        if (data.link) {            
        console.log("data", data);
        // osmosis
        // // Do Google search
        // // .get(data.link) 
        // .get('https://www.tnnthailand.com/content/25845') 
        // .find('#content') 
        // .set({
        //     // test: '.EntryBody'
        //     'title': '#read-title',
        //     'img': '#content-detail img@src',
        //     'content': "#content-detail",
        //     'date': ".date span",
        // })
        // .data(data => {
        //     // Each iteration, push the data into our array
        //     console.log("data", data);
    
        // })
        // .log(console.log)
        // .error(console.log)
        // .debug(console.log)
        }
    })
    .log(console.log)
    .error(console.log)
    .debug(console.log)
