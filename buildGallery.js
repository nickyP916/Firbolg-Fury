async function Build(folderPath, includeCaptions) {
    const repo = "nickyp916/Firbolg-Fury";
    const gallery = document.getElementById("gallery");
    gallery.innerHTML = "";


    try {
        const files = await fetch(`https://api.github.com/repos/${repo}/contents/images/${folderPath}`)
            .then(async response => await response.json());

        if (includeCaptions) {
            const imageDataMeta = await (await fetch(`https://api.github.com/repos/${repo}/contents/images/${folderPath}/imageData.json`)).json();
            const imageData = await (await fetch(imageDataMeta.download_url)).json();

            const images = files
                .filter(file => file.type === "file" && /\.(jpg|jpeg|png)$/i.test(file.name))
                .map(file => {
                    const meta = imageData.find(img => img.filename === file.name) || {};
                    return {
                        ...file,
                        description: meta.description || "",
                        date: meta.date || ""
                    };
                });

            images.sort((a, b) => new Date(b.date) - new Date(a.date));

            images.forEach(file => {
                const img = document.createElement("img");
                const fileName = file.name.replace(/\.[^/.]+$/, "");
                img.src = file.download_url;
                img.alt = fileName;
                img.addEventListener("click", () => enlargeImage(img));
                const container = document.createElement("div");
                container.className = "image-item";
                container.appendChild(img);

                const description = document.createElement("p");
                description.textContent = file.description;

                const summary = document.createElement("summary");
                summary.textContent = fileName;

                const details = document.createElement("details");
                details.appendChild(summary);

                details.appendChild(description);

                container.appendChild(details);
                gallery.appendChild(container);
            });
        }
        else {
            fetch(`https://api.github.com/repos/${repo}/contents/images/${folderPath}`)
                .then(response => response.json())
                .then(files => {
                    files.forEach(file => {
                        if (file.type === "file" && /\.(jpg|jpeg|png)$/i.test(file.name)) {
                            const img = document.createElement("img");
                            img.src = file.download_url;
                            img.addEventListener("click", () => enlargeImage(img));

                            const container = document.createElement("div");
                            container.className = "image-item";
                            container.appendChild(img);

                            gallery.appendChild(container);
                        }
                    });
                }).catch(error => console.error("Error fetching images:", error));
        }
    }
    catch (error) {
        console.error("Error fetching gallery data:", error);
    }

}

function enlargeImage(img) {
    if (img.requestFullscreen) {
        img.requestFullscreen(); //Modern browsers
    } else if (img.webkitRequestFullscreen) { // Safari
        img.webkitRequestFullscreen();
    } else if (img.msRequestFullscreen) { // IE11
        img.msRequestFullscreen();
    }
    else {
        console.warn("Fullscreen API not supported");
    }

}