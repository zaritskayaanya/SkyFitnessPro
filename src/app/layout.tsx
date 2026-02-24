import type { Metadata } from 'next';
import { Roboto } from 'next/font/google';
import './globals.css';
import 'react-toastify/dist/ReactToastify.css';
import ReduxProvider from '../store/ReduxProvider';
import { ModalProvider } from '../context/ModalContext';
import ModalLogin from '../components/ModalLogin/ModalLogin';
import ModalRegister from '../components/ModalRegister/ModalRegister';
import Header from '../components/Header/Header';
import MyCoursesHydration from '../components/MyCoursesHydration/MyCoursesHydration';
import { ToastContainer } from 'react-toastify';

const roboto = Roboto({
  variable: '--font-roboto',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'SkyFitnessPro',
  description: 'Онлайн-тренировки для занятий дома',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${roboto.variable}  antialiased`} suppressHydrationWarning>
        <ReduxProvider>
          <ModalProvider>
            <MyCoursesHydration />
            <Header /> 
            <main>{children}</main>
            <ModalLogin />
            <ModalRegister />
            <ToastContainer
              position="top-right"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="light"
            />
          </ModalProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}