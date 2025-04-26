import express from 'express';
import nodemailer from 'nodemailer';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

app.post('/send', async (req, res) => {
  const data = req.body;

  let html = `
    <h2>Nouvelle fiche client</h2>
    <ul>
      <li><b>Nom:</b> ${data.nom}</li>
      <li><b>Prénom:</b> ${data.prenom}</li>
      <li><b>Nom de la société:</b> ${data.societe}</li>
      <li><b>Email:</b> ${data.email}</li>
      <li><b>Téléphone:</b> ${data.telephone}</li>
      <li><b>Date:</b> ${data.date}</li>
      <li><b>SIRET:</b> ${data.siret}</li>
    </ul>
    <h3>Données</h3>
    <table border="1" cellpadding="5" cellspacing="0">
      <tr>
        <th>Type de data</th>
        <th>Quantité</th>
        <th>Prix unitaire (€)</th>
        <th>Total (€)</th>
      </tr>
      ${data.lignes.map(ligne => `
        <tr>
          <td>${ligne.typeData}</td>
          <td>${ligne.quantite}</td>
          <td>${ligne.prix}</td>
          <td>${ligne.total}</td>
        </tr>
      `).join('')}
    </table>
    <p><b>Quantité totale :</b> ${data.quantiteTotal}</p>
    <p><b>Prix total :</b> ${data.prixTotal} €</p>
  `;

  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASSWORD
    }
  });

  try {
    await transporter.sendMail({
      from: `"Fiche Client" <${process.env.GMAIL_USER}>`,
      to: [process.env.GMAIL_USER, data.email, data.email2].filter(Boolean).join(','),
      subject: "Nouvelle fiche client",
      html
    });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Serveur lancé sur http://localhost:${PORT}`));