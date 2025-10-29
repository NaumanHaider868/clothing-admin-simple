import './App.css'
import { Route, Routes } from "react-router-dom";
import MainLayout from './pages/MainLayout';
import { Login, Register } from './pages/Public/auth';
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from 'react-toastify';
import { ViewProduct, AddProduct, Collection } from './pages/Public/Components';

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route path='/' element={<Collection />} />
          <Route path='/product/:id' element={<ViewProduct />} />
          <Route path='/product_action' element={<AddProduct />} />
        </Route>
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
      </Routes>
      <ToastContainer />
    </>
  )
}
