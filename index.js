
const express = require('express');
const multer = require('multer');
const cors = require('cors');
const tf = require('@tensorflow/tfjs-node');
const yamnet = require('@tensorflow-models/yamnet');
const app = express();
const port = process.env.PORT || 3000;
const upload = multer();

app.use(cors());

let model;

(async () => {
  model = await yamnet.load();
  console.log("YAMNet model loaded");
})();

app.post('/analyze', upload.single('audio'), async (req, res) => {
  try {
    if (!model) return res.status(503).send('Model not loaded yet');
    const audioBuffer = req.file.buffer;
    const audioTensor = tf.node.decodeWav(audioBuffer);
    const predictions = await model.predict(audioTensor.audio);
    const top = predictions.topK(1);
    const result = {
      tag: top.indices[0],
      confidence: top.values[0]
    };
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).send('Failed to analyze audio');
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
