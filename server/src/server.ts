import "reflect-metadata";
import 'source-map-support/register';

import {PrismaClient} from "@prisma/client"
import {format, fromUnixTime} from "date-fns";
import {enUS} from "date-fns/locale";
import * as cron from "node-cron";
import fetch, {Response} from "node-fetch";
import { get } from 'lodash';
import {prisma} from "./db";
import {buildSchema} from "type-graphql";
import {GroupResolver} from "./resolver/group";
import {ApolloServer} from "apollo-server";
import request, {gql} from "graphql-request";
import { v4 as uuidv4 } from 'uuid';
import {run} from "tslint/lib/runner";

// let JOB_NAME = 'test';
// let RUN_ID = uuidv4();
//
// interface IRun {
//     runId: string;
//     started?: Date;
//     finished?: Date;
//     success?: boolean;
// }
//
// async function updateRun(run: IRun) {
//     const endpoint = 'http://localhost:5005/graphql'
//     const query = gql`
//         mutation updateRun($updateRunInput: UpdateRunInput!) {
//             updateRun(updateRunInput: $updateRunInput)
//         }
//     `;
//
//     const variables = { updateRunInput: {...run, jobName: JOB_NAME} };
//     const data = await request(endpoint, query, variables)
//     // origLog(JSON.stringify(data, undefined, 2))
//     // origLog('lines', lines);
// }
//
// async function newLog(args: any) {
//     const lines = [
//         {
//             date: new Date(),
//             text: formatArgs(args),
//         },
//     ];
//
//     const endpoint = 'http://localhost:5005/graphql'
//
//     const query = gql`
//         mutation log($title: LogInput!) {
//             log(logInput: $title)
//         }
//     `
//
//     const variables = {
//         title: {
//             jobName: JOB_NAME,
//             runId: RUN_ID,
//             lines,
//         },
//     };
//
//     const data = await request(endpoint, query, variables)
//     // origLog(JSON.stringify(data, undefined, 2))
//     // origLog('lines', lines);
// }
//
// const util = require('util');
//
// function formatArgs(args: any){
//     return util.formatWithOptions.apply(util.formatWithOptions, [{ colors: true }, ...Array.prototype.slice.call(args)]);
// }
//
// const origLog = console.log;
// console.log = function() {
//     // origLog(JSON.stringify({a: formatArgs(arguments)}));
//     origLog(...arguments);
//     newLog(arguments);
// };




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
    responseTime?: number;
}

export interface IValue {
    date: Date;
    value: number;
}

async function addStatus(componentId: number, status: IStatus) {
    await prisma.status.create({
        data: {
            component: {
                connect: {
                    id: componentId,
                },
            },
            date: status.date,
            available: status.available,
            responseTime: status.responseTime,
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
    let responseTime = null;
    try {
        const url = component.statusUrl;
        console.log(url);
        if (url) {
            const started = new Date();
            const response = await fetch(url, {timeout: 30 * 1000});
            responseTime = new Date().getTime() - started.getTime();
            const json = await response.json();
        }
    } catch (err) {
        available = false;
    }

    if (available) {
        console.log('> available', responseTime);
    } else {
        console.log('> failed');
    }

    await addStatus(component.id, {
        date,
        available,
        responseTime,
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

    console.log('Check components status');
    console.log('Check components status');
    console.log('Check components status', formatDayAndTime(date));

    const components = await prisma.component.findMany({});
    for (const component of components) {
        await checkComponentStatus(date, component);
        await sleep(5000);
    }

    const metrics = await prisma.metric.findMany({});
    for (const metric of metrics) {
        await fetchMetric(date, metric);
    }
}

let running = false;

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

    console.log("Starting scheduler...");
    // check();
    cron.schedule("0 * * * * *", async () => {
        console.log("Last job:", running);
        if (running) {
            console.log("Last job still running.");
            return;
        }
        running = true;
        // RUN_ID = uuidv4();
        // updateRun({ runId: RUN_ID, started: new Date()});
        let error = null;
        try {
            await check();
        } catch (err) {
            error = err;
            console.error(err);
        }
        running = false;
        // updateRun({ runId: RUN_ID, finished: new Date(), success: error == null});
    });
}

main();
    // .catch((e) => {
    //     throw e
    // })
    // .finally(async () => {
    //     await prisma.$disconnect()
    // })
