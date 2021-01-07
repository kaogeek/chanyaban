const compression = require('compression');
const cors = require('cors')
const morgan = require('morgan');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const Moment = require('moment/moment');
const MomentRange = require('moment-range');
const moment = MomentRange.extendMoment(Moment);
const express = require('express');
const errorHandler = require('errorhandler');
const app = express()
const PORT = process.env.PORT || 7000;
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const osmosis = require('osmosis');
const Keyword = require("../models/Keyword")
const Source = require("../models/Source")
const SourceType = require("../models/SourceType")
const Journalist = require("../models/Journalist")
const Persona = require("../models/Persona")
const PersonaType = require("../models/PersonaType")
const News = require("../models/News")
const User = require("../models/User")
const Trend = require("../models/Trend")
const NewsCategory = require("../models/NewsCategory")
const NewsAgency = require("../models/NewsAgency")
const Country = require("../models/Country")
const Config = require("../models/Config")
const cron = require('node-cron');
const mongoConnection = 'mongodb://<hostName>:27017/<dbName>';
var cluster = require('cluster');
var numCPUs = require('os').cpus().length;

var counterTime = 0;

mongoose.connect(mongoConnection, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
});

mongoose.connection.on('error', err => {
    console.error('MongoDB error', err)
});

function getBeforeTodayRange(days) {
    const today = moment().utc();
    const lastDay = today.clone().toDate();
    lastDay.setHours(23);
    lastDay.setMinutes(59);
    lastDay.setSeconds(59);
    const firstDay = today.clone().subtract(days, 'days').toDate();
    firstDay.setHours(0);
    firstDay.setMinutes(0);
    firstDay.setSeconds(0);
    const result = [firstDay, lastDay];
    return result;
}

async function getConfigTrending() {
    var config = {
        config1: await Config.findOne({ name: "config.trend.var1" }),
        config2: await Config.findOne({ name: "config.trend.var2" }),
        config3: await Config.findOne({ name: "config.trend.var3" }),
        config4: await Config.findOne({ name: "config.trend.var4" }),
        config5: await Config.findOne({ name: "config.trend.var5" }),
        config6: await Config.findOne({ name: "config.trend.var6" }),
        config7: await Config.findOne({ name: "config.trend.var7" })
    }
    if (!config.config1) {
        config.config1 = 72;
        const configSave = new Config({
            name: "config.trend.var1",
            type: "number",
            value: 72,
            createdDate: new Date(),
            modifiedDate: new Date()
        });
        configSave.save();
    } else {
        config.config1 = config.config1 && config.config1.value ? config.config1.value : 72;
    }
    if (!config.config2) {
        config.config2 = 0.5;
        const configSave = new Config({
            name: "config.trend.var2",
            type: "number",
            value: 0.5,
            createdDate: new Date(),
            modifiedDate: new Date()
        });
        configSave.save();
    } else {
        config.config2 = config.config2 && config.config2.value ? config.config2.value : 0.5;
    }
    if (!config.config3) {
        config.config3 = 1.08;
        const configSave = new Config({
            name: "config.trend.var3",
            type: "number",
            value: 1.08,
            createdDate: new Date(),
            modifiedDate: new Date()
        });
        configSave.save();
    } else {
        config.config3 = config.config3 && config.config3.value ? config.config3.value : 1.08;
    }
    if (!config.config4) {
        config.config4 = 1;
        const configSave = new Config({
            name: "config.trend.var4",
            type: "number",
            value: 1,
            createdDate: new Date(),
            modifiedDate: new Date()
        });
        configSave.save();
    } else {
        config.config4 = config.config4 && config.config4.value ? config.config4.value : 1;
    }
    if (!config.config5) {
        config.config5 = 3500;
        const configSave = new Config({
            name: "config.trend.var5",
            type: "number",
            value: 3500,
            createdDate: new Date(),
            modifiedDate: new Date()
        });
        configSave.save();
    } else {
        config.config5 = config.config5 && config.config5.value ? config.config5.value : 3500;
    }
    if (!config.config6) {
        config.config6 = 1;
        const configSave = new Config({
            name: "config.trend.var6",
            type: "number",
            value: 1,
            createdDate: new Date(),
            modifiedDate: new Date()
        });
        configSave.save();
    } else {
        config.config6 = config.config6 && config.config6.value ? config.config6.value : 1;
    }
    if (!config.config7) {
        config.config7 = 30;
        const configSave = new Config({
            name: "config.trend.var7",
            type: "number",
            value: 30,
            createdDate: new Date(),
            modifiedDate: new Date()
        });
        configSave.save();
    } else {
        config.config7 = config.config7 && config.config7.value ? config.config7.value : 30;
    }
    return config;
}

async function formulaTrend(lastDay) {
    const config = await getConfigTrending();
    let formulaCount = { $add: [{ $multiply: [config.config7, { "$cond": [{ $gt: ["$keywords.countTitle", null] }, "$keywords.countTitle", 0] }] }, "$keywords.countContent"] };
    let formulaPow = { $pow: [config.config3, { $subtract: [{ $divide: [{ $toDouble: { $subtract: [new Date(lastDay).getTime(), { $toDouble: "$date" }] } }, 3600000] }, config.config2] }] };
    let formulaTrend = {
        $add: [
            {
                $divide: [
                    {
                        $multiply: [
                            config.config1, // 72
                            {
                                "$cond": [
                                    { $gt: [formulaCount, 0] },
                                    formulaCount,
                                    config.config6
                                ]
                            },
                        ]
                    },
                    formulaPow
                ]
            },
            config.config4 // 1
        ]
    }
    return {
        "$cond": [
            {
                $gte: [
                    formulaTrend,
                    config.config5 // 1000
                ]
            },
            config.config5,
            formulaTrend
        ]
    }
}

async function getConfigTrendingLength() {
    var config = {
        config1: await Config.findOne({ name: "config.trend.length.var1" }),
        config2: await Config.findOne({ name: "config.trend.length.var2" }),
        config3: await Config.findOne({ name: "config.trend.length.var3" }),
        config4: await Config.findOne({ name: "config.trend.length.var4" }),
        config5: await Config.findOne({ name: "config.trend.length.var5" })
    }
    if (!config.config1) {
        config.config1 = 100;
        const configSave = new Config({
            name: "config.trend.length.var1",
            type: "number",
            value: 100,
            createdDate: new Date(),
            modifiedDate: new Date()
        });
        configSave.save();
    } else {
        config.config1 = config.config1 && config.config1.value ? config.config1.value : 100;
    }
    if (!config.config2) {
        config.config2 = 100;
        const configSave = new Config({
            name: "config.trend.length.var2",
            type: "number",
            value: 100,
            createdDate: new Date(),
            modifiedDate: new Date()
        });
        configSave.save();
    } else {
        config.config2 = config.config2 && config.config2.value ? config.config2.value : 100;
    }
    if (!config.config3) {
        config.config3 = 1;
        const configSave = new Config({
            name: "config.trend.length.var3",
            type: "number",
            value: 1,
            createdDate: new Date(),
            modifiedDate: new Date()
        });
        configSave.save();
    } else {
        config.config3 = config.config3 && config.config3.value ? config.config3.value : 1;
    }
    if (!config.config4) {
        config.config4 = 1.45;
        const configSave = new Config({
            name: "config.trend.length.var4",
            type: "number",
            value: 1.45,
            createdDate: new Date(),
            modifiedDate: new Date()
        });
        configSave.save();
    } else {
        config.config4 = config.config4 && config.config4.value ? config.config4.value : 1.45;
    }
    if (!config.config5) {
        config.config5 = 0.02;
        const configSave = new Config({
            name: "config.trend.length.var5",
            type: "number",
            value: 0.02,
            createdDate: new Date(),
            modifiedDate: new Date()
        });
        configSave.save();
    } else {
        config.config5 = config.config5 && config.config5.value ? config.config5.value : 0.02;
    }
    return config;
}

async function formulaTrendLength(lastDay) {
    const config = await getConfigTrendingLength();
    let strLenCP = {
        "$cond": [
            { $gt: ["$keywordDetail", null] },
            { $strLenCP: "$keywordDetail.name" },
            0
        ]
    }
    let formulaPow = { $pow: [config.config4, { $add: [strLenCP, config.config5] }] };
    let formulaTrendLength = {
        $add: [
            {
                $divide: [
                    config.config2, // 100
                    formulaPow
                ]
            },
            config.config3 // 1
        ]
    }
    return {
        $divide: [
            await formulaTrend(lastDay),
            {
                "$cond": [
                    {
                        $gte: [
                            formulaTrendLength,
                            config.config1 // 1000
                        ]
                    },
                    config.config1,
                    formulaTrendLength
                ]
            }
        ]
    }
}

async function getConfigTrendingBonus() {
    var config1 = await Config.findOne({ name: "config.trend.bonus.var1" });
    var config2 = await Config.findOne({ name: "config.trend.bonus.var2" });
    var config3 = await Config.findOne({ name: "config.trend.bonus.var3" });
    var config4 = await Config.findOne({ name: "config.trend.bonus.var4" });
    var config5 = await Config.findOne({ name: "config.trend.bonus.var5" });
    config = {
        config1: config1 && config1.value ? config1.value : 10,
        config2: config2 && config2.value ? config2.value : 10,
        config3: config3 && config3.value ? config3.value : 1,
        config4: config4 && config4.value ? config4.value : 1.8,
        config5: config5 && config5.value ? config5.value : 0
    };
    return config;
}

async function formulaTrendBonus(lastDay) {
    const config = await getConfigTrendingBonus();
    let formulaTrendBonus = {
        $add: [
            {
                $divide: [
                    config.config2, //10
                    {
                        $pow: [
                            config.config4, // 1.8
                            {
                                $subtract: [
                                    {
                                        $divide: [
                                            {
                                                $toDouble: {
                                                    $subtract: [
                                                        new Date(lastDay).getTime(),
                                                        {
                                                            "$cond": [
                                                                { "$gt": ["$entity", null] },
                                                                {
                                                                    "$cond": [
                                                                        { "$lte": ["$entity.createdDate", { $min: "$keywordDetail.createdDate" }] },
                                                                        { $toDouble: "$entity.createdDate" },
                                                                        { $toDouble: { $min: "$keywordDetail.createdDate" } }
                                                                    ]
                                                                },
                                                                { $toDouble: "$date" }
                                                            ]
                                                        }
                                                    ]
                                                }
                                            },
                                            86400000
                                        ]
                                    },
                                    config.config5 // 0
                                ]
                            }
                        ]
                    }
                ]
            },
            config.config3 // 1
        ]
    }
    return {
        $multiply: [
            "$score",
            {
                "$cond": [
                    {
                        $gte: [
                            formulaTrendBonus,
                            config.config1 // 1
                        ]
                    },
                    config.config1, // 1
                    formulaTrendBonus
                ]
            }
        ]
    }
}

async function cronJobTrendHome() {
    console.log('running cronJobTrendHome');
    let range = getBeforeTodayRange(3);
    let matchDate = { $gt: new Date(range[0]), $lte: new Date(range[1]) };
    let match = { date: matchDate };
    var configLimit = await Config.findOne({ name: "config.trend.limit" });
    configLimit = configLimit && configLimit.value ? configLimit.value : 300

    const keywordSearch = await Keyword.aggregate([
        { $match: { useDate: matchDate } },
        {
            $match: {
                $or: [
                    { status: { $eq: "trend" } },
                    { status: { $eq: "unclassified" } }
                ]
            }
        },
        {
            $lookup: {
                from: "personas",
                localField: "_id",
                foreignField: "keywords",
                as: "entity"
            }
        },
        { "$unwind": { path: "$entity", preserveNullAndEmptyArrays: true } },
        {
            $group: {
                _id: {
                    "$cond": [
                        { "$gt": ["$entity", null] },
                        "$entity._id",
                        "$_id",
                    ]
                },
                data: {
                    $first: {
                        "$cond": [
                            { "$gt": ["$entity", null] },
                            "$entity",
                            "$$ROOT"
                        ]
                    }
                },
            }
        },
        { $sort: { useDate: -1 } },
        { $limit: configLimit * 2 }
    ]);
    var keywordMatch = [];
    for (const keyword of keywordSearch) {
        if (keyword.data.keywords) {
            for (const k of keyword.data.keywords) {
                keywordMatch.push(ObjectId.isValid(k) ? ObjectId(k) : k);
            }
        } else {
            keywordMatch.push(ObjectId.isValid(keyword.data._id) ? ObjectId(keyword.data._id) : keyword.data._id);
        }
    }
    const keywordTops = await News.aggregate([
        { $match: match },
        {
            "$unwind":
            {
                path: "$keywords",
                preserveNullAndEmptyArrays: true
            }
        },
        { $match: { "keywords.keywordId": { $in: keywordMatch } } },
        {
            $lookup: {
                from: 'keywords',
                let: { keywordId: '$keywords.keywordId' },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $and: [
                                    { $eq: ['$_id', '$$keywordId'] },
                                    {
                                        $or: [
                                            { $eq: ["$status", "trend"] },
                                            { $eq: ["$status", "unclassified"] }
                                        ]
                                    }
                                ]
                            }
                        }
                    }
                ],
                as: 'keywordDetail'
            }
        },
        {
            "$unwind":
            {
                path: "$keywordDetail",
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $lookup: {
                from: "personas",
                localField: "keywordDetail._id",
                foreignField: "keywords",
                as: "entity"
            }
        },
        {
            "$unwind":
            {
                path: "$entity",
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $lookup: {
                from: "journalists",
                localField: "journalists",
                foreignField: "_id",
                as: "journalistDetail"
            }
        },
        {
            "$unwind":
            {
                path: "$journalistDetail",
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $lookup: {
                from: "sources",
                localField: "source",
                foreignField: "_id",
                as: "sourceDetail"
            }
        },
        { "$unwind": "$sourceDetail" },
        {
            $lookup: {
                from: "newsagencies",
                localField: "sourceDetail.newsAgency",
                foreignField: "_id",
                as: "newsAgencyDetail"
            }
        },
        {
            "$unwind":
            {
                path: "$newsAgencyDetail",
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $addFields: {
                // score: await formulaTrend(range[1])
                score: await formulaTrendLength(range[1])
            }
        },
        {
            $group: {
                _id: {
                    "$cond": [
                        { "$gt": ["$entity", null] },
                        "$entity._id",
                        "$keywordDetail._id",
                    ]
                },
                keyword: {
                    $first: {
                        "$cond": [
                            { "$gt": ["$entity", null] },
                            null,
                            "$keywordDetail"
                        ]
                    }
                },
                entity: { $first: '$entity' },
                newsAgency: { $addToSet: '$newsAgencyDetail' },
                journalist: { $addToSet: '$journalistDetail' },
                // score: { $max: "$score" },
                score: { $max: await formulaTrendBonus(range[1]) },
                count: { $sum: 1 }
            }
        },
        {
            $match: {
                _id: { $ne: null },
                count: { $gt: 0 }
            }
        },
        {
            $addFields: {
                trending: {
                    $concatArrays: [
                        "$newsAgency",
                        "$journalist"
                    ]
                }
            }
        },
        {
            $project: {
                newsAgency: 0,
                journalist: 0,
            }
        },
        { $sort: { score: -1 } },
        { $limit: configLimit }
    ]);
    const trendHome = {
        name: "home",
        trending: keywordTops && keywordTops.length ? keywordTops : [],
        date: new Date()
    }
    console.log("trendHome: ", trendHome.trending.length);
    const trendHomeUpdate = await Trend.findOneAndUpdate({ name: "home" }, trendHome);
    if (!trendHomeUpdate) {
        const trend = new Trend(trendHome);
        await trend.save();
    }

    return trendHome;
}

async function cronJobTrendSearch(data) {
    let firstDay = data.firstDay;
    if (!firstDay) {
        firstDay = moment().subtract(3, 'days').toDate();
    }
    let lastDay = data.lastDay ? data.lastDay : new Date();
    console.log('running cronJobTrendSearch');
    let matchDate = { $gt: new Date(firstDay), $lte: new Date(lastDay) };

    const keywordSearch = await Keyword.aggregate([
        { $match: { useDate: matchDate } },
        {
            $match: {
                $or: [
                    { status: { $eq: "trend" } },
                    { status: { $eq: "unclassified" } }
                ]
            }
        },
        { $sort: { useDate: -1 } }
    ]);
    // console.log("keywordSearch: ",keywordSearch.length);
    var keywordMatch = [];
    for (const keyword of keywordSearch) {
        keywordMatch.push(ObjectId.isValid(keyword._id) ? ObjectId(keyword._id) : keyword._id);
    }
    var aggregate = [
        { $match: { date: matchDate } },
        { "$unwind": { path: "$keywords", preserveNullAndEmptyArrays: true } },
        { $match: { "keywords.keywordId": { $in: keywordMatch } } },
        {
            $lookup: {
                from: 'keywords',
                let: { keywordId: '$keywords.keywordId' },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $and: [
                                    { $eq: ['$_id', '$$keywordId'] },
                                    {
                                        $or: [
                                            { $eq: ["$status", "trend"] },
                                            { $eq: ["$status", "unclassified"] }
                                        ]
                                    }
                                ]
                            }
                        }
                    }
                ],
                as: 'keywordDetail'
            }
        },
        { "$unwind": { path: "$keywordDetail", preserveNullAndEmptyArrays: true } },
        {
            $lookup: {
                from: "personas",
                localField: "keywordDetail._id",
                foreignField: "keywords",
                as: "entity"
            }
        },
        { "$unwind": { path: "$entity", preserveNullAndEmptyArrays: true } },
        {
            $addFields: {
                // score: await formulaTrend(lastDay)
                score: await formulaTrendLength(lastDay)
            }
        },
        {
            $group: {
                _id: {
                    _id: {
                        "$cond": [
                            { "$gt": ["$entity", null] },
                            "$entity._id",
                            "$keywordDetail._id",
                        ]
                    },
                    news: "$_id"
                },
                lastDate: { $max: "$date" },
                data: {
                    $first: {
                        "$cond": [
                            { "$gt": ["$entity", null] },
                            "$entity",
                            "$keywordDetail"
                        ]
                    }
                },
                // score: { $max: "$score" },
                score: { $max: await formulaTrendBonus(lastDay) }
            }
        },
        {
            $group: {
                _id: "$_id._id",
                data: { $first: "$data" },
                lastDate: { $max: "$lastDate" },
                score: { $sum: "$score" },
                count: { $sum: 1 }
            }
        },
        {
            $match: {
                _id: { $ne: null },
                count: { $gt: 0 }
            }
        },
        { $sort: { score: -1 } },
        { $limit: 30 }
    ];
    var searchKeywordAll = await News.aggregate(aggregate);
    const trendSearch = {
        name: "search",
        trending: searchKeywordAll && searchKeywordAll.length ? searchKeywordAll : [],
        date: new Date()
    }
    console.log("searchKeywordAll: ", searchKeywordAll.length);
    const trendSearchUpdate = await Trend.findOneAndUpdate({ name: "search" }, trendSearch);
    if (!trendSearchUpdate) {
        const trend = new Trend(trendSearch);
        await trend.save();
    }
    return searchKeywordAll;
}

