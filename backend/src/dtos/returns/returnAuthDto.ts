export class ReturnAuthDto {
  token: string;

  constructor(auth: { token: string }) {
    this.token = auth.token;
  }
}
