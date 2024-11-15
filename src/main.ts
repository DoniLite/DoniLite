import './output.css';
import Navigo from 'navigo';
import { index } from './router';
import { about } from './router/about';

export const router = new Navigo('/DoniLite/');

router.on('/', index);
router.on('/about', about);

export const APP = document.querySelector<HTMLDivElement>('#app');

router.resolve();
