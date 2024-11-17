import { nav } from "../components/nav";
import { APP } from "../main";
import { projectsPage } from "../pages/projects";



export const projects = () => {
  APP!.innerHTML = projectsPage(nav);
};