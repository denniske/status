import {Field, ID, ObjectType} from "type-graphql";

@ObjectType()
export class Value {
    @Field(type => ID)
    metricId: number;

    @Field()
    date: Date;

    @Field({ nullable: true })
    value?: number;
}