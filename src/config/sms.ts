interface ISMSConfig {
  driver: 'twilio';
}

export default {
  driver: process.env.SMS_DRIVER || 'twilio',
} as ISMSConfig;
