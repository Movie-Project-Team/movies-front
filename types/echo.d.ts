// echo.d.ts
import 'laravel-echo';
import Pusher from 'pusher-js';

declare module 'laravel-echo' {
  interface PusherChannel {
    whisper(event: string, data?: any): void;
  }
}
