import {Field, ID, ObjectType} from "type-graphql";
import {Status} from "./status";
import {Value} from "./value";

@ObjectType()
export class Metric {
    @Field(type => ID)
    id: number;

    @Field()
    name: string;

    @Field({ defaultValue: 1 })
    delayInMinutes: number;

    @Field(type => [Value])
    values: Value[];
}