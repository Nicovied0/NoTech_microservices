const nodemailer = require("nodemailer");

const sendEmail = async (req, res, next) => {
  try {
    const { email, html, subject } = req.body;

    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: `${process.env.GMAIL_USER}`,
      to: `${email}`,
      subject: `${subject}`,
      html: `${html}`,
    });

    res.json({ mensaje: `enviado a ${email}` });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Ocurrió un error al enviar el correo electrónico" });
  }
};

module.exports = sendEmail;
