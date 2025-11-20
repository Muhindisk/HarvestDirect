// Project-level global types to satisfy code during CI when full @types are not available.

// Minimal IUser so code that expects `_id` compiles.
interface IUser {
  _id?: any;
  [key: string]: any;
}

// Augment Express Request with `user` and permissive `body`, `params`, `query` fields.
declare namespace Express {
  interface Request {
    user?: IUser;
    body?: any;
    params?: any;
    query?: any;
  }
}

// AuthRequest type used across the codebase.
type AuthRequest = Express.Request & { user?: IUser };
