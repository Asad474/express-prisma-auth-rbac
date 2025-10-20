import { httpStatusCode } from '../constants/httpStatusCode.constants';

export interface ApiResponse {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any;
  message: string;
  statusCode: httpStatusCode;

  success: boolean;
}
