async function checkGallery() {
    try {
        const res = await fetch('http://localhost:5000/api/sheet/gallery');
        const data = await res.json();
        console.log("ALL DATA:", JSON.stringify(data, null, 2));
    } catch (err) {
        console.error(err);
    }
}
checkGallery();
