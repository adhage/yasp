var express = require('express');
var api = express.Router();
var constants = require('../constants');
var advQuery = require('../advquery');
api.get('/items', function(req, res) {
    res.json(constants.items[req.query.name]);
});
api.get('/abilities', function(req, res) {
    res.json(constants.abilities[req.query.name]);
});
api.get('/matches', function(req, res, next) {
    var draw = Number(req.query.draw);
    var select = req.query.select || {};
    var limit = Number(req.query.limit);
    var js_agg = req.query.agg || {"win":1,"games":1};
    //support sort hash, or order+columns
    var js_sort = req.query.js_sort || makeSort(req.query.order, req.query.columns) || {};
    var js_limit = Number(req.query.length) || 1;
    var js_skip = Number(req.query.start) || 0;
    advQuery({
        select: select,
        project: null, //just project default fields
        //trying to sort after a players.account_id select is very slow
        /*
        sort: {
            "match_id": -1
        },
        */
        limit: limit,
        js_agg: js_agg,
        js_limit: js_limit,
        js_skip: js_skip,
        js_sort: js_sort,
    }, function(err, result) {
        if (err) {
            return next(err);
        }
        result = {
            draw: draw,
            aggData: result.aggData,
            recordsTotal: result.unfiltered_count,
            recordsFiltered: result.data.length,
            data: result.page
        };
        res.json(result);
    });
});

function makeSort(order, columns) {
    //Makes sort from a datatables call
    var sort;
    if (order && columns) {
        sort = {};
        order.forEach(function(s) {
            var c = columns[Number(s.column)];
            if (c) {
                sort[c.data] = s.dir === 'desc' ? -1 : 1;
            }
        });
    }
    return sort;
}
module.exports = api;