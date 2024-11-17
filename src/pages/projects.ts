import { Component } from "../types";


export const projectsPage = (nav?: Component, children?: Component) => {
    return `
    <input type="hidden" name="currentPage" id="currentPage" value="projects">
    ${nav ? nav : ''}
    <div class="h-auto lg:h-screen flex justify-center items-center w-full p-2">
        <div class="w-full">
            <div class="w-full">
                <div 
                    class="flex flex-col gap-4 justify-center items-center"
                >
                    ${children ? children : ''}
                </div>
            </div>
        </div>
    </div>
    `;
}