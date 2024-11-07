import axios, { AxiosResponse } from "axios";
import UserNotification from "../notification";
import logger from "../../util/logger/logger";
import config from "../../config/config";

export type Contact = {
  name: string;
  email: string;
};

interface RequestOptions {
  path: string;
  query?: { [key: string]: string };
  headers?: { [key: string]: string };
  body?: any;
}

export default class BrevoEmailNotification implements UserNotification {
  private requestOptions: RequestOptions = {
    path: "/v3/smtp/email",
  };
  private _sender: Contact = {
    name: "NodeTypeScript Boilerplate Application",
    email: "no-reply@dipan.dev",
  };
  private _replyTo: Contact = {
    name: "Dipan Mandal",
    email: "info@dipan.dev",
  };
  private _subject = "Email Notification";

  constructor(recipients?: Contact[], content?: string) {
    this.requestOptions.headers = {
      accept: "application/json",
      "X-Mailin-custom": "some_custom_header",
      "content-type": "application/json",
      "api-key": config.brevokey,
    };
    this.requestOptions.body = {
      to: recipients,
      htmlContent: content,
      //   textContent:
      //     "Please confirm your email address by clicking on the link https://text.domain.com",
    };
  }

  set sender(details: Contact) {
    this._sender = details;
  }

  set replyTo(details: Contact) {
    this._replyTo = details;
  }

  set subject(value: string) {
    this._subject = value;
  }

  async notify(): Promise<boolean> {
    this.requestOptions.body.sender = this._sender;
    this.requestOptions.body.replyTo = this._replyTo;
    this.requestOptions.body.subject = this._subject;
    return (await this.postApi(this.requestOptions)) !== null;
  }

  async postApi(options: RequestOptions): Promise<AxiosResponse> {
    const { path, query, headers, body } = options;

    const url = new URL(path, "https://api.brevo.com");
    if (query) {
      Object.entries(query).forEach(([key, value]) =>
        url.searchParams.append(key, value)
      );
    }

    try {
      logger.debug({ body, headers, url: url.toString() });
      const response = await axios.post(url.toString(), body, { headers });
      return response;
    } catch (error) {
      logger.error(error);
      throw new Error(`Error making POST request: ${error}`);
    }
  }

  async getAccountDetails() {
    const { query, headers, body } = this.requestOptions;
    const path = "/v3/account";

    const url = new URL(path, "https://api.brevo.com");
    if (query) {
      Object.entries(query).forEach(([key, value]) =>
        url.searchParams.append(key, value)
      );
    }

    try {
      const response = await axios.get(url.toString(), { headers });
      return response;
    } catch (error) {
      logger.error(error);
      throw new Error(`Error while fetchiing account detailst: ${error}`);
    }
  }
}
