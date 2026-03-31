import { Resend } from 'resend';

const resendApiKey = process.env.RESEND_API_KEY;

if (!resendApiKey) {
  console.warn('RESEND_API_KEY is not set. Email functionality will not work.');
}

export const resend = new Resend(resendApiKey);

const fromEmail = process.env.EMAIL_FROM || 'bharatvote@primexmeta.com';
const fromName = process.env.EMAIL_FROM_NAME || 'BharatVote';

export const emailConfig = {
  from: `${fromName} <${fromEmail}>`,
};

// Email templates
export const sendVoterRegistrationEmail = async (to: string, data: {
  name: string;
  voterId: string;
  verificationLink: string;
}) => {
  if (!resendApiKey) {
    console.log('Email sending skipped (no API key):', { to, data });
    return { success: false, message: 'No API key configured' };
  }

  try {
    const { data: result, error } = await resend.emails.send({
      from: emailConfig.from,
      to,
      subject: 'Welcome to BharatVote - Complete Your Registration',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #FF9933 0%, #138808 100%); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0;">BharatVote</h1>
            <p style="color: white; margin: 10px 0 0 0;">Secure Digital Voting Platform</p>
          </div>
          <div style="padding: 30px; background: #f9f9f9;">
            <h2>Welcome, ${data.name}!</h2>
            <p>Thank you for registering with BharatVote. Your voter registration is almost complete.</p>
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p><strong>Your Voter ID:</strong> ${data.voterId}</p>
            </div>
            <p>To complete your registration, please verify your email address by clicking the button below:</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${data.verificationLink}" style="background: #138808; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
                Verify Email Address
              </a>
            </div>
            <p style="color: #666; font-size: 14px;">This link will expire in 24 hours.</p>
            <p style="color: #666; font-size: 14px;">If you didn't create this account, please ignore this email.</p>
          </div>
          <div style="padding: 20px; text-align: center; color: #999; font-size: 12px;">
            <p>© 2026 BharatVote. All rights reserved.</p>
          </div>
        </div>
      `,
    });

    if (error) {
      console.error('Email sending error:', error);
      return { success: false, error };
    }

    return { success: true, data: result };
  } catch (error) {
    console.error('Email sending exception:', error);
    return { success: false, error };
  }
};

export const sendVoteConfirmationEmail = async (to: string, data: {
  name: string;
  electionName: string;
  confirmationId: string;
  votedAt: string;
}) => {
  if (!resendApiKey) {
    console.log('Email sending skipped (no API key):', { to, data });
    return { success: false, message: 'No API key configured' };
  }

  try {
    const { data: result, error } = await resend.emails.send({
      from: emailConfig.from,
      to,
      subject: 'Vote Confirmation - BharatVote',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #FF9933 0%, #138808 100%); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0;">✓ Vote Recorded</h1>
          </div>
          <div style="padding: 30px; background: #f9f9f9;">
            <h2>Thank you, ${data.name}!</h2>
            <p>Your vote has been successfully recorded and encrypted.</p>
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p><strong>Election:</strong> ${data.electionName}</p>
              <p><strong>Confirmation ID:</strong> <code style="background: #f0f0f0; padding: 5px 10px; border-radius: 3px;">${data.confirmationId}</code></p>
              <p><strong>Timestamp:</strong> ${data.votedAt}</p>
            </div>
            <p style="color: #138808; font-weight: bold;">🔒 Your vote is secure and encrypted</p>
            <p style="color: #666; font-size: 14px;">Save this confirmation ID for your records. You can use it to verify your vote was counted.</p>
          </div>
          <div style="padding: 20px; text-align: center; color: #999; font-size: 12px;">
            <p>© 2026 BharatVote. All rights reserved.</p>
          </div>
        </div>
      `,
    });

    if (error) {
      console.error('Email sending error:', error);
      return { success: false, error };
    }

    return { success: true, data: result };
  } catch (error) {
    console.error('Email sending exception:', error);
    return { success: false, error };
  }
};
