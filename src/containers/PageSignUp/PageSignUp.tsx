import React, { FC } from "react";
import facebookSvg from "images/Facebook.svg";
import twitterSvg from "images/Twitter.svg";
import googleSvg from "images/Google.svg";
import { Helmet } from "react-helmet-async";
import Input from "shared/Input/Input";
import ButtonPrimary from "shared/Button/ButtonPrimary";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useCart } from "containers/CartContext";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export interface PageSignUpProps {
  className?: string;
}

const loginSocials = [
  {
    name: "Continue with Facebook",
    href: "#",
    icon: facebookSvg,
  },
  {
    name: "Continue with Twitter",
    href: "#",
    icon: twitterSvg,
  },
  {
    name: "Continue with Google",
    href: "#",
    icon: googleSvg,
  },
];

const PageSignUp: FC<PageSignUpProps> = ({ className = "" }) => {
  const { setUser } = useCart();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
  
    const userData = {
      Id: "", // Empty string for now, as it might be auto-generated by the backend
      username: fullName, // Assuming full name corresponds to the username
      email,
      password,
      mobileNo: phoneNumber // Assuming phone number corresponds to mobileNo
    };
  
    console.log(userData);
  
    try {
      const response = await fetch("http://localhost:8081/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(userData)
      });
  
      if (response.ok) {
        const data = await response.json(); // Assuming the response contains user data
        setUser({
          username: data.username,
          location: "Los Angeles, CA", // This can be dynamic if available
          avatarUrl: data.avatarUrl, // Assuming the avatar URL is part of the response
        });
  
        // Handle success, maybe redirect user or show a success message
        console.log("Account registered successfully!");
        toast.success("Registration Successful", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        } as any);
      } else {
        // Check if the response is JSON
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const errorData = await response.json();
          console.error("Failed to register account:", errorData);
          toast.error(`Registration failed: ${errorData.message}`, {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          } as any);
        } else {
          // Read response as text if not JSON
          const errorText = await response.text();
          console.error("Failed to register account:", errorText);
          toast.error(`Registration failed: ${errorText}`, {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          } as any);
        }
      }
    } catch (error){
      let errorMessage = "An unknown error occurred.";
      if (error instanceof Error) {
        errorMessage = error.message;  
    } 
      console.error("Error:", errorMessage);
      toast.error(`Registration failed: ${errorMessage}`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      } as any);
    }
  };
  

  return (
    <div className={`nc-PageSignUp  ${className}`} data-nc-id="PageSignUp">
      <Helmet>
        <title>Sign up || Ciseco React Template</title>
      </Helmet>
      <div className="container mb-24 lg:mb-32">
        <h2 className="my-20 flex items-center text-3xl leading-[115%] md:text-5xl md:leading-[115%] font-semibold text-neutral-900 dark:text-neutral-100 justify-center">
          Signup
        </h2>
        <div className="max-w-md mx-auto space-y-6 ">
          <div className="grid gap-3">
            {loginSocials.map((item, index) => (
              <a
                key={index}
                href={item.href}
                className=" flex w-full rounded-lg bg-primary-50 dark:bg-neutral-800 px-4 py-3 transform transition-transform sm:px-6 hover:translate-y-[-2px]"
              >
                <img
                  className="flex-shrink-0"
                  src={item.icon}
                  alt={item.name}
                />
                <h3 className="flex-grow text-center text-sm font-medium text-neutral-700 dark:text-neutral-300 sm:text-sm">
                  {item.name}
                </h3>
              </a>
            ))}
          </div>
          {/* OR */}
          <div className="relative text-center">
            <span className="relative z-10 inline-block px-4 font-medium text-sm bg-white dark:text-neutral-400 dark:bg-neutral-900">
              OR
            </span>
            <div className="absolute left-0 w-full top-1/2 transform -translate-y-1/2 border border-neutral-100 dark:border-neutral-800"></div>
          </div>

          {/* FORM */}
          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6" action="#" method="post">
            <label className="block">
              <>
                <span className="flex justify-between items-center text-neutral-800 dark:text-neutral-200">
                  Full Name
                </span>
                <Input type="text" className="mt-1"
                  value={fullName}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFullName(e.target.value)} />
              </>
            </label>
            <label className="block">
              <>
                <span className="text-neutral-800 dark:text-neutral-200">
                  Email address
                </span>
                <Input
                  type="email"
                  placeholder="example@example.com"
                  className="mt-1"
                  value={email}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                />
              </>
            </label>
            <label className="block">
              <>
                <span className="flex justify-between items-center text-neutral-800 dark:text-neutral-200">
                  Phone Number
                </span>
                <Input type="number" className="mt-1"
                  value={phoneNumber}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPhoneNumber(e.target.value)}
                />
              </>
            </label>
            <label className="block">
              <>
                <span className="flex justify-between items-center text-neutral-800 dark:text-neutral-200">
                  Password
                </span>
                <Input type="password" className="mt-1"
                  value={password}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                />
              </>
            </label>
            <ButtonPrimary type="submit">Continue</ButtonPrimary>
          </form>

          {/* ==== */}
          <span className="block text-center text-neutral-700 dark:text-neutral-300">
            Already have an account? {` `}
            <Link className="text-green-600" to="/login">
              Sign in
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
};

export default PageSignUp;
