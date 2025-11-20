// Ambient module declarations for common packages used in the server.
// These are minimal `any`-typed stubs to allow CI builds when full @types are missing.

declare module 'express' {
  const e: any;
  // Minimal named types used across the codebase
  export interface Request {
    user?: any;
    body?: any;
    params?: any;
    query?: any;
    headers?: any;
  }
  export interface Response {
    status?: any;
    json?: any;
    send?: any;
  }
  export interface Application { [key: string]: any }
  export type NextFunction = (err?: any) => void;

  export function Router(): any;
  export { Router };
  export default e;
}

declare module 'axios' {
  const a: any;
  export default a;
}

declare module 'form-data' {
  const f: any;
  export = f;
}

declare module 'path' {
  const p: any;
  export = p;
}

declare module 'fs' {
  const fs: any;
  export = fs;
}

declare module 'mongoose' {
  // Minimal mongoose stub: Schema, Types, model, Document
  export class Schema<T = any> {
    constructor(definition?: any, options?: any);
    static Types: {
      ObjectId: any;
      Mixed: any;
      [key: string]: any;
    };
    [key: string]: any;
  }
  export interface Document {
    _id?: any;
    [key: string]: any;
  }
  export namespace Types {
    type ObjectId = any;
    const ObjectId: any;
  }
  interface Model<T> {
    new (doc?: any): T;
    [key: string]: any;
  }
  interface Mongoose {
    model<T = any>(name: string, schema?: any): Model<T>;
    Schema: typeof Schema;
    Types: typeof Types;
    [key: string]: any;
  }
  const mongoose: Mongoose;
  export { mongoose as default };
  export function model<T = any>(name: string, schema?: any): Model<T>;
  export const Types: any;
}

declare module 'intasend-node' {
  const i: any;
  export = i;
}

declare module 'jsonwebtoken' {
  const jwt: any;
  export = jwt;
}

declare module 'bcryptjs' {
  const bcrypt: any;
  export default bcrypt;
}

declare module 'dotenv' {
  const dotenv: any;
  export = dotenv;
}

declare module 'cors' {
  const cors: any;
  export = cors;
}

declare module 'helmet' {
  const helmet: any;
  export = helmet;
}

declare module 'morgan' {
  const morgan: any;
  export = morgan;
}

declare module 'compression' {
  const compression: any;
  export = compression;
}

declare module 'express-rate-limit' {
  const rateLimit: any;
  export = rateLimit;
}

declare module 'multer' {
  interface File {
    [key: string]: any;
  }
  type FileFilterCallback = (error: Error | null, acceptFile: boolean) => void;
  
  const multer: any;
  export = multer;
}
