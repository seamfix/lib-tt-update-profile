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
                                "_text": "admin"
                            },
                            "auth:password": {
                                "_text": "admin"
                            },
                            "auth:type": {
                                "_text": "PLAIN"
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
                                    "_text": "externalapp"
                                },
                                "Sender": {
                                    "_text": "externalapp"
                                },
                                "MessageId": {
                                    "_text": "abl_portal"
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
                                                        "_attributes": {
                                                            "EXTERNAL_APPLICATION": "axonext",
                                                            "EXTERNAL_USER": "clmui",
                                                            "API_CODE": "60022",
                                                            "INFO_LEVEL": "1",
                                                            "CLIENT_ID": "CI",
                                                            "EXTERNAL_REFERENCE": "294420478", // TODO
                                                            "EXTERNAL_SYSTEMS_LOG_REFERNCE": dto.objectId,
                                                            "EXT_SUBSCRIBER_CODE": "11946322", // TODO
                                                            "UPDT_ONLY_SERVICE": "N", // TODO
                                                            "ACCOUNT_LINK_CODE": "725093863" // TODO
                                                        },
                                                        "PROFILE_INFO": {
                                                            "PROFILEDETAILS": {
                                                                "_attributes": {
                                                                    "TITLE": dto.title,
                                                                    "FIRST_NAME": dto.firstName,
                                                                    "MIDDLE_NAME": dto.middleName,
                                                                    "LAST_NAME": dto.lastName,
                                                                    "DATE_OF_BIRTH": this.getDateByFormate(dto.dob, 'YYYY/MM/DD'),
                                                                    "SEND_EMAIL_NOTIFICATION": "",
                                                                    "SEND_SMS_NOTIFICATION": "",
                                                                    "NOTIFICATION_EMAIL_IDS": "",
                                                                    "SMS_NUMBER": "",
                                                                    "IDENTIFICATION_NUMBER": dto.idNumber,
                                                                    "IDENTIFICATION_TYPE": dto.idType,
                                                                    "IDENTIFICATION_EXPIRY_DATE": dto.idExpiryDate,
                                                                    "IDENTIFICATION_ISSUE_DATE": dto.idIssueDate,
                                                                    "ID_ISSUE_PLACE": dto.idIssuePlace
                                                                }
                                                            },
                                                            "ADDRESS_INFO": {
                                                                "ADDRESS_DTLS": {
                                                                    "_attributes": {
                                                                        "ADDRESS_TYPE": dto.addressType,
                                                                        "ADDRESS1": dto.fullAddress,
                                                                        "ADDRESS2": dto.fullAddress,
                                                                        "ADDRESS3": dto.fullAddress,
                                                                        "ADDRESS4": dto.fullAddress,
                                                                        "ADDRESS5": dto.fullAddress,
                                                                        "LOCALITY": dto.locality,
                                                                        "STREET_DESC": dto.street,
                                                                        "CITY": dto.city,
                                                                        "DISTRICT": dto.district,
                                                                        "COUNTRY": dto.country,
                                                                        "POSTAL_CODE": dto.postalCode,
                                                                    }
                                                                }
                                                            }
                                                        },
                                                        "SERVICE_INFO": {
                                                            "SERVICEDETAILS": {
                                                                "_attributes": {
                                                                    "TITLE": dto.title,  // TODO confusion, same param as above
                                                                    "DOB": this.getDateByFormate(dto.dob, 'YYYY/MM/DD'),  // TODO confusion, same param as above
                                                                    "GENDER": dto.gender,  // TODO confusion, same param as above 
                                                                    "FIRST_NAME": dto.firstName,  // TODO confusion, same param as above 
                                                                    "LAST_NAME": dto.lastName,  // TODO confusion, same param as above 
                                                                    "MIDDLE_NAME": dto.middleName,  // TODO confusion, same param as above 
                                                                    "ID_EXPIRY_DATE": dto.idExpiryDate,  // TODO confusion, same param as above 
                                                                    "ID_ISSUE_DATE": dto.idIssueDate,  // TODO confusion, same param as above 
                                                                    "ID_ISSUE_PLACE": dto.idIssuePlace,  // TODO confusion, same param as above 
                                                                    "ID_NUMBER": dto.idNumber,  // TODO confusion, same param as above 
                                                                    "ID_TYPE": dto.idType,  // TODO confusion, same param as above
                                                                }
                                                            }
                                                        }, 
                                                        "ADDRESS_INFO": {
                                                            "ADDRESS_DTLS": {
                                                                "_attributes": {
                                                                    "ADDRESS_TYPE": dto.addressType, // TODO confusion, same param as above
                                                                    "ADDRESS1": dto.fullAddress, // TODO confusion, same param as above
                                                                    "ADDRESS2": dto.fullAddress, // TODO confusion, same param as above
                                                                    "ADDRESS3": dto.fullAddress, // TODO confusion, same param as above
                                                                    "ADDRESS4": dto.fullAddress, // TODO confusion, same param as above
                                                                    "ADDRESS5": dto.fullAddress, // TODO confusion, same param as above
                                                                    "LOCALITY": dto.locality, // TODO confusion, same param as above
                                                                    "STREET_DESC": dto.street, // TODO confusion, same param as above
                                                                    "CITY": dto.city, // TODO confusion, same param as above
                                                                    "DISTRICT": dto.district, // TODO confusion, same param as above
                                                                    "COUNTRY": dto.country, // TODO confusion, same param as above
                                                                    "POSTAL_CODE": dto.postalCode, // TODO confusion, same param as above
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
        };

        try {
            const body = await this.soapApiRequest(requestUrl, soapHeaders, requestPayload.transformedObj);
            const transResponseDto = this.transformResponseDTO(body);
            if (jsonDocument) {
				await this.saveResponsePayload(jsonDocument._id, transResponseDto);
			}
            const integrationResponse: IResponse = {
                status: 0,
                msg: 'Success',
                payload: transResponseDto
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
        const errors = await validate(userStructureClass);
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
}