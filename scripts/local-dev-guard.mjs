import net from 'node:net';

const host = process.env.LOCAL_DEV_HOST || '127.0.0.1';
const port = Number(process.env.LOCAL_DEV_PORT || '3000');
const url = `http://localhost:${port}`;

export function isLocalDevPortOpen() {
  return new Promise((resolve) => {
    const socket = net.createConnection({ host, port });
    socket.setTimeout(800);

    socket.once('connect', () => {
      socket.destroy();
      resolve(true);
    });

    socket.once('timeout', () => {
      socket.destroy();
      resolve(false);
    });

    socket.once('error', () => {
      resolve(false);
    });
  });
}

export { host as localDevHost, port as localDevPort, url as localDevUrl };
