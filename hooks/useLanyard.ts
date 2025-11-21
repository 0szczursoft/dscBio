import { useEffect, useState } from 'react';
import { LanyardData, LanyardOp, LanyardMessage } from '../types';

const LANYARD_WS = 'wss://api.lanyard.rest/socket';

export function useLanyard(userId: string) {
  const [data, setData] = useState<LanyardData | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!userId) return;

    let socket: WebSocket | null = null;
    let heartbeatInterval: number | null = null;

    const connect = () => {
      socket = new WebSocket(LANYARD_WS);

      socket.onopen = () => {
        setIsConnected(true);
        // Initialize connection
        socket?.send(
          JSON.stringify({
            op: LanyardOp.Initialize,
            d: { subscribe_to_id: userId },
          })
        );
      };

      socket.onmessage = (event) => {
        const message: LanyardMessage = JSON.parse(event.data);

        switch (message.op) {
          case LanyardOp.Hello:
            // Start heartbeat
            const interval = (message.d as { heartbeat_interval: number }).heartbeat_interval;
            heartbeatInterval = window.setInterval(() => {
              socket?.send(JSON.stringify({ op: LanyardOp.Heartbeat }));
            }, interval);
            break;

          case LanyardOp.Event:
            if (message.t === 'INIT_STATE' || message.t === 'PRESENCE_UPDATE') {
              setData(message.d as LanyardData);
            }
            break;
        }
      };

      socket.onclose = () => {
        setIsConnected(false);
        if (heartbeatInterval) clearInterval(heartbeatInterval);
        // Simple reconnect logic could go here
        setTimeout(connect, 5000); 
      };
    };

    connect();

    return () => {
      if (heartbeatInterval) clearInterval(heartbeatInterval);
      socket?.close();
    };
  }, [userId]);

  return { data, isConnected };
}
