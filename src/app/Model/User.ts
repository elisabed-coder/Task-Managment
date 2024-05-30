export class User {
  constructor(
    public email: string,
    public id: string,
    private _token: string, //i want to access token the Json web token which im going to receive when a user logs in or signs up our application, but dont want token to be modified , with this private key it will be accessible outside the class(_so i wil use get method) but it shouldnt  be modified.
    private _expiresIn: Date // here im saving a datetime value, this property will tell us then that token is going to expire
  ) {}

  get token() {
    if (!this._expiresIn || this._expiresIn < new Date()) {
      return null;
    }
    return this._token;
    // so with get property , it will be accessible outside the class, but cant be modiifed.
  }
}
