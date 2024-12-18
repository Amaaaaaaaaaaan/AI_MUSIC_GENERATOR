//todo -- add prompt when user wants to download the file so he can save the file with their desired name
import WaveSurfer from 'https://unpkg.com/wavesurfer.js@latest/dist/wavesurfer.esm.js';
let prompt=document.getElementById("prompt")

let promptInput = document.getElementById("prompt");
let loadingIndicator = document.getElementById("loading");

// Update this function to call your backend instead of Hugging Face directly
async function query(data) {
    const response = await fetch("http://localhost/generate-music", { // Change the endpoint to your Express backend
        headers: {
            "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        throw new Error("Network response was not ok");
    }

    const result = await response.blob();
    return result;
}

document.getElementById("generateMusic").addEventListener("click", () => {
    loadingIndicator.style.display = "block"; // Show loading indicator
    query({ "inputs": promptInput.value })
        .then((response) => {
            console.log(response)
            const audioURL = URL.createObjectURL(response);
            console.log(audioURL)
            const wavesurfer = WaveSurfer.create({
                container: '#waveform',
                waveColor: '#4F4A85',
                progressColor: '#383351',
                url: audioURL,
              })
             
document.getElementById('playPauseBtn').addEventListener('click', () => {
    wavesurfer.playPause();
});

              document.getElementById('downloadBtn').addEventListener('click', () => {
                const link = document.createElement('a');
                link.href = audioURL; // Use the same URL you loaded
                link.download = prompt.value; // Specify the filename


                document.body.appendChild(link); // Append to body
                link.click(); // Trigger download
                document.body.removeChild(link); // Clean up
            });              
            // const audioElement = document.createElement("audio");

            // // Set attributes for the audio element
            // audioElement.src = audioURL;
            // audioElement.controls = true; // Show playback controls
            // audioElement.play(); // Play the audio immediately

            // // Append the audio element to the container
            // document.getElementById("audioContainer").appendChild(audioElement);
        })
        .catch((error) => {
            console.error("Error generating music:", error);
        })
        .finally(() => {
            loadingIndicator.style.display = "none"; // Hide loading indicator when done
        });
});
document.getElementById('playPauseBtn').addEventListener('click', () => {
    wavesurfer.playPause();
});

// below i have written all the steps taken to use the inference API using a BACKEND here EXPRESS(node)JS
/*

for easy understanding i implemented the backend to hide my API KEY and to learn post req handling it was tedious but got
the job done tbh

Initial Issue: The initial attempt to return the audio data directly as a blob was problematic because Axios does not recognize the response.blob() method. Axios processes the response differently, particularly for binary data.

Using arrayBuffer(): By changing the Axios response type to arraybuffer, we can handle the binary data correctly. This allows us to receive the audio file as a raw binary buffer.

Creating a Blob: Once we have the binary data (array buffer), we wrap it into a Blob. This blob represents the binary data as a file-like object (in this case, an audio file).

Sending the Blob to the Frontend: We send this blob back to the frontend using res.send(musicResponse). The frontend can then handle this response properly.

Handling the Response in the Frontend:

The frontend receives the audio data and uses URL.createObjectURL() to create a URL from the blob.
This URL is then used to create an audio element, which allows the user to play the audio directly in the browser.

*/