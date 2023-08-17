import { RequestDto } from "./dto/request.dto";
import { ResponseDto } from "./dto/response.dto";

export interface IUpdateProfilePush {

	transformRequestDTO(dto: RequestDto): unknown ;

	transformResponseDTO(responsePayload: unknown): ResponseDto ;

	saveRequestPayload(requestPayload: unknown);

	saveResponsePayload(responsePayload: unknown);

	integration(request: RequestDto);
}