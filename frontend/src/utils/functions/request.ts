import { useState } from "react";
import { MethodEnum } from "../../enums/MethodEnum";
import { getAuthorizationToken } from "./auth";
import axios from "axios";

interface RequestOptions {
  method: MethodEnum;
  url: string;
  body?: object;
  params?: object;
}

export const useRequest = () => {
  const [loadingRequest, setLoadingRequest] = useState<boolean>(false);

  const request = async <T>({
    method,
    url,
    body,
    params,
  }: RequestOptions): Promise<T> => {
    setLoadingRequest(true);

    const headers = {
      Authorization: getAuthorizationToken(),
      "Content-Type": "application/json",
    };

    try {
      const response = await axios({
        method: method,
        url: url,
        data: body,
        params: params,
        headers: headers,
      });

      return response.data;
    } catch (error) {
      return Promise.reject(error);
    } finally {
      setLoadingRequest(false);
    }
  };

  return {
    loadingRequest,
    request,
  };
};
