/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import axios, { catchAxiosError } from "../services/api";

type CurdProps = {
  post: (url: string, data?: any) => Promise<any>;
  put: (url: string, data?: any) => Promise<any>;
  processing: boolean;
};

export default function useCURD(): CurdProps {
  const [processing, setProcessing] = React.useState(false);

  const post = async (url: string, data?: any) => {
    setProcessing(true);
    return new Promise((resolve, reject) => {
      axios
        .post(url, data)
        .then((res) => {
          resolve(res.data);
        })
        .catch((err) => reject(catchAxiosError(err)))
        .finally(() => setProcessing(false));
    });
  };

  const put = async (url: string, data?: any) => {
    setProcessing(true);
    return new Promise((resolve, reject) => {
      axios
        .put(url, data)
        .then((res) => {
          resolve(res.data);
        })
        .catch((err) => reject(catchAxiosError(err)))
        .finally(() => setProcessing(false));
    });
  };

  return { post, put, processing };
}
