"use client";
import { Footer } from "flowbite-react";
import {
  BsDribbble,
  BsGlobeEuropeAfrica,
  BsGithub,
  BsHandbagFill,
  BsFire,
} from "react-icons/bs";

export function MyFooter() {
  return (
    <Footer container className=" bg-slate-300 dark:bg-slate-700">
      <div className="w-full">
        <div className="grid w-full justify-between sm:flex sm:justify-between md:flex md:grid-cols-1">
          <div>
            <Footer.Brand
              href="https://github.com/AlexL69420"
              src="https://sun9-74.userapi.com/impg/CMGltaPFh1GlBOv6vNyRwirf-kc0EcFy5-99jg/FMGXYm45BIU.jpg?size=736x761&quality=95&sign=19aad259836f6aeb335f63fcde4c9191&type=album"
              alt="My Logo"
              name="Летов Александр"
            />
          </div>
          <div className="grid grid-cols-2 gap-8 sm:mt-4 sm:grid-cols-3 sm:gap-6">
            <div>
              <Footer.Title title="about" />
              <Footer.LinkGroup col>
                <Footer.Link href="https://flowbite-react.com/">
                  Flowbite
                </Footer.Link>
                <Footer.Link href="https://tailwindcss.com/">
                  Tailwind CSS
                </Footer.Link>
              </Footer.LinkGroup>
            </div>
            <div>
              <Footer.Title title="Follow us" />
              <Footer.LinkGroup col>
                <Footer.Link href="https://vk.com/aletov3">VK</Footer.Link>
                <Footer.Link href="https://github.com/AlexL69420">
                  Github
                </Footer.Link>
              </Footer.LinkGroup>
            </div>
            <div>
              <Footer.Title title="Legal" />
              <Footer.LinkGroup col>
                <Footer.Link href="#">Privacy Policy</Footer.Link>
                <Footer.Link href="#">Terms &amp; Conditions</Footer.Link>
              </Footer.LinkGroup>
            </div>
          </div>
        </div>
        <Footer.Divider />
        <div className="w-full sm:flex sm:items-center sm:justify-between">
          <Footer.Copyright href="#" by="Летов" year={2024} />
          <div className="mt-4 flex space-x-6 sm:mt-0 sm:justify-center">
            <Footer.Icon href="#" icon={BsGlobeEuropeAfrica} />
            <Footer.Icon href="#" icon={BsHandbagFill} />
            <Footer.Icon href="#" icon={BsFire} />
            <Footer.Icon href="https://github.com/AlexL69420" icon={BsGithub} />
            <Footer.Icon href="#" icon={BsDribbble} />
          </div>
        </div>
      </div>
    </Footer>
  );
}
