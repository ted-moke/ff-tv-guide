import { Routes, Route, Link } from 'react-router-dom';
import ButtonShow from './ButtonShow';
import FontShow from '../components/FontShow';

const UIShowcase = () => {

  return (
    <div>
      <nav>
        <ul>
          <li><Link to="/ui/button">Button Showcase</Link></li>
          <li><Link to="/ui/fonts">Font Showcase</Link></li>
        </ul>
      </nav>
      <Routes>
        <Route path="button" element={<ButtonShow />} />
        <Route path="fonts" element={<FontShow />} />
      </Routes>
    </div>
  );
};

export default UIShowcase;