/*
 * @license Chanyaban v0.1
 * (c) 2020-2021 KaoGeek. http://kaogeek.dev
 * License: MIT. https://opensource.org/licenses/MIT
 * Author: oilNEWlio <apidech.s@absolute.co.th>
 */

const Moment = require('moment/moment');
const MomentRange = require('moment-range');
const moment = MomentRange.extendMoment(Moment);
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const osmosis = require('osmosis');
const axios = require('axios');
const cheerio = require('cheerio');
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
    let range = getBeforeTodayRange(7);
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
    ]).allowDiskUse(true).exec();
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
    ]).allowDiskUse(true).exec();
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

async function cronJobTrendSearch() {
    console.log("cronJobTrendSearch");
    let range = getBeforeTodayRange(7);
    let firstDay = range[0];
    let lastDay = range[1];
    let matchDate = { $gt: new Date(firstDay), $lte: new Date(lastDay) };
    var configPageLimit = await Config.findOne({ name: "config.trend.page.limit" });
    if (configPageLimit && configPageLimit.value) {
        configPageLimit = configPageLimit.value;
    } else {
        configPageLimit = 300;
        const config = new Config({
            name: "config.trend.page.limit",
            type: "number",
            value: configPageLimit,
            createdDate: new Date,
            modifiedDate: new Date,
        });
        await config.save();
    }
    var configPageSearch = await Config.findOne({ name: "config.trend.page.search" });
    if (configPageSearch && configPageSearch.value) {
        configPageSearch = configPageSearch.value;
    } else {
        configPageSearch = 30;
        const config = new Config({
            name: "config.trend.page.search",
            type: "number",
            value: configPageSearch,
            createdDate: new Date,
            modifiedDate: new Date,
        });
        await config.save();
    }
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
    ]).allowDiskUse(true).exec();
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
        { $limit: configPageLimit }
    ];
    var searchKeywordAll = await News.aggregate(aggregate).allowDiskUse(true).exec();
    const trendSearch = {
        name: "search",
        trending: searchKeywordAll && searchKeywordAll.length ? searchKeywordAll.slice(0, configPageSearch) : [],
        date: new Date()
    }
    console.log("searchKeywordAll: ", searchKeywordAll.length);
    const trendSearchUpdate = await Trend.findOneAndUpdate({ name: "search" }, trendSearch);
    if (!trendSearchUpdate) {
        const trend = new Trend(trendSearch);
        await trend.save();
    }
    // chart trend
    var listTrending = [];
    for (const trend of searchKeywordAll) {
        let keywords = trend.data.keywords ? [] : [trend.data._id + ""];
        let entityKeywords = trend.data.keywords ? [trend.data.keywords] : [];
        data = trend.data;
        data.count = trend.count;
        data.lastDate = moment(trend.lastDate).locale("th").fromNow();
        data.trend = await TrendingKeywordChart(keywords, entityKeywords, firstDay, lastDay);
        listTrending.push(data);
    }
    if (listTrending.length > 0) {
        if (listTrending[0].keywords) {
            const keywords = await Persona.aggregate([
                {
                    $match: {
                        _id: ObjectId(listTrending[0]._id)
                    }
                },
                { "$unwind": "$keywords" },
                {
                    $lookup: {
                        from: 'keywords',
                        let: { keywordId: '$keywords' },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            { $eq: ['$_id', '$$keywordId'] },
                                            { $ne: ["$status", "banned"] }
                                        ]
                                    }
                                }
                            }
                        ],
                        as: 'keywordDetail'
                    }
                },
                { "$unwind": "$keywordDetail" },
                {
                    $group: {
                        _id: null,
                        keywords: { $addToSet: "$keywordDetail._id" }
                    }
                }
            ]);
            if (keywords.length > 0) {
                listTrending[0].sourceType = await TrendingSourceTypeChart([], [keywords[0].keywords], firstDay, lastDay);
            }
        } else {
            listTrending[0].sourceType = await TrendingSourceTypeChart([listTrending[0]._id], [], firstDay, lastDay);
        }
        const trendPage = {
            name: "trend",
            trending: listTrending && listTrending.length ? listTrending : [],
            date: new Date()
        }
        console.log("listTrending: ", listTrending.length);
        const trendPageUpdate = await Trend.findOneAndUpdate({ name: "trend" }, trendPage);
        if (!trendPageUpdate) {
            const trend = new Trend(trendPage);
            await trend.save();
        }
    }
    return listTrending;
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
                    setTrending[setTrending.length - 1].count += t.count;
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
                    setTrending[setTrending.length - 1].count += t.count;
                    counter++;
                }
            }
        }
    }
    return setTrending;
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
    ]).allowDiskUse(true).exec();
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
    ]).allowDiskUse(true).exec();
    for (const trend of trending) {
        trend.date = await setDateTrendingAddDate(trend.date, firstDay, lastDay);
    }
    return trending;
}

