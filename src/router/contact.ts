import { nav } from "../components/nav";
import { APP } from "../main";
import { contactPage } from "../pages/contact";



export const contact = () => {
  APP!.innerHTML = contactPage(nav);
};