"use client";

import React, { useEffect } from 'react';
import { io, Socket } from 'socket.io-client';

interface ServerToClientEvents {
  message: (data: string) => void;
  fileChanged: (filePath: string) => void;
}

interface ClientToServerEvents {
  sendMessage: (data: string) => void;
}

const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io('/');

export function ClientCacheInvalidation() {
  useEffect(() => {
    socket.on('message', (data) => {
      console.log('Received message:', data);
    });

    socket.on('fileChanged', (filePath) => {
      console.log('File changed:', filePath);
    });

    socket.on('connect_error', (error) => {
      console.error('Connection error:', error);
    });

    return () => {
      socket.off('message');
      socket.off('fileChanged');
      socket.off('connect_error');
    };
  }, []);

  return <></>;
}
