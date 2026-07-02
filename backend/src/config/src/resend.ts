import { Resend } from "resend";
import { env } from "./env";
import { log } from "./logger";

let resendClient: Resend | null = null;

/**
 * Initialize Resend client
 */
export const initializeResend = (): Resend => {
    if (resendClient) {
        return resendClient;
    }

    resendClient = new Resend(env.resendApiKey);
    log.success("Resend client initialized");
    return resendClient;
};

/**
 * Get Resend client instance
 */
export const getResendClient = (): Resend | null => {
    return resendClient;
};

export interface SendEmailOptions {
    from: string;
    to: string | string[];
    subject: string;
    html?: string;
    text?: string;
    replyTo?: string;
}

/**
 * Send email using Resend
 * @param options - Email options
 * @returns Email response or null on error
 */
export const sendEmail = async (options: SendEmailOptions): Promise<any> => {
    try {
        const client = getResendClient();
        
        if (!client) {
            log.error("Resend client not initialized");
            return null;
        }

        const emailPayload: any = {
            from: options.from,
            to: options.to,
            subject: options.subject,
        };

        if (options.html) emailPayload.html = options.html;
        if (options.text) emailPayload.text = options.text;
        if (options.replyTo) emailPayload.replyTo = options.replyTo;

        const { data, error } = await client.emails.send(emailPayload);

        if (error) {
            log.error(`Error sending email: ${error.message}`);
            return null;
        }

        log.success(`Email sent successfully: ${data?.id}`);
        return data;
    } catch (error) {
        log.error(`Unexpected error sending email: ${error instanceof Error ? error.message : String(error)}`);
        return null;
    }
};
