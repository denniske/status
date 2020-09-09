import {Field, ID, ObjectType} from "type-graphql";

@ObjectType()
export class Status {
    @Field(type => ID)
    componentId: number;

    @Field()
    date: Date;

    @Field()
    available: boolean;
}