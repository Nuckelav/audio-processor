const express = require('express');
const multer = require('multer');
const cors = require('cors');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());

const upload = multer({ dest: 'uploads/' });

app.post('/process-audio', upload.single('audio'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('Nenhum arquivo enviado');
  }

  const inputPath = req.file.path;
  const outputPath = path.join(__dirname, `output-${Date.now()}.wav`);

  const command = `ffmpeg -i ${inputPath} -af "highpass=f=80, lowpass=f=8000, dynaudnorm" ${outputPath}`;

  exec(command, (error) => {
    if (error) {
      console.error(error);
      return res.status(500).send('Erro ao processar áudio');
    }

    res.download(outputPath, () => {
      fs.unlinkSync(inputPath);
      fs.unlinkSync(outputPath);
    });
  });
});

app.get('/', (req, res) => {
  res.send('Servidor de áudio ativo');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
