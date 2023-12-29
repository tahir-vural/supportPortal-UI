import { Type } from "./Type";
import { Neighbourhood } from "./Neighbourhood";
import { RoomNumber } from "./RoomNumber";
import { Currency } from "./Currency";
import { HomeType } from "./HomeType";
import { User } from "./User";
import { Status } from "./Status";

export interface Home{
    id:number;
    price:number;
    neighbourhood:Neighbourhood;
    type:Type;
    roomNumber:RoomNumber;
    currency:Currency;
    homeType:HomeType;
    user:User;
    floorNumber:number;
    totalFloor:number;
    address:string;
    header:string;
    details:string;
    status:Status;
}