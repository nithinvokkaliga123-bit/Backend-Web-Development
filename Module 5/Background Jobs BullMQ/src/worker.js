'use strict';

const { Worker } = require('bullmq');
const { connection } = require('./queue');
const { transporter } = require('./email');

const worker = new Worker('email', async (job) => {
  if (job.name !== 'otp') {
    throw new Error(`Unsupported email job: ${job.name}`);
  }

  await transporter.sendMail({
    to: job.data.to,
    subject: 'Your verification code',
    text: `Your OTP is ${job.data.otp}.`,
  });
}, { connection });

worker.on('completed', (job) => {
  console.log(`Job ${job.id} completed`);
});

worker.on('failed', (job, err) => {
  console.error(`Job ${job ? job.id : 'unknown'} failed: ${err.message}`);
});

module.exports = { worker };
