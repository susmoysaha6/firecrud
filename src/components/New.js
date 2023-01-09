import React from 'react';
import { addDoc, collection, doc, getDoc, getDocs, onSnapshot, serverTimestamp, setDoc } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { db, storage } from '../firebase/firebase.config';
import { useEffect, useState } from 'react';
import '../styles/New.css'

const New = () => {
    const [file, setFile] = useState("");
    const [url, setUrl] = useState("");
    const [per, setPer] = useState(null);
    const [users, setUsers] = useState([]);
    // const userCollectionRef = collection(db, 'users')
    // // console.log(file);

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



    useEffect(() => {
        // const getUser = async () => {
        //     const data = await getDocs(collection(db, 'users'));
        //     console.log(data);
        //     setUsers(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
        // };
        // getUser();

        const unsub = onSnapshot(collection(db, 'users'), (snapshot) => {
            let list = [];
            snapshot.docs.forEach((doc) => {
                list.push({ id: doc.id, ...doc.data() })
            });
            setUsers(list);
        }, error => {
            console.log(error);
        });

        return () => {
            unsub();
        }

    }, [])


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
        alert("Document Updated Successfully");
        setUrl("");
        setPer(null);
    }

    return (
        <div className='input-contatianer'>
            <h1>Submit Form</h1>
            <form className='form-container' onSubmit={handleAdd}>
                <input type="text" name="name" id="" placeholder='Enter Your Name' required />
                <br />
                <input type="text" name="address" placeholder='Enter Your Address' id="" required />
                <br />
                <input type="file" id="" onChange={(e) => setFile(e.target.files[0])} />
                <br />
                <button disabled={per < 100} type="submit">Add</button>
            </form>
            <h1>User List</h1>
            {
                users.map(user => <div className='userlist' key={user.id}>
                    <p className='name'>
                        {user.name}
                    </p>
                    <p className='name'>
                        {user.address}

                    </p>
                    <img width={100} src={user.img} alt="" />
                </div>)
            }
        </div>
    );
};

export default New;