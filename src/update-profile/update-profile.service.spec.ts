import { RequestDto } from '../dto/request.dto';
import { UpdateProfileService } from './update-profile.service';

describe('Change Request service', () => {

    let apiLogModel = jest.fn().mockReturnValue({});

	const dto: RequestDto = {
		apiUrl: 'url',
		addressType: 'addressType',
		city: 'city',
		country: 'country',
		district: 'district',
		dob: new Date(),
		firstName: 'firstName',
		fullAddress: 'fullAddress',
		gender: 'gender',
		idExpiryDate: new Date(),
		idIssueDate: new Date(),
		idIssuePlace: 'idIssuePlace',
		idNumber: 'idNumber',
		idType: 'idType',
		lastName: 'lastName',
		locality: 'locality',
		middleName: 'middleName',
		msisdn: 'primaryIdentity',
		objectId: {} as any,
		postalCode: 'postalCode',
		street: 'street',
		title: 'title',
		uniqueId: 'uniqueId',
	}

    it('should transform request', async () => {
		apiLogModel = jest.fn(() => ({
            save: jest.fn().mockReturnThis(),
        }));
        const serviceObj = new UpdateProfileService(apiLogModel);
		const returnObj = await serviceObj.transformRequestDTO(dto);
		expect(returnObj.isTransformed).toBeTruthy();
    });

	it('should NOT transform request', async () => {
		apiLogModel = jest.fn(() => ({
            save: jest.fn().mockReturnThis(),
        }));
        const serviceObj = new UpdateProfileService(apiLogModel);
		const returnObj = await serviceObj.transformRequestDTO({
			apiUrl: 'url',
			imsi: 'imsi',
			inventoryType: 'inventoryType',
			msisdn: 'msisdn',
			simRequestType: 'simRequestType',
		} as any);
		expect(returnObj.isTransformed).toBeFalsy();
    });

	it('should return error on transform request', async () => {
		apiLogModel = jest.fn(() => ({
            save: jest.fn().mockReturnThis(),
        }));
        const serviceObj = new UpdateProfileService(apiLogModel);
		serviceObj.dtoValidation = jest.fn().mockImplementationOnce(() => {
			throw new Error('testError');
		});
		const returnObj = await serviceObj.transformRequestDTO({
				apiUrl: 'url',
				imsi: 'imsi',
				msisdn: 'msisdn',
				uniqueId: 'uniqueId',
			} as any
		);
		expect(returnObj.msg).toBe('testError');
	});

	it('should transform response object', () => {
		const xml = `
		<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/">
		<soapenv:Header xmlns:com="http://schema.concierge.com"/>
		<soapenv:Body xmlns:com="http://schema.concierge.com">
		<com:clientRequestResponse>
		<EaiEnvelope xmlns="http://schema.concierge.com/Envelope"
		xmlns:ser="http://schema.concierge.com/Services">
		<ApplicationName>MTNCI</ApplicationName>
		<Domain>abl_portal</Domain>
		<Service>IRMService</Service>
		<Language>En</Language>
		<UserId>externalapp</UserId>
		<Sender>externalapp</Sender>
		<MessageId>abl_portal</MessageId>
		<Payload>
		<ser:Services>
		<ser:response>
		<ser:ResponseCode>testCode</ser:ResponseCode>
		<ser:ResponseMessage>Request has been Processed
		Successfully</ser:ResponseMessage>
		<EVENT>
		<API_OUTPUT>
		<REQUEST_STATUS>0</REQUEST_STATUS>
		<SUCCESS_FLAG>0</SUCCESS_FLAG>
		<ABILLITY_REF_NUM>5387226253</ABILLITY_REF_NUM>
		<SUCCESS_MESG_LANG_1>Service Level details modified successfully</SUCCESS_MESG_LANG_1>
		<SUCCESS_MESG_LANG_2>Service Level details modified successfully</SUCCESS_MESG_LANG_2>
		<TRANSACTION_LOG_REFERNCE>2023071112301820230711123018</TRANSACTION_LOG_REFERNCE>
		</API_OUTPUT>
		</EVENT>
		</ser:response>
		</ser:Services>
		</Payload>
		</EaiEnvelope>
		</com:clientRequestResponse>
		</soapenv:Body>
		</soapenv:Envelope>
		`;

		apiLogModel = jest.fn(() => ({
            save: jest.fn().mockReturnThis(),
        }));
        const serviceObj = new UpdateProfileService(apiLogModel);

		const responseObj = serviceObj.transformResponseDTO(xml);
		expect(responseObj.code).toBe('testCode');
	});

	it('should save request payload', async () => {
		apiLogModel = jest.fn(() => ({
            save: jest.fn().mockReturnThis(),
        }));
        const serviceObj = new UpdateProfileService(apiLogModel);

		const result = await serviceObj.saveRequestPayload('uniqueId', {}, dto);
		expect(result).toBeTruthy();
	});

	it('should NOT save request payload', async () => {
		apiLogModel = jest.fn(() => ({}));
        const serviceObj = new UpdateProfileService(apiLogModel);

		const result = await serviceObj.saveRequestPayload('uniqueId', {}, dto);
		expect(result).toBeNull();
	});

	it('should return error on save response payload', async () => {
		apiLogModel = jest.fn(() => ({
            save: jest.fn().mockReturnThis(),
        }));
        const serviceObj = new UpdateProfileService(apiLogModel);

		const result = await serviceObj.saveResponsePayload({} as any, {});
		expect(result).toBeFalsy();
	});

	it('should calculate duraction', () => {
		apiLogModel = jest.fn(() => ({
            save: jest.fn().mockReturnThis(),
        }));
        const serviceObj = new UpdateProfileService(apiLogModel);

		const result = serviceObj.calculateDuration(new Date('06/27/1997 19:22:36'), new Date('06/27/1997 19:23:33'));
		expect(result).toBe(57);
	});

	it('should simplify JSON', () => {
		const json = [
			{
				testKey: {
					_text: 'testValue'
				}
			}
		];

		apiLogModel = jest.fn(() => ({
            save: jest.fn().mockReturnThis(),
        }));
        const serviceObj = new UpdateProfileService(apiLogModel);

		const result = serviceObj.simplifyJSON(json);
		expect(result[0].testKey).toBe('testValue');
	});

	it ('should NOT simplify JSON', () => {
		apiLogModel = jest.fn(() => ({
            save: jest.fn().mockReturnThis(),
        }));
        const serviceObj = new UpdateProfileService(apiLogModel);

		const result = serviceObj.simplifyJSON('testJson');
		expect(result).toBe('testJson');
	});
});