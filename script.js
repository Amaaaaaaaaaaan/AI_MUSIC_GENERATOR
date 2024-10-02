let promptInput = document.getElementById("prompt");
let loadingIndicator = document.getElementById("loading");

async function query(data) {
    const response = await fetch(
        "https://api-inference.huggingface.co/models/facebook/musicgen-small",
        {
            headers: {
                Authorization: "Bearer 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", // Your token here
                "Content-Type": "application/json",
            },
            method: "POST",
            body: JSON.stringify(data),
        }
    );

    const result = await response.blob();
    return result;
}

document.getElementById("generateMusic").addEventListener("click", () => {
    loadingIndicator.style.display = "block"; // Show loading indicator
    query({"inputs": promptInput.value})
        .then((response) => {
            const audioURL = URL.createObjectURL(response);
            const audioElement = document.createElement("audio");
            
            // Set attributes for the audio element
            audioElement.src = audioURL;
            audioElement.controls = true; // Show playback controls
            audioElement.play(); // Play the audio immediately
            
            // Append the audio element to the container
            document.getElementById("audioContainer").appendChild(audioElement);
        })
        .catch((error) => {
            console.error("Error generating music:", error);
        })
        .finally(() => {
            loadingIndicator.style.display = "none"; // Hide loading indicator when done
        });
});