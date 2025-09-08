// app/(auth)/layout.js
import { ToastContainer } from "react-toastify";
import "../globals.css";
import LoadingUIProvider from '../LoadingProvider';
export default function AuthLayout({ children }) {
  return (
    <div>
      <div className="bg-gray-100">
        <LoadingUIProvider>
          {children}
        </LoadingUIProvider>
        <ToastContainer theme="colored"/>
      </div>
    </div>
  )
}
