function Build(directory, inclueCaptions){
    const repo = "nickyp916/Barely-Fine-Art";
    const folderPath = "images/dnd/";
    const gallery = document.getElementById("gallery");

    fetch(`https://api.github.com/repos/${repo}/contents/${folderPath}${directory}`)
    .then(response => response.json())
    .then(files => {
        files.forEach(file => {
        if (file.type === "file" && /\.(jpg|jpeg|png)$/i.test(file.name)) {
            const img = document.createElement("img");
            const fileName = file.name.replace(/\.[^/.]+$/, "");
            img.src = file.download_url;
            img.alt = fileName;

            const container = document.createElement("div");
            container.className = "image-item";
            container.appendChild(img);

            if(inclueCaptions){
                const caption = document.createElement("p");
                caption.textContent = fileName;
                container.appendChild(caption);
            }

            gallery.appendChild(container);
        }
        });
    })
    .catch(error => console.error("Error fetching images:", error));
}       