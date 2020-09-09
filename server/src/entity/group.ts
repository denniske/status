import {Field, ID, ObjectType} from "type-graphql";

@ObjectType()
export class Group {
    @Field(type => ID)
    id: number;

    @Field()
    name: string;
}