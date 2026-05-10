// Firebase DB and Storage operations

window.loadMemoriesFromFirebase = async function() {
    if (!window.firebaseAuth.currentUser) return;
    
    try {
        const uid = window.firebaseAuth.currentUser.uid;
        const q = window.firebaseQuery(window.firebaseCollection(window.firebaseDb, "memories_" + uid));
        const querySnapshot = await window.firebaseGetDocs(q);
        
        window.memories = [];
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            window.memories.push({
                id: doc.id,
                title: data.title,
                date: new Date(data.date), // Convert timestamp/string back to Date
                latlng: data.latlng,
                images: data.images || []
            });
        });
        window.renderAll();
    } catch (error) {
        console.error("Error loading memories:", error);
        window.showMessage("Failed to load memories from cloud.");
    }
};

window.uploadFileToStorage = async function(file) {
    if (!window.firebaseAuth.currentUser) throw new Error("Not authenticated");
    const uid = window.firebaseAuth.currentUser.uid;
    
    // Create a unique filename
    const uniqueName = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
    const storageRef = window.firebaseRef(window.firebaseStorage, `users/${uid}/${uniqueName}`);
    
    // Determine type (image or video)
    const isVideo = file.type.startsWith('video/');
    
    const snapshot = await window.firebaseUploadBytesResumable(storageRef, file);
    const downloadURL = await window.firebaseGetDownloadURL(snapshot.ref);
    
    return {
        url: downloadURL,
        name: file.name,
        type: isVideo ? 'video' : 'image',
        path: snapshot.ref.fullPath // Keep path for deletion later
    };
};

window.deleteFileFromStorage = async function(path) {
    if(!path) return;
    try {
        const storageRef = window.firebaseRef(window.firebaseStorage, path);
        await window.firebaseDeleteObject(storageRef);
    } catch (error) {
        console.error("Error deleting file:", error);
    }
};
