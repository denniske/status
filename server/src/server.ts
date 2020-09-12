import "reflect-metadata";
import 'source-map-support/register';

import {PrismaClient} from "@prisma/client"
import {format, fromUnixTime, subMinutes} from "date-fns";
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

require('dotenv').config();

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

function checkCondition(value: number, condition: string, conditionValue: number) {
    switch (condition) {
        case '<':
            console.log('check', value, '<', conditionValue);
            return value < conditionValue;
    }
}

const mail = require('@sendgrid/mail');
mail.setApiKey(process.env.SENDGRID_API_KEY);

async function sendAlert(alert: any) {
    const subject = 'AoE II Companion Alert ' + alert.metric.name;
    const msg = {
        to: process.env.ALERT_MAIL_TO,
        from: 'alert@aoe2companion.com',
        subject,
        text: 'Alert for ' + alert.metric.name,
    };
    await prisma.alert.update({
        where: {
            id: alert.id,
        },
        data: {
            activated: true,
        },
    });
    await mail.send(msg);
}

async function checkAlert(date: Date, alert: any) {
    if (alert.metric) {
        const values = await prisma.value.findMany({
            where: {
                metricId: alert.metricId,
                date: {
                    gt: subMinutes(date, 5 * alert.metric.delayInMinutes),
                },
            },
        });
        console.log(values);
        if (values.length === 5 && values.every(v => checkCondition(v.value, alert.condition, alert.conditionValue))) {
            console.log('sending alert');
            await sendAlert(alert);
        }
    }
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
        if (minute % component.delayInMinutes != 0) continue;
        await checkComponentStatus(date, component);
        await sleep(500);
    }

    const metrics = await prisma.metric.findMany({});
    for (const metric of metrics) {
        if (minute % metric.delayInMinutes != 0) continue;
        await fetchMetric(date, metric);
    }

    const alerts = await prisma.alert.findMany({
        include: {
            component: true,
            metric: true,
        },
        where: {
            activated: false,
        },
    });
    for (const alert of alerts) {
        await checkAlert(date, alert);
    }
}

let running = false;
let minute = 0;

async function main() {
    console.log("Starting graphql...");

    const schema = await buildSchema({
        resolvers: [GroupResolver],
    });

    const server = new ApolloServer({
        debug: true,
        schema,
    });

    console.log('process.env.PORT', process.env.PORT);
    const { url } = await server.listen(process.env.PORT);
    console.log(`Server is running, GraphQL Playground available at ${url}`);

    console.log("Starting scheduler...");
    // check();
    cron.schedule("0 * * * * *", async () => {
        minute++;
        // console.log("Last job:", running);
        // if (running) {
        //     console.log("Last job still running.");
        //     return;
        // }
        // running = true;
        // RUN_ID = uuidv4();
        // updateRun({ runId: RUN_ID, started: new Date()});
        let error = null;
        try {
            await check();
        } catch (err) {
            error = err;
            console.error(err);
        }
        // running = false;
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
