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
    // add more if needed
  }
}

declare var process: NodeJS.Process;

declare class Buffer {
  static from(data: any, encoding?: string): Buffer;
  toString(encoding?: string): string;
}

declare var Buffer: typeof Buffer;
