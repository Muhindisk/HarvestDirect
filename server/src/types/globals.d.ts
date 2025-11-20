export {};

declare global {
  interface IUser {
    _id?: any;
    [key: string]: any;
  }

  namespace mongoose {
    namespace Types {
      type ObjectId = any;
    }
  }

  namespace Express {
    interface Request {
      user?: IUser;
      body?: any;
      params?: any;
      query?: any;
    }
  }

  type AuthRequest = Express.Request & { user?: IUser };
}
