import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Catalog.css";

const Catalog = () => {
    const [paintings, setPaintings] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6; // Количество картин на странице

    useEffect(() => {
        fetch("http://localhost:5000/api/paintings")
            .then((res) => res.json())
            .then((data) => setPaintings(data.filter(p => !p.sold))) // Исключаем проданные картины
            .catch((err) => console.error("Ошибка загрузки картин:", err));
    }, []);

    // Подсчет общего количества страниц
    const totalPages = Math.ceil(paintings.length / itemsPerPage);

    // Вычисление индексов для текущей страницы
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentPaintings = paintings.slice(indexOfFirstItem, indexOfLastItem);

    // Функции смены страницы
    const goToPage = (page) => setCurrentPage(page);
    const goToNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
    const goToPrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

    return (
        <div className="CatalogPage">
            <h1>Каталог картин</h1>
            <div className="catalogP">
                {currentPaintings.map((painting) => (
                    <Link key={painting._id} to={`/painting/${painting._id}`} className="product-link">
                        <div className="product-card">
                            <img src={`http://localhost:5000/${painting.mainImage}`} alt={painting.title} className="catalog-image" />
                            <h2>{painting.title}</h2>
                            <p>{painting.price} руб.</p>
                        </div>
                    </Link>
                ))}
            </div>

            {/* Пагинация */}
            {totalPages > 1 && (
                <div className="pagination">
                    <button onClick={() => goToPage(1)} disabled={currentPage === 1}>Первая</button>
                    <button onClick={goToPrevPage} disabled={currentPage === 1}>Назад</button>

                    {[...Array(totalPages)].map((_, index) => {
                        const pageNum = index + 1;
                        return (
                            <button
                                key={pageNum}
                                onClick={() => goToPage(pageNum)}
                                className={currentPage === pageNum ? "active" : ""}
                            >
                                {pageNum}
                            </button>
                        );
                    })}

                    <button onClick={goToNextPage} disabled={currentPage === totalPages}>Вперед</button>
                    <button onClick={() => goToPage(totalPages)} disabled={currentPage === totalPages}>Последняя</button>
                </div>
            )}
        </div>
    );
};

export default Catalog;
