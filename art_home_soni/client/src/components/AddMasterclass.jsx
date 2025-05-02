import ArtistPanel from "../pages/ArtistPanel";

const AddMasterclass = () => {
  return (
    <div>
      <ArtistPanel/>
      <h2>Добавить мастер-класс</h2>
      <form>
        <label>Название:</label>
        <input type="text" name="title" />

        <label>Дата:</label>
        <input type="date" name="date" />

        <label>Формат:</label>
        <select name="format">
          <option value="online">Онлайн</option>
          <option value="offline">Офлайн</option>
        </select>

        <label>Цена:</label>
        <input type="number" name="price" />

        <button type="submit">Добавить</button>
      </form>
    </div>
  );
};

export default AddMasterclass;
