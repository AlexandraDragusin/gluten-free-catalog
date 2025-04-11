const nodemailer = require("nodemailer");

async function sendVerificationEmail(to, code) {
	const transporter = nodemailer.createTransport({
		service: "gmail",
		auth: {
			user: process.env.EMAIL_USER,
			pass: process.env.EMAIL_PASS,
		},
	});

	await transporter.sendMail({
		from: `"Gluten Free Shop" <${process.env.EMAIL_USER}>`,
		to,
		subject: "Codul tău de verificare",
		text: `Codul tău de activare este: ${code}`,
		html: `<p>Codul tău de activare este: <b>${code}</b></p>`,
	});
}

module.exports = { sendVerificationEmail };