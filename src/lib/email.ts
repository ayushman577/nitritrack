import { BrevoClient } from "@getbrevo/brevo";

const apiKey = process.env.BREVO_API_KEY;
const senderEmail = process.env.BREVO_SENDER_EMAIL;
const senderName =
    process.env.BREVO_SENDER_NAME || "NITRiTrack";

if (!apiKey) {
    throw new Error("BREVO_API_KEY is not defined");
}

if (!senderEmail) {
    throw new Error(
        "BREVO_SENDER_EMAIL is not defined"
    );
}

const brevo = new BrevoClient({
    apiKey,
});

export async function sendOTPEmail(
    email: string,
    otp: string
) {
    const result =
        await brevo.transactionalEmails.sendTransacEmail({
            sender: {
                name: senderName,
                email: senderEmail,
            },

            to: [
                {
                    email,
                },
            ],

            subject:
                "Your NITRiTrack Verification Code",

            htmlContent: `
        <div style="
          font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          max-width: 600px;
          margin: auto;
          padding: 40px 20px;
          background: #0a0a0c;
          color: #f4f4f5;
        ">
          <!-- Header Banner -->
          <div style="
            border-bottom: 1px solid rgba(255, 255, 255, 0.08);
            padding-bottom: 20px;
            margin-bottom: 24px;
          ">
            <h1 style="
              font-size: 20px;
              font-weight: 900;
              letter-spacing: -0.03em;
              color: #ffffff;
              margin: 0;
            ">
              NITRiTrack
            </h1>
            <span style="
              font-family: ui-monospace, monospace;
              font-size: 9px;
              font-weight: 700;
              text-transform: uppercase;
              letter-spacing: 0.1em;
              color: #71717a;
            ">
              CAMPUS SECURITY REGISTRY
            </span>
          </div>

          <!-- Card Panel -->
          <div style="
            background: #111114;
            border: 1px solid rgba(255, 255, 255, 0.08);
            border-radius: 16px;
            padding: 32px 24px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
          ">
            <p style="
              font-size: 14px;
              color: #a1a1aa;
              margin-top: 0;
              margin-bottom: 16px;
            ">
              Welcome to NITRiTrack. Use the verification code below to authorize your account access.
            </p>

            <!-- OTP Box -->
            <div style="
              margin: 28px 0;
              padding: 24px;
              text-align: center;
              background: #0a0a0c;
              border: 1px solid rgba(255, 255, 255, 0.08);
              border-radius: 12px;
            ">
              <div style="
                font-family: ui-monospace, monospace;
                font-size: 32px;
                font-weight: 900;
                letter-spacing: 10px;
                color: #ffffff;
              ">
                ${otp}
              </div>
            </div>

            <p style="
              font-family: ui-monospace, monospace;
              font-size: 11px;
              color: #71717a;
              margin: 0;
            ">
              This verification code will expire in <strong style="color: #a1a1aa;">10 minutes</strong>.
            </p>
          </div>

          <!-- Footer Legal / Ignore Note -->
          <p style="
            font-family: ui-monospace, monospace;
            font-size: 10px;
            color: #52525b;
            margin-top: 24px;
            line-height: 1.5;
          ">
            If you did not request a NITRiTrack account verification, you can safely ignore and delete this email.<br/>
            NITRiTrack // NIT Rourkela Registry
          </p>
        </div>
      `,

            textContent: `
NITRiTrack // Campus Security Registry

Welcome to NITRiTrack. Your verification code is:

${otp}

This code will expire in 10 minutes.

If you did not request a NITRiTrack account verification, you can safely ignore this email.
      `,
        });

    console.log(
        "Brevo email sent:",
        result.messageId
    );

    return result;
}