async function cronJobScraping() {
    const sources = await Source.find({ setTimeout: { $gt: 0 } })
        .populate("newsAgency")
        .populate("newsCategory")
        .populate("sourceType")
        .sort({ "selectorData.setData.tags": -1 });
    for (const source of sources) {
        let isPass = source.setTimeout > 0 ? counterTime % source.setTimeout === 0 : false;
        if (isPass) {
            console.log("isPass: ", source.name);
            if (source.sourceType.name === "web") {
                await runScrapingWeb(source);
            } else if (source.sourceType.name === "facebook") {
                await runScrapingFacebook(source);
            } else if (source.sourceType.name === "twitter") {
                await runScrapingTwitter(source);
            }
        }
    }
    console.log("----------------------------------------------------------------------sueccssful----------------------------------------------------------------------");
}

function cronJobScrapingCluster(numCPU, numCPUs) {
    return async () => {
        console.log('running a task every 10 minute numCPU ' + numCPU + " date " + new Date());
        const counterSources = await Source.countDocuments({ setTimeout: { $gt: 0 } });
        if (!counterSources) {
            return;
        }
        amount = parseInt(counterSources / numCPUs) + 1;
        const end = amount * numCPU;
        const start = end - amount;
        const sources = await Source.find({ setTimeout: { $gt: 0 } })
            .populate("newsAgency")
            .populate("newsCategory")
            .populate("sourceType")
            .sort({ "selectorData.setData.tags": -1 })
            .skip(start)
            .limit(amount);
        console.log('start: ' + start);
        console.log('end: ' + end);
        console.log('sources: ' + sources.length);
        for (const source of sources) {
            let isPass = source.setTimeout > 0 ? counterTime % source.setTimeout === 0 : false;
            if (isPass) {
                console.log("isPass: ", source.name);
                if (source.sourceType.name === "web") {
                    await runScrapingWeb(source);
                } else if (source.sourceType.name === "facebook") {
                    await runScrapingFacebook(source);
                } else if (source.sourceType.name === "twitter") {
                    await runScrapingTwitter(source);
                }
            }
        }
        console.log("----------------------------------------------------------------------sueccssful----------------------------------------------------------------------");
    };
}

async function runScrapingWeb(source) {
    return new Promise(async (resolve, reject) => {
        if (!source.link) {
            return reject("require is link");
        } else if (source.selectorUpdate) {
            if (!source.selectorUpdate.find) {
                return reject("require is selectorUpdate.find");
            } else if (!source.selectorUpdate.setLink) {
                return reject("require is selectorUpdate.setLink");
            }
        } else if (!source.selectorUpdate) {
            return reject("require is selectorUpdate");
        }
        if (source.selectorData) {
            if (!source.selectorData.find) {
                return reject("require is selectorData.find");
            } else if (!source.selectorData.setData) {
                return reject("require is selectorData.setData");
            }
        } else if (!source.selectorData) {
            return reject("require is selectorData");
        }
        let listLink = [];
        let selectorUpdate = source.selectorUpdate;
        osmosis
            .get(encodeURI(source.link))
            .paginate(selectorUpdate.paginate, selectorUpdate.pageLimit)
            .find(source.selectorUpdate.find)
            .set({
                link: source.selectorUpdate.setLink
            })
            .data(item => {
                if (item.link) {
                    item.link = selectorUpdate.preAddLink !== "" && selectorUpdate.preAddLink ? selectorUpdate.preAddLink + item.link : item.link;
                    item.link = selectorUpdate.addLink !== "" && selectorUpdate.addLink ? item.link + selectorUpdate.addLink : item.link;
                    item.link = encodeURI(item.link);
                    listLink.push(item.link);
                }
            })
            .log(console.log)
            .error(async (err) => {
                await Source.findByIdAndUpdate(source._id, { isScraping: false });
                console.log(err)
            })
            .done(async () => {
                let promiseAll = [];
                for (const link of listLink) {
                    promiseAll.push(ScrapingWeb(link, source));
                }
                Promise.all(promiseAll).then(async (listNews) => {
                    await Source.findByIdAndUpdate(source._id, { isScraping: false });
                    for (const news of listNews) {
                        if (news && news.link) {
                            await AddNews(news);
                        }
                    }
                    console.log("final done.");
                    resolve(listNews);
                }).catch(async (err) => {
                    await Source.findByIdAndUpdate(source._id, { isScraping: false });
                    reject(err);
                });
            })
    });
}

async function ScrapingWeb(link, source) {
    return new Promise((resolve, reject) => {
        let News
        let selectorData = source.selectorData;
        let setData = selectorData.setData;
        let configDate = selectorData.configDate;
        osmosis
            .get(link)
            .find(selectorData.find)
            .set({
                img: setData.img,
                content: setData.content,
                title: setData.title,
                tags: [setData.tags],
                date: setData.date,
                journalistName: setData.journalistName ? setData.journalistName : "",
                journalistImage: setData.journalistImage ? setData.journalistImage : ""
            })
            .data(news => {
                if (news.title) {
                    news.keywords = {};
                    news.source = source._id;
                    news.link = link;
                    news.img = selectorData.preAddLinkImg ? selectorData.preAddLinkImg + news.img : news.img;
                    news.date = news.date ? configDate.format ? moment(news.date, configDate.format, configDate.locale).toDate() : news.date : new Date;
                    news.createdDate = new Date();
                    news.modifiedDate = new Date();
                    console.log("news.date: ", news.date);
                    if (news.date.toString() === "Invalid Date" || typeof news.date === "string") {
                        news.date = new Date();
                    } else if (configDate.isConvert) {
                        let date = new Date();
                        date.getFullYear();
                        if (configDate.format.includes("YYYY")) {
                            news.date.setFullYear(news.date.getFullYear() - 543);
                        } else {
                            news.date.setFullYear(news.date.getFullYear() - 43);
                        }
                    }
                    if (news.date.getHours() === 0 && news.date.getMinutes() === 0) {
                        let date = new Date();
                        news.date.setHours(date.getHours());
                        news.date.setMinutes(date.getMinutes());
                    }
                    News = news;
                }
            })
            .log(console.log)
            .error(async (err) => {
                await Source.findByIdAndUpdate(source._id, { isScraping: false });
                console.log("error: ", err);
            })
            // .debug(console.log)
            .done(() => resolve(News));
    });
}

async function runScrapingFacebook(source) {
    return new Promise((resolve, reject) => {
        let listNews = [];
        osmosis
            .get(source.link)
            .find("#pagelet_timeline_main_column div._427x .userContentWrapper")
            .set({
                date: 'div._5pcp._5lel._2jyu._232_ abbr@data-utime',
                link: 'a._5pcq@href',
                // img: '.uiScaledImageContainer img@src',
                tags: ['.text_exposed_show ._58cm'],
                content: '.userContent'
            })
            .data(news => {
                news.keywords = {};
                news.source = source._id;
                link = news.link.split("?");
                news.link = "https://www.facebook.com/" + link[0];
                news.title = news.content.substring(0, 100);
                news.img = "";
                news.date = new Date(Number(news.date * 1000));
                news.createdDate = new Date();
                news.modifiedDate = new Date();
                if (news.date.toString() === "Invalid Date") {
                    news.date = new Date();
                }
                if (news.title) {
                    listNews.push(news);
                }
            })
            .log(console.log)
            .error(async (err) => {
                await Source.findByIdAndUpdate(source._id, { isScraping: false });
                console.log("error: ", err);
            })
            // .debug(console.log)
            .done(async () => {
                await Source.findByIdAndUpdate(source._id, { isScraping: false });
                for (const news of listNews) {
                    // console.log("news: ", news.title);
                    if (news.link) {
                        await AddNews(news);
                    }
                }
                console.log("final done.");
                resolve(listNews);
            });
    });
}

async function runScrapingTwitter(source) {
    return new Promise((resolve, reject) => {
        let listNews = [];
        osmosis
            // Do Google search
            .get(source.link)
            .find('body table.tweet')
            .set({
                'link': '.tweet-header .timestamp > a@href',
            })
            .follow('.tweet-header .timestamp > a@href')
            .set({
                'link': '.main-tweet .tweet-header .timestamp > a@href',
                'content': '.main-tweet .tweet-content .tweet-text',
                'date': '.main-tweet div.metadata',
                'tags': ['.main-tweet .tweet-content .tweet-text a.twitter-hashtag']
            })
            .data(news => {
                news.content = typeof news.content === "string" ? news.content : "";
                var contentSplit = news.content.split("\n");
                news.title = contentSplit[0];
                if (news.title.length > 100) {
                    news.title = news.content.substring(0, 100);
                }
                news.link = "https://twitter.com/" + news.link;
                if (news.date) {
                    news.date = moment(news.date, "HH:mm - DD MMM YYYY").toDate();
                }
                news.keywords = {};
                news.img = "";
                news.source = source._id;
                news.createdDate = new Date();
                news.modifiedDate = new Date();
                listNews.push(news);
            })
            .log(console.log)
            .error(async (err) => {
                await Source.findByIdAndUpdate(source._id, { isScraping: false });
                console.log("error: ", err);
            })
            .done(async () => {
                await Source.findByIdAndUpdate(source._id, { isScraping: false });
                for (const news of listNews) {
                    if (news.link) {
                        await AddNews(news);
                    }
                }
                console.log("final done.");
                resolve(listNews);
            });
    });
}

async function AddNews(news) {
    const qNews = await News.findOne({ link: news.link });
    if (!qNews) {
        for (const t of news.tags) {
            var tag = t.split('#').join('');
            tag = tag.trim();
            if (!tag) {
                continue;
            }
            console.log("tag: ", tag);
            const qkeyword = await Keyword.findOne({ name: tag });
            if (qkeyword) {
                qkeyword.useDate = new Date();
                qkeyword.isTag = true;
                await qkeyword.save()
                news.keywords[qkeyword._id] = {
                    keywordId: qkeyword._id,
                    countTitle: 1,
                    countContent: 0,
                    countAll: 1
                };
                console.log("update: ", news.link);
            } else {
                const configIstag = await Config.findOne({ name: "config.source.isTag" });
                if (configIstag && configIstag.value) {
                    const keyword = new Keyword({
                        name: tag,
                        details: "",
                        isTag: true,
                        status: "unclassified",
                        useDate: new Date(),
                        createdDate: new Date(),
                        modifiedDate: new Date()
                    });
                    await keyword.save();
                    console.log("keyword: ", keyword);
                    news.keywords[keyword._id] = {
                        keywordId: keyword._id,
                        countTitle: 1,
                        countContent: 0,
                        countAll: 1
                    };
                    console.log("add: ", news.link);
                }
            }
            console.log(tag + " sueccss.");
        }
        const qKeywords = await Keyword.find({ status: { $ne: "banned" } });
        for (let keyword of qKeywords) {
            news.title = typeof news.title === "string" ? news.title : "";
            news.content = typeof news.content === "string" ? news.content : "";
            let countKeywordTitle = news.title.split(keyword.name).length;
            let countKeywordContent = news.content.split(keyword.name).length;
            countKeywordTitle--;
            countKeywordContent--;
            let countKeyword = countKeywordTitle + countKeywordContent;
            if (countKeyword > 0) {
                news.keywords[keyword._id] = {
                    keywordId: keyword._id,
                    countTitle: countKeywordTitle,
                    countContent: countKeywordContent,
                    countAll: countKeyword
                };
            }
        }
        news.keywords = news.keywords ? Object.values(news.keywords) : [];
        if (news.journalistName) {
            let name = news.journalistName.trim();
            let source = news.source;
            let image = news.journalistImage;
            const journalist = await Journalist.findOne({ name: name, source: source });
            if (!journalist) {
                const saveJournalist = new Journalist({
                    source: source,
                    image: image,
                    name: name,
                    createdDate: new Date(),
                    modifiedDate: new Date()
                });
                await saveJournalist.save();
                news.journalists = [saveJournalist._id];
            } else {
                news.journalists = [journalist._id];
            }
        }
        const configIsContent = await Config.findOne({ name: "config.source.isContent" });
        if (configIsContent && !configIsContent.value) {
            news.content = ""
        }
        const newsSave = new News(news);
        await newsSave.save();
        console.log("news sueccss.");
    } else {
        console.log("match");
    }
}

