import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import MapBooks from '../../components/user/MapBooks';

export default function Home() {
  const { books, subjects } = useSelector((state) => state.books);
  const [showSubjects, setShowSubjects] = useState([]);

  useEffect(() => {
    if (subjects && subjects.length) {
      const count = Math.min(6, subjects.length);
      const shuffled = [...subjects];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      const randomSubjects = shuffled.slice(0, count);
      setShowSubjects(randomSubjects);
    } else {
      setShowSubjects([]);
    }
  }, [subjects]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-row-1 sm:grid-row-2 lg:grid-row-4 gap-6">
        {showSubjects.map((sub, index) => (
          <MapBooks key={index} subject={sub} />
        ))}
      </div>
    </div>
  );
}
