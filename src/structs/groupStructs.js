import { object, number, min, partial } from "superstruct";
import { pageParamsStruct } from './commonStructs';

export const GetGroupListParamsStruct = pageParamsStruct;

export const AddGroupLike = object({ groupid: min(number(), 0) });

export const MinusGroupLike = partial(AddGroupLike);



