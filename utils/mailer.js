// ! nodemailer send email
const nodemailer = require("nodemailer")

let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    auth: {
        user: "rahim.rodruigez16@gmail.com",
        pass: "otny dzxd sxux dwsp",
    },
})

// test transporter
transporter.verify((error, success) => {
    if (error) {
        console.log(error)
    } else {
        console.log("transporter works")
    }
})

const sendEmail = async (mailOptions) => {
    try {
        await transporter.sendMail(mailOptions)
        return
    } catch(err) {
        throw err
    }
}

module.exports = sendEmail;