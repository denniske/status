"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
require("source-map-support/register");
var client_1 = require("@prisma/client");
var date_fns_1 = require("date-fns");
var locale_1 = require("date-fns/locale");
var node_fetch_1 = tslib_1.__importDefault(require("node-fetch"));
var lodash_1 = require("lodash");
var prisma = new client_1.PrismaClient({
    log: ['query', 'info', 'warn'],
});
function formatDayAndTime(date) {
    console.log(date);
    return date_fns_1.format(date, 'MMM d HH:mm', { locale: locale_1.enUS });
}
function sleep(ms) {
    return new Promise(function (resolve) {
        setTimeout(resolve, ms);
    });
}
exports.sleep = sleep;
function addStatus(componentId, status) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: 
                // let component = await prisma.component.findOne({where: { name: componentName }});
                // if (!component) {
                //     component = await prisma.component.create({
                //         data: {
                //             name: componentName,
                //         },
                //     });
                // }
                return [4 /*yield*/, prisma.status.create({
                        data: {
                            component: {
                                connect: {
                                    id: componentId,
                                },
                            },
                            date: status.date,
                            available: status.available,
                        },
                    })];
                case 1:
                    // let component = await prisma.component.findOne({where: { name: componentName }});
                    // if (!component) {
                    //     component = await prisma.component.create({
                    //         data: {
                    //             name: componentName,
                    //         },
                    //     });
                    // }
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function addValue(metricId, status) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, prisma.value.create({
                        data: {
                            metric: {
                                connect: {
                                    id: metricId,
                                },
                            },
                            date: status.date,
                            value: status.value,
                        },
                    })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function checkComponentStatus(date, component) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var available, url, response, json, err_1;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log();
                    console.log('Component:', component.name);
                    available = true;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 5, , 6]);
                    url = component.statusUrl;
                    if (!url) return [3 /*break*/, 4];
                    console.log(url);
                    return [4 /*yield*/, node_fetch_1.default(url, { timeout: 10 * 1000 })];
                case 2:
                    response = _a.sent();
                    return [4 /*yield*/, response.json()];
                case 3:
                    json = _a.sent();
                    _a.label = 4;
                case 4: return [3 /*break*/, 6];
                case 5:
                    err_1 = _a.sent();
                    available = false;
                    return [3 /*break*/, 6];
                case 6:
                    console.log(available ? '> available' : '> failed');
                    return [4 /*yield*/, addStatus(component.id, {
                            date: date,
                            available: available,
                        })];
                case 7:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function fetchMetric(date, metric) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var value, url, response, json, err_2;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log();
                    console.log('Metric:', metric.name);
                    value = null;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 5, , 6]);
                    url = metric.url;
                    if (!url) return [3 /*break*/, 4];
                    console.log(url);
                    return [4 /*yield*/, node_fetch_1.default(url, { timeout: 10 * 1000 })];
                case 2:
                    response = _a.sent();
                    return [4 /*yield*/, response.json()];
                case 3:
                    json = _a.sent();
                    value = lodash_1.get(json, metric.path);
                    _a.label = 4;
                case 4: return [3 /*break*/, 6];
                case 5:
                    err_2 = _a.sent();
                    return [3 /*break*/, 6];
                case 6:
                    console.log(value != null ? '> ' + value : '> failed');
                    return [4 /*yield*/, addValue(metric.id, {
                            date: date,
                            value: value,
                        })];
                case 7:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function check() {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var date, components, components_1, components_1_1, component, e_1_1, metrics, metrics_1, metrics_1_1, metric, e_2_1;
        var e_1, _a, e_2, _b;
        return tslib_1.__generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    date = new Date();
                    date.setSeconds(0);
                    date.setMilliseconds(0);
                    console.log('Check components status', formatDayAndTime(date));
                    return [4 /*yield*/, prisma.component.findMany({})];
                case 1:
                    components = _c.sent();
                    _c.label = 2;
                case 2:
                    _c.trys.push([2, 7, 8, 9]);
                    components_1 = tslib_1.__values(components), components_1_1 = components_1.next();
                    _c.label = 3;
                case 3:
                    if (!!components_1_1.done) return [3 /*break*/, 6];
                    component = components_1_1.value;
                    return [4 /*yield*/, checkComponentStatus(date, component)];
                case 4:
                    _c.sent();
                    _c.label = 5;
                case 5:
                    components_1_1 = components_1.next();
                    return [3 /*break*/, 3];
                case 6: return [3 /*break*/, 9];
                case 7:
                    e_1_1 = _c.sent();
                    e_1 = { error: e_1_1 };
                    return [3 /*break*/, 9];
                case 8:
                    try {
                        if (components_1_1 && !components_1_1.done && (_a = components_1.return)) _a.call(components_1);
                    }
                    finally { if (e_1) throw e_1.error; }
                    return [7 /*endfinally*/];
                case 9: return [4 /*yield*/, prisma.metric.findMany({})];
                case 10:
                    metrics = _c.sent();
                    _c.label = 11;
                case 11:
                    _c.trys.push([11, 16, 17, 18]);
                    metrics_1 = tslib_1.__values(metrics), metrics_1_1 = metrics_1.next();
                    _c.label = 12;
                case 12:
                    if (!!metrics_1_1.done) return [3 /*break*/, 15];
                    metric = metrics_1_1.value;
                    return [4 /*yield*/, fetchMetric(date, metric)];
                case 13:
                    _c.sent();
                    _c.label = 14;
                case 14:
                    metrics_1_1 = metrics_1.next();
                    return [3 /*break*/, 12];
                case 15: return [3 /*break*/, 18];
                case 16:
                    e_2_1 = _c.sent();
                    e_2 = { error: e_2_1 };
                    return [3 /*break*/, 18];
                case 17:
                    try {
                        if (metrics_1_1 && !metrics_1_1.done && (_b = metrics_1.return)) _b.call(metrics_1);
                    }
                    finally { if (e_2) throw e_2.error; }
                    return [7 /*endfinally*/];
                case 18: return [2 /*return*/];
            }
        });
    });
}
function main() {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            console.log("Started scheduler");
            check();
            return [2 /*return*/];
        });
    });
}
main()
    .catch(function (e) {
    throw e;
})
    .finally(function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
    return tslib_1.__generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, prisma.$disconnect()];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
// async function refetchMatchesSinceLastTime() {
//     const connection = await createDB();
//
//     console.log(new Date(), "Refetch leaderboard recent matches");
//
//     await prisma.match.updateMany({
//         where: {
//             match_id: { in: updatedButNotFinishedMatches.map(m => m.match_id) },
//         },
//         data: {
//             maybe_finished: -1,
//         },
//     });
//
//     // await sleep(60 * 1000);
//     return true;
// }
//# sourceMappingURL=server.js.map