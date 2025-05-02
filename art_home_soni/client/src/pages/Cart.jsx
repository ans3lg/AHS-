import React, { useEffect, useState, useMemo, useCallback } from "react";
import Modal from "react-modal";
import "./Cart.css";

const Cart = ({ cart, setCart }) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [deleteConfirmModalOpen, setDeleteConfirmModalOpen] = useState(false);
  const [paintingToDelete, setPaintingToDelete] = useState(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    telegram: "",
    address: "",
    postalCode: "",
  });

  // Подсчет общей суммы
  const total = useMemo(() => {
    return cart.reduce(
      (acc, item) => acc + Number(item.paintingId?.price || 0) * item.quantity,
      0
    );
  }, [cart]);

  const handleCheckout = async () => {
    // Проверяем, есть ли в корзине купленные товары
    const hasSoldItems = cart.some((item) => item.paintingId.sold);

    if (hasSoldItems) {
      alert(
        "Некоторые товары в вашей корзине уже куплены. Пожалуйста, обновите корзину."
      );
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5000/api/orders/checkout",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ ...formData, cart }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        alert("Заказ успешно оформлен!");
        setCart([]); // Очищаем корзину на клиенте
        setModalIsOpen(false);
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Ошибка оформления заказа:", error);
    }
  };

  // Функция удаления из корзины
  const removeFromCart = useCallback(
    async (paintingId) => {
      try {
        await fetch("http://localhost:5000/api/cart/remove", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ paintingId }),
        });

        setCart((prevCart) =>
          prevCart.filter((item) => item.paintingId?._id !== paintingId)
        );
      } catch (error) {
        console.error("Ошибка удаления из корзины:", error);
      }
    },
    [setCart]
  );

  // Открытие модального окна подтверждения удаления
  const handleDeleteClick = (paintingId) => {
    setPaintingToDelete(paintingId);
    setDeleteConfirmModalOpen(true);
  };

  // Подтверждение удаления
  const confirmDelete = () => {
    removeFromCart(paintingToDelete);
    setDeleteConfirmModalOpen(false);
  };

  return (
    <div className="cart-page">
      <div className="cart-page-container">
        <h1>Корзина</h1>
        {!cart.length ? (
          <p className="empty-cart">Корзина пуста</p>
        ) : (
          <>
            <div className="cart-list">
              {cart.map((item, index) => (
                <div key={index} className="cart-item">
                  {item.paintingId && (
                    <>
                      <img
                        src={`http://localhost:5000/${item.paintingId.mainImage}`}
                        alt={item.paintingId.title}
                      />
                      <div className="cart-details">
                        <h2>{item.paintingId.title}</h2>
                        <p>Цена: {item.paintingId.price} руб.</p>
                        <p>Количество: {item.quantity}</p>
                        {item.paintingId.sold ? (
                          <div className="buyed">
                            <p className="sold-out">Товар уже куплен</p>
                            <button onClick={() => handleDeleteClick(item.paintingId._id)}>
                              Удалить
                            </button>
                          </div>
                        ) : (
                          <button onClick={() => handleDeleteClick(item.paintingId._id)}>
                            Удалить
                          </button>
                        )}
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
            <h2 className="total-price">Общая сумма: {total} руб.</h2>
            <button onClick={() => setModalIsOpen(true)}>Оформить заказ</button>

            <Modal
              className="cart_modal"
              isOpen={modalIsOpen}
              onRequestClose={() => setModalIsOpen(false)}
            >
              <h2 className="cart_modal_h2">Введите данные для заказа</h2>
              <input
                className="cart_input-field"
                type="text"
                placeholder="Имя"
                value={formData.firstName}
                onChange={(e) =>
                  setFormData({ ...formData, firstName: e.target.value })
                }
              />
              <input
                className="cart_input-field"
                type="text"
                placeholder="Фамилия"
                value={formData.lastName}
                onChange={(e) =>
                  setFormData({ ...formData, lastName: e.target.value })
                }
              />
              <input
                className="cart_input-field"
                type="text"
                placeholder="Телефон"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
              />
              <input
                className="cart_input-field"
                type="text"
                placeholder="Телеграм"
                value={formData.telegram}
                onChange={(e) =>
                  setFormData({ ...formData, telegram: e.target.value })
                }
              />
              <input
                className="cart_input-field"
                type="text"
                placeholder="Адрес"
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
              />
              <input
                className="cart_input-field"
                type="text"
                placeholder="Почтовый индекс"
                value={formData.postalCode}
                onChange={(e) =>
                  setFormData({ ...formData, postalCode: e.target.value })
                }
              />
              <button className="cart_confirm-button" onClick={handleCheckout}>
                Подтвердить
              </button>
            </Modal>
          </>
        )}
      </div>

      {/* Модальное окно подтверждения удаления */}
      <Modal
        isOpen={deleteConfirmModalOpen}
        onRequestClose={() => setDeleteConfirmModalOpen(false)}
        className="cart_modal"
      >
        <h3>Вы уверены, что хотите удалить этот товар из корзины?</h3>
        <div className="cart_button-container">
          <button
            className="cart_confirm-button"
            onClick={confirmDelete}
          >
            Да, удалить
          </button>
          <button
            className="cart_confirm-button"
            onClick={() => setDeleteConfirmModalOpen(false)}
          >
            Отмена
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default Cart;
