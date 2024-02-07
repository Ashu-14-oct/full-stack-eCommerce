import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Product from "./components/Product";
import Cart from "./components/Cart";
import Order from "./components/Order";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Fail from "./components/Fail";


function App() {
  return (
    <div className="App">
      
      <BrowserRouter>
      <Navbar />
        <Routes>
          <Route path="/" element={<Home/>}></Route>
          <Route path="/login" element={<Login/>}></Route>
          <Route path="/signup" element={<Signup/>}></Route>
          <Route path="/products" element={<Product/>}></Route>
          <Route path="/cart" element={<Cart/>}></Route>
          <Route path="/orders" element={<Order/>}></Route>
          <Route path="/ashu" element={<Fail/>}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
