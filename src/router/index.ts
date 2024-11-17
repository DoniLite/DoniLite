import { nav, updateAboutNav } from '../components/nav';
import { APP } from '../main';
import { home } from '../pages/home';
import { about } from './about';

export const index = () => {
  APP!.innerHTML = home(nav, about());
  APP?.querySelector('#navGroup')?.querySelectorAll('a').forEach(nav => {
    nav.addEventListener('click', updateAboutNav);
  });
}