async function processFork(numCPUs) {
    const configNumCPUs = await Config.findOne({ name: "config.api.numCPUs" });
    numCPUs = configNumCPUs && configNumCPUs.value ? configNumCPUs.value : typeof numCPUs === "number" ? numCPUs : 1;
    console.log("numCPUs: ", numCPUs);
    if (numCPUs <= 1) {
        // Create a worker
        cluster.fork();
        cron.schedule('0 */5 * * * *', async () => {
            console.log('running a task every 5 minute one CPU');
            cronJobTrendHome();
            cronJobTrendSearch({});
        });
        cron.schedule('0 */10 * * * *', async () => {
            counterTime++;
            console.log('running a task every 10 minute one CPU');
            cronJobScraping();
        });
    } else {
        for (var i = 0; i < numCPUs; i++) {
            // Create a worker
            cluster.fork();
            if (i === 0) {
                cron.schedule('0 */5 * * * *', async () => {
                    console.log('running a task every 5 minute');
                    cronJobTrendHome();
                    cronJobTrendSearch({});
                });
                cron.schedule('0 */10 * * * *', async () => {
                    console.log('running a task every 10 minute');
                    counterTime++;
                });
            } else {
                cron.schedule('0 */10 * * * *', cronJobScrapingCluster(i, numCPUs - 1));
            }
        }
    }

    cron.schedule('0 0 0 * * *', async () => {
        console.log('running a task every day at 12:00 AM');
        counterTime = 0;
    });
}

