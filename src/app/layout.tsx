import type { Metadata } from 'next';
import { Roboto } from 'next/font/google';
import './globals.css';
import ReduxProvider from '../store/ReduxProvider';
import { ModalProvider } from '../context/ModalContext';
import ModalLogin from '../components/ModalLogin/ModalLogin';
import ModalRegister from '../components/ModalRegister/ModalRegister';
import Header from '../components/Header/Header';

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
    <html lang="en">
      <body className={`${roboto.variable}  antialiased`}>
        <ReduxProvider>
          <ModalProvider>
            <FetchingCourses />
            <Header /> {/* 💡 Header теперь один на все страницы */}
            <main>{children}</main>
            <ModalLogin />
            <ModalRegister/>
          </ModalProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}