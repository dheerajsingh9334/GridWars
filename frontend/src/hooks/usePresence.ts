import { useEffect, useState } from 'react';
import socket from '@/lib/socket';

export function usePresence(): number {
  const [online, setOnline] = useState(0);

  useEffect(() => {
    socket.on('presence:count', setOnline);
    return () => { socket.off('presence:count', setOnline); };
  }, []);

  return online;
}
