const tf = require('@tensorflow/tfjs-node');

async function predictClassification(model, imageBuffer) {
    let tensor;
    try {
        tensor = tf.node.decodeImage(imageBuffer, 3)
            .resizeNearestNeighbor([299, 299])
            .expandDims()
            .toFloat()
            .div(tf.scalar(255.0));

        console.log('Tensor shape:', tensor.shape);
    } catch (error) {
        throw new Error('Invalid image format. Please upload JPEG, PNG, GIF, or BMP file.');
    }

    const prediction = model.predict(tensor);
    const score = await prediction.data();
    console.log('Prediction scores:', score);

    const confidenceScore = Math.max(...score) * 100;

    const classes = ['Cabai Hijau Besar', 'Cabai Jalapeno', 'Cabai Keriting', 'Cabai Merah Besar', 'Cabai Paprika', 'Cabai Rawit', 'Cabai gendot (habanero)'];

    const classResult = tf.argMax(prediction, 1).dataSync()[0];
    const label = classes[classResult];

    let id;

    if (label === 'Cabai Hijau Besar') {
        id = 3;
    } else if (label === 'Cabai Jalapeno') {
        id = 4;
    } else if (label === 'Cabai Keriting') {
        id = 5;
    } else if (label === 'Cabai Merah Besar') {
        id = 6;
    } else if (label === 'Cabai Paprika') {
        id = 2;
    } else if (label === 'Cabai Rawit') {
        id = 1;
    } else if (label === 'Cabai gendot (habanero)') {
        id = 7;
    }

    return { confidenceScore, label, id };
}

module.exports = predictClassification;