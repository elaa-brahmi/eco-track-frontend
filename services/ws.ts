import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

export function connectToWS(handlers: Record<string, (data: any) => void>) {
  const client = new Client({
    webSocketFactory: () => new SockJS("http://localhost:8080/ws"),
    reconnectDelay: 5000,
    debug: () => {},
  });

  client.onConnect = () => {
    console.log("WS Connected!");

    Object.entries(handlers).forEach(([topic, callback]) => {
      console.log("Subscribing to:", topic);
      client.subscribe(topic, (msg) => callback(JSON.parse(msg.body)));
    });
  };

  client.activate();
  return client;
}
