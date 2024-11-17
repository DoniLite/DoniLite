import './output.css';
import Navigo from 'navigo';
import { index } from './router';
import { updateNavigation } from './components/nav';
import { projects } from './router/projects';
import { contact } from './router/contact';

export const router = new Navigo('/DoniLite/');

router.on('/', index);
router.on('/contact', contact);
router.on('/projects', projects)

export const APP = document.querySelector<HTMLDivElement>('#app');

router.resolve();

window.onload = updateNavigation;
