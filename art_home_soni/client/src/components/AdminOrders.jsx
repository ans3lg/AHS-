import { useEffect, useState } from "react";
import "./AdminOrders.css";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/orders", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(`Ошибка сервера: ${response.status} - ${errorMessage}`);
      }

      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error("Ошибка загрузки заказов:", error);
    }
  };

  const filteredOrders = orders
    .filter((order) =>
      order.items.some(
        (item) =>
          item.paintingId?.title.toLowerCase().includes(search.toLowerCase()) ||
          order.customerInfo.firstName.toLowerCase().includes(search.toLowerCase()) ||
          order.customerInfo.lastName.toLowerCase().includes(search.toLowerCase())
      )
    )
    .sort((a, b) => {
      let aValue, bValue;

      switch (sortBy) {
        case "createdAt":
          aValue = new Date(a.createdAt);
          bValue = new Date(b.createdAt);
          break;
        case "name":
          aValue = `${a.customerInfo.firstName} ${a.customerInfo.lastName}`.toLowerCase();
          bValue = `${b.customerInfo.firstName} ${b.customerInfo.lastName}`.toLowerCase();
          break;
        case "email":
          aValue = a.userId?.email || "";
          bValue = b.userId?.email || "";
          break;
        case "phone":
          aValue = a.customerInfo.phone;
          bValue = b.customerInfo.phone;
          break;
        case "address":
          aValue = a.customerInfo.address;
          bValue = b.customerInfo.address;
          break;
        case "price":
          aValue = a.totalPrice;
          bValue = b.totalPrice;
          break;
        case "status":
          aValue = a.status;
          bValue = b.status;
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
      if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  const renderSortIcon = (field) => {
    if (sortBy !== field) return "⇅";
    return sortOrder === "asc" ? "▲" : "▼";
  };

  return (
    <div className="admin-orders">
      <h2>Список заказов</h2>

      <div className="search-controls">
        <input
          type="text"
          placeholder="🔍 Поиск по названию картины или имени..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />
        <button className="clear-button" onClick={() => setSearch("")}>
          Очистить
        </button>
      </div>

      {filteredOrders.length === 0 ? (
        <p>Заказов не найдено.</p>
      ) : (
        <div className="orders-table-wrapper">
          <table className="orders-table">
            <thead>
              <tr>
                <th onClick={() => handleSort("createdAt")}>
                  Дата {renderSortIcon("createdAt")}
                </th>
                <th onClick={() => handleSort("name")}>
                  Имя клиента {renderSortIcon("name")}
                </th>
                <th onClick={() => handleSort("email")}>
                  Email {renderSortIcon("email")}
                </th>
                <th onClick={() => handleSort("phone")}>
                  Телефон {renderSortIcon("phone")}
                </th>
                <th onClick={() => handleSort("address")}>
                  Адрес {renderSortIcon("address")}
                </th>
                <th>Картины</th>
                <th onClick={() => handleSort("price")}>
                  Сумма {renderSortIcon("price")}
                </th>
                <th onClick={() => handleSort("status")}>
                  Статус {renderSortIcon("status")}
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order._id}>
                  <td>{new Date(order.createdAt).toLocaleString()}</td>
                  <td>
                    {order.customerInfo.firstName} {order.customerInfo.lastName}
                  </td>
                  <td>{order.userId?.email || "Не указан"}</td>
                  <td>{order.customerInfo.phone}</td>
                  <td>
                    {order.customerInfo.address}, {order.customerInfo.postalCode}
                  </td>
                  <td>
                    <ul>
                      {order.items.map((item) => (
                        <li key={item.paintingId?._id}>
                          {item.paintingId?.title || "Удалено"} — {item.quantity} шт.
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td>{order.totalPrice} ₽</td>
                  <td>{order.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
