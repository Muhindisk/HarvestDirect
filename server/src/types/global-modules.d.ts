// Ambient module declarations for common packages used in the server.
// These are minimal `any`-typed stubs to allow CI builds when full @types are missing.

declare module 'express' {
  const e: any;
  export = e;
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

declare module 'mongoose' {
  const m: any;
  export default m;
}

declare module 'intasend-node' {
  const i: any;
  export = i;
}
