import "reflect-metadata";
import 'source-map-support/register';

import {PrismaClient} from "@prisma/client"
import {format, fromUnixTime} from "date-fns";
import {enUS} from "date-fns/locale";
import * as cron from "node-cron";
import fetch from "node-fetch";
import { get } from 'lodash';
import {prisma} from "./db";
import {buildSchema} from "type-graphql";
import {GroupResolver} from "./resolver/group";
import {ApolloServer} from "apollo-server";

function formatDayAndTime(date: Date) {
    console.log(date);
    return format(date, 'MMM d HH:mm', {locale: enUS});
}

export function sleep(ms: number) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}


export interface IStatus {
    date: Date;
    available: boolean;
}

export interface IValue {
    date: Date;
    value: number;
}

async function addStatus(componentId: number, status: IStatus) {
    // let component = await prisma.component.findOne({where: { name: componentName }});
    // if (!component) {
    //     component = await prisma.component.create({
    //         data: {
    //             name: componentName,
    //         },
    //     });
    // }

    await prisma.status.create({
        data: {
            component: {
                connect: {
                    id: componentId,
                },
            },
            date: status.date,
            available: status.available,
        },
    });
}

async function addValue(metricId: number, status: IValue) {
    await prisma.value.create({
        data: {
            metric: {
                connect: {
                    id: metricId,
                },
            },
            date: status.date,
            value: status.value,
        },
    });
}

async function checkComponentStatus(date: Date, component: any) {
    console.log();
    console.log('Component:', component.name);
    let available = true;
    try {
        const url = component.statusUrl;
        if (url) {
            console.log(url);
            const response = await fetch(url, {timeout: 10 * 1000});
            const json = await response.json();
        }
    } catch (err) {
        available = false;
    }

    console.log(available ? '> available' : '> failed');

    await addStatus(component.id, {
        date,
        available,
    });
}

async function fetchMetric(date: Date, metric: any) {
    console.log();
    console.log('Metric:', metric.name);
    let value: number = null;
    try {
        const url = metric.url;
        if (url) {
            console.log(url);
            const response = await fetch(url, {timeout: 10 * 1000});
            const json = await response.json();
            value = get(json, metric.path);
        }
    } catch (err) {

    }

    console.log(value != null ? '> ' + value : '> failed');

    await addValue(metric.id, {
        date,
        value,
    });
}

async function check() {
    const date = new Date();
    date.setSeconds(0);
    date.setMilliseconds(0);

    console.log('Check components status', formatDayAndTime(date));

    const components = await prisma.component.findMany({});
    for (const component of components) {
        await checkComponentStatus(date, component);
    }

    const metrics = await prisma.metric.findMany({});
    for (const metric of metrics) {
        await fetchMetric(date, metric);
    }
}

async function main() {
    console.log("Starting graphql...");

    const schema = await buildSchema({
        resolvers: [GroupResolver],
    });

    const server = new ApolloServer({
        debug: true,
        schema,
    });

    const { url } = await server.listen(4005);
    console.log(`Server is running, GraphQL Playground available at ${url}`);

    // console.log("Starting scheduler...");
    // check();
    // cron.schedule("* * * * *", check);
}

main()
    .catch((e) => {
        throw e
    })
    .finally(async () => {
        await prisma.$disconnect()
    })


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
