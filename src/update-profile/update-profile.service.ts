import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import soapRequest from 'easy-soap-request';
import moment from 'moment';
import { ObjectId } from 'mongoose';
import * as R from 'ramda';
import { json2xml, xml2json } from 'xml-js';
import { RequestDto } from '../dto/request.dto';
import { ResponseDto } from '../dto/response.dto';
import IResponse from '../interfaces/response.interface';
import { ITransformRequest } from '../interfaces/transform-request.interface';
import { IUpdateProfile } from '../interfaces/update-profile.interface';
import { IValidatorResponse } from '../interfaces/validator-response.interface';
import { IApiLog } from './../interfaces/api-log.interface';
import { Gender } from '../enum/common.enum';

export class UpdateProfileService implements IUpdateProfile {

    private apiLog: any;

    constructor(externalApiLogModel: any) {
        this.apiLog = externalApiLogModel
    }

    async transformRequestDTO(dto: RequestDto): Promise<ITransformRequest> {
        const transformRequestDTOResponse: ITransformRequest = {
            isTransformed: false,
        }
        try {

            const validateDto = await this.dtoValidation(dto);
            if (!validateDto.isValid) {
                transformRequestDTOResponse.isTransformed = false;
                transformRequestDTOResponse.msg = validateDto.msg;
                return transformRequestDTOResponse;
            }

            const payload = {
                "soapenv:Envelope": {
                    "_attributes": {
                        "xmlns:soapenv": "http://schemas.xmlsoap.org/soap/envelope/",
                        "xmlns:com": "http://schema.concierge.com"
                    },
                    "soapenv:Header": {
                        "_attributes": {
                            "xmlns:auth": "http://schemas.eia.org/middleware/AuthInfo"
                        },
                        "auth:authentication": {
                            "auth:user": {
                                "_text": dto.authUser
                            },
                            "auth:password": {
                                "_text": dto.authPassword
                            },
                            "auth:type": {
                                "_text": dto.authType
                            }
                        }
                    },
                    "soapenv:Body": {
                        "com:clientRequest": {
                            "EaiEnvelope": {
                                "_attributes": {
                                    "xmlns": "http://schema.concierge.com/Envelope",
                                    "xmlns:ser": "http://schema.concierge.com/Services"
                                },
                                "ApplicationName": {
                                    "_text": "MTNCI"
                                },
                                "Domain": {
                                    "_text": "abl_portal"
                                },
                                "Service": {
                                    "_text": "IRMService"
                                },
                                "Language": {
                                    "_text": "En"
                                },
                                "UserId": {
                                    "_text": dto.clientUserId
                                },
                                "Sender": {
                                    "_text": dto.sender
                                },
                                "MessageId": {
                                    "_text": dto.messageId
                                },
                                "Payload": {
                                    "ser:Services": {
                                        "ser:Request": {
                                            "ser:Operation_Name": {
                                                "_text": "UpdateProfile"
                                            },
                                            "ser:Subscriber_Type": {
                                                "_text": "individual"
                                            },
                                            "ser:ChangeServicesRequest": {
                                                "ser:request": {
                                                    "EVENT": {
                                                        "REQUEST": {
                                                           "_attributes": { 
                                                                "CLIENT_ID": "MTNCI",
                                                                "ENTITY_ID": dto.msisdn,
                                                                "EXTERNAL_APPLICATION": "axonext",
                                                                "EXTERNAL_SYSTEMS_LOG_REFERNCE": dto.externalLogReference,
                                                                "EXTERNAL_USER": "axonext",
                                                                "INFO_LEVEL": "3",
                                                                "OPERATION_NAME": "updateSubscriber",
                                                                "SERVICE_CODE": "GSM"
                                                            }
                                                        },
                                                        "REQUESTDETAILS": {
                                                            "_attributes": {
                                                                "AGENT_NAME": dto.agentName,
                                                                "DATE_OF_BIRTH": this.getDateByFormate(dto.dob, 'YYYYMMDD'),
                                                                "DOCUMENTID_NUMBER": dto.idNumber,
                                                                "DOCUMENTID_TYPE": dto.idType,
                                                                "DOCUMENT_EXPIRY_DATE": this.getDateByFormate(dto.idExpiryDate, 'YYYYMMDD'),
                                                                "DOCUMENT_ISSUE_DATE": this.getDateByFormate(dto.idIssueDate, 'YYYYMMDD'),
                                                                "DOCUMENT_ISSUE_PLACE": dto.idIssuePlace,
                                                                "FIRST_NAME": dto.firstName,
                                                                "GENDER": this.getGender(dto.gender) ,
                                                                "LAST_NAME": dto.lastName,
                                                                "MOBILE_MONEY": dto.isMobileMoney,
                                                                "NATIONALITY": dto.nationality,
                                                                "OCCUPATION": dto.occupation,
                                                                "ORGANIZATION": dto.organization,
                                                                "SIM_NUMBER": dto.simNumber
                                                            }
                                                        },
                                                        "ADDRESS": {
                                                            "PHYSICAL_ADDRESS": {
                                                                "_attributes": {
                                                                    "ADDRESS1": dto.fullAddress,
                                                                    "ADDRESS2": '',
                                                                    "ADDRESS3": '',
                                                                    "ADDRESS4": '',
                                                                    "ADDRESS_TYPE": dto.addressType,
                                                                    "CITY": dto.city,
                                                                    "POBOX": '',
                                                                }
                                                            }
                                                        },
                                                        "DOCUMENTS": {},
                                                        "BILLDETAILS": {
                                                            "BILL_PREFERENCE": {
                                                                "_attributes": {
                                                                    "BILL_BY_EMAIL": dto.billByEmail,
                                                                    "BILL_BY_FAX": dto.billByFax,
                                                                    "BILL_BY_POST": dto.billByPost,
                                                                    "BILL_BY_SMS": dto.billBySms,
                                                                    "EMAIL1": dto.billEmail1,
                                                                    "EMAIL2": dto.billEmail2,
                                                                    "PREFFERED_CURRENCY": dto.preferredCurrency,
                                                                    "PRESENTATION_LANGUAGE": dto.presentLanguage
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            };

            const options = { compact: true, ignoreComment: true, spaces: 4 };
            const xmlResult = json2xml(JSON.stringify(payload), options);
            transformRequestDTOResponse.isTransformed = true;
            transformRequestDTOResponse.transformedObj = xmlResult;
            return transformRequestDTOResponse;
        } catch (error: any) {
            console.log(`something wrong while transform Request DTO. ERROR : ${JSON.stringify(error)}`);
            transformRequestDTOResponse.isTransformed = false;
            transformRequestDTOResponse.msg = error.message;
            return transformRequestDTOResponse;
        }
    }

    transformResponseDTO(responsePayload: string): ResponseDto {
        const json = xml2json(responsePayload, { compact: true });
        const parsedJSON = JSON.parse(json);

        const code = R.pathOr(
            0,
            [
                'soapenv:Envelope',
                'soapenv:Body',
                'com:clientRequestResponse',
                'EaiEnvelope',
                'Payload',
                'ser:Services',
                'ser:response',
                'ser:ResponseCode',
                '_text'
            ],
            parsedJSON
        );

        const message = R.pathOr(
            '',
            [
                'soapenv:Envelope',
                'soapenv:Body',
                'com:clientRequestResponse',
                'EaiEnvelope',
                'Payload',
                'ser:Services',
                'ser:response',
                'ser:ResponseMessage',
                '_text'
            ],
            parsedJSON
        );

        const payload = this.simplifyJSON(R.pathOr(
            null,
            [
                'soapenv:Envelope',
                'soapenv:Body',
                'com:clientRequestResponse',
                'EaiEnvelope',
                'Payload',
                'ser:Services',
                'ser:response',
                'EVENT',
            ],
            parsedJSON
        ))

        const responseJson: ResponseDto = {
            code,
            message,
            payload,
        }
        return responseJson;
    }

    async saveRequestPayload(uniqueId: string, requestPayload: any, request: RequestDto) {
        try {
            const payload: IApiLog = {
                uniqueId: uniqueId,
                msisdn: request.msisdn,
                requestType: 'SOAP Request',
                startTime: new Date(),
                tpRequestPayload: JSON.stringify(requestPayload)
            }
            const createApiRequestLog = new this.apiLog({
                ...payload,
            });
            const jsonDocument = await createApiRequestLog.save();
            return jsonDocument;
        } catch (error) {
            console.log(`Something wrong while adding request payload to DB. ${JSON.stringify(error)}`);
            return null;
        }
    }

	async saveResponsePayload(documentId: ObjectId, responsePayload: any) {
		try {
			const model = await this.apiLog.findOne({
				_id: documentId
			});
			if (model) {
				await this.apiLog.updateOne(
					{ _id: documentId },
					{
						endTime: new Date(),
						duration: this.calculateDuration(model.startTime, new Date()),
						tpResponsePayload: JSON.stringify(responsePayload)
					}
				);
				return true;
			}
			return false;
		} catch (error) {
            console.log(`Something wrong while adding request payload to DB. ERROR: ${JSON.stringify(error)}`);
			return false;
		}
	}

    async integration(request: RequestDto) {
        const requestPayload = await this.transformRequestDTO(request);
        if (!requestPayload.isTransformed) {
            const response: IResponse = {
                status: -1,
                msg: requestPayload.msg,
                payload: null
            }
            return response;
        }

        const requestUrl = request.apiUrl;
        const jsonDocument = await this.saveRequestPayload(request.uniqueId, requestPayload, request);

        const soapHeaders = {
            'Content-Type': 'text/xml;charset=UTF-8',
            'SOAPAction': 'http://www.openuri.org/clientRequest'
        };

        try {
            const body = await this.soapApiRequest(requestUrl, soapHeaders, requestPayload.transformedObj);
            const transResponseDto = this.transformResponseDTO(body);
            if (jsonDocument) {
				await this.saveResponsePayload(jsonDocument._id, transResponseDto);
			}
            const integrationResponse: IResponse = {
                status: transResponseDto.code,
                msg: transResponseDto.message,
                payload: transResponseDto.payload
            }
            return integrationResponse;
        } catch (error: any) {
            console.log(`something wrong while calling Soap API. ERROR: ${JSON.stringify(error)}`);
			const transResponseDto = {
				error: error
			};
            if (jsonDocument) {
				await this.saveResponsePayload(jsonDocument._id, transResponseDto);
			}
			const response: IResponse = {
				status: -1,
				msg: error.message,
				payload: null
			}
			return response;
        }

    }

    async soapApiRequest(url: string, headers: any, requestBody: any) {
        const { response } = await soapRequest({
            url: url,
            headers,
            xml: requestBody,
        });
        const { body } = response;
        return body;
    }

    calculateDuration(startTime: Date, endTime: Date) {
        const differenceValue = (endTime.getTime() - startTime.getTime()) / 1000;
        return Math.abs(Math.round(differenceValue));
    }

    async dtoValidation(dto: any): Promise<IValidatorResponse> {
        const userStructureClass = plainToInstance(RequestDto, dto);
        const errors = await validate(userStructureClass, { skipMissingProperties: true });
        const validateResponse: IValidatorResponse = {
            isValid: true,
            msg: null
        };
        if (errors.length > 0) {
            validateResponse.msg = JSON.stringify(errors);
            if (errors[0] && errors[0]['constraints']) {
                validateResponse.msg = JSON.stringify(errors[0]['constraints']);
            }
            validateResponse.isValid = false;
        };
        return validateResponse;
    }

    getDateByFormate(date: Date, format: string) {
        if (!date) return '';
        return moment(date).format(format);
    }

    simplifyJSON(jsonObj: any) {
		if (typeof jsonObj === 'object') {
			if (jsonObj instanceof Array) {
				return jsonObj.map(item => this.simplifyJSON(item));
			} else {
				const newObj = {};
				for (const key in jsonObj) {
					if (jsonObj.hasOwnProperty(key)) {
						const value = jsonObj[key];
						if (typeof value === 'object' && '_text' in value && Object.keys(value).length === 1) {
							newObj[key] = value['_text'];
						} else {
							newObj[key] = this.simplifyJSON(value);
						}
					}
				}
				return newObj;
			}
		} else {
			return jsonObj;
		}
	}

    getGender(gender: string): string {
        if(!gender) {
            return ''
        } else {
            if(gender.toLocaleLowerCase() === 'male') {
                return Gender.MALE
            } else if(gender.toLocaleLowerCase() === 'female') {
                return Gender.FEMALE
            } else {
                return ''
            }
        }
        
    } 
}