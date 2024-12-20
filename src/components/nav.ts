import { Component } from '../types';

export const nav: Component = `
<div class=" w-full fixed top-0 p-4 flex items-center justify-between z-40">
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 448 512"
        class=" fill-orange-500 font-bold w-[3rem] h-[3rem] hover:scale-150 hover:rotate-180 transition-all"
    >
      <path
        d="M120.12 208.29c-3.88-2.9-7.77-4.35-11.65-4.35H91.03v104.47h17.45c3.88 0 7.77-1.45 11.65-4.35 3.88-2.9 5.82-7.25 5.82-13.06v-69.65c-.01-5.8-1.96-10.16-5.83-13.06zM404.1 32H43.9C19.7 32 .06 51.59 0 75.8v360.4C.06 460.41 19.7 480 43.9 480h360.2c24.21 0 43.84-19.59 43.9-43.8V75.8c-.06-24.21-19.7-43.8-43.9-43.8zM154.2 291.19c0 18.81-11.61 47.31-48.36 47.25h-46.4V172.98h47.38c35.44 0 47.36 28.46 47.37 47.28l.01 70.93zm100.68-88.66H201.6v38.42h32.57v29.57H201.6v38.41h53.29v29.57h-62.18c-11.16.29-20.44-8.53-20.72-19.69V193.7c-.27-11.15 8.56-20.41 19.71-20.69h63.19l-.01 29.52zm103.64 115.29c-13.2 30.75-36.85 24.63-47.44 0l-38.53-144.8h32.57l29.71 113.72 29.57-113.72h32.58l-38.46 144.8z"
      />
    </svg>
    <div class=" gap-x-6 items-center font-bold poetsen-one-regular hidden lg:flex" id="navGroup">
        <a href="/" class="active hover:text-orange-500 transition-all">
            Home
        </a>
        <a href="/#about" class="hover:text-orange-500 transition-all">
            About
        </a>
        <a href="/DoniLite/projects" class="hover:text-orange-500 transition-all">
            Projects
        </a>
        <a href="/DoniLite/contact" class="hover:text-orange-500 transition-all">
            Contact me
        </a>
    </div>
    <div class=" lg:flex hidden items-center gap-x-6">
        <a href="https://x.com/ghost_spyco">
            <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 512 512" 
                class=" fill-white hover:fill-orange-500 transition-all w-8 h-8"
            >
                <path
                    d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z"
                />
            </svg>
        </a>
        <a href="https://github.com/DoniLite">
            <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 496 512"
                class=" fill-white hover:fill-orange-500 transition-all w-8 h-8"
            >
                <path
                    d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3.3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9.3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3.7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3.3 2.9 2.3 3.9 1.6 1 3.6.7 4.3-.7.7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3.7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3.7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z"
                />
            </svg>
        </a>
        <a href="https://www.linkedin.com/in/yao-messan-nogb%C3%A9dzi-3b3696239/">
            <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 448 512"
                class=" fill-white hover:fill-orange-500 transition-all w-8 h-8"
            >
                <path
                    d="M100.28 448H7.4V148.9h92.88zM53.79 108.1C24.09 108.1 0 83.5 0 53.8a53.79 53.79 0 0 1 107.58 0c0 29.7-24.1 54.3-53.79 54.3zM447.9 448h-92.68V302.4c0-34.7-.7-79.2-48.29-79.2-48.29 0-55.69 37.7-55.69 76.7V448h-92.78V148.9h89.08v40.8h1.3c12.4-23.5 42.69-48.3 87.88-48.3 94 0 111.28 61.9 111.28 142.3V448z"
                />
            </svg>
        </a>
        <a href="https://orcid.org/0009-0006-0474-6792">
            <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 512 512"
                class=" fill-white hover:fill-orange-500 transition-all w-8 h-8"
            >
                <path
                    d="M294.75 188.19h-45.92V342h47.47c67.62 0 83.12-51.34 83.12-76.91 0-41.64-26.54-76.9-84.67-76.9zM256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm-80.79 360.76h-29.84v-207.5h29.84zm-14.92-231.14a19.57 19.57 0 1 1 19.57-19.57 19.64 19.64 0 0 1-19.57 19.57zM300 369h-81V161.26h80.6c76.73 0 110.44 54.83 110.44 103.85C410 318.39 368.38 369 300 369z"
                />
            </svg>
        </a>
    </div>

    <div class=" w-8 h-6 flex flex-col gap-1 lg:hidden">
        <div class=" w-full h-1.5 rounded-lg bg-white"></div>
        <div class=" w-full h-1.5 rounded-lg bg-white"></div>
        <div class=" w-full h-1.5 rounded-lg bg-white"></div>
    </div>
</div>
`;

export const updateNavigation = () => {
  const navGroup = document.querySelector<HTMLDivElement>('#navGroup');
  const navEls = navGroup?.querySelectorAll(
    'a'
  ) as NodeListOf<HTMLAnchorElement>;
  const active =
    document.querySelector<HTMLInputElement>('#currentPage')?.value;
  navEls?.forEach((el) => {
    el.classList.remove('active');
  });
  switch (active) {
    case 'home':
      console.log('home clicked');
      const location = window.location.href.split('/').pop();
      console.log(location);
      if(location === '#about') {
        navEls[1].classList.add('active');
        break;
      }
      navEls[0].classList.add('active');
      break;
    case 'contact':
      navEls[3].classList.add('active');
      break;
    case 'projects':
      navEls[2].classList.add('active');
      break;

    default:
      break;
  }
};

export const updateAboutNav = (e: MouseEvent) => {
  const target = e.currentTarget as HTMLElement;

  if (target.textContent === 'about') {
    e.preventDefault();
  }
  const navGroup = document.querySelector<HTMLDivElement>('#navGroup');
  const navEls = navGroup?.querySelectorAll(
    'a'
  ) as NodeListOf<HTMLAnchorElement>;
  navEls?.forEach((el) => {
    el.classList.remove('active');
  });
  target.classList.add('active');
};
