import { IsDate, IsDefined, IsEnum, IsObject, IsOptional, IsString, isString } from "class-validator";
import { ObjectId } from 'mongoose';
import { CommonValue, Language } from "../enum/common.enum";

export class RequestDto {

    @IsDefined()
    @IsString()
    apiUrl: string;

    @IsDefined()
    @IsString()
    uniqueId: string;

    @IsDefined()
    @IsString()
    msisdn: string;

    @IsObject()
    @IsOptional()
    objectId?: ObjectId;

    @IsOptional()
    @IsString()
    title?: string;

    @IsDefined()
    @IsString()
    firstName: string;

    @IsOptional()
    @IsString()
    middleName?: string;

    @IsDefined()
    @IsString()
    lastName: string;

    @IsDefined()
    @IsString()
    gender: string;

    @IsDefined()
    @IsDate()
    dob: Date;

    @IsDefined()
    @IsString()
    idNumber: string;

    @IsDefined()
    @IsString()
    idType: string;

    @IsDefined()
    @IsDate()
    idExpiryDate: Date;

    @IsDefined()
    @IsDate()
    idIssueDate: Date;

    @IsDefined()
    @IsString()
    idIssuePlace: string;

    @IsOptional()
    @IsString()
    addressType?: string;

    @IsOptional()
    @IsString()
    fullAddress?: string;

    @IsOptional()
    @IsString()
    locality?: string;

    @IsOptional()
    @IsString()
    street?: string;

    @IsDefined()
    @IsString()
    city: string;

    @IsOptional()
    @IsString()
    district?: string;

    @IsOptional()
    @IsString()
    country?: string;

    @IsOptional()
    @IsString()
    postalCode?: string;

    @IsDefined()
    @IsString()
    authUser: string;

    @IsDefined()
    @IsString()
    authPassword: string;

    @IsDefined()
    @IsString()
    authType: string;

    @IsDefined()
    @IsString()
    clientUserId: string;

    @IsDefined()
    @IsString()
    sender: string;

    @IsDefined()
    @IsString()
    messageId: string;

    @IsDefined()
    @IsString()
    externalLogReference: string;

    @IsDefined()
    @IsString()
    isMobileMoney: string;

    @IsDefined()
    @IsString()
    nationality: string;

    @IsOptional()
    @IsString()
    occupation?: string;

    @IsDefined()
    @IsString()
    simNumber: string;

    @IsDefined()
    @IsString()
    agentName: string;

    @IsDefined()
    @IsString()
    organization: string;

    @IsOptional()
    @IsEnum(CommonValue)
    billByEmail?: string;

    @IsOptional()
    @IsEnum(CommonValue)
    billByFax?: string;

    @IsOptional()
    @IsEnum(CommonValue)
    billByPost?: string;

    @IsOptional()
    @IsEnum(CommonValue)
    billBySms?: string;

    @IsOptional()
    @IsString()
    billEmail1?: string;

    @IsOptional()
    @IsString()
    billEmail2?: string;

    @IsOptional()
    @IsString()
    preferredCurrency?: string;

    @IsOptional()
    @IsEnum(Language)
    presentLanguage?: string;

}