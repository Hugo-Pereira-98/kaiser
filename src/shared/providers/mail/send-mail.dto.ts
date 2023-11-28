interface IMailContact {
  name: string;
  email: string;
}

export default interface ISendMailDTO {
  to: IMailContact;
  from?: IMailContact;
  replyTo?: IMailContact;
  subject: string;
  templateData?: any;
  templateId?: string;
  text?: string;
}
