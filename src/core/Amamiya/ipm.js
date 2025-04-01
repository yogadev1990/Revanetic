const tf = require("@tensorflow/tfjs-node");
const path = require("path");
const fs = require("fs");

class IPM {
  constructor() {
    this.model = null;
  }

  async loadModel() {
    if (!this.model) {
      const modelPath = path.resolve(__dirname, "../../data/model_ipm/model.json");
      this.model = await tf.loadGraphModel(`file://${modelPath}`);
      console.log("✅ Model berhasil dimuat.");
    }
  }

  async predict(imageBuffer) {
    if (!this.model) {
      await this.loadModel();
    }

    const tempPath = `${__dirname}/../../data/temp/ipm.png`;
    const stream = Buffer.from(imageBuffer, "base64");
    fs.writeFileSync(tempPath, stream);

    const tensor = tf.node.decodeImage(fs.readFileSync(tempPath))
      .resizeNearestNeighbor([100, 100])
      .expandDims()
      .toFloat();

    // Jalankan prediksi
    const predictions = this.model.predict(tensor);
    const softmaxPredictions = tf.softmax(predictions);
    const probabilities = await softmaxPredictions.data(); // Konversi tensor menjadi array

    // Kelas yang diprediksi
    const classNames = ["Tumor Ganas (Kanker)", "Bukan Tumor Ganas/Tidak terdeteksi"];
    const predictedIndex = probabilities.indexOf(Math.max(...probabilities));

    return {
      prediksi: classNames[predictedIndex],
      prob: (Math.max(...probabilities) * 100).toFixed(2) + "%",
    };
  }
}

module.exports = IPM;
