import { useEffect, useState, useRef } from "react";
import { Bar } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import "./AdminStats.css";

Chart.register(...registerables);

const AdminStats = () => {
  const [stats, setStats] = useState({
    totalSales: 0,
    totalOrders: 0,
    monthlySales: [],
  });
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const chartRef = useRef(null);

  useEffect(() => {
    fetchStats(); // загружаем за весь период при первом рендере
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("token");
      let url = "http://localhost:5000/api/orders/stats";

      const queryParams = [];
      if (startDate) queryParams.push(`startDate=${startDate}`);
      if (endDate) queryParams.push(`endDate=${endDate}`);

      if (queryParams.length) {
        url += `?${queryParams.join("&")}`;
      }

      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error(`Ошибка сервера: ${response.status}`);
      }

      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error("Ошибка загрузки статистики:", error);
    }
  };

  const generatePDF = async () => {
    const doc = new jsPDF("p", "mm", "a4");
    doc.setFont("helvetica", "normal");

    doc.text("Sales Report", 10, 10);
    doc.text(`Total sales amount: ${stats.totalSales} RUB.`, 10, 20);
    doc.text(`Number of orders: ${stats.totalOrders}`, 10, 30);

    if (chartRef.current) {
      const canvas = await html2canvas(chartRef.current);
      const imgData = canvas.toDataURL("image/png");
      doc.addImage(imgData, "PNG", 10, 40, 180, 80);
    }

    doc.save("Отчет.pdf");
  };

  const chartData = {
    labels: [
      "Янв",
      "Фев",
      "Мар",
      "Апр",
      "Май",
      "Июн",
      "Июл",
      "Авг",
      "Сен",
      "Окт",
      "Ноя",
      "Дек",
    ],
    datasets: [
      {
        label: "Продажи по месяцам (руб.)",
        data: stats.monthlySales,
        backgroundColor: "rgba(54, 162, 235, 0.6)",
      },
    ],
  };

  return (
    <div className="admin-stats">
      <h2>Отчетность о продажах</h2>

      <div className="date-filters">
        <label>
          Начальная дата:{" "}
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </label>
        <label>
          Конечная дата:{" "}
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </label>
        <button onClick={fetchStats}>Применить фильтр</button>
        <button className="clear-button" onClick={() => setStartDate("") & setEndDate("")}>
          Очистить
        </button>
      </div>

      <p>
        <strong>Общая сумма продаж:</strong> {stats.totalSales} руб.
      </p>
      <p>
        <strong>Количество заказов:</strong> {stats.totalOrders}
      </p>

      <div className="chart-container" ref={chartRef}>
        <Bar data={chartData} />
      </div>

      <button className="download-btn" onClick={generatePDF}>
        📥 Скачать отчет
      </button>
    </div>
  );
};

export default AdminStats;
