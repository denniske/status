"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
require("source-map-support/register");
var client_1 = require("@prisma/client");
var prisma = new client_1.PrismaClient({
    log: ['query', 'info', 'warn'],
});
function addGroup(name) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, prisma.group.create({
                        data: {
                            name: name,
                        },
                    })];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
function addComponent(groupId, name, statusUrl) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, prisma.component.create({
                        data: {
                            group: {
                                connect: {
                                    id: groupId,
                                },
                            },
                            name: name,
                            statusUrl: statusUrl,
                        },
                    })];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
function addMetric(groupId, name, url, path) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, prisma.metric.create({
                        data: {
                            group: {
                                connect: {
                                    id: groupId,
                                },
                            },
                            name: name,
                            url: url,
                            path: path,
                        },
                    })];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
function main() {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var system, runner, aoe2net, leaderboardUrl, leaderboard, statsUrl, playersInGame;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("Seeding...");
                    return [4 /*yield*/, prisma.status.deleteMany({})];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, prisma.component.deleteMany({})];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, prisma.value.deleteMany({})];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, prisma.metric.deleteMany({})];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, prisma.group.deleteMany({})];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, addGroup('system')];
                case 6:
                    system = _a.sent();
                    return [4 /*yield*/, addComponent(system.id, 'runner', '')];
                case 7:
                    runner = _a.sent();
                    return [4 /*yield*/, addGroup('aoe2net')];
                case 8:
                    aoe2net = _a.sent();
                    leaderboardUrl = 'https://aoe2.net/api/leaderboard?game=aoe2de&leaderboard_id=3&start=1&count=1';
                    return [4 /*yield*/, addComponent(aoe2net.id, 'leaderboard', leaderboardUrl)];
                case 9:
                    leaderboard = _a.sent();
                    statsUrl = 'https://aoe2.net/api/stats/players?game=aoe2de';
                    return [4 /*yield*/, addMetric(aoe2net.id, 'leaderboard', statsUrl, 'player_stats[0].num_players.in_game')];
                case 10:
                    playersInGame = _a.sent();
                    return [2 /*return*/];
            }
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
//# sourceMappingURL=seed.js.map