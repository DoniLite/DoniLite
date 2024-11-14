import { nav } from "../components/nav"
import { APP } from "../main"


export const about = () => {
    APP!.innerHTML = `
    ${nav}
    <h1>About</h1>
    `
}