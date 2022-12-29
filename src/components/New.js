import React from 'react';
import { addDoc, collection, doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { db, storage } from '../firebase/firebase.config';
import { useEffect, useState } from 'react';

const New = () => {
    const [file, setFile] = useState("");
    const [url, setUrl] = useState("");
    const [per, setPer] = useState(null);
    console.log(file);

    useEffect(() => {
        const uploadFile = () => {
            const name = new Date().getTime() + file.name;

            console.log(name);
            const storageRef = ref(storage, name);
            const uploadTask = uploadBytesResumable(storageRef, file);

            uploadTask.on(
                "state_changed",
                (snapshot) => {
                    const progress =
                        (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log("Upload is " + progress + "% done");
                    setPer(progress);
                    switch (snapshot.state) {
                        case "paused":
                            console.log("Upload is paused");
                            break;
                        case "running":
                            console.log("Upload is running");
                            break;
                        default:
                            break;
                    }
                },
                (error) => {
                    console.log(error);
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        setUrl(downloadURL);
                    });
                }
            );
        };
        file && uploadFile();
    }, [file]);


    const handleAdd = async (e) => {
        e.preventDefault();
        const name = e.target.name.value;
        const address = e.target.address.value;
        const res = await addDoc(collection(db, "users"), {
            name: name,
            address: address,
            img: url,
            timeStamp: serverTimestamp()
        })
        console.log(res.id);
        e.target.reset();
    }
    return (
        <div>
            <form onSubmit={handleAdd}>
                <input type="text" name="name" id="" required />
                <input type="text" name="address" id="" required />
                <input type="file" id="" onChange={(e) => setFile(e.target.files[0])} />
                <button disabled={per < 100} type="submit">Add</button>
            </form>
        </div>
    );
};

export default New;