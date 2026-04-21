const express = require('express');
const multer = require('multer');
const cors = require('cors');
const fs = require('fs');

const app = express();
app.use(cors());

const upload = multer({ dest: 'uploads/' });

app.post('/process-audio', upload.single('audio'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('Nenhum arquivo enviado');
  }

  const inputPath = req.file.path;

  res.download(inputPath, () => {
    try {
      fs.unlinkSync(inputPath);
    } catch (err) {
      console.error('Erro ao apagar arquivo:', err);
    }
  });
});

app.get('/', (req, res) => {
  res.send('Servidor de áudio ativo');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
