import PropTypes from 'prop-types';
import useDarkMode from '../hooks/useDarkMode';
import { MdOutlineNightlight, MdOutlineWbSunny } from 'react-icons/md';

/**
 * A toggle for switching between light and dark modes.
 *
 * @param {Object} props - The properties for the component.
 * @param {boolean} props.open - Whether the sidebar is open or not.
 */
const ToggleTheme = (props) => {
  const [theme, setTheme] = useDarkMode();
  const { setThm } = props;
  /**
   * Toggles the dark mode.
   */
  const handleToggle =async () => {
   await setTheme(theme === 'light' ? 'dark' : 'light');
    if (theme === 'light') setThm(true);
    else setThm(false);
  };

  return (
    <a onClick={handleToggle} className="flex items-center gap-2 py-2 px-2 hover:bg-neutral-focus rounded" href="">
    {theme === 'dark' ? (
      <div className="flex items-center justify-center gap-2">
        <MdOutlineWbSunny size={20} />
        <p className={`${!props.open && 'hidden'}`}>Light mode</p>
      </div>
    ) : (
      <div className="flex items-center justify-center gap-2">
        <MdOutlineNightlight size={20} />
        <p className={`${!props.open && 'hidden'}`}>Night mode</p>
      </div>
    )}
  </a>
  );
};

export default ToggleTheme;

ToggleTheme.propTypes = {
  open: PropTypes.bool,
};
