import CenterBlock from '../../../components/CenterBlock/CenterBlock';
import FetchingCourses from '../../../components/FetchingCourses/FetchingCourses';
import Header from '../../../components/Header/Header';

export default function Home() {
  return (
      <main>
        <Header />
        <FetchingCourses />
        <CenterBlock />
      </main>
  );
}