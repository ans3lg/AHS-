import { useEffect, useState } from "react";
import axios from "axios";

const PaintingsList = () => {
  const [paintings, setPaintings] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/paintings").then(({ data }) => setPaintings(data));
  }, []);

  return (
    <div>
      <h2>Картины</h2>
      <ul>{paintings.map((p) => <li key={p._id}>{p.title} - {p.price}₽</li>)}
      </ul>
    </div>
  );
};

export default PaintingsList;
