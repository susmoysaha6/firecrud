import './App.css';
import { addDoc, collection, doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { db } from './firebase/firebase.config';

function App() {
  const handleAdd = async (e) => {
    e.preventDefault()
    const res = await addDoc(collection(db, "cities"), {
      name: "Los Angeles",
      state: "CA",
      country: "USA",
      timeStamp: serverTimestamp()
    })
    console.log(res.id);
  }
  return (
    <div className="App">
      <form onSubmit={handleAdd}>
        <input type="text" name="name" id="" />
        <input type="text" name="address" id="" />
        <button type="submit">Add</button>
      </form>
    </div>
  );
}

export default App;
