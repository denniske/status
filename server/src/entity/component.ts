import {Field, ID, ObjectType} from "type-graphql";
import {Status} from "./status";

@ObjectType()
export class Component {
    @Field(type => ID)
    id: number;

    @Field()
    name: string;

    @Field(type => [Status])
    status: Status[];
}