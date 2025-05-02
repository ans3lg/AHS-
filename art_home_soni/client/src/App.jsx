import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import HomePage from "./pages/HomePage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Admin from "./pages/Admin";
import Catalog from "./pages/Catalog";
import PaintingPage from "./pages/PaintingPage";
import Cart from "./pages/Cart";
import MasterclassesList from "./pages/MasterclassesList";
import MasterclassPage from "./pages/MasterclassPage";
import AdminRoute from "./components/AdminRoute";
import AboutPage from "./pages/AboutPage";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ArtistPanel from "./pages/ArtistPanel";
import AddPainting from "./components/AddPainting";
import AddMasterclass from "./components/AddMasterclass";
import BookingsPage from "./pages/BookingsPage";
import GoogleAuthHandler from './pages/GoogleAuthHandler';



import "./App.css";

function App() {
  const [cart, setCart] = useState([]);
  const [notification, setNotification] = useState({ message: "", type: "" });
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  const onLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    setUser(null);
    window.location.reload();
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedUser = jwtDecode(token);
        setUser(decodedUser);
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Ошибка декодирования токена:", error);
        setUser(null);
        setIsAuthenticated(false);
      }
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      const fetchCart = async () => {
        try {
          const res = await fetch("http://localhost:5000/api/cart", {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });

          if (!res.ok) throw new Error("Ошибка загрузки корзины");

          const data = await res.json();
          setCart(data.items || []);
        } catch (error) {
          console.error("Ошибка загрузки корзины:", error);
        }
      };

      fetchCart();
    }
  }, [isAuthenticated]);

  const addToCart = async (painting) => {
    if (!isAuthenticated) {
      setNotification({
        message: "Авторизуйтесь, чтобы добавить товар в корзину!",
        type: "error",
      });
      setTimeout(() => setNotification({ message: "", type: "" }), 3000);
      return;
    }

    try {
      await fetch("http://localhost:5000/api/cart/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ paintingId: painting._id }),
      });

      setCart((prevCart) => {
        const existingItem = prevCart.find(
          (item) => item.paintingId._id === painting._id
        );
        if (existingItem) {
          return prevCart.map((item) =>
            item.paintingId._id === painting._id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        }
        return [...prevCart, { paintingId: painting, quantity: 1 }];
      });

      setNotification({
        message: "Товар добавлен в корзину!",
        type: "success",
      });
      setTimeout(() => setNotification({ message: "", type: "" }), 3000);
    } catch (error) {
      console.error("Ошибка добавления в корзину:", error);
    }
  };

  return (
    <Router>
      <div className="App">
        <Header
          isAuthenticated={isAuthenticated}
          onLogout={onLogout}
          user={user}
        />

        {notification.message && (
          <div className={`notification ${notification.type}`}>
            {notification.message}
          </div>
        )}

        <div className="content-wrapper">
          <Routes>
            <Route path="/admin/*" element={<AdminRoute><Admin /></AdminRoute>} />
            <Route path="/artist" element={<ArtistPanel />} />
            <Route path="/artist/add-painting" element={<AddPainting />} />
            <Route path="/artist/add-masterclass" element={<AddMasterclass />} />
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/catalog" element={<Catalog />} />
            <Route path="/painting/:id" element={<PaintingPage addToCart={addToCart} />} />
            <Route path="/cart" element={<Cart cart={cart} setCart={setCart} />} />
            <Route path="/masterclasses" element={<MasterclassesList />} />
            <Route path="/masterclass/:id" element={<MasterclassPage />} />
            <Route path="/aboutpage" element={<AboutPage />} />
            <Route path="/bookings" element={<BookingsPage />} />
            <Route path="/google-auth" element={<GoogleAuthHandler setUser={setUser} setIsAuthenticated={setIsAuthenticated}/>}/>
          </Routes>
        </div>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
