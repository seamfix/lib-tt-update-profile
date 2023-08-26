import { IsDate, IsObject, IsString } from "class-validator";
import { ObjectId } from 'mongoose';

export class RequestDto {

    @IsString()
    apiUrl: string

    @IsString()
    uniqueId: string;

    @IsString()
    msisdn: string;

    @IsObject()
    objectId: ObjectId;

    @IsString()
    title: string;

    @IsString()
    firstName: string;

    @IsString()
    middleName: string;

    @IsString()
    lastName: string;

    @IsString()
    gender: string;

    @IsDate()
    dob: Date;

    @IsString()
    idNumber: string;

    @IsString()
    idType: string;

    @IsDate()
    idExpiryDate: Date;

    @IsDate()
    idIssueDate: Date;

    @IsString()
    idIssuePlace: string;

    @IsString()
    addressType: string;

    @IsString()
    fullAddress: string;

    @IsString()
    locality: string;

    @IsString()
    street: string;

    @IsString()
    city: string;

    @IsString()
    district: string;

    @IsString()
    country: string;

    @IsString()
    postalCode: string;

}