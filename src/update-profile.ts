import { RequestDto } from "./dto/request.dto";
import { ResponseDto } from "./dto/response.dto";
import { IUpdateProfilePush } from "./update-profile.interface";

export class UpdateProfile implements IUpdateProfilePush {
	integration(request: RequestDto) {
		const requestPayload = this.transformRequestDTO(request);
		this.saveRequestPayload(requestPayload);
		//TODO: implement Update Profile with Tecnotree API
	}

	/**
	 * Save integration request payload to NoSQL database for audit purpose.
	 *
	 */
	saveRequestPayload(requestPayload: unknown) {
	}

	/**
	 * Save integration response payload to NoSQL database for audit purpose.
	 *
	 */
	saveResponsePayload(responsePayload: unknown) {
	}

	/**
	 * Transform standard DTO definition from core logic implementation to format required for Huawei MSISDN
	 * validation integration.
	 *
	 */
	transformRequestDTO(dto: RequestDto): unknown {
			return undefined;
	}

	/**
	 * Transform response from Huawei MSISDN validation integration to DTO format recognisable by core logic
	 * implementation.
	 *
	 */
	transformResponseDTO(responsePayload: unknown): ResponseDto {
			return undefined;
	}

}