import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { Client, IMessage, StompSubscription } from '@stomp/stompjs';
import { getAccessToken, getRefreshToken, setAccessToken } from '../service/localStoreService';
import { refreshToken } from '../service/AuthService';

type StompContextType = {
  connect: (token: string) => void;
  disconnect: () => void;
  send: (options: { destination?: string; data: any }) => void;
  subscribe: (
    destination: string,
    callback: (data: any, message: IMessage) => void
  ) => StompSubscription | undefined;
  isConnected: boolean;
};

const StompContext = createContext<StompContextType | undefined>(undefined);

export const useStomp = () => {
  const context = useContext(StompContext);
  if (!context) throw new Error('useStomp must be used within a StompProvider');
  return context;
};

const RECONNECT_DELAY = 5000;
const WEBSOCKET_URL = 'ws://localhost:8686/api/v1/ws';

export const StompProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const clientRef = useRef<Client | null>(null);
  const [connected, setConnected] = useState(false);

  const reconnectWithNewToken = async () => {
    try {
      const refresh = getRefreshToken();
      if (!refresh) throw new Error('No refresh token found');
      const newToken = await refreshToken(refresh);
      setAccessToken(newToken.data.accessToken);
      if (clientRef.current) {
        clientRef.current.connectHeaders = {
          Authorization: `Bearer ${newToken.data.accessToken}`,
        };
        clientRef.current.activate();
      }
    } catch (error) {
      console.error('❌ Token refresh error', error);
    }
  };

  const connect = (token: string) => {
    if (clientRef.current?.connected || clientRef.current?.active) return;

    const client = new Client({
      brokerURL: WEBSOCKET_URL,
      connectHeaders: {
        Authorization: `Bearer ${token}`,
      },
      reconnectDelay: RECONNECT_DELAY,
      debug: () => { },
      onConnect: () => {
        console.log('✅ STOMP connected');

        setConnected(true);
      },
      onDisconnect: () => {
        console.log('❌ STOMP disconnected');
        setConnected(false);
      },
      onWebSocketError: (error) => {
        console.error('❌ WebSocket error', error);
      },
      onStompError: (frame) => {
        console.error('❌ STOMP frame error', frame);
        reconnectWithNewToken();
      },
    });

    client.activate();
    clientRef.current = client;
  };

  const disconnect = () => {
    clientRef.current?.deactivate();
    clientRef.current = null;
    setConnected(false);
  };

  const send = ({ destination = '/app/chat', data }: { destination?: string; data: any }) => {
    if (clientRef.current?.connected) {
      clientRef.current.publish({
        destination,
        body: JSON.stringify(data),
      });
    } else {
      console.warn('⚠️ Cannot send message: not connected');
    }
  };

  const subscribe = (
    destination: string,
    callback: (data: any, message: IMessage) => void
  ) => {
    if (clientRef.current?.connected) {
      return clientRef.current.subscribe(destination, (message: IMessage) => {
        try {
          const parsed = JSON.parse(message.body);
          callback(parsed, message);
        } catch (e) {
          console.error('❌ Error parsing message body:', e);
        }
      });
    } else {
      console.warn(`⚠️ Cannot subscribe to ${destination}: not connected`);
      return undefined;
    }
  };

  useEffect(() => {
    const token = getAccessToken();
    if (token) connect(token);

    return () => disconnect();
  }, []);

  return (
    <StompContext.Provider value={{ connect, disconnect, send, subscribe, isConnected: connected }}>
      {children}
    </StompContext.Provider>
  );
};
