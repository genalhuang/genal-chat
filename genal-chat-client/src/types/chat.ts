interface Chat {
  name: string;
  message: string;
  group: string;
  time: string;
}

declare module 'socket.io-client'