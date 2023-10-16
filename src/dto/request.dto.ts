import { IsDate, IsDefined, IsObject, IsOptional, IsString, isString } from "class-validator";
import { ObjectId } from 'mongoose';

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
    @IsString()
    billByEmail?: string;

    @IsOptional()
    @IsString()
    billByFax?: string;

    @IsOptional()
    @IsString()
    billByPost?: string;

    @IsOptional()
    @IsString()
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
    @IsString()
    presentLanguage?: string;

    @IsDefined()
    @IsString()
    externalApplication: string;

    @IsDefined()
    @IsString()
    externalUser: string;

    @IsDefined()
    @IsString()
    infoLevel: string;

}