// Minimal Node globals to satisfy TypeScript when @types/node is not available.
// This file provides just the basics used in the project (console, process, Buffer).

declare var console: {
  log: (...args: any[]) => void;
  info: (...args: any[]) => void;
  warn: (...args: any[]) => void;
  error: (...args: any[]) => void;
};

declare namespace NodeJS {
  interface ProcessEnv {
    [key: string]: string | undefined;
  }
  interface Process {
    env: ProcessEnv;
    exit(code?: number): void;
    cwd(): string;
    uptime(): number;
    on(event: string, listener: (...args: any[]) => void): this;
  }
}

declare var process: NodeJS.Process;

declare function require(name: string): any;
declare var module: any;
declare var exports: any;
declare var __dirname: string;

declare class Buffer {
  static from(data: any, encoding?: string): Buffer;
  static isBuffer(obj: any): boolean;
  toString(encoding?: string): string;
}

declare var Buffer: typeof Buffer;
