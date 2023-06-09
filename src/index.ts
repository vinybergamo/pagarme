import axios, { AxiosInstance } from "axios";
import { Order } from "./order";
import { Webhook } from "./webhook";

interface Client {
  secret_key: string;
  account_id?: string;
  public_key?: string;
  password?: string;
}

interface IPagarme {
  orders: Order;
  webhooks: Webhook;
}

export class Pagarme implements IPagarme {
  private readonly api: AxiosInstance;
  public readonly orders: Order;
  public readonly webhooks: Webhook;

  constructor(private readonly client: Client) {
    this.client = client;

    if (!this.client.secret_key) throw new Error("Secret key is required");

    const base64Key = Buffer.from(
      `${this.client.secret_key}:${this.client.password}`
    ).toString("base64");

    this.api = axios.create({
      baseURL: "https://api.pagar.me/core/v5",
      headers: {
        "content-type": "application/json",
        Accept: "application/json",
        Authorization: `Basic ${base64Key}`,
      },
    });

    this.orders = new Order(this.api);
    this.webhooks = new Webhook(this.api);
  }
}
