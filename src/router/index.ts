import { nav } from '../components/nav';
import { APP } from '../main';
import { home } from '../pages/home';

export const index = () => {
  APP!.innerHTML = home(nav);
}
