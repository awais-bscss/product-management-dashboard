import { Outlet } from 'react-router-dom';
import ToastContainer from '../components/ui/ToastContainer';

export default function RootLayout() {
  return (
    <>
      <Outlet />
      <ToastContainer />
    </>
  );
}
