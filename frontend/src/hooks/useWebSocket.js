import { useEffect, useRef } from "react";

function useWebSocket(url, onMessage) {
  const socketRef = useRef(null);

  useEffect(() => {
    if (!url) {
      return undefined;
    }

    const socket = new WebSocket(url);
    socketRef.current = socket;

    socket.onmessage = (event) => {
      if (onMessage) {
        onMessage(event.data);
      }
    };

    return () => {
      socket.close();
    };
  }, [url, onMessage]);

  return socketRef;
}

export default useWebSocket;
