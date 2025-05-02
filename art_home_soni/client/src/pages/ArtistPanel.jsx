import { Link } from "react-router-dom";

const ArtistPanel = () => {
  return (
    <div>
      <h2>Панель художника</h2>
      <Link to="/artist/add-painting">
        <button>Добавить картину</button>
      </Link>
      <Link to="/artist/add-masterclass">
        <button>Добавить мастер-класс</button>
      </Link>
    </div>
  );
};

export default ArtistPanel;
