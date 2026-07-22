export interface NewsletterArticleTemplateData {
  title: string
  description: string
  url: string
  logoUrl: string
  unsubscribeUrl: string
}

// Inline CSS only — email clients don't support Tailwind or <link> stylesheets.
// Palette/identity mirrors app/components/OgImage/Frame.vue (dark gradient
// header, #ff8300 accent, circular avatar, "Doni Lite" name + tagline) so the
// newsletter reads as the same brand as the site/OG images.
export const renderNewsletterArticleEmail = (data: NewsletterArticleTemplateData) => {
  const { title, description, url, logoUrl, unsubscribeUrl } = data

  return `<!doctype html>
<html>
  <body style="margin:0;padding:0;background-color:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f5;padding:32px 0;">
      <tr>
        <td align="center">
          <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background-color:#ffffff;border-radius:12px;overflow:hidden;">
            <tr>
              <td style="background:linear-gradient(to bottom right, #0d0b07, #322e22);padding:40px 32px;text-align:center;">
                <img
                  src="${logoUrl}"
                  alt="Doni Lite"
                  width="72"
                  height="72"
                  style="width:72px;height:72px;border-radius:50%;border:2px solid #ffffff;object-fit:cover;margin-bottom:16px;"
                />
                <div style="color:#ff8300;font-size:22px;font-weight:700;">Doni Lite</div>
                <div style="color:#e5e5e5;font-size:13px;margin-top:4px;">
                  Open Source Developer and Passionate about new technologies
                </div>
              </td>
            </tr>
            <tr>
              <td style="padding:32px;">
                <div style="color:#ff8300;font-size:12px;font-weight:600;letter-spacing:0.05em;text-transform:uppercase;margin-bottom:8px;">
                  New article
                </div>
                <h1 style="margin:0 0 12px;font-size:24px;line-height:1.3;color:#0d0b07;">
                  ${title}
                </h1>
                <p style="margin:0 0 24px;font-size:15px;line-height:1.6;color:#4b4b4b;">
                  ${description}
                </p>
                <a
                  href="${url}"
                  style="display:inline-block;background-color:#ff8300;color:#ffffff;text-decoration:none;font-weight:600;font-size:14px;padding:12px 24px;border-radius:8px;"
                >
                  Read the article
                </a>
              </td>
            </tr>
            <tr>
              <td style="padding:24px 32px;border-top:1px solid #eeeeee;text-align:center;">
                <p style="margin:0;font-size:12px;color:#9ca3af;">
                  You're receiving this because you subscribed to the Doni Lite newsletter.
                  <br />
                  <a href="${unsubscribeUrl}" style="color:#9ca3af;text-decoration:underline;">Unsubscribe</a>
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`
}
