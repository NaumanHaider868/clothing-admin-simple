import './App.css'
import { Route, Routes } from "react-router-dom";
import MainLayout from './pages/MainLayout';
import { Login, Register } from './pages/Public/auth';
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from 'react-toastify';
import { ViewProduct, AddProduct, Collection } from './pages/Public/Components';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Dashboard } from './pages/Public/dashboard/Dashboard';
import { Team } from './pages/Public/team/Team';
import { Orders } from './pages/Public/orders/Orders';
import { Activity } from './pages/Public/activity/Activity';
import { BulkImport } from './pages/Public/import/BulkImport';

export default function App() {
  return (
    <>
      <Routes>
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<MainLayout />}>
            <Route path='/' element={<Collection />} />
            <Route path='/dashboard' element={<Dashboard />} />
            <Route path='/product/:id' element={<ViewProduct />} />
            <Route path='/product_action' element={<AddProduct />} />
            <Route path='/import' element={<BulkImport />} />
            <Route path='/team' element={<Team />} />
            <Route path='/orders' element={<Orders />} />
            <Route path='/activity' element={<Activity />} />
          </Route>
        </Route>
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
      </Routes>
      <ToastContainer />
    </>
  )
}
