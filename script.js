// js/script.js

let net;
const webcamElement = document.getElementById('webcam');
const classifier = knnClassifier.create();
let currentClassIndex = 0;

var hiddenButton = document.getElementById("hidden-button");

async function setupWebcam() {
    return new Promise((resolve, reject) => {
        const navigatorAny = navigator;
        navigator.getUserMedia = navigator.getUserMedia || navigatorAny.webkitGetUserMedia || navigatorAny.mozGetUserMedia || navigatorAny.msGetUserMedia;
        if (navigator.getUserMedia) {
            navigator.getUserMedia(
                { video: true },
                stream => {
                    webcamElement.srcObject = stream;
                    webcamElement.addEventListener('loadeddata', resolve, false);
                },
                error => reject(error)
            );
        } else {
            reject();
        }
    });
}

async function app() {
    console.log('Loading mobilenet..');
    net = await mobilenet.load();
    console.log('Successfully loaded model');
    
    await setupWebcam();
    
    const addExample = classId => {
        const activation = net.infer(webcamElement, 'conv_preds');
        classifier.addExample(activation, classId);
        alert(`Added image to class ${classId}`);
    };

    document.getElementById('capture').addEventListener('click', () => {
        addExample(currentClassIndex);
        hiddenButton.push("on");

    });

    document.getElementById('train').addEventListener('click', async () => {
        alert('Training not required for KNN classifier.');
    });

    document.getElementById('test').addEventListener('click', async () => {
        const activation = net.infer(webcamElement, 'conv_preds');
        const result = await classifier.predictClass(activation);
        const classes = ['Class A', 'Class B', 'Class C'];
        document.getElementById('result').innerText = `
            prediction: ${classes[result.label]}\n
            probability: ${result.confidences[result.label]}
        `;
    });

    document.getElementById('class-buttons').innerHTML = `
        <button id="hidden-button" onclick="currentClassIndex = 0">Class A</button>
        <button id="hidden-button" onclick="currentClassIndex = 1">Class B</button>
        <button id="hidden-button" onclick="currentClassIndex = 2">Class C</button>
    `;
}

app();
