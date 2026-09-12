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
          font-family: Arial, sans-serif;
          max-width: 600px;
          margin: auto;
          padding: 40px 20px;
          background: #0d1117;
          color: white;
        ">

          <h1 style="
            color: #3b82f6;
            margin-bottom: 10px;
          ">
            NITRiTrack
          </h1>

          <p style="color: #c9d1d9;">
            Welcome to NITRiTrack.
          </p>

          <p style="color: #c9d1d9;">
            Use the verification code below to verify
            your email address.
          </p>

          <div style="
            margin: 30px 0;
            padding: 20px;
            text-align: center;
            background: #161b22;
            border-radius: 12px;
          ">

            <div style="
              font-size: 36px;
              font-weight: bold;
              letter-spacing: 8px;
              color: #3b82f6;
            ">
              ${otp}
            </div>

          </div>

          <p style="color: #8b949e;">
            This code will expire in 10 minutes.
          </p>

          <p style="
            color: #8b949e;
            font-size: 13px;
            margin-top: 30px;
          ">
            If you did not create a NITRiTrack account,
            you can safely ignore this email.
          </p>

        </div>
      `,

            textContent: `
NITRiTrack Email Verification

Your verification code is: ${otp}

This code will expire in 10 minutes.

If you did not create a NITRiTrack account,
you can safely ignore this email.
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
                    font-family: Arial, sans-serif;
                    max-width: 600px;
                    margin: auto;
                    padding: 40px 20px;
                    background: #0d1117;
                    color: white;
                ">

                    <h1 style="
                        color: #3b82f6;
                        margin-bottom: 10px;
                    ">
                        NITRiTrack
                    </h1>

                    <p style="
                        color: #c9d1d9;
                        font-size: 16px;
                    ">
                        Hi ${name || "NITR Student"},
                    </p>

                    <h2 style="
                        color: #f0f6fc;
                        margin-top: 30px;
                    ">
                        Your report is expiring tomorrow
                    </h2>

                    <p style="
                        color: #c9d1d9;
                        line-height: 1.6;
                    ">
                        Your ${reportType} report
                        <strong style="color: #ffffff;">
                            "${title}"
                        </strong>
                        is scheduled to expire on
                        <strong style="color: #ffffff;">
                            ${formattedExpiry}
                        </strong>.
                    </p>

                    <div style="
                        margin: 25px 0;
                        padding: 20px;
                        background: #161b22;
                        border: 1px solid #30363d;
                        border-radius: 12px;
                    ">

                        <p style="
                            margin: 0;
                            color: #c9d1d9;
                            line-height: 1.6;
                        ">
                            If you still need this report to remain
                            visible, you can repost it on NITRiTrack
                            after it expires to create a fresh
                            active report.
                        </p>

                    </div>

                    <p style="
                        color: #8b949e;
                        line-height: 1.6;
                    ">
                        If the item has already been recovered,
                        you can mark your report as
                        <strong style="color: #34d399;">
                            Resolved
                        </strong>
                        instead.
                    </p>

                    <div style="
                        margin-top: 35px;
                        padding-top: 20px;
                        border-top: 1px solid #30363d;
                    ">

                        <p style="
                            color: #8b949e;
                            font-size: 13px;
                            margin: 0;
                        ">
                            This is an automated notification
                            from NITRiTrack.
                        </p>

                    </div>

                </div>
            `,

            textContent: `
NITRiTrack

Hi ${name || "NITR Student"},

Your ${reportType} report "${title}" is expiring tomorrow.

Expiry date: ${formattedExpiry}

If you still need this report to remain visible, you can repost it on NITRiTrack after it expires to create a fresh active report.

If the item has already been recovered, you can mark your report as Resolved.

This is an automated notification from NITRiTrack.
            `,
        });

    console.log(
        "Expiry warning email sent:",
        result.messageId
    );

    return result;
}