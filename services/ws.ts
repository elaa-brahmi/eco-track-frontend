import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

export function connectToWS(onContainerUpdate: (msg: any) => void) {
  const client = new Client({
    webSocketFactory: () => new SockJS("http://localhost:8080/ws") as any,
    reconnectDelay: 5000,  // auto reconnect
    debug: () => {}        // disable logs
  });

  client.onConnect = () => {
    console.log("Connected to WebSocket!");

    client.subscribe("/topic/containers", (message) => {
      const updatedContainer = JSON.parse(message.body);
      console.log("Received update:", updatedContainer);
      onContainerUpdate(updatedContainer);
    });
  };

  client.onStompError = (frame) => {
    console.error("Broker error:", frame.headers["message"]);
  };

  client.activate();

  return client;
}
