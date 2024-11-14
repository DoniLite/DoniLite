import './output.css'
import Navigo from 'navigo';
import { index } from './router';

export const router = new Navigo('/');

router.on('/', index)

export const APP = document.querySelector<HTMLDivElement>('#app');

router.resolve();


