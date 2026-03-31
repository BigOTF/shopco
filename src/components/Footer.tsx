"use client"
import { useState } from "react"
import { Icon } from "@iconify/react"
import Link from "next/link"

export default function Footer() {
    const [email, setEmail] = useState("")

    return (
        <footer className="flex flex-col max-w-360 w-full">

            <div className="lg:w-310 mx-7 lg:mx-auto bg-black rounded-[20px] px-6 py-8 lg:px-16 lg:py-9 flex flex-col gap-6 lg:gap-0 lg:flex-row items-center justify-between relative z-10">
                <p className="font-bebas font-bold text-white text-[32px] leading-8.75 lg:text-[40px] lg:leading-11.25 tracking-[0%]">STAY UPTO DATE ABOUT OUR LATEST OFFERS</p>

                <div className="flex flex-col gap-3.5 w-full lg:w-87.25">
                    <div className="h-10.5 lg:h-12 flex gap-3 items-center px-4 py-3 bg-white rounded-[62px]">
                        
                        <Icon icon="streamline-cyber:email-2" width="22" height="22" className="text-black/40" />
                      
                        <input className="focus:outline-none text-sm lg:text-base text-black/40 w-full"
                            type="email"
                            placeholder="Enter your email address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <button className="bg-white h-10.5 lg:h-11.5 flex items-center justify-center py-3 rounded-[62px]">
                        <p className="font-medium text-sm lg:text-base">Subscribe to Newsletter</p>
                    </button> 
                </div>
            </div>

            <div className="bg-[#F0F0F0] h-211.5 lg:h-124.75 px-7 pt-10 lg:py-10 lg:px-25 flex flex-col justify-center -mt-[20%] lg:-mt-[4%]">

                <div className="flex flex-col gap-6 lg:gap-0 lg:flex-row lg:items-center justify-between">

                    <div className="flex flex-col gap-4 lg:gap-8.75 lg:w-62">
                        <div className="flex flex-col gap-6.25">
                            <img src={"/images/brand.png"} alt="Brand_logo" className="object-contain w-36 h-5 lg:w-41.75 lg:h-5.75" />
                            <p className="text-sm text-black/60">We have clothes that suits your style and which you’re proud to wear. From women to men.</p>
                        </div>

                        <div className="flex items-center gap-3">
                            {
                                [
                                    { icon: "codicon:twitter", link: "https://x.com/Olamide957" },
                                    { icon: "mingcute:notion-line", link: "https://www.notion.so/Olamide-Olorunfemi-Frontend-Developer-Portfolio-2f896db40b2081b0a4a1d2e94d5a01fb?p=2f896db40b2081fd892dd53dcd0d4b3b&pm=c" },
                                    { icon: "mdi:github", link: "https://github.com/BigOTF" },
                                    { icon: "line-md:linkedin", link: "https://www.linkedin.com/in/olorunfemi-olamide-9b4037222/" },
                                ].map((i, index) => (
                                    <Link target="_blank" rel="noopener noreferrer" href={i.link} key={index} className="px-3 py-3 border border-black/20 flex items-center justify-center rounded-full bg-white hover:bg-black text-black hover:text-white transition-colors duration-300">
                                        <Icon icon={i.icon} width="24" height="24" />
                                    </Link>
                                ))
                            }
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6 lg:grid-cols-4 lg:gap-14">

                        <div className="flex flex-col gap-4 lg:gap-6.5">
                            <p className="font-medium text-sm lg:text-base tracking-[3px] uppercase">Company</p>

                            <div className="flex flex-col gap-3">
                                {["About", "Features", "Works", "Careers"].map((i, index) => (
                                    <Link key={index} href="/#">
                                        <p className="text-sm lg:text-base text-black/60">{i}</p>
                                    </Link> 
                                ))}
                            </div>
                        </div>

                        <div className="flex flex-col gap-4 lg:gap-6.5">
                            <p className="font-medium text-sm lg:text-base tracking-[3px] uppercase">Help</p>

                            <div className="flex flex-col gap-3">
                                {["Customer Support", "Delivery Details", "Terms & Conditions", "Privacy Policy"].map((i, index) => (
                                   <Link key={index} href="/#">
                                        <p className="text-sm lg:text-base text-black/60">{i}</p>
                                    </Link>
                                ))}
                            </div>
                        </div>

                        <div className="flex flex-col gap-4 lg:gap-6.5">
                            <p className="font-medium text-sm lg:text-base tracking-[3px] uppercase">FAQ</p>

                            <div className="flex flex-col gap-3">
                                {["Account", "Manage Delivery", "Orders", "Payments"].map((i, index) => (
                                    <Link key={index} href="/#">
                                        <p className="text-sm lg:text-base text-black/60">{i}</p>
                                    </Link>
                                ))}
                            </div>
                        </div>

                        <div className="flex flex-col gap-4 lg:gap-6.5">
                            <p className="font-medium text-sm lg:text-base tracking-[3px] uppercase">Resources</p>

                            <div className="flex flex-col gap-3">
                                {["Free eBooks", "Development Tutorial", "How to - Blog", "Youtube Playlists"].map((i, index) => (
                                    <Link key={index} href="/#">
                                        <p className="text-sm lg:text-base text-black/60">{i}</p>
                                    </Link>
                                ))}
                            </div>
                        </div>

                    </div>

                </div>

                <div className="border border-black/10 w-full mt-8 lg:mt-14" />

                <div className="flex flex-col items-center justify-center gap-4 lg:gap-0 lg:flex-row lg:justify-between mt-6 lg:mt-8">
                    <div className="flex flex-col items-center lg:items-start gap-2">
                        <p className="text-sm text-black/60">Shop.co &copy; 2026, All Rights Reserved</p>
                        <p className="text-sm text-black/60"> Developed by{" "}
                            <Link target="_blank" rel="noopener noreferrer" href="https://www.notion.so/Olamide-Olorunfemi-Frontend-Developer-Portfolio-2f896db40b2081b0a4a1d2e94d5a01fb?p=2f896db40b2081fd892dd53dcd0d4b3b&pm=c">
                                Big_O
                            </Link>
                            {" "}· Frontend Developer
                        </p>
                    </div>

                    <div className="flex items-center gap-[10.29px] lg:gap-2">
                        {
                            [
                                {icon: "/icons/visa.svg", link: "/#"},
                                {icon: "/icons/mastercard.svg", link: "/#"},
                                {icon: "/icons/paypal.svg", link: "/#"},
                                {icon: "/icons/applePay.svg", link: "/#"},
                                {icon: "/icons/googlePay.svg", link: "/#"},
                            ].map((i, index) => (
                                <Link target="_blank" rel="noopener noreferrer" key={index} href={i.link}>
                                    <img src={i.icon}  className="object-contain" />
                                </Link>
                            ))
                        }
                    </div>
                </div>


            </div>

        </footer>
    )
}