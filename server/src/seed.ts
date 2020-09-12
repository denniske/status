import 'source-map-support/register';

import {PrismaClient} from "@prisma/client"
import {format, fromUnixTime} from "date-fns";
import {enUS} from "date-fns/locale";
import * as cron from "node-cron";
import fetch from "node-fetch";

const prisma = new PrismaClient({
    log: ['query', 'info', 'warn'],
});

export interface IStatus {
    date: Date;
    available: boolean;
}

async function addGroup(name: string) {
    return await prisma.group.create({
        data: {
            name,
        },
    });
}

async function addComponent(groupId: number, name: string, statusUrl: string, delayInMinutes: number = 1) {
    return await prisma.component.create({
        data: {
            group: {
                connect: {
                    id: groupId,
                },
            },
            name,
            statusUrl,
            delayInMinutes,
        },
    });
}

async function addMetric(groupId: number, name: string, url: string, path: string, delayInMinutes: number = 1) {
    return await prisma.metric.create({
        data: {
            group: {
                connect: {
                    id: groupId,
                },
            },
            name,
            url,
            path,
            delayInMinutes,
        },
    });
}

async function addAlert(componentId: number, metricId: number, condition?: string, conditionValue?: number) {
    return await prisma.alert.create({
        data: {
            component: componentId ? {
                connect: {
                    id: componentId,
                },
            } : {},
            metric: metricId ? {
                connect: {
                    id: metricId,
                },
            } : {},
            condition,
            conditionValue,
            activated: false,
        },
    });
}

async function main() {
    console.log("Seeding...");

    await prisma.status.deleteMany({});
    await prisma.component.deleteMany({});

    await prisma.value.deleteMany({});
    await prisma.metric.deleteMany({});

    await prisma.group.deleteMany({});

    let url = '';

    const system = await addGroup('system');
    await addComponent(system.id, 'runner', '');

    const aoe2companion = await addGroup('aoe2companion');
    url = 'https://import.aoe2companion.com/health';
    await addComponent(aoe2companion.id, 'import', url);
    url = 'https://notify.aoe2companion.com/health';
    await addComponent(aoe2companion.id, 'notify', url);
    url = 'https://function.aoe2companion.com/api/leaderboard?game=aoe2de&leaderboard_id=0&start=100000&count=100';
    await addComponent(aoe2companion.id, 'leaderboard', url);

    const aoe2net = await addGroup('aoe2net');
    url = 'https://aoe2.net/api/leaderboard?game=aoe2de&leaderboard_id=3&start=1&count=100';
    await addComponent(aoe2net.id, '/api/leaderboard', url, 5);
    url = 'https://aoe2.net/api/player/matches?game=aoe2de&steam_id=76561197984749679&count=1000';
    await addComponent(aoe2net.id, '/api/player/matches', url, 5);

    const metricUrl = 'https://metric.aoe2companion.com';
    const sentPushNotifications = await addMetric(aoe2companion.id, 'sentPushNotifications', metricUrl, 'sentPushNotifications');
    await addMetric(aoe2companion.id, 'importedMatches', metricUrl, 'importedMatches');
    await addMetric(aoe2companion.id, 'unfinishedMatches', metricUrl, 'unfinishedMatches');
    await addMetric(aoe2companion.id, 'finishedMatches', metricUrl, 'finishedMatches');
    await addMetric(aoe2companion.id, 'finishedButUndecidedMatches', metricUrl, 'finishedButUndecidedMatches');
    await addMetric(aoe2companion.id, 'leaderboardLastMatchTimeDiffInMinutes', metricUrl, 'leaderboardLastMatchTimeDiffInMinutes');

    const statsUrl = 'https://aoe2.net/api/stats/players?game=aoe2de';
    await addMetric(aoe2net.id, 'players_in_game', statsUrl, 'player_stats[0].num_players.in_game', 5);

    await addAlert(null, sentPushNotifications.id, '<', 1);

    // const allComponents = await prisma.component.findMany()
    // console.log(allComponents);
    //
    // const allStatus = await prisma.status.findMany()
    // console.log(allStatus);
}

main()
    .catch((e) => {
        throw e
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
