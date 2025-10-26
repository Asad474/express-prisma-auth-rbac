/* eslint-disable @typescript-eslint/no-explicit-any */

import { httpStatusCode } from '../constants/httpStatusCode.constants';

export interface ApiResponse {
  success: boolean;
  statusCode: httpStatusCode;
  message: string;
  data?: any;
}
