import './App.css'
import { Route, Routes } from "react-router-dom";
import MainLayout from './pages/MainLayout';
// import '../src/assets/css/font.css'
import Collection from './pages/Public/Components/Collection'
import Products from './pages/Public/Components/Products';
import ViewProduct from './pages/Public/Components/ViewProduct';
import Checkout from './pages/Public/Components/Checkout';
import Cart from './pages/Public/Components/Cart';
import Login from './pages/Public/auth/login';
import Register from './pages/Public/auth/Register';
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from 'react-toastify';

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route path='/' element={<Collection />} />
          <Route path='/products' element={<Products />} />
          <Route path='/viewproduct' element={<ViewProduct />} />
          <Route path='/cart' element={<Cart />} />
        </Route>
        <Route path='/checkout' element={<Checkout />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
      </Routes>
      <ToastContainer />
    </>
  )
}