async function cronJobScraping() {
    const sources = await Source.find({ setTimeout: { $gt: 0 } })
        .populate("newsAgency")
        .populate("newsCategory")
        .populate("sourceType")
        .sort({ "selectorData.setData.tags": -1 });
    console.log("cronJobScraping: ", sources);
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
                await Source.findByIdAndUpdate(source._id, { isScraping: false, isUsable: false });
                console.log(err)
            })
            .done(async () => {
                let promiseAll = [];
                for (const link of listLink) {
                    promiseAll.push(ScrapingWeb(link, source));
                }
                Promise.all(promiseAll).then(async (listNews) => {
                    if (listNews.length === 0) {
                        return reject({ error: "not usable", message: "not usable" });
                    }
                    await Source.findByIdAndUpdate(source._id, { isScraping: false, isUsable: true });
                    for (const news of listNews) {
                        if (news && news.link) {
                            await AddNews(news);
                        }
                    }
                    console.log("final done.");
                    resolve(listNews);
                }).catch(async (err) => {
                    await Source.findByIdAndUpdate(source._id, { isScraping: false, isUsable: false });
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
                await Source.findByIdAndUpdate(source._id, { isScraping: false, isUsable: false });
                console.log("error: ", err);
            })
            // .debug(console.log)
            .done(() => resolve(News));
    });
}

async function runScrapingFacebook(source) {
    return new Promise((resolve, reject) => {
        let listNews = [];
        // osmosis
        //     .get(source.link)
        //     .find("#pagelet_timeline_main_column div._427x .userContentWrapper")
        //     .set({
        //         date: 'div._5pcp._5lel._2jyu._232_ abbr@data-utime',
        //         link: 'a._5pcq@href',
        //         // img: '.uiScaledImageContainer img@src',
        //         tags: ['.text_exposed_show ._58cm'],
        //         content: '.userContent'
        //     })
        //     .data(news => {
        //         news.keywords = {};
        //         news.source = source._id;
        //         link = news.link.split("?");
        //         news.link = "https://www.facebook.com/" + link[0];
        //         news.title = news.content.substring(0, 100);
        //         news.img = "";
        //         news.date = new Date(Number(news.date * 1000));
        //         news.createdDate = new Date();
        //         news.modifiedDate = new Date();
        //         if (news.date.toString() === "Invalid Date") {
        //             news.date = new Date();
        //         }
        //         if (news.title) {
        //             listNews.push(news);
        //         }
        //     })
        //     .log(console.log)
        //     .error(async (err) => {
        //         await Source.findByIdAndUpdate(source._id, { isScraping: false, isUsable: false });
        //         console.log("error: ", err);
        //     })
        //     // .debug(console.log)
        //     .done(async () => {
        //         if (listNews.length === 0) {
        //             return reject({ error: "not usable", message: "not usable" });
        //         }
        //         await Source.findByIdAndUpdate(source._id, { isScraping: false, isUsable: true });
        //         for (const news of listNews) { 
        //             if (news.link) {
        //                 await AddNews(news);
        //             }
        //         }
        //         console.log("final done.");
        //         resolve(listNews);
        //     });

        axios.get(source.link).then(async (response) => {
            if (response.status === 200) {
                const html = response.data;
                const $ = cheerio.load(html);
                $('#pagelet_timeline_main_column div._1dwg._1w_m._q7o').each(function (i, elem) {
                    var tags = [];
                    $(this).find('.text_exposed_show ._58cm').each(function (i, elem) {
                        if ($(this).text().trim() !== "") {
                            tags.push($(this).text().trim());
                        }
                    });
                    var post = $(this).find('.userContent').text().trim();
                    var title = post.substring(0, 50);
                    news = {
                        keywords: {},
                        source: source._id,
                        title: title,
                        img: "",
                        content: $(this).find('.userContent').text().trim(),
                        date: new Date(Number($(this).find('div._5pcp._5lel._2jyu._232_ abbr').attr('data-utime') * 1000)),
                        link: "https://facebook.com/" + $(this).find("a._5pcq").attr('href'),
                        tags: tags,
                        createdDate: new Date(),
                        modifiedDate: new Date()
                    };
                    if (news.date.toString() === "Invalid Date") {
                        news.date = new Date();
                    }
                    if (news.title) {
                        listNews.push(news);
                    }
                });
                if (listNews.length === 0) {
                    return reject({ error: "not usable", message: "not usable" });
                }
                await Source.findByIdAndUpdate(source._id, { isScraping: false, isUsable: true });
                for (const news of listNews) {
                    if (news.link) {
                        await AddNews(news);
                    }
                }
                console.log("final done.");
                resolve(listNews);
            }
        }, (error) => Source.findByIdAndUpdate(source._id, { isScraping: false, isUsable: false }));
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
                await Source.findByIdAndUpdate(source._id, { isScraping: false, isUsable: false });
                console.log("error: ", err);
            })
            .done(async () => {
                if (listNews.length === 0) {
                    return reject({ error: "not usable", message: "not usable" });
                }
                await Source.findByIdAndUpdate(source._id, { isScraping: false, isUsable: true });
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
    const configNumCPUs = await Config.findOne({ name: "config.cronjob.numCPUs" });
    numCPUs = configNumCPUs && configNumCPUs.value ? configNumCPUs.value : typeof numCPUs === "number" ? numCPUs : 1;
    console.log("numCPUs: ", numCPUs);
    if (numCPUs <= 1) {
        // Create a worker
        cluster.fork();
        cron.schedule('0 */5 * * * *', async () => {
            console.log('running a task every 5 minute one CPU');
            cronJobTrendHome();
            cronJobTrendSearch();
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
                    cronJobTrendSearch();
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
    console.log("test");
}