export async function sendExpiryWarningEmail({
    email,
    name,
    title,
    type,
    expiresAt,
}: {
    email: string;
    name: string | null;
    title: string;
    type: "LOST" | "FOUND";
    expiresAt: Date;
}) {
    const formattedExpiry =
        expiresAt.toLocaleDateString("en-IN", {
            day: "numeric",
            month: "long",
            year: "numeric",
        });

    const reportType =
        type === "LOST" ? "lost" : "found";

    const badgeColor =
        type === "LOST" ? "#f43f5e" : "#34d399";
    const badgeBg =
        type === "LOST" ? "rgba(244, 63, 94, 0.1)" : "rgba(52, 211, 153, 0.1)";

    const result =
        await brevo.transactionalEmails.sendTransacEmail({
            sender: {
                name: senderName,
                email: senderEmail,
            },

            to: [{ email }],

            subject:
                `Your NITRiTrack ${reportType} report expires tomorrow`,

            htmlContent: `
                <div style="
                    font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                    max-width: 600px;
                    margin: auto;
                    padding: 40px 20px;
                    background: #0a0a0c;
                    color: #f4f4f5;
                ">
                    <!-- Header Banner -->
                    <div style="
                        border-bottom: 1px solid rgba(255, 255, 255, 0.08);
                        padding-bottom: 20px;
                        margin-bottom: 24px;
                    ">
                        <h1 style="
                            font-size: 20px;
                            font-weight: 900;
                            letter-spacing: -0.03em;
                            color: #ffffff;
                            margin: 0;
                        ">
                            NITRiTrack
                        </h1>
                        <span style="
                            font-family: ui-monospace, monospace;
                            font-size: 9px;
                            font-weight: 700;
                            text-transform: uppercase;
                            letter-spacing: 0.1em;
                            color: #71717a;
                        ">
                            CAMPUS SECURITY REGISTRY
                        </span>
                    </div>

                    <!-- Card Panel -->
                    <div style="
                        background: #111114;
                        border: 1px solid rgba(255, 255, 255, 0.08);
                        border-radius: 16px;
                        padding: 32px 24px;
                        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
                    ">
                        <p style="
                            font-size: 13px;
                            color: #a1a1aa;
                            margin-top: 0;
                            margin-bottom: 16px;
                        ">
                            Hi <strong style="color: #ffffff;">${name || "NITR Student"}</strong>,
                        </p>

                        <!-- Badge Strip -->
                        <div style="margin-bottom: 16px;">
                            <span style="
                                display: inline-block;
                                font-family: ui-monospace, monospace;
                                font-size: 9px;
                                font-weight: 900;
                                text-transform: uppercase;
                                letter-spacing: 0.08em;
                                padding: 4px 10px;
                                border-radius: 6px;
                                color: ${badgeColor};
                                background: ${badgeBg};
                                border: 1px solid ${badgeColor}30;
                            ">
                                ${type} REPORT EXPIRING
                            </span>
                        </div>

                        <h2 style="
                            font-size: 18px;
                            font-weight: 900;
                            letter-spacing: -0.02em;
                            color: #ffffff;
                            margin-top: 0;
                            margin-bottom: 16px;
                        ">
                            Your listing expires tomorrow
                        </h2>

                        <p style="
                            font-size: 13px;
                            color: #a1a1aa;
                            line-height: 1.6;
                            margin-bottom: 20px;
                        ">
                            Your ${reportType} report 
                            <strong style="color: #ffffff; font-weight: 700;">
                                "${title}"
                            </strong> 
                            is scheduled to expire on 
                            <strong style="color: #ffffff; font-family: ui-monospace, monospace;">
                                ${formattedExpiry}
                            </strong>.
                        </p>

                        <!-- Callout Box -->
                        <div style="
                            margin: 24px 0;
                            padding: 20px;
                            background: #0a0a0c;
                            border: 1px solid rgba(255, 255, 255, 0.08);
                            border-radius: 12px;
                        ">
                            <p style="
                                margin: 0;
                                font-size: 12px;
                                color: #a1a1aa;
                                line-height: 1.6;
                            ">
                                If your item has already been recovered, please mark your report as <strong style="color: #34d399;">Resolved</strong> on your dashboard. Otherwise, you can easily repost it after expiration to maintain active visibility.
                            </p>
                        </div>
                    </div>

                    <!-- Footer Legal -->
                    <p style="
                        font-family: ui-monospace, monospace;
                        font-size: 10px;
                        color: #52525b;
                        margin-top: 24px;
                        line-height: 1.5;
                    ">
                        This is an automated lifecycle notification from NITRiTrack.<br/>
                        NITRiTrack // NIT Rourkela Registry
                    </p>
                </div>
            `,

            textContent: `
NITRiTrack // Campus Security Registry

Hi ${name || "NITR Student"},

Your ${reportType} report "${title}" is expiring tomorrow (${formattedExpiry}).

If your item has been recovered, please mark your report as Resolved on your dashboard. Otherwise, you can repost it after expiration to keep it active.

This is an automated notification from NITRiTrack.
            `,
        });

    console.log(
        "Expiry warning email sent:",
        result.messageId
    );

    return result;
}