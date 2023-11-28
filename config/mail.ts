interface IMailConfig {
  driver: 'ethereal' | 'ses' | 'sendgrid';

  defaults: {
    from: {
      email: string;
      name: string;
    };
    replyTo: {
      email: string;
      name: string;
    };
  };
}

export default {
  driver: process.env.MAIL_DRIVER || 'ethereal',

  defaults: {
    from: {
      email: process.env.SENDGRID_FROM,
      name: 'Kaiser',
    },
    replyTo: {
      email: process.env.SENDGRID_REPLY_TO,
      name: 'Kaiser',
    },
  },
} as IMailConfig;
