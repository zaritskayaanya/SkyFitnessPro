import CenterBlock from '../../../components/CenterBlock/CenterBlock';
import FetchingCourses from '../../../components/FetchingCourses/FetchingCourses';

export default function Home() {
  return (
    <main>
      <FetchingCourses />
      <CenterBlock />
    </main>
  );
}