if (cluster.isMaster) {
    processFork(numCPUs);
} else {
    app.use(compression());
    app.use(cors());
    app.set('port', PORT);
    app.set('view engine', 'ejs');
    app.use(morgan('dev'));
    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.use(bodyParser.json({
        extended: true
    }));
    app.use(methodOverride());
    const env = process.env.NODE_ENV || 'development';
    // development only
    if ('development' == env) {
        console.log('dev mode!!')
    }
    const router = express.Router();

    router.get('/', (req, res) => {
        res.send('Hello World')
    });

    // login
    router.post('/api/admin/login', async (req, res) => {
        let username = req.body.username;
        let password = req.body.password;
        const user = await User.findOne({
            username: username,
            password: password
        });
        if (user) {
            res.json(true);
        } else {
            res.json(false);
        }
    });

    // keyword
    router.get('/api/keyword', async (req, res) => {
        const keyword = await Keyword.find({});
        res.json(keyword)
    });

    router.post('/api/keyword/search', async (req, res) => {
        let body = req.body;
        var keyword;
        if (body.isCount) {
            keyword = await Keyword.countDocuments(body.whereConditions);
        } else {
            keyword = await Keyword.find(body.whereConditions).skip(body.offset).limit(body.limit).sort(body.sort);
        }
        res.json(keyword)
    });

    router.get('/api/keyword/:id', async (req, res) => {
        const { id } = req.params;
        if (!id) {
            res.status(400);
            return res.json("require is id");
        }
        const keyword = await Keyword.findById(id);
        res.json(keyword)
    });

    router.put('/api/admin/keyword/:id', async (req, res) => {
        const { id } = req.params;
        const body = req.body;
        if (!id) {
            res.status(400);
            return res.json("require is id");
        }
        if (!body) {
            res.status(400);
            return res.json("require is body");
        }
        const check = await Keyword.findOne({ name: body.name });
        let isPass = true;
        if (check) {
            if (check._id === id) {
                isPass = false;
            }
        }
        if (!isPass) {
            res.status(400);
            res.json("มีคีย์เวิร์ดนี้แล้ว")
        } else {
            await Keyword.findByIdAndUpdate(id, body)
            const keyword = await Keyword.findById(id)
            res.json(keyword)
        }
    });

    router.post('/api/admin/keyword', async (req, res) => {
        const data = req.body;
        if (!data) {
            res.status(400);
            return res.json("require is body");
        }
        const check = await Keyword.findOne({ name: data.name });
        if (check) {
            res.status(400);
            res.json("มีคีย์เวิร์ดนี้แล้ว")
        } else {
            const keyword = new Keyword(data)
            await keyword.save();
            res.json(keyword)
        }
    });

    router.delete('/api/admin/keyword/:id', async (req, res) => {
        const { id } = req.params;
        if (!id) {
            res.status(400);
            return res.json("require is id");
        }
        const keyword = await Keyword.findByIdAndDelete(id)
        res.json(keyword)
    });

    router.post('/api/keyword/home', async (req, res) => {
        const trendHome = await Trend.findOne({ name: "home" });
        if (trendHome) {
            res.json(trendHome);
        } else {
            const trendingHome = await cronJobTrendHome();
            res.json(trendingHome);
        }
    });

    async function findNewsByKeywords(keywords, entityKeywords, firstDay, lastDay, start, amount, sourceTypes, newsAgencys) {
        let match = setMatchNews(keywords, entityKeywords, firstDay, lastDay);
        var config = await Config.findOne({ name: "config.trend.var7" });
        config = config && config.value ? config.value : 30;
        let formulaCount = { $add: [{ $multiply: [config, { "$cond": [{ $gt: ["$keywords.countTitle", null] }, "$keywords.countTitle", 0] }] }, "$keywords.countContent"] };
        var aggregate = [
            { $match: match },
            { $sort: { date: -1 } },
            {
                $lookup: {
                    from: "sources",
                    localField: "source",
                    foreignField: "_id",
                    as: "sourceDetail"
                }
            },
            { "$unwind": "$sourceDetail" },
            {
                $lookup: {
                    from: "sourcetypes",
                    localField: "sourceDetail.sourceType",
                    foreignField: "_id",
                    as: "sourceTypeDetail"
                }
            },
            { "$unwind": "$sourceTypeDetail" }
        ];
        if (sourceTypes.length > 0) {
            aggregate = aggregate.concat(
                {
                    $match:
                    {
                        "sourceTypeDetail.name": { $in: sourceTypes }

                    }
                });
        }
        aggregate = aggregate.concat(
            {
                $lookup: {
                    from: "newsagencies",
                    localField: "sourceDetail.newsAgency",
                    foreignField: "_id",
                    as: "newsAgencyDetail"
                }
            },
            { "$unwind": "$newsAgencyDetail" }
        );
        let inNewsAgencys = [];
        for (const newsAgency of newsAgencys) {
            inNewsAgencys.push(ObjectId.isValid(newsAgency) ? ObjectId(newsAgency) : newsAgency);
        }
        if (inNewsAgencys.length > 0) {
            aggregate = aggregate.concat(
                {
                    $match:
                    {
                        "newsAgencyDetail._id": { $in: inNewsAgencys }

                    }
                });
        }
        aggregate = aggregate.concat(
            { $skip: start },
            { $limit: amount },
            {
                "$unwind":
                {
                    path: "$keywords",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $addFields: {
                    score: formulaCount
                }
            },
            {
                $lookup: {
                    from: 'keywords',
                    let: { keywordId: '$keywords.keywordId' },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ['$_id', '$$keywordId'] },
                                        { $ne: ["$status", "banned"] },
                                        { $ne: ["$status", "common"] }
                                    ]
                                }
                            }
                        }
                    ],
                    as: 'keywordDetail'
                }
            },
            {
                $lookup: {
                    from: "personas",
                    localField: "keywords.keywordId",
                    foreignField: "keywords",
                    as: "listEntity"
                }
            },
            {
                "$unwind":
                {
                    path: "$listEntity",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: "personatypes",
                    localField: "listEntity.personaType",
                    foreignField: "_id",
                    as: "listEntity.entityType"
                }
            },
            {
                "$unwind":
                {
                    path: "$listEntity.entityType",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                "$unwind":
                {
                    path: "$listEntity.keywords",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: "journalists",
                    localField: "journalists",
                    foreignField: "_id",
                    as: "listJournalist"
                }
            },
            {
                $addFields: {
                    "listEntity.score": { $sum: "$score" },
                    "listEntity.countTitle": { $sum: "$keywords.countTitle" },
                    "listEntity.countContent": { $sum: "$keywords.countContent" }
                }
            },
            {
                $group: {
                    _id: {
                        _id: "$_id",
                        entity: "$listEntity._id"
                    },
                    title: { $first: "$title" },
                    date: { $first: "$date" },
                    content: { $first: "$content" },
                    img: { $first: "$img" },
                    link: { $first: "$link" },
                    sourceDetail: { $first: "$sourceDetail" },
                    sourceTypeDetail: { $first: "$sourceTypeDetail" },
                    newsAgencyDetail: { $first: "$newsAgencyDetail" },
                    listJournalist: { $first: "$listJournalist" },
                    listEntity: { $first: "$listEntity" },
                    countTitle: { $first: "$keywords.countTitle" },
                    countContent: { $first: "$keywords.countContent" },
                    score: { $first: "$score" }
                }
            },
            {
                $group: {
                    _id: "$_id._id",
                    title: { $first: "$title" },
                    date: { $first: "$date" },
                    content: { $first: "$content" },
                    img: { $first: "$img" },
                    link: { $first: "$link" },
                    sourceDetail: { $first: "$sourceDetail" },
                    sourceTypeDetail: { $first: "$sourceTypeDetail" },
                    newsAgencyDetail: { $first: "$newsAgencyDetail" },
                    listJournalist: { $first: "$listJournalist" },
                    listEntity: { $addToSet: "$listEntity" },
                    score: { $sum: "$score" },
                    countTitle: { $sum: "$countTitle" },
                    countContent: { $sum: "$countContent" }
                }
            },
            { $sort: { "listEntity.score": -1 } },
            { $sort: { date: -1 } }
        );
        return await News.aggregate(aggregate);
    }

    router.post('/api/keyword/searchall', async (req, res) => {
        let search = req.body.search ? req.body.search.trim() : "";
        let keywords = req.body.keywords ? req.body.keywords : [];
        let entitys = req.body.entitys ? req.body.entitys : [];
        let entityKeywords = req.body.entityKeywords ? req.body.entityKeywords : [];
        let firstDay = req.body.firstDay;
        if (!firstDay) {
            firstDay = moment().subtract(6, 'days').toDate();
        }
        let lastDay = req.body.lastDay ? req.body.lastDay : new Date();
        let matchDate = { $gt: new Date(firstDay), $lte: new Date(lastDay) };
        var aggregate = [{ $match: { date: matchDate } }];
        if (search) {
            const keywordSearch = await Keyword.aggregate([
                { $match: { useDate: matchDate } },
                { $match: { name: { $regex: search }, status: { $ne: "banned" } } },
                {
                    $lookup: {
                        from: "personas",
                        localField: "_id",
                        foreignField: "keywords",
                        as: "entity"
                    }
                },
                { "$unwind": { path: "$entity", preserveNullAndEmptyArrays: true } },
                {
                    $group: {
                        _id: {
                            "$cond": [
                                { "$gt": ["$entity", null] },
                                "$entity._id",
                                "$_id",
                            ]
                        },
                        data: {
                            $first: {
                                "$cond": [
                                    { "$gt": ["$entity", null] },
                                    "$entity",
                                    "$$ROOT"
                                ]
                            }
                        },
                    }
                },
                { $sort: { useDate: -1 } },
                { $limit: 100 }
            ]);
            if (!keywordSearch || keywordSearch.length === 0) {
                return res.json([]);
            }
            var keywordMatch = [];
            for (const keyword of keywordSearch) {
                if (keyword.data.keywords) {
                    for (const k of keyword.data.keywords) {
                        keywordMatch.push(ObjectId.isValid(k) ? ObjectId(k) : k);
                    }
                } else {
                    keywordMatch.push(ObjectId.isValid(keyword.data._id) ? ObjectId(keyword.data._id) : keyword.data._id);
                }
            }
            aggregate = aggregate.concat(
                { "$unwind": { path: "$keywords", preserveNullAndEmptyArrays: true } },
                { $match: { "keywords.keywordId": { $in: keywordMatch } } },
                {
                    $lookup: {
                        from: "keywords",
                        localField: "keywords.keywordId",
                        foreignField: "_id",
                        as: "keywordDetail"
                    }
                },
                { "$unwind": { path: "$keywordDetail", preserveNullAndEmptyArrays: true } },
                {
                    $lookup: {
                        from: "personas",
                        localField: "keywordDetail._id",
                        foreignField: "keywords",
                        as: "entity"
                    }
                },
                { "$unwind": { path: "$entity", preserveNullAndEmptyArrays: true } },
                {
                    $addFields: {
                        // score: await formulaTrend(lastDay)
                        score: await formulaTrendLength(lastDay)
                    }
                },
                {
                    $group: {
                        _id: {
                            _id: {
                                "$cond": [
                                    { "$gt": ["$entity", null] },
                                    "$entity._id",
                                    "$keywordDetail._id",
                                ]
                            },
                            newsId: "$_id"
                        },
                        lastDate: { $max: "$date" },
                        data: {
                            $first: {
                                "$cond": [
                                    { "$gt": ["$entity", null] },
                                    "$entity",
                                    "$keywordDetail"
                                ]
                            }
                        },
                        // score: { $max: "$score" },
                        score: { $max: await formulaTrendBonus(lastDay) }
                    }
                },
                {
                    $group: {
                        _id: "$_id._id",
                        data: { $first: "$data" },
                        lastDate: { $max: "$lastDate" },
                        score: { $sum: "$score" },
                        count: { $sum: 1 }
                    }
                },
                {
                    $match: {
                        _id: { $ne: null },
                        count: { $gt: 0 }
                    }
                },
                { $sort: { score: -1 } },
                { $limit: 15 }
            );
            var searchKeywordAll = await News.aggregate(aggregate);;
            var result = [];
            if (keywords.length > 0 || entityKeywords.length > 0) {
                for (const searchKeyword of searchKeywordAll) {
                    var dataSearch = searchKeyword;
                    if (JSON.stringify(keywords).includes(dataSearch._id)) {
                        console.log("match: keyword");
                        continue;
                    }
                    let keywordsClone = dataSearch.data.image ? JSON.parse(JSON.stringify(keywords)) : keywords.concat(dataSearch._id);
                    let entityKeywordsClone = JSON.parse(JSON.stringify(entityKeywords));
                    if (dataSearch.data.keywords && dataSearch.data.keywords.length > 0 && entitys && entitys.length > 0) {
                        let isContinue = true;
                        for (const entity of entitys) {
                            if (JSON.stringify(entity) === JSON.stringify(dataSearch._id)) {
                                console.log("match: entity");
                                isContinue = false;
                                break;
                            }
                        }
                        if (!isContinue) {
                            result.push(dataSearch);
                            continue;
                        }
                        var entityKeywordsAdd = [];
                        for (const keyword of dataSearch.data.keywords) {
                            entityKeywordsAdd.push(keyword);
                        }
                        entityKeywordsClone.push(entityKeywordsAdd);
                    }
                    let match = setMatchNews(keywordsClone, entityKeywordsClone, firstDay, lastDay);
                    const countWith = await News.aggregate([{ $match: match }]);
                    dataSearch.countWith = countWith.length;
                    result.push(dataSearch);
                }
                res.json(result);
            } else {
                res.json(searchKeywordAll);
            }
        } else {
            const trendSearch = await Trend.findOne({ name: "search" });
            if (trendSearch) {
                res.json(trendSearch.trending);
            } else {
                const newTrendSearch = await cronJobTrendSearch(req.body);
                res.json(newTrendSearch);
            }
        }
    });

    router.post('/api/keyword/find', async (req, res) => {
        let keyEntitys = req.body.keyEntitys;
        if (!Array.isArray(keyEntitys)) {
            res.status(400);
            return res.json("require is keywords or entitys");
        }
        let notFind = [];
        let searchKeywordAll = [];
        let keywords = [];
        let entitys = [];
        for (const keyEntity of keyEntitys) {
            if (keyEntity.isKeyword) {
                const keyword = await Keyword.findOne({ name: keyEntity.name, status: { $ne: "banned" } });
                if (keyword) {
                    searchKeywordAll.push(keyword);
                    keywords.push(keyword);
                } else {
                    notFind.push(keyEntity);
                }
            } else {
                var entity = await Persona.findOne({ name: keyEntity.name })
                    .populate("keywords")
                    .populate("personaType");
                if (entity) {
                    var entityKeywords = [];
                    for (const keyword of entity.keywords) {
                        if (keyword.status !== "banned") {
                            entityKeywords.push(keyword);
                        }
                    }
                    if (entityKeywords.length > 0) {
                        entity.keywords = entityKeywords;
                        entitys.push(entity);
                        searchKeywordAll.push(entity);
                    } else {
                        notFind.push(keyEntity);
                    }
                } else {
                    notFind.push(keyEntity);
                }
            }
        }
        let data = {
            notFind: notFind,
            searchKeywordAll: searchKeywordAll,
            keywords: keywords,
            entitys: entitys
        }
        res.json(data);
    });

    router.post('/api/keyword/page', async (req, res) => {
        let resBody = {};
        let keywords = req.body.keywords;
        let entityKeywords = req.body.entityKeywords;
        let entitys = req.body.entitys;
        let firstDay = req.body.firstDay;
        let lastDay = req.body.lastDay;

        if (!Array.isArray(keywords) && !Array.isArray(entitys) && !Array.isArray(entityKeywords) && !firstDay && !lastDay) {
            res.status(400);
            return res.json("require is keywords or entitys");
        }
        let findKeepDateNews
        let findCountNews = {
            $and: []
        }
        if (keywords.length > 0) {
            findCountNews.$and.push({ 'keywords.keywordId': { $all: keywords } });
        }
        for (const keywords of entityKeywords) {
            findCountNews.$and.push({ 'keywords.keywordId': { $in: keywords } });
        }
        findKeepDateNews = JSON.parse(JSON.stringify(findCountNews));
        findCountNews.$and.push({ date: { $gt: firstDay, $lte: lastDay } });
        const countNews = await News.countDocuments(findCountNews);
        const keepDates = await News.find(findKeepDateNews).sort({ date: 1 });
        const keepDate = keepDates ? keepDates.length > 0 ? keepDates[0].date : undefined : undefined;
        const countFromSource = await CountFromSource(keywords, entityKeywords, firstDay, lastDay);

        const trendingKeyword = await TrendingKeywordChart(keywords, entityKeywords, firstDay, lastDay);
        const trendingMap = await TrendingMapChart(keywords, entityKeywords, firstDay, lastDay);
        const trendingSourceType = await TrendingSourceTypeChart(keywords, entityKeywords, firstDay, lastDay);
        const trendingTopNewsAgency = await TrendingTopNewsAgencyChart(keywords, entityKeywords, firstDay, lastDay);

        var trendNewsAgencys = [];
        for (const trendNewsAgency of trendingTopNewsAgency) {
            trendNewsAgencys.push(ObjectId.isValid(trendNewsAgency._id) ? ObjectId(trendNewsAgency._id) : trendNewsAgency._id);
        }
        const trendingLeastNewsAgency = await TrendingLeastNewsAgencyChart(trendNewsAgencys, keywords, entityKeywords, firstDay, lastDay);
        const listNewsAgency = await NewsAgency.find();
        // const trendingTopLeastJouranlist = await TrendingTopLeastJouranlistChart(keywords, entityKeywords, firstDay, lastDay);
        // const trendingTopJouranlist = trendingTopLeastJouranlist.trendingTop;
        // const trendingLeastJouranlist = trendingTopLeastJouranlist.trendingLeast;
        const listNewsAgencysWithNews = await ListNewsAgencysWithNews(keywords, entityKeywords, firstDay, lastDay, []);

        const dataNews = await findNewsByKeywords(keywords, entityKeywords, firstDay, lastDay, 0, 36, [], []);

        const keywordTop = await KeywordTop(keywords, entityKeywords, firstDay, lastDay);
        const keywordRelates = await KeywordRelates(keywordTop, keywords, entityKeywords, firstDay, lastDay);
        const entityRelatedTop = await TrendingEntityTop(entitys, keywords, entityKeywords, firstDay, lastDay);
        resBody = {
            keepDate: keepDate,
            totalNews: countNews,
            countFromSource: countFromSource,
            listNewsAgency: listNewsAgency,
            listNewsAgencysWithNews: listNewsAgencysWithNews,
            trendingKeyword: trendingKeyword,
            trendingMap: trendingMap,
            trendingSourceType: trendingSourceType,
            trendingTopNewsAgency: trendingTopNewsAgency,
            trendingLeastNewsAgency: trendingLeastNewsAgency,
            // trendingTopJouranlist: trendingTopJouranlist,
            // trendingLeastJouranlist: trendingLeastJouranlist,
            news: dataNews,
            entityRelatedTop: entityRelatedTop,
            keywordTop: keywordTop,
            keywordRelates: keywordRelates
        };
        return res.json(resBody);
    });

    router.post('/api/keyword/page/count', async (req, res) => {
        let resBody = {};
        let keywords = req.body.keywords;
        let entityKeywords = req.body.entityKeywords;
        let entitys = req.body.entitys;
        let firstDay = req.body.firstDay;
        let lastDay = req.body.lastDay;

        if (!Array.isArray(keywords) && !Array.isArray(entitys) && !Array.isArray(entityKeywords) && !firstDay && !lastDay) {
            res.status(400);
            return res.json("require is keywords or entitys");
        }
        let findKeepDateNews
        let findCountNews = {
            $and: []
        }
        if (keywords.length > 0) {
            findCountNews.$and.push({ 'keywords.keywordId': { $all: keywords } });
        }
        for (const keywords of entityKeywords) {
            findCountNews.$and.push({ 'keywords.keywordId': { $in: keywords } });
        }
        findKeepDateNews = JSON.parse(JSON.stringify(findCountNews));
        findCountNews.$and.push({ date: { $gt: firstDay, $lte: lastDay } });
        const countNews = await News.countDocuments(findCountNews);
        const keepDates = await News.find(findKeepDateNews).sort({ date: 1 }).limit(1);
        const keepDate = keepDates ? keepDates.length > 0 ? keepDates[0].date : undefined : undefined;
        const lastDates = await News.find(findCountNews).sort({ date: -1 }).limit(1);
        const lastDate = lastDates ? lastDates.length > 0 ? lastDates[0].date : undefined : undefined;
        const countFromSource = await CountFromSource(keywords, entityKeywords, firstDay, lastDay);
        resBody = {
            keepDate: keepDate,
            lastDate: lastDate,
            totalNews: countNews,
            countFromSource: countFromSource
        };
        res.json(resBody);
    });

    router.post('/api/keyword/page/trend/all', async (req, res) => {
        let keywords = req.body.keywords;
        let entityKeywords = req.body.entityKeywords;
        let entitys = req.body.entitys;
        let firstDay = req.body.firstDay;
        let lastDay = req.body.lastDay;

        if (!Array.isArray(keywords) && !Array.isArray(entitys) && !Array.isArray(entityKeywords) && !firstDay && !lastDay) {
            res.status(400);
            return res.json("require is keywords or entitys");
        }
        const trendingKeyword = await TrendingKeywordChart(keywords, entityKeywords, firstDay, lastDay);
        res.json(trendingKeyword);
    });

    router.post('/api/keyword/page/trend/map', async (req, res) => {
        let keywords = req.body.keywords;
        let entityKeywords = req.body.entityKeywords;
        let entitys = req.body.entitys;
        let firstDay = req.body.firstDay;
        let lastDay = req.body.lastDay;

        if (!Array.isArray(keywords) && !Array.isArray(entitys) && !Array.isArray(entityKeywords) && !firstDay && !lastDay) {
            res.status(400);
            return res.json("require is keywords or entitys");
        }
        const trendingMap = await TrendingMapChart(keywords, entityKeywords, firstDay, lastDay);
        res.json(trendingMap);
    });

    router.post('/api/keyword/page/trend/sourcetype', async (req, res) => {
        let keywords = req.body.keywords;
        let entityKeywords = req.body.entityKeywords;
        let entitys = req.body.entitys;
        let firstDay = req.body.firstDay;
        let lastDay = req.body.lastDay;

        if (!Array.isArray(keywords) && !Array.isArray(entitys) && !Array.isArray(entityKeywords) && !firstDay && !lastDay) {
            res.status(400);
            return res.json("require is keywords or entitys");
        }
        const trendingSourceType = await TrendingSourceTypeChart(keywords, entityKeywords, firstDay, lastDay);
        res.json(trendingSourceType);
    });

    router.post('/api/keyword/page/trend/newsagency', async (req, res) => {
        let keywords = req.body.keywords;
        let entityKeywords = req.body.entityKeywords;
        let entitys = req.body.entitys;
        let firstDay = req.body.firstDay;
        let lastDay = req.body.lastDay;

        if (!Array.isArray(keywords) && !Array.isArray(entitys) && !Array.isArray(entityKeywords) && !firstDay && !lastDay) {
            res.status(400);
            return res.json("require is keywords or entitys");
        }
        const trendingTopNewsAgency = await TrendingTopNewsAgencyChart(keywords, entityKeywords, firstDay, lastDay);
        var trendNewsAgencys = [];
        for (const trendNewsAgency of trendingTopNewsAgency) {
            trendNewsAgencys.push(ObjectId.isValid(trendNewsAgency._id) ? ObjectId(trendNewsAgency._id) : trendNewsAgency._id);
        }
        const trendingLeastNewsAgency = await TrendingLeastNewsAgencyChart(trendNewsAgencys, keywords, entityKeywords, firstDay, lastDay);
        const resBody = {
            trendingTopNewsAgency: trendingTopNewsAgency,
            trendingLeastNewsAgency: trendingLeastNewsAgency
        };
        res.json(resBody);
    });

    router.post('/api/keyword/page/top', async (req, res) => {
        let keywords = req.body.keywords;
        let entityKeywords = req.body.entityKeywords;
        let entitys = req.body.entitys;
        let firstDay = req.body.firstDay;
        let lastDay = req.body.lastDay;

        if (!Array.isArray(keywords) && !Array.isArray(entitys) && !Array.isArray(entityKeywords) && !firstDay && !lastDay) {
            res.status(400);
            return res.json("require is keywords or entitys");
        }
        const keywordTop = await KeywordTop(keywords, entityKeywords, firstDay, lastDay);
        res.json(keywordTop);
    });

    router.post('/api/keyword/page/relates', async (req, res) => {
        let keywords = req.body.keywords;
        let keywordTop = req.body.keywordTop ? req.body.keywordTop : [];
        let entityKeywords = req.body.entityKeywords;
        let entitys = req.body.entitys;
        let firstDay = req.body.firstDay;
        let lastDay = req.body.lastDay;

        if (!Array.isArray(keywords) && !Array.isArray(entitys) && !Array.isArray(entityKeywords) && !firstDay && !lastDay) {
            res.status(400);
            return res.json("require is keywords or entitys");
        }
        const keywordRelates = await KeywordRelates(keywordTop, keywords, entityKeywords, firstDay, lastDay);
        res.json(keywordRelates);
    });

    router.post('/api/keyword/page/entity', async (req, res) => {
        let keywords = req.body.keywords;
        let entityKeywords = req.body.entityKeywords;
        let entitys = req.body.entitys;
        let firstDay = req.body.firstDay;
        let lastDay = req.body.lastDay;

        if (!Array.isArray(keywords) && !Array.isArray(entitys) && !Array.isArray(entityKeywords) && !firstDay && !lastDay) {
            res.status(400);
            return res.json("require is keywords or entitys");
        }
        const entityRelatedTop = await TrendingEntityTop(entitys, keywords, entityKeywords, firstDay, lastDay);
        res.json(entityRelatedTop);
    });

    router.post('/api/keyword/page/news', async (req, res) => {
        let keywords = req.body.keywords ? req.body.keywords : [];
        let entityKeywords = req.body.entityKeywords ? req.body.entityKeywords : [];
        let sourceTypes = req.body.sourceTypes ? req.body.sourceTypes : [];
        let newsAgencys = req.body.newsAgencys ? req.body.newsAgencys : [];
        let start = req.body.start ? req.body.start : 0;
        let amount = req.body.amount ? req.body.amount : 36;
        let firstDay = req.body.firstDay;
        let lastDay = req.body.lastDay;
        if (!Array.isArray(keywords) && !Array.isArray(entityKeywords)) {
            res.status(400);
            return res.json("require is keywords or entityKeywords");
        }
        if (!firstDay || !lastDay) {
            res.status(400);
            return res.json("require is firstDay and lastDay");
        }
        const dataNews = await findNewsByKeywords(keywords, entityKeywords, firstDay, lastDay, start, amount, sourceTypes, newsAgencys);
        res.json(dataNews)
    });

    router.post('/api/keyword/page/newsagency/news', async (req, res) => {
        let keywords = req.body.keywords;
        let entityKeywords = req.body.entityKeywords;
        let firstDay = req.body.firstDay;
        let lastDay = req.body.lastDay;
        let sourceTypes = req.body.sourceTypes;
        if (!Array.isArray(keywords) && !Array.isArray(entityKeywords)) {
            res.status(400);
            return res.json("require is keywords or entityKeywords");
        }
        if (!firstDay || !lastDay) {
            res.status(400);
            return res.json("require is firstDay and lastDay");
        }
        keywords = keywords ? keywords : [];
        sourceTypes = sourceTypes ? sourceTypes : [];
        entityKeywords = entityKeywords ? entityKeywords : [];
        const dataNews = await ListNewsAgencysWithNews(keywords, entityKeywords, firstDay, lastDay, sourceTypes);
        res.json(dataNews)
    });

    router.post('/api/keyword/page/newagency/compare/:id', async (req, res) => {
        let id = req.params.id;
        let keywords = req.body.keywords;
        let entityKeywords = req.body.entityKeywords;
        let entitys = req.body.entitys;
        let firstDay = req.body.firstDay;
        let lastDay = req.body.lastDay;

        if (!Array.isArray(keywords) && !Array.isArray(entitys) && !Array.isArray(entityKeywords) && !firstDay && !lastDay) {
            res.status(400);
            return res.json("require is keywords or entitys");
        }
        let match = setMatchNews(keywords, entityKeywords, firstDay, lastDay);
        const trendings = await News.aggregate([
            { $match: match },
            {
                $lookup: {
                    from: "sources",
                    localField: "source",
                    foreignField: "_id",
                    as: "sourceDetail"
                }
            },
            {
                "$unwind":
                {
                    path: "$sourceDetail",
                    preserveNullAndEmptyArrays: true
                }
            },
            { $match: { "sourceDetail.newsAgency": { $eq: ObjectId.isValid(id) ? ObjectId(id) : id } } },
            {
                $lookup: {
                    from: "newsagencies",
                    localField: "sourceDetail.newsAgency",
                    foreignField: "_id",
                    as: "newsAgencyDetail"
                }
            },
            {
                "$unwind":
                {
                    path: "$newsAgencyDetail",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $group: {
                    _id: {
                        date: { $dateFromParts: { 'year': { $year: "$date" }, 'month': { $month: "$date" }, 'day': { $dayOfMonth: "$date" } } },
                        icon: "$newsAgencyDetail.icon",
                        newsAgency: "$newsAgencyDetail.name",
                        _id: "$newsAgencyDetail._id"
                    },
                    count: { $sum: 1 }
                }
            },
            { $sort: { "_id.date": 1, } },
            {
                $group: {
                    _id: "$_id._id",
                    icon: { $first: "$_id.icon" },
                    name: { $first: "$_id.newsAgency" },
                    date: { $push: "$$ROOT" },
                    count: { $sum: "$count" }
                }
            },
            { $sort: { count: -1 } },
            { $limit: 1 }
        ]);
        var trending;
        if (trendings && trendings.length > 0) {
            trendings[0].date = await setDateTrendingAddDate(trendings[0].date, firstDay, lastDay);
            trending = trendings[0];
        } else {
            const newsAgency = await NewsAgency.findById(id);
            trending = {
                _id: id,
                icon: newsAgency.icon,
                name: newsAgency.name,
                date: [],
                count: 0
            }
            trending.date = await setDateTrendingAddDate(trending.date, firstDay, lastDay);

        }
        res.json(trending);
    });

    async function CountFromSource(keywords, entityKeywords, firstDay, lastDay) {
        let match = setMatchNews(keywords, entityKeywords, firstDay, lastDay);
        const counter = await News.aggregate([
            { $match: match },
            {
                $lookup: {
                    from: "sources",
                    localField: "source",
                    foreignField: "_id",
                    as: "sourceDetail"
                }
            },
            { "$unwind": "$sourceDetail" },
            {
                $group: {
                    _id: "$sourceDetail._id"
                }
            }
        ]);
        return counter ? counter.length : 0;
    }

    async function ListNewsAgencysWithNews(keywords, entityKeywords, firstDay, lastDay, sourceTypes) {
        let match = setMatchNews(keywords, entityKeywords, firstDay, lastDay);
        let aggregate = [
            { $match: match },
            {
                $lookup: {
                    from: "sources",
                    localField: "source",
                    foreignField: "_id",
                    as: "sourceDetail"
                }
            },
            { "$unwind": "$sourceDetail" },
            {
                $lookup: {
                    from: "newsagencies",
                    localField: "sourceDetail.newsAgency",
                    foreignField: "_id",
                    as: "newsAgencyDetail"
                }
            },
            { "$unwind": "$newsAgencyDetail" },
            {
                $lookup: {
                    from: "sourcetypes",
                    localField: "sourceDetail.sourceType",
                    foreignField: "_id",
                    as: "sourceTypeDetail"
                }
            },
            { "$unwind": "$sourceTypeDetail" },
        ];
        if (sourceTypes.length > 0) {
            aggregate = aggregate.concat(
                {
                    $match:
                    {
                        "sourceTypeDetail.name": { $in: sourceTypes }
                    }
                });
        }
        aggregate = aggregate.concat(
            {
                $group: {
                    _id: "$newsAgencyDetail._id",
                    name: { $first: "$newsAgencyDetail.name" },
                    image: { $first: "$newsAgencyDetail.icon" }
                }
            },
            {
                $addFields: {
                    isActive: true
                }
            }
        );
        return await News.aggregate(aggregate);
    }

    async function TrendingEntityTop(entitys, keywords, entityKeywords, firstDay, lastDay) {
        let match = setMatchNews(keywords, entityKeywords, firstDay, lastDay);
        let entityIds = [];
        var entityTops = [];
        for (const entity of entitys) {
            entityIds.push(ObjectId.isValid(entity) ? ObjectId(entity) : entity);
        }
        var aggregate = [
            { $match: match },
            {
                "$unwind":
                {
                    path: "$keywords",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $addFields: {
                    score: await formulaTrend(lastDay)
                }
            },
            {
                $group: {
                    _id: "$keywords.keywordId",
                    score: { $first: "$score" }
                }
            },
            {
                $lookup: {
                    from: 'keywords',
                    let: { keywordId: '$_id' },
                    // let: { keywordId: '$keywords.keywordId' },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ['$_id', '$$keywordId'] },
                                        { $ne: ["$status", "banned"] },
                                        { $ne: ["$status", "common"] }
                                    ]
                                }
                            }
                        }
                    ],
                    as: 'keywordDetail'
                }
            },
            {
                "$unwind":
                {
                    path: "$keywordDetail",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $group: {
                    _id: "$keywordDetail._id",
                    name: { $first: "$keywordDetail.name" },
                    isTag: { $first: "$keywordDetail.isTag" },
                    score: { $first: "$score" }
                }
            },
            { $sort: { score: -1 } },
            {
                $lookup: {
                    from: "personas",
                    localField: "_id",
                    foreignField: "keywords",
                    as: "personaDetail"
                }
            },
            {
                "$unwind": "$personaDetail"
            },
            {
                $group: {
                    _id: "$personaDetail._id",
                    name: { $first: "$personaDetail.name" },
                    image: { $first: "$personaDetail.image" },
                    keywords: { $first: "$personaDetail.keywords" },
                    details: { $first: "$personaDetail.details" },
                    personaType: { $first: "$personaDetail.personaType" },
                    score: { $sum: "$score" }
                }
            },
            { $sort: { score: -1 } },
            { $match: { _id: { $nin: entityIds } } }
        ];

        var aggregateTop = aggregate.concat({ $limit: 9 });
        const entityTop = await News.aggregate(aggregateTop);
        if (entityTop && entityTop.length) {
            entityTops.push({
                _id: "total",
                name: "",
                icon: "",
                details: "",
                list: entityTop
            });
        }
        aggregate = aggregate.concat(
            {
                $lookup: {
                    from: "personatypes",
                    localField: "personaType",
                    foreignField: "_id",
                    as: "personaTypeDetail"
                }
            },
            { "$unwind": "$personaTypeDetail" },
            {
                $group: {
                    _id: "$personaTypeDetail._id",
                    name: { $first: "$personaTypeDetail.name" },
                    icon: { $first: "$personaTypeDetail.icon" },
                    details: { $first: "$personaTypeDetail.details" },
                    list: { $push: "$$ROOT" },
                    score: { $max: "$score" }
                }
            },
            { $sort: { score: -1 } },
            {
                $project: {
                    name: 1,
                    icon: 1,
                    details: 1,
                    list: { "$slice": ["$list", 0, 9] }
                }
            }
        )
        const entityTopByType = await News.aggregate(aggregate);
        entityTops = entityTops.concat(entityTopByType);
        return entityTops;
    }

    async function KeywordTop(keywords, entityKeywords, firstDay, lastDay) {
        var match = { date: { $gt: new Date(firstDay), $lte: new Date(lastDay) }, $and: [] };
        var ne = [];
        var matchKeywords = [];
        for (const keyword of keywords) {
            matchKeywords.push({ $elemMatch: { keywordId: ObjectId.isValid(keyword) ? ObjectId(keyword) : keyword } });
            ne.push({ _id: { $ne: ObjectId.isValid(keyword) ? ObjectId(keyword) : keyword } })
        }
        if (matchKeywords.length > 0) {
            match.$and.push({ keywords: { $all: matchKeywords } });
        }
        for (const keywords of entityKeywords) {
            let matchEntitys = [];
            for (const keyword of keywords) {
                matchEntitys.push(ObjectId.isValid(keyword) ? ObjectId(keyword) : keyword);
                ne.push({ _id: { $ne: ObjectId.isValid(keyword) ? ObjectId(keyword) : keyword } })
            }
            match.$and.push({ keywords: { $elemMatch: { keywordId: { $in: matchEntitys } } } });
        }
        const keywordTop = await News.aggregate([
            { $match: match },
            { "$unwind": "$keywords" },
            {
                $addFields: {
                    score: await formulaTrend(lastDay)
                }
            },
            {
                $group: {
                    _id: "$keywords.keywordId",
                    count: { $sum: 1 },
                    score: { $sum: "$score" }
                }
            },
            { $match: { $and: ne } },
            {
                $lookup: {
                    from: "personas",
                    localField: "_id",
                    foreignField: "keywords",
                    as: "entity"
                }
            },
            {
                "$unwind":
                {
                    path: "$entity",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $match: {
                    entity: null
                }
            },
            {
                $lookup: {
                    from: "keywords",
                    localField: "_id",
                    foreignField: "_id",
                    as: "keywordDetail"
                }
            },
            {
                "$unwind":
                {
                    path: "$keywordDetail",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $match: {
                    $and: [
                        { "keywordDetail.status": { $ne: 'common' } },
                        { "keywordDetail.status": { $ne: 'banned' } }
                    ]
                }
            },
            { $sort: { score: -1 } },
            { "$unwind": "$keywordDetail" },
            {
                $group: {
                    _id: "$_id",
                    name: { $first: "$keywordDetail.name" },
                    isTag: { $first: "$keywordDetail.isTag" },
                    count: { $first: "$count" },
                    score: { $first: "$score" }
                }
            },
            { $sort: { score: -1 } },
            { $limit: 6 }
        ]);
        return keywordTop;
    }

    async function KeywordRelates(keywordTop, keywords, entityKeywords, firstDay, lastDay) {
        var match = { date: { $gt: new Date(firstDay), $lte: new Date(lastDay) }, $and: [] };
        var ne = [];
        var matchKeywords = [];
        for (const keyword of keywords) {
            matchKeywords.push({ $elemMatch: { keywordId: ObjectId.isValid(keyword) ? ObjectId(keyword) : keyword } });
            ne.push({ _id: { $ne: ObjectId.isValid(keyword) ? ObjectId(keyword) : keyword } })
        }
        for (const keyword of keywordTop) {
            ne.push({ _id: { $ne: ObjectId.isValid(keyword._id) ? ObjectId(keyword._id) : keyword._id } })
        }
        if (matchKeywords.length > 0) {
            match.$and.push({ keywords: { $all: matchKeywords } });
        }
        for (const keywords of entityKeywords) {
            let matchEntitys = [];
            for (const keyword of keywords) {
                matchEntitys.push(ObjectId.isValid(keyword) ? ObjectId(keyword) : keyword);
                ne.push({ _id: { $ne: ObjectId.isValid(keyword) ? ObjectId(keyword) : keyword } })
            }
            match.$and.push({ keywords: { $elemMatch: { keywordId: { $in: matchEntitys } } } });
        }
        const keywordRelates = await News.aggregate([
            { $match: match },
            { "$unwind": "$keywords" },
            {
                $group: {
                    _id: "$keywords.keywordId",
                    count: { $sum: 1 }
                }
            },
            { $match: { $and: ne } },
            {
                $lookup: {
                    from: "personas",
                    localField: "_id",
                    foreignField: "keywords",
                    as: "entity"
                }
            },
            {
                "$unwind":
                {
                    path: "$entity",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $match: {
                    entity: null
                }
            },
            {
                $lookup: {
                    from: "keywords",
                    localField: "_id",
                    foreignField: "_id",
                    as: "keywordDetail"
                }
            },
            {
                "$unwind":
                {
                    path: "$keywordDetail",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $match: {
                    $and: [
                        { "keywordDetail.status": { $ne: 'common' } },
                        { "keywordDetail.status": { $ne: 'banned' } }
                    ]
                }
            },
            { $sort: { count: -1 } },
            { "$unwind": "$keywordDetail" },
            {
                $group: {
                    _id: "$_id",
                    name: { $first: "$keywordDetail.name" },
                    isTag: { $first: "$keywordDetail.isTag" },
                    count: { $first: "$count" }
                }
            },
            { $sort: { count: -1 } }
        ]);
        return keywordRelates;
    }

    function setMatchNews(keywords, entityKeywords, firstDay, lastDay) {
        var match = { date: { $gt: new Date(firstDay), $lte: new Date(lastDay) }, $and: [] };
        var matchKeywords = [];
        for (const keyword of keywords) {
            matchKeywords.push({ $elemMatch: { keywordId: ObjectId.isValid(keyword) ? ObjectId(keyword) : keyword } });
        }
        if (matchKeywords.length > 0) {
            match.$and.push({ keywords: { $all: matchKeywords } });
        }
        for (const keywords of entityKeywords) {
            let matchEntitys = [];
            for (const keyword of keywords) {
                matchEntitys.push(ObjectId.isValid(keyword) ? ObjectId(keyword) : keyword);
            }
            match.$and.push({ keywords: { $elemMatch: { keywordId: { $in: matchEntitys } } } });
        }
        return match;
    }

    async function setDateTrending(trending, firstDay, lastDay) {
        const dates = await getDatesBetween(new Date(firstDay), new Date(lastDay));
        var setTrending = [];
        var counter = 0;
        for (const date of dates) {
            setTrending.push({
                _id: date,
                count: 0
            })
            if (counter !== trending.length) {
                for (const t of trending) {
                    if (date.getDate() === t._id.getDate() && date.getMonth() === t._id.getMonth() && date.getFullYear() === t._id.getFullYear()) {
                        setTrending[setTrending.length - 1] = t;
                        counter++;
                    }
                }
            }
        }
        return setTrending;
    }

    async function setDateTrendingAddDate(trending, firstDay, lastDay) {
        const dates = await getDatesBetween(new Date(firstDay), new Date(lastDay));
        var setTrending = [];
        var counter = 0;
        for (const date of dates) {
            setTrending.push({
                _id: { date: date },
                count: 0
            })
            if (counter !== trending.length) {
                for (const t of trending) {
                    if (date.getDate() === t._id.date.getDate() && date.getMonth() === t._id.date.getMonth() && date.getFullYear() === t._id.date.getFullYear()) {
                        setTrending[setTrending.length - 1] = t;
                        counter++;
                    }
                }
            }
        }
        return setTrending;
    }

    async function getDatesBetween(startDate, endDate) {
        const dates = [];

        // Strip hours minutes seconds etc. 
        let currentDate = new Date(
            startDate.getFullYear(),
            startDate.getMonth(),
            startDate.getDate()
        );

        while (currentDate <= endDate) {
            dates.push(currentDate);

            currentDate = new Date(
                currentDate.getFullYear(),
                currentDate.getMonth(),
                currentDate.getDate() + 1, // Will increase month if over range
            );
        }

        return dates;
    }

    async function TrendingKeywordChart(keywords, entityKeywords, firstDay, lastDay) {
        let match = setMatchNews(keywords, entityKeywords, firstDay, lastDay);
        const trending = await News.aggregate([
            { $match: match },
            {
                $group: {
                    _id: {
                        $dateFromParts: { 'year': { $year: "$date" }, 'month': { $month: "$date" }, 'day': { $dayOfMonth: "$date" } }
                    },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);
        return setDateTrending(trending, firstDay, lastDay);
    }

    async function TrendingSourceTypeChart(keywords, entityKeywords, firstDay, lastDay) {
        let match = setMatchNews(keywords, entityKeywords, firstDay, lastDay);
        const trending = await News.aggregate([
            { $match: match },
            {
                $lookup: {
                    from: "sources",
                    localField: "source",
                    foreignField: "_id",
                    as: "sourceDetail"
                }
            },
            { "$unwind": "$sourceDetail" },
            {
                $lookup: {
                    from: "sourcetypes",
                    localField: "sourceDetail.sourceType",
                    foreignField: "_id",
                    as: "sourceTypeDetail"
                }
            },
            { "$unwind": "$sourceTypeDetail" },
            {
                $group: {
                    _id: {
                        date: { $dateFromParts: { 'year': { $year: "$date" }, 'month': { $month: "$date" }, 'day': { $dayOfMonth: "$date" } } },
                        icon: "$sourceTypeDetail.icon",
                        sourceType: "$sourceTypeDetail.name"
                    },
                    count: { $sum: 1 }
                }
            },
            { $sort: { "_id.date": 1 } },
            {
                $group: {
                    _id: "$_id.sourceType",
                    icon: { $first: "$_id.icon" },
                    date: { $push: "$$ROOT" },
                    count: { $sum: "$count" }
                }
            },
            { $sort: { "count": -1 } },
            {
                $addFields: {
                    isActive: true
                }
            }
        ]);
        for (const trend of trending) {
            trend.date = await setDateTrendingAddDate(trend.date, firstDay, lastDay);
        }
        return trending;
    }

    async function TrendingTopNewsAgencyChart(keywords, entityKeywords, firstDay, lastDay) {
        let match = setMatchNews(keywords, entityKeywords, firstDay, lastDay);
        const trending = await News.aggregate([
            { $match: match },
            {
                $lookup: {
                    from: "sources",
                    localField: "source",
                    foreignField: "_id",
                    as: "sourceDetail"
                }
            },
            { "$unwind": "$sourceDetail" },
            {
                $lookup: {
                    from: "newsagencies",
                    localField: "sourceDetail.newsAgency",
                    foreignField: "_id",
                    as: "newsAgencyDetail"
                }
            },
            { "$unwind": "$newsAgencyDetail" },
            {
                $group: {
                    _id: {
                        date: { $dateFromParts: { 'year': { $year: "$date" }, 'month': { $month: "$date" }, 'day': { $dayOfMonth: "$date" } } },
                        icon: "$newsAgencyDetail.icon",
                        newsAgency: "$newsAgencyDetail.name",
                        _id: "$newsAgencyDetail._id"
                    },
                    count: { $sum: 1 }
                }
            },
            { $sort: { "_id.date": 1, } },
            {
                $group: {
                    _id: "$_id._id",
                    icon: { $first: "$_id.icon" },
                    name: { $first: "$_id.newsAgency" },
                    date: { $push: "$$ROOT" },
                    count: { $sum: "$count" }
                }
            },
            { $sort: { count: -1 } },
            { $limit: 3 }
        ]);
        for (const trend of trending) {
            trend.date = await setDateTrendingAddDate(trend.date, firstDay, lastDay);
        }
        return trending;
    }

    async function TrendingLeastNewsAgencyChart(trendNewsAgencys, keywords, entityKeywords, firstDay, lastDay) {
        let match = setMatchNews(keywords, entityKeywords, firstDay, lastDay);
        const newsAgencys = await NewsAgency.aggregate([
            { $match: { _id: { $nin: trendNewsAgencys } } },
            {
                $lookup: {
                    from: "sources",
                    localField: "_id",
                    foreignField: "newsAgency",
                    as: "sources"
                }
            }
        ]);
        let sources = [];
        for (const newsAgency of newsAgencys) {
            sources = sources.concat(newsAgency.sources);
        }
        const trendingLeast = await News.aggregate([
            { $match: match },
            {
                $match: { source: { $nin: sources } }
            },
            {
                $lookup: {
                    from: "sources",
                    localField: "source",
                    foreignField: "_id",
                    as: "sourceDetail"
                }
            },
            { "$unwind": "$sourceDetail" },
            {
                $lookup: {
                    from: "newsagencies",
                    localField: "sourceDetail.newsAgency",
                    foreignField: "_id",
                    as: "newsAgencyDetail"
                }
            },
            { "$unwind": "$newsAgencyDetail" },
            {
                $group: {
                    _id: {
                        date: { $dateFromParts: { 'year': { $year: "$date" }, 'month': { $month: "$date" }, 'day': { $dayOfMonth: "$date" } } },
                        icon: "$newsAgencyDetail.icon",
                        newsAgency: "$newsAgencyDetail.name",
                        _id: "$newsAgencyDetail._id"
                    },
                    count: { $sum: 1 }
                }
            },
            { $sort: { "_id.date": 1, } },
            {
                $group: {
                    _id: "$_id._id",
                    icon: { $first: "$_id.icon" },
                    name: { $first: "$_id.newsAgency" },
                    date: { $push: "$$ROOT" },
                    count: { $sum: "$count" }
                }
            },
            { $sort: { count: 1 } },
            { $limit: 3 }
        ]);
        for (const trend of trendingLeast) {
            trend.date = await setDateTrendingAddDate(trend.date, firstDay, lastDay);
        }
        return trendingLeast;
    }

    async function TrendingTopLeastJouranlistChart(keywords, entityKeywords, firstDay, lastDay) {
        let match = setMatchNews(keywords, entityKeywords, firstDay, lastDay);
        const journalists = await Journalist.find({});
        let trending = [];
        for (const journalist of journalists) {
            $in = [];
            $in.push(journalist._id);
            const news = await News.aggregate([
                {
                    $match: match
                },
                {
                    $match: { journalists: { $in: $in } }
                },
                {
                    $group: {
                        _id: null,
                        count: { $sum: 1 }
                    }
                }
            ]);
            let data = {
                _id: journalist._id,
                name: journalist.name,
                image: journalist.image,
                count: news.length > 0 ? news[0].count : 0
            }
            trending.push(data);
        }
        trending.sort((a, b) => {
            if (a.count > b.count) return -1;
            if (b.count > a.count) return 1;
            return 0;
        });
        trendingTop = [];
        let index = 0;
        for (const trend of trending) {
            if (trend.count > 0 && trendingTop.length <= 4) {
                trendingTop.push(trend);
                index++;
                if (trendingTop.length <= 4) {
                    break;
                }
            }
        }
        let trendingLeast = trending.slice(index);
        trendingLeast.sort((a, b) => {
            if (a.count > b.count) return 1;
            if (b.count > a.count) return -1;
            return 0;
        });
        trendingLeast.splice(4);
        return { trendingTop: trendingTop, trendingLeast: trendingLeast };
    }

    async function TrendingMapChart(keywords, entityKeywords, firstDay, lastDay) {
        let match = setMatchNews(keywords, entityKeywords, firstDay, lastDay);
        const trending = await News.aggregate([
            { $match: match },
            {
                $lookup: {
                    from: "sources",
                    localField: "source",
                    foreignField: "_id",
                    as: "sourceDetail"
                }
            },
            { "$unwind": "$sourceDetail" },
            {
                $lookup: {
                    from: "countries",
                    localField: "sourceDetail.country",
                    foreignField: "_id",
                    as: "countryDetail"
                }
            },
            { "$unwind": "$countryDetail" },
            {
                $group: {
                    _id: "$countryDetail.name",
                    count: { $sum: 1 }
                }
            }
        ]);
        return trending;
    }

    // news
    router.get('/api/news', async (req, res) => {
        const news = await News.find({})
            .populate("source", {
                selectorData: 0,
                selectorUpdate: 0
            })
        res.json(news)
    });

    router.post('/api/news/search', async (req, res) => {
        let body = req.body;
        var news;
        if (body.isCount) {
            news = await News.countDocuments(body.whereConditions);
        } else {
            news = await News.find(body.whereConditions).skip(body.offset).limit(body.limit).sort(body.sort)
                .populate("source", {
                    selectorData: 0,
                    selectorUpdate: 0
                });
        }
        res.json(news)
    });

    router.get('/api/news/:id', async (req, res) => {
        const { id } = req.params;
        if (!id) {
            res.status(400);
            return res.json("require is id");
        }
        const news = await News.findById(id)
            .populate("source", {
                selectorData: 0,
                selectorUpdate: 0
            })
        res.json(news)
    });

    // country

    router.get('/api/country/:id', async (req, res) => {
        const { id } = req.params;
        if (!id) {
            res.status(400);
            return res.json("require is id");
        }

        const country = await Country.findById(id)
        res.json(country)
    });

    router.post('/api/country/search', async (req, res) => {
        let body = req.body;
        var country;
        if (body.isCount) {
            country = await Country.countDocuments(body.whereConditions);
        } else {
            country = await Country.find(body.whereConditions).skip(body.offset).limit(body.limit).sort(body.sort);
        }
        res.json(country)
    });

    // keyword management 
    router.get('/api/admin/keywordmanagement/unclassified/count', async (req, res) => {
        const count = await Keyword.countDocuments({ $or: [{ status: "unclassified" }, { status: null }] });
        res.json(count);
    });

    router.post('/api/admin/keywordmanagement/search', async (req, res) => {
        let search = req.body.search;
        let filter = !req.body.filter ? "keyword" : req.body.filter;
        let dateField = req.body.dateField;
        let startDate = req.body.startDate;
        let endDate = req.body.endDate;
        var aggregate = [];
        if (dateField && startDate && endDate) {
            var match;
            if (dateField === "useDate") {
                match = { useDate: { $gt: new Date(startDate), $lte: new Date(endDate) } };
                aggregate.push({
                    $sort: {
                        useDate: -1
                    }
                });
            } else if (dateField === "createdDate") {
                match = { createdDate: { $gt: new Date(startDate), $lte: new Date(endDate) } };
                aggregate.push({
                    $sort: {
                        createdDate: -1
                    }
                });
            } else if (dateField === "modifiedDate") {
                match = { modifiedDate: { $gt: new Date(startDate), $lte: new Date(endDate) } };
                aggregate.push({
                    $sort: {
                        modifiedDate: -1
                    }
                });
            } else {
                aggregate.push({
                    $sort: {
                        createdDate: -1
                    }
                });
            }
            if (match) {
                aggregate.push({ $match: match });
            }
        }
        if (search && filter === "keyword") {
            aggregate.push({
                $match: {
                    name: { $regex: search }
                }
            });
        }
        aggregate = aggregate.concat(
            {
                $lookup: {
                    from: "personas",
                    localField: "_id",
                    foreignField: "keywords",
                    as: "entity"
                }
            },
            {
                "$unwind":
                {
                    path: "$entity",
                    preserveNullAndEmptyArrays: true
                }
            }
        );
        if (search && filter === "entity") {
            aggregate.push({
                $match: {
                    "entity.name": { $regex: search }
                }
            });
        }
        aggregate.push({ $limit: 100 });
        let listStatus = [
            'unclassified',
            'trend',
            'permanent',
            'common',
            'banned'
        ];
        let keywordManagements = [];
        for (const status of listStatus) {
            let aggregateClone = JSON.parse(JSON.stringify(aggregate));
            let statusMatch = status === "unclassified" ? {
                $match: {
                    $or: [
                        { status: { $eq: status } },
                        { status: { $eq: null } }
                    ]
                }
            } : { $match: { status: status } };
            aggregateClone.unshift(statusMatch);
            let keywordManagement = {
                _id: status,
                keywords: await Keyword.aggregate(aggregateClone)
            }
            keywordManagements = keywordManagements.concat(keywordManagement);
        }

        res.json(keywordManagements);
    });

    router.post('/api/admin/keywordmanagement/more/:status', async (req, res) => {
        let status = req.params.status;
        let search = req.body.search;
        let filter = !req.body.filter ? "keyword" : req.body.filter;
        let dateField = req.body.dateField;
        let start = req.body.start;
        let end = req.body.end;
        let startDate = req.body.startDate;
        let endDate = req.body.endDate;
        var aggregate = [];
        if (status) {
            if (status === "unclassified") {
                aggregate.push(
                    {
                        $match: {
                            $or: [
                                { status: status },
                                { status: null }
                            ]
                        }
                    }
                );
            } else {
                aggregate.push({
                    $match: {
                        status: status
                    }
                });
            }
        }
        if (dateField && startDate && endDate) {
            var match;
            if (dateField === "useDate") {
                match = { useDate: { $gt: new Date(startDate), $lte: new Date(endDate) } };
                aggregate.push({
                    $sort: {
                        useDate: -1
                    }
                });
            } else if (dateField === "createdDate") {
                match = { createdDate: { $gt: new Date(startDate), $lte: new Date(endDate) } };
                aggregate.push({
                    $sort: {
                        createdDate: -1
                    }
                });
            } else if (dateField === "modifiedDate") {
                match = { modifiedDate: { $gt: new Date(startDate), $lte: new Date(endDate) } };
                aggregate.push({
                    $sort: {
                        modifiedDate: -1
                    }
                });
            } else {
                aggregate.push({
                    $sort: {
                        createdDate: -1
                    }
                });
            }
            if (match) {
                aggregate.push({ $match: match });
            }
        }
        if (search && filter === "keyword") {
            aggregate.push({
                $match: {
                    name: { $regex: search }
                }
            });
        }
        aggregate = aggregate.concat(
            {
                $lookup: {
                    from: "personas",
                    localField: "_id",
                    foreignField: "keywords",
                    as: "entity"
                }
            },
            {
                "$unwind":
                {
                    path: "$entity",
                    preserveNullAndEmptyArrays: true
                }
            }
        );
        if (search && filter === "entity") {
            aggregate.push({
                $match: {
                    "entity.name": { $regex: search }
                }
            });
        }
        if (start && end) {
            aggregate = aggregate.concat(
                { $skip: start },
                { $limit: end }
            );
        }
        const keywordManagement = await Keyword.aggregate(aggregate);

        res.json(keywordManagement);
    });

    router.put('/api/admin/keywordmanagement/move/:from/:to', async (req, res) => {
        const { from } = req.params;
        const { to } = req.params;
        if (!from || !to) {
            res.status(400);
            return res.json("require is status");
        } else if (from !== "unclassified"
            && from !== "trend"
            && from !== "permanent"
            && from !== "common"
            && from !== "banned") {
            res.status(400);
            return res.json("require is unclassified or trend or permanent or common or banned");
        } else if (to !== "unclassified"
            && to !== "trend"
            && to !== "permanent"
            && to !== "common"
            && to !== "banned") {
            res.status(400);
            return res.json("require is unclassified or trend or permanent or common or banned");
        }
        try {
            var find = from === "unclassified" ? { $or: [{ status: "unclassified" }, { status: null }] } : { status: from };
            await Keyword.updateMany(
                find,
                { $set: { "status": to } }
            );
            res.json("Success.");
        } catch (e) {
            res.status(400);
            res.json(e);
        }
    });

    router.put('/api/admin/keywordmanagement/:id/:status', async (req, res) => {
        const { id } = req.params;
        const { status } = req.params;
        if (!id) {
            res.status(400);
            return res.json("require is id");
        }
        if (!status) {
            res.status(400);
            return res.json("require is status");
        } else if (status !== "unclassified"
            && status !== "trend"
            && status !== "permanent"
            && status !== "common"
            && status !== "banned") {
            res.status(400);
            return res.json("require is unclassified or trend or permanent or common or banned");
        }
        const keyword = await Keyword.findByIdAndUpdate(id, { status: status });
        res.json(keyword);
    });

    router.put('/api/admin/keywordmanagement/entity/:id/:status', async (req, res) => {
        const { id } = req.params;
        const { status } = req.params;
        if (!id) {
            res.status(400);
            return res.json("require is id");
        }
        if (!status) {
            res.status(400);
            return res.json("require is status");
        } else if (status !== "unclassified"
            && status !== "trend"
            && status !== "permanent"
            && status !== "common"
            && status !== "banned") {
            res.status(400);
            return res.json("require is unclassified or trend or permanent or common or banned");
        }
        const entity = await Persona.findById(id).populate("keywords");
        if (entity) {
            if (entity.keywords && entity.keywords.length > 0) {
                for (const keyword of entity.keywords) {
                    if (keyword.status !== status) {
                        await Keyword.findByIdAndUpdate(keyword._id, { status: status });
                    }
                }
                res.json(entity);
            } else {
                res.status(400);
                res.json("not is keywords");
            }
        } else {
            res.status(400);
            res.json("not find entity");
        }
    });

    // source
    router.get('/api/source', async (req, res) => {
        const source = await Source.find({})
            .populate("newsAgency")
            .populate("newsCategory")
            .populate("sourceType")
            .populate("country");
        res.json(source)
    });

    router.post('/api/source/search', async (req, res) => {
        let body = req.body;
        var source;
        if (body.isCount) {
            source = await Source.countDocuments(body.whereConditions);
        } else {
            source = await Source.find(body.whereConditions).skip(body.offset).limit(body.limit).sort(body.sort)
                .populate("newsAgency")
                .populate("newsCategory")
                .populate("sourceType")
                .populate("country");
        }
        res.json(source)
    });

    router.get('/api/source/:id', async (req, res) => {
        const { id } = req.params;
        if (!id) {
            res.status(400);
            return res.json("require is id");
        }
        const source = await Source.findById(id)
            .populate("newsAgency")
            .populate("newsCategory")
            .populate("sourceType")
            .populate("country");
        res.json(source)
    });

    router.put('/api/admin/source/:id', async (req, res) => {
        const { id } = req.params;
        const body = req.body;
        if (!id) {
            res.status(400);
            return res.json("require is id");
        }
        if (!body) {
            res.status(400);
            return res.json("require is body");
        }
        const check = await Source.findOne({ name: body.name });
        let isPass = true;
        if (check) {
            if (check._id === id) {
                isPass = false;
            }
        }
        if (!isPass) {
            res.status(400);
            res.json("มีชื่อแหล่งที่มานี้แล้ว")
        } else {
            await Source.findByIdAndUpdate({ _id: id }, body)
            const source = await Source.findById(id)
                .populate("newsAgency")
                .populate("newsCategory")
                .populate("sourceType")
                .populate("country");
            res.json(source)
        }
    });

    router.post('/api/admin/source', async (req, res) => {
        const data = req.body;
        if (!data) {
            res.status(400);
            return res.json("require is body");
        }
        const check = await Source.findOne({ name: data.name });
        if (check) {
            res.status(400);
            res.json("มีชื่อแหล่งที่มานี้แล้ว")
        } else {
            const source = new Source(data)
            const sourceS = await source.save();
            const sourceQ = await Source.findById(sourceS._id)
                .populate("newsAgency")
                .populate("newsCategory")
                .populate("sourceType")
                .populate("country");
            res.json(sourceQ)
        }
    });

    router.delete('/api/admin/source/:id', async (req, res) => {
        const { id } = req.params;
        if (!id) {
            res.status(400);
            return res.json("require is id");
        }
        const source = await Source.findByIdAndDelete(id)
        res.json(source)
    });

    // sourcetype
    router.get('/api/sourcetype', async (req, res) => {
        const sourcetype = await SourceType.find({})
        res.json(sourcetype)
    });

    router.post('/api/sourcetype/search', async (req, res) => {
        let body = req.body;
        var sourcetype;
        if (body.isCount) {
            sourcetype = await SourceType.countDocuments(body.whereConditions);
        } else {
            sourcetype = await SourceType.find(body.whereConditions).skip(body.offset).limit(body.limit).sort(body.sort);
        }
        res.json(sourcetype)
    });

    router.get('/api/sourcetype/:id', async (req, res) => {
        const { id } = req.params;
        if (!id) {
            res.status(400);
            return res.json("require is id");
        }
        const sourcetype = await SourceType.findById(id)
        res.json(sourcetype)
    });

    router.put('/api/admin/sourcetype/:id', async (req, res) => {
        const { id } = req.params;
        const body = req.body;
        if (!id) {
            res.status(400);
            return res.json("require is id");
        }
        if (!body) {
            res.status(400);
            return res.json("require is body");
        }
        const check = await SourceType.findOne({ name: body.name });
        let isPass = true;
        if (check) {
            if (check._id === id) {
                isPass = false;
            }
        }
        if (!isPass) {
            res.status(400);
            res.json("มีชื่อประเภทแหล่งที่มานี้แล้ว")
        } else {
            await SourceType.findByIdAndUpdate({ _id: id }, body)
            const sourcetype = await SourceType.findById(id)
            res.json(sourcetype)
        }
    });

    router.post('/api/admin/sourcetype', async (req, res) => {
        const data = req.body;
        if (!data) {
            res.status(400);
            return res.json("require is body");
        }
        const check = await SourceType.findOne({ name: data.name });
        if (check) {
            res.status(400);
            res.json("มีชื่อประเภทแหล่งที่มานี้แล้ว")
        } else {
            const sourcetype = new SourceType(data)
            await sourcetype.save();
            res.json(sourcetype)
        }
    });

    router.delete('/api/admin/sourcetype/:id', async (req, res) => {
        const { id } = req.params;
        if (!id) {
            res.status(400);
            return res.json("require is id");
        }
        const sourcetype = await SourceType.findByIdAndDelete(id)
        res.json(sourcetype)
    });

    // keywordtype
    router.get('/api/keywordtype', async (req, res) => {
        const keywordtype = await KeywordType.find({})
        res.json(keywordtype)
    });

    router.post('/api/keywordtype/search', async (req, res) => {
        let body = req.body;
        var keywordtype;
        if (body.isCount) {
            keywordtype = await KeywordType.countDocuments(body.whereConditions);
        } else {
            keywordtype = await KeywordType.find(body.whereConditions).skip(body.offset).limit(body.limit).sort(body.sort);
        }
        res.json(keywordtype)
    });

    router.get('/api/keywordtype/:id', async (req, res) => {
        const { id } = req.params;
        if (!id) {
            res.status(400);
            return res.json("require is id");
        }
        const keywordtype = await KeywordType.findById(id)
        res.json(keywordtype)
    });

    router.put('/api/admin/keywordtype/:id', async (req, res) => {
        const { id } = req.params;
        const body = req.body;
        if (!id) {
            res.status(400);
            return res.json("require is id");
        }
        if (!body) {
            res.status(400);
            return res.json("require is body");
        }
        await KeywordType.findByIdAndUpdate({ _id: id }, body)
        const keywordtype = await KeywordType.findById(id)
        res.json(keywordtype)
    });

    router.post('/api/admin/keywordtype', async (req, res) => {
        const data = req.body;
        if (!data) {
            res.status(400);
            return res.json("require is body");
        }
        const keywordtype = new KeywordType(data)
        await keywordtype.save();
        res.json(keywordtype)
    });

    router.delete('/api/admin/keywordtype/:id', async (req, res) => {
        const { id } = req.params;
        if (!id) {
            res.status(400);
            return res.json("require is id");
        }
        const keywordtype = await KeywordType.findByIdAndDelete(id)
        res.json(keywordtype)
    });

    // journalist
    router.get('/api/journalist', async (req, res) => {
        const journalist = await Journalist.find({})
            .populate("source");
        res.json(journalist)
    });

    router.post('/api/journalist/search', async (req, res) => {
        let body = req.body;
        var journalist;
        if (body.isCount) {
            journalist = await Journalist.countDocuments(body.whereConditions);
        } else {
            journalist = await Journalist.find(body.whereConditions).skip(body.offset).limit(body.limit).sort(body.sort)
                .populate("source");
        }
        res.json(journalist)
    });

    router.get('/api/journalist/:id', async (req, res) => {
        const { id } = req.params;
        if (!id) {
            res.status(400);
            return res.json("require is id");
        }
        const journalist = await Journalist.findById(id)
            .populate("source");
        res.json(journalist)
    });

    router.put('/api/admin/journalist/:id', async (req, res) => {
        const { id } = req.params;
        const body = req.body;
        if (!id) {
            res.status(400);
            return res.json("require is id");
        }
        if (!body) {
            res.status(400);
            return res.json("require is body");
        }
        const check = await Journalist.findOne({ name: body.name });
        let isPass = true;
        if (check) {
            if (check._id === id) {
                isPass = false;
            }
        }
        if (!isPass) {
            res.status(400);
            res.json("มีชื่อนักข่าวนี้แล้ว")
        } else {
            await Journalist.findByIdAndUpdate({ _id: id }, body)
            const journalist = await Journalist.findById({ _id: id })
                .populate("source");
            res.json(journalist)
        }
    });

    router.post('/api/admin/journalist', async (req, res) => {
        const data = req.body;
        if (!data) {
            res.status(400);
            return res.json("require is body");
        }
        const check = await Journalist.findOne({ name: data.name });
        if (check) {
            res.status(400);
            res.json("มีชื่อนักข่าวนี้แล้ว")
        } else {
            const journalist = new Journalist(data)
            const journalistS = await journalist.save();
            const journalistQ = await Journalist.findById({ _id: journalistS._id })
                .populate("source");
            res.json(journalistQ)
        }
    });

    router.delete('/api/admin/journalist/:id', async (req, res) => {
        const { id } = req.params;
        if (!id) {
            res.status(400);
            return res.json("require is id");
        }
        const journalist = await Journalist.findByIdAndDelete(id)
        res.json(journalist)
    });

    // config
    router.get('/api/config', async (req, res) => {
        const config = await Config.find({});
        res.json(config)
    });

    router.post('/api/config/search', async (req, res) => {
        let body = req.body;
        var config;
        if (body.isCount) {
            config = await Config.countDocuments(body.whereConditions);
        } else {
            config = await Config.find(body.whereConditions).skip(body.offset).limit(body.limit).sort(body.sort);
        }
        res.json(config)
    });

    router.get('/api/config/:id', async (req, res) => {
        const { id } = req.params;
        if (!id) {
            res.status(400);
            return res.json("require is id");
        }
        const config = await Config.findById(id);
        res.json(config)
    });

    router.put('/api/admin/config/:id', async (req, res) => {
        const { id } = req.params;
        const body = req.body;
        if (!id) {
            res.status(400);
            return res.json("require is id");
        }
        if (!body) {
            res.status(400);
            return res.json("require is body");
        }
        const check = await Config.findOne({ name: body.name });
        let isPass = true;
        if (check) {
            if (check._id === id) {
                isPass = false;
            }
        }
        if (!isPass) {
            res.status(400);
            res.json("มีชื่อค่าระบบนี้แล้ว")
        } else {
            await Config.findByIdAndUpdate({ _id: id }, body)
            const config = await Config.findById({ _id: id });
            res.json(config)
        }
    });

    router.post('/api/admin/config', async (req, res) => {
        const data = req.body;
        if (!data) {
            res.status(400);
            return res.json("require is body");
        }
        const check = await Config.findOne({ name: data.name });
        if (check) {
            res.status(400);
            res.json("มีชื่อค่าระบบนี้แล้ว")
        } else {
            const config = new Config(data)
            const configS = await config.save();
            const configQ = await Config.findById({ _id: configS._id });
            res.json(configQ)
        }
    });

    router.delete('/api/admin/config/:id', async (req, res) => {
        const { id } = req.params;
        if (!id) {
            res.status(400);
            return res.json("require is id");
        }
        const config = await Config.findByIdAndDelete(id)
        res.json(config)
    });

    // persona
    router.get('/api/persona', async (req, res) => {
        const persona = await Persona.find({})
            .populate("personaType")
            .populate("keywords")
        res.json(persona)
    });

    router.post('/api/persona/search', async (req, res) => {
        let body = req.body;
        var persona;
        if (body.isCount) {
            persona = await Persona.countDocuments(body.whereConditions);
        } else {
            persona = await Persona.find(body.whereConditions).skip(body.offset).limit(body.limit).sort(body.sort)
                .populate("personaType")
                .populate("keywords");
        }
        res.json(persona)
    });

    router.get('/api/persona/:id', async (req, res) => {
        const { id } = req.params;
        if (!id) {
            res.status(400);
            return res.json("require is id");
        }
        const persona = await Persona.findById(id)
            .populate("personaType")
            .populate("keywords")
        res.json(persona)
    });

    router.put('/api/admin/persona/:id', async (req, res) => {
        const { id } = req.params;
        const body = req.body;
        if (!id) {
            res.status(400);
            return res.json("require is id");
        }
        if (!body) {
            res.status(400);
            return res.json("require is body");
        }
        const check = await Persona.findOne({ name: body.name });
        let isPass = true;
        if (check) {
            if (check._id === id) {
                isPass = false;
            }
        }
        if (!isPass) {
            res.status(400);
            res.json("มีบุคคลนี้แล้ว")
        } else {
            await Persona.findByIdAndUpdate({ _id: id }, body)
            const persona = await Persona.findById({ _id: id })
                .populate("personaType")
                .populate("keywords")
            res.json(persona)
        }
    });

    router.post('/api/admin/persona', async (req, res) => {
        const data = req.body;
        if (!data) {
            res.status(400);
            return res.json("require is body");
        }
        const check = await Persona.findOne({ name: data.name });
        if (check) {
            res.status(400);
            res.json("มีบุคคลนี้แล้ว")
        } else {
            const persona = new Persona(data)
            const personaS = await persona.save();
            const personaQ = await Persona.findById({ _id: personaS._id })
                .populate("personaType")
                .populate("keywords");
            res.json(personaQ)
        }
    });

    router.delete('/api/admin/persona/:id', async (req, res) => {
        const { id } = req.params;
        if (!id) {
            res.status(400);
            return res.json("require is id");
        }
        const persona = await Persona.findByIdAndDelete(id)
        res.json(persona)
    });

    // personatype
    router.get('/api/personatype', async (req, res) => {
        const personatype = await PersonaType.find({})
        res.json(personatype)
    });

    router.post('/api/personatype/search', async (req, res) => {
        let body = req.body;
        var personatype;
        if (body.isCount) {
            personatype = await PersonaType.countDocuments(body.whereConditions);
        } else {
            personatype = await PersonaType.find(body.whereConditions).skip(body.offset).limit(body.limit).sort(body.sort);
        }
        res.json(personatype)
    });

    router.get('/api/personatype/:id', async (req, res) => {
        const { id } = req.params;
        if (!id) {
            res.status(400);
            return res.json("require is id");
        }
        const personatype = await PersonaType.findById(id)
        res.json(personatype)
    });

    router.put('/api/admin/personatype/:id', async (req, res) => {
        const { id } = req.params;
        const body = req.body;
        if (!id) {
            res.status(400);
            return res.json("require is id");
        }
        if (!body) {
            res.status(400);
            return res.json("require is body");
        }
        const check = await PersonaType.findOne({ name: body.name });
        let isPass = true;
        if (check) {
            if (check._id === id) {
                isPass = false;
            }
        }
        if (!isPass) {
            res.status(400);
            res.json("มีประเภทบุคคลนี้แล้ว")
        } else {
            await PersonaType.findByIdAndUpdate({ _id: id }, body)
            const personatype = await PersonaType.findById(id)
            res.json(personatype)
        }
    });

    router.post('/api/admin/personatype', async (req, res) => {
        const data = req.body;
        if (!data) {
            res.status(400);
            return res.json("require is body");
        }
        const check = await PersonaType.findOne({ name: data.name });
        if (check) {
            res.status(400);
            res.json("มีประเภทบุคคลนี้แล้ว")
        } else {
            const personatype = new PersonaType(data)
            await personatype.save();
            res.json(personatype)
        }
    });

    router.delete('/api/admin/personatype/:id', async (req, res) => {
        const { id } = req.params;
        if (!id) {
            res.status(400);
            return res.json("require is id");
        }
        const personatype = await PersonaType.findByIdAndDelete(id)
        res.json(personatype)
    });

    // newsagency
    router.get('/api/newsagency', async (req, res) => {
        const newsagency = await NewsAgency.find({})
        res.json(newsagency)
    });

    router.post('/api/newsagency/search', async (req, res) => {
        let body = req.body;
        var newsagency;
        if (body.isCount) {
            newsagency = await NewsAgency.countDocuments(body.whereConditions);
        } else {
            newsagency = await NewsAgency.find(body.whereConditions).skip(body.offset).limit(body.limit).sort(body.sort);
        }
        res.json(newsagency)
    });

    router.get('/api/newsagency/:id', async (req, res) => {
        const { id } = req.params;
        if (!id) {
            res.status(400);
            return res.json("require is id");
        }
        const newsagency = await NewsAgency.findById(id)
        res.json(newsagency)
    });

    router.put('/api/admin/newsagency/:id', async (req, res) => {
        const { id } = req.params;
        const body = req.body;
        if (!id) {
            res.status(400);
            return res.json("require is id");
        }
        if (!body) {
            res.status(400);
            return res.json("require is body");
        }
        const check = await NewsAgency.findOne({ name: body.name });
        let isPass = true;
        if (check) {
            if (check._id === id) {
                isPass = false;
            }
        }
        if (!isPass) {
            res.status(400);
            res.json("มีสื่อนี้แล้ว")
        } else {
            await NewsAgency.findByIdAndUpdate({ _id: id }, body)
            const newsagency = await NewsAgency.findById(id)
            res.json(newsagency)
        }
    });

    router.post('/api/admin/newsagency', async (req, res) => {
        const data = req.body;
        if (!data) {
            res.status(400);
            return res.json("require is body");
        }
        const check = await NewsAgency.findOne({ name: data.name });
        if (check) {
            res.status(400);
            res.json("มีสื่อนี้แล้ว")
        } else {
            const newsagency = new NewsAgency(data)
            await newsagency.save();
            res.json(newsagency)
        }
    });

    router.delete('/api/admin/newsagency/:id', async (req, res) => {
        const { id } = req.params;
        if (!id) {
            res.status(400);
            return res.json("require is id");
        }
        const newsagency = await NewsAgency.findByIdAndDelete(id)
        res.json(newsagency)
    });

    // newscategory
    router.get('/api/newscategory', async (req, res) => {
        const newscategory = await NewsCategory.find({})
        res.json(newscategory)
    });

    router.post('/api/newscategory/search', async (req, res) => {
        let body = req.body;
        var newscategory;
        if (body.isCount) {
            newscategory = await NewsCategory.countDocuments(body.whereConditions);
        } else {
            newscategory = await NewsCategory.find(body.whereConditions).skip(body.offset).limit(body.limit).sort(body.sort);
        }
        res.json(newscategory)
    });

    router.get('/api/newscategory/:id', async (req, res) => {
        const { id } = req.params;
        if (!id) {
            res.status(400);
            return res.json("require is id");
        }
        const newscategory = await NewsCategory.findById(id)
        res.json(newscategory)
    });

    router.put('/api/admin/newscategory/:id', async (req, res) => {
        const { id } = req.params;
        const body = req.body;
        if (!id) {
            res.status(400);
            return res.json("require is id");
        }
        if (!body) {
            res.status(400);
            return res.json("require is body");
        }
        const check = await NewsCategory.findOne({ name: body.name });
        let isPass = true;
        if (check) {
            if (check._id === id) {
                isPass = false;
            }
        }
        if (!isPass) {
            res.status(400);
            res.json("มีหมวดหมู่ข่าวนี้แล้ว")
        } else {
            await NewsCategory.findByIdAndUpdate({ _id: id }, body)
            const newscategory = await NewsCategory.findById(id)
            res.json(newscategory)
        }
    });

    router.post('/api/admin/newscategory', async (req, res) => {
        const data = req.body;
        if (!data) {
            res.status(400);
            return res.json("require is body");
        }
        const check = await NewsCategory.findOne({ name: data.name });
        if (check) {
            res.status(400);
            res.json("มีหมวดหมู่ข่าวนี้แล้ว")
        } else {
            const newscategory = new NewsCategory(data)
            await newscategory.save();
            res.json(newscategory)
        }
    });

    router.delete('/api/admin/newscategory/:id', async (req, res) => {
        const { id } = req.params;
        if (!id) {
            res.status(400);
            return res.json("require is id");
        }
        const newscategory = await NewsCategory.findByIdAndDelete(id)
        res.json(newscategory)
    });

    // ADMIN
    router.post('/api/admin/selector/link', (req, res) => {
        let data = req.body;
        let resBody = [];
        if (!data.link) {
            res.status(400)
            return res.json("require is link");
        } else if (!data.find) {
            res.status(400)
            return res.json("require is find");
        } else if (!data.setLink) {
            res.status(400)
            return res.json("require is setLink");
        }
        if (!data.paginate) {
            data.paginate = ""
        }
        if (!data.pageLimit) {
            data.pageLimit = 1
        }
        osmosis
            .get(encodeURI(data.link))
            .paginate(data.paginate, data.pageLimit)
            .find(data.find)
            .set({
                link: data.setLink
            })
            .data(item => {
                if (item.link) {
                    item.link = data.preAddLink ? data.preAddLink + item.link : item.link;
                    item.link = data.addLink ? item.link + data.addLink : item.link;
                    resBody.push(item);
                }
            })
            .error((err) => {
                console.log(err);
                // resBody = err;
            })
            .debug(console.log)
            .done(() => {
                res.json(resBody);
            });
    });

    router.post('/api/admin/selector/social', (req, res) => {
        let data = req.body;
        let resBody = [];
        if (!data.link) {
            res.status(400)
            return res.json("require is link");
        } else if (!data.name) {
            res.status(400)
            return res.json("require is name");
        } else if (data.name !== "facebook" && data.name !== "twitter") {
            res.status(400)
            return res.json("require is name 'facebook' or 'twitter'");
        }
        let listNews = [];
        if (data.name === "facebook") {
            osmosis
                .get(data.link)
                .find("#pagelet_timeline_main_column div._427x .userContentWrapper")
                .set({
                    date: 'div._5pcp._5lel._2jyu._232_ abbr@data-utime',
                    link: 'a._5pcq@href',
                    // img: '.uiScaledImageContainer img@src',
                    tags: ['.text_exposed_show ._58cm'],
                    content: '.userContent'
                })
                .data(news => {
                    link = news.link.split("?");
                    news.link = "https://www.facebook.com/" + link[0];
                    news.title = news.content.substring(0, 50);
                    news.date = new Date(Number(news.date * 1000));
                    if (news.date.toString() === "Invalid Date") {
                        news.date = new Date();
                    }
                    if (news.title) {
                        listNews.push(news);
                    }
                })
                .log(console.log)
                .error(async (err) => {
                    console.log("error: ", err);
                })
                // .debug(console.log)
                .done(async () => {
                    res.json(listNews);
                });
        } else if (data.name === "twitter") {
            osmosis
                .get(data.link)
                .find('body table.tweet')
                .set({
                    'link': '.tweet-header .timestamp > a@href',
                })
                .follow('.tweet-header .timestamp > a@href')
                .set({
                    'link': '.main-tweet .tweet-header .timestamp > a@href',
                    'content': '.main-tweet .tweet-content .tweet-text',
                    'date': '.main-tweet div.metadata',
                    'tags': ['.main-tweet .tweet-content .tweet-text a.twitter-hashtag']
                })
                .data(news => {
                    var contentSplit = news.content.split("\n");
                    news.title = contentSplit[0];
                    if (news.title.length > 100) {
                        news.title = news.content.substring(0, 100);
                    }
                    news.link = "https://twitter.com/" + news.link;
                    if (news.date) {
                        news.date = moment(news.date, "hh:mm a - DD MMM YYYY").toDate();
                    }
                    listNews.push(news);
                })
                .log(console.log)
                .error(async (err) => {
                    console.log("error: ", err);
                })
                // .debug(console.log)
                .done(async () => {
                    res.json(listNews);
                });
        }
    });

    router.post('/api/admin/selector/data', (req, res) => {
        let data = req.body;
        let resBody = [];
        let countLink = 0;
        let countData = 0;
        let isError;
        if (!data.link) {
            res.status(400)
            return res.json("require is selectorUpdate.link");
        }
        if (data.selectorUpdate) {
            if (!data.selectorUpdate.find) {
                res.status(400)
                return res.json("require is selectorUpdate.find");
            } else if (!data.selectorUpdate.setLink) {
                res.status(400)
                return res.json("require is selectorUpdate.setLink");
            }
        } else if (!data.selectorUpdate) {
            res.status(400)
            return res.json("require is selectorUpdate");
        }
        if (data.selectorData) {
            if (!data.selectorData.find) {
                res.status(400)
                return res.json("require is selectorData.find");
            } else if (!data.selectorData.setData) {
                res.status(400)
                return res.json("require is selectorData.setData");
            } else if (!data.selectorData.configDate) {
                res.status(400)
                return res.json("require is selectorData.configDate");
            } else if (typeof data.selectorData.configDate.format !== "string") {
                res.status(400)
                return res.json("require is selectorData.configDate.format");
            } else if (typeof data.selectorData.configDate.locale !== "string") {
                res.status(400)
                return res.json("require is selectorData.configDate.locale");
            }
        } else if (!data.selectorData) {
            res.status(400)
            return res.json("require is selectorData");
        }
        let selectorData = data.selectorData;
        let selectorUpdate = data.selectorUpdate;
        let setData = selectorData.setData;
        let configDate = selectorData.configDate;
        let listNews = [];
        osmosis
            .get(encodeURI(data.link))
            .paginate(selectorUpdate.paginate, selectorUpdate.pageLimit)
            .find(selectorUpdate.find)
            .set({
                link: selectorUpdate.setLink
            })
            .data(item => {
                if (item.link) {
                    countLink++;
                    console.log(item);
                    item.link = selectorUpdate.preAddLink ? selectorUpdate.preAddLink + item.link : item.link;
                    item.link = selectorUpdate.addLink ? item.link + selectorUpdate.addLink : item.link;
                    item.link = encodeURI(item.link);
                    listNews.push(item.link);
                }
            })
            // .log(console.log)
            .error((err) => {
                countLink++;
                console.log(err);
                // resBody = err;
            })
            .done(() => {
                for (const link of listNews) {
                    osmosis
                        .get(link)
                        .find(selectorData.find)
                        .set({
                            img: setData.img,
                            content: setData.content,
                            title: setData.title,
                            tags: [setData.tags],
                            date: setData.date,
                            journalistName: setData.journalistName,
                            journalistImage: setData.journalistImage
                        })
                        .data(news => {
                            countData++;
                            var tags = [];
                            for (const t of news.tags) {
                                const tag = t.split('#').join('');
                                tags.push(tag);
                            }
                            news.tags = tags;
                            news.img = selectorData.preAddLinkImg ? selectorData.preAddLinkImg + news.img : news.img;
                            news.date = news.date ? configDate.format ? moment(news.date, configDate.format, configDate.locale).toDate() : news.date : new Date;
                            console.log("news", news.date);
                            if (news.date.toString() === "Invalid Date" || typeof news.date === "string") {
                                news.date = new Date();
                            } else if (configDate.isConvert) {
                                let date = new Date();
                                date.getFullYear();
                                if (configDate.format.includes("YYYY")) {
                                    news.date.setFullYear(news.date.getFullYear() - 543);
                                } else {
                                    news.date.setFullYear(news.date.getFullYear() - 43);
                                }
                            }
                            resBody.push(news);
                        })
                        // .log(console.log)
                        .error((err) => {
                            countData++;
                            console.log(err);
                            // resBody = err;
                        })
                        // .debug(console.log)
                        .done(() => {
                            if (listNews.length === countData) {
                                console.log("resBody.", resBody.length);
                                res.json(resBody);
                            }
                        })
                }
            })
        // .debug(console.log); 
    });

    router.post('/api/admin/source', async (req, res) => {
        let data = req.body;
        if (!data) {
            res.status(400);
            return res.json("require is body");
        }
        const check = await Source.findOne({ name: data.name });
        if (check) {
            res.status(400);
            res.json("มีชื่อแหล่งที่มานี้แล้ว")
        } else {
            const source = new Source(data);
            await source.save();
            const sourceQ = await Source.findById(source._id)
                .populate("newsAgency")
                .populate("newsCategory")
                .populate("sourceType")
            res.json(sourceQ);
        }
    });

    router.post('/api/admin/source/:id/stop', async (req, res) => {
        const { id } = req.params;
        const source = await Source.findByIdAndUpdate(id, { isScraping: false });
        res.json(source);
    });

    router.post('/api/admin/source/:id/run', async (req, res) => {
        const { id } = req.params;
        if (!id) {
            res.status(400);
            return res.json("require is sourceID");
        }
        const source = await Source.findById(id)
            .populate("newsAgency")
            .populate("newsCategory")
            .populate("sourceType")
        if (source.isScraping) {
            res.status(400);
            return res.json("Is scraping!");
        }
        await Source.findByIdAndUpdate(source._id, { isScraping: true });
        if (source.sourceType.name === "web") {
            runScrapingWeb(source).then((ref) => {
                res.json(ref);
            }).catch((err) => {
                console.log('err', err);
                resBody = err;
                res.status(400);
                res.json(resBody);
            })
        } else if (source.sourceType.name === "facebook") {
            runScrapingFacebook(source).then((ref) => {
                res.json(ref);
            }).catch((err) => {
                console.log('err', err);
                resBody = err;
                res.status(400);
                res.json(resBody);
            })
        } else if (source.sourceType.name === "twitter") {
            runScrapingTwitter(source).then((ref) => {
                res.json(ref);
            }).catch((err) => {
                console.log('err', err);
                resBody = err;
                res.status(400);
                res.json(resBody);
            })
        }
    });

    app.use('/', router);
    app.use(errorHandler());
    app.listen(PORT, () => {
        console.log('Server running at http://127.0.0.1:' + PORT + '/');
    });
}