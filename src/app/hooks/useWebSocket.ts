import { useEffect, useRef, useState, useCallback } from "react";
import { useAuth } from "@/app/context/AuthContext";

interface WebSocketMessage {
  type: "text" | "decision" | "save" | "status" | "saved" | "story_complete" | "act_transition" | "act_status" | "act_title" | "error";
  scene_text?: string;
  question?: string;
  options?: number;
  user_choice?: string;
  id?: string;
  chapter_complete?: boolean;
  story_word_count?: number;
  chapter_word_count?: number;
  word_count?: number;
  FATAL?: string;
  EXCEPTION?: string;
  message?: string;
  current_act_id?: number;
  total_acts?: number;
  act_title?: string;
  progress_percentage?: number;
  //tokens_used?: number;
  latest_chapter_id?: number;
  
}

interface UseWebSocketProps {
  userId: string | null;
  storyId: string | null;
  storyType: string | null;
  baseUrl?: string;
  onMessage?: (message: WebSocketMessage) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: string) => void;
}

export const useWebSocket = ({
  userId,
  storyId,
  storyType,
  baseUrl,
  onMessage,
  onConnect,
  onDisconnect,
  onError,
}: UseWebSocketProps) => {
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<
    "disconnected" | "connecting" | "connected" | "error"
  >("disconnected");
  const socketRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { accessToken } = useAuth();

  const disconnect = useCallback(() => {
    if (socketRef.current) {
      try {
        console.log("🔴 Disconnecting WebSocket...");
        if (
          socketRef.current.readyState === WebSocket.OPEN ||
          socketRef.current.readyState === WebSocket.CONNECTING
        ) {
          socketRef.current.close(1000, "User initiated disconnect");
        }
      } catch (error) {
        console.error("❌ Error disconnecting WebSocket:", error);
      } finally {
        socketRef.current = null;
        setIsConnected(false);
        setConnectionStatus("disconnected");
      }
    }
  }, []);

  const connect = useCallback(() => {
    if (!userId || !storyId || !storyType || !accessToken) {
      console.warn("❌ Missing required parameters for WebSocket connection", {
        userId,
        storyId,
        storyType,
        accessToken,
      });
      onError?.("Missing required parameters for WebSocket connection");
      return;
    }

    if (!["classic", "interactive"].includes(storyType)) {
      console.warn("❌ Invalid story type:", storyType);
      onError?.("Invalid story type");
      return;
    }

    if (socketRef.current?.readyState === WebSocket.OPEN) {
      console.log("⚠️ WebSocket already connected");
      return;
    }

    try {
      const backendWsUrl = baseUrl || process.env.NEXT_PUBLIC_WS_BASE_URL;
      if (!backendWsUrl) {
        throw new Error("WebSocket base URL not configured");
      }
      const wsUrl = `${backendWsUrl}/ws/next_chapter/${userId}/${storyId}?story_type=${storyType}&token=${encodeURIComponent(accessToken)}`;

      console.log("🔵 Attempting WebSocket connection:", {
        url: wsUrl,
        userId,
        storyId,
        storyType,
      });

      setConnectionStatus("connecting");
      socketRef.current = new WebSocket(wsUrl);

      socketRef.current.onopen = () => {
        console.log("✅ WebSocket connected successfully");
        setIsConnected(true);
        setConnectionStatus("connected");

        const initMessage = {
          user_id: userId,
          story_id: storyId,
        };

        console.log("� sending init message:", initMessage);

        if (socketRef.current?.readyState === WebSocket.OPEN) {
          socketRef.current.send(JSON.stringify(initMessage));
          console.log("✅ Init message sent successfully");
        } else {
          console.error("❌ Socket not ready to send init message");
          onError?.("Socket not ready to send init message");
        }

        onConnect?.();
      };

      socketRef.current.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          console.log("📥 WebSocket message received:", message);
          onMessage?.(message);

          if (message.type === "story_complete" || message.chapter_complete) {
            console.log("✅ Story or chapter complete, disconnecting...");
            disconnect();
          }
        } catch (error) {
          console.error("❌ Error parsing WebSocket message:", error);
          console.error("Raw message data:", event.data);
          onError?.("Failed to parse message");
        }
      };

      socketRef.current.onerror = (error) => {
        console.error("❌ WebSocket error:", error);
        setConnectionStatus("error");
        onError?.("WebSocket connection error");
      };

      socketRef.current.onclose = (event) => {
        console.log("🔴 WebSocket closed:", {
          code: event.code,
          reason: event.reason,
          wasClean: event.wasClean,
        });
        setIsConnected(false);
        setConnectionStatus("disconnected");
        socketRef.current = null;
        onDisconnect?.();

        if (event.code === 4001) {
          onError?.("Authentication failed: Missing or invalid token");
        } else if (event.code === 4003) {
          onError?.("Authentication failed: User ID mismatch");
        }
      };
    } catch (error) {
      console.error("❌ Error creating WebSocket:", error);
      setConnectionStatus("error");
      onError?.("Failed to create WebSocket connection");
    }
  }, [userId, storyId, storyType, accessToken, baseUrl, onMessage, onConnect, onDisconnect, onError, disconnect]);

  const sendMessage = useCallback((message: unknown) => {
    if (!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN) {
      console.warn("⚠️ Cannot send message: WebSocket not connected");
      return false;
    }

    try {
      console.log("📤 Sending message:", message);
      socketRef.current.send(JSON.stringify(message));
      console.log("✅ Message sent successfully");
      return true;
    } catch (error) {
      console.error("❌ Error sending message:", error);
      onError?.("Failed to send message");
      return false;
    }
  }, [onError]);

  const sendChoice = useCallback(
    (choice: string) => {
      const message = { choice };
      console.log("📤 Sending choice:", message);
      return sendMessage(message);
    },
    [sendMessage]
  );

  const continueChapter = useCallback(() => {
    const message = { continue_chapter: 1 };
    console.log("📤 Sending continue_chapter:", message);
    return sendMessage(message);
  }, [sendMessage]);

  useEffect(() => {
    const timeoutId = reconnectTimeoutRef.current;

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      disconnect();
    };
  }, [disconnect]);

  return {
    connect,
    disconnect,
    sendMessage,
    sendChoice,
    continueChapter,
    isConnected,
    connectionStatus,
  };
};