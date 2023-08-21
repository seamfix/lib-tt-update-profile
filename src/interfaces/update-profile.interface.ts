import { ObjectId } from 'mongoose';
import { RequestDto } from '../dto/request.dto';
import { ResponseDto } from '../dto/response.dto';

export interface IUpdateProfile {

	transformRequestDTO(dto: RequestDto): unknown;

	transformResponseDTO(responsePayload: unknown): ResponseDto;

	saveRequestPayload(uniqueId: string, requestPayload: any, request: RequestDto);

	saveResponsePayload(responsePayload: any, uniqueId: string, documentId: ObjectId);

	integration(request: RequestDto);

}