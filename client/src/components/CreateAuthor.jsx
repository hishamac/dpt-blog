import { useState } from "react";
import Axios from "../utils/Axios";
import Toast from "./Toast";

export default function CreateAuthor({ setOpen }) {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [name, setName] = useState(null);
  const [toastType, setToastType] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  const submitForm = async (e) => {
    e.preventDefault();
    try {
      if (image === null) {
        setToastType("error");
        setToastMessage("Please upload an image");
        setTimeout(() => {
          setToastType(null);
          setToastMessage(null);
        }, 3000);
      } else if (name === null) {
        setToastType("error");
        setToastMessage("Author name cannot be empty");
        setTimeout(() => {
          setToastType(null);
          setToastMessage(null);
        }, 3000);
      } else {
        const formData = new FormData();
        formData.append("name", name);
        formData.append("image", image);

        await Axios.post("/author", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        }).then((res) => {
          if (res.data.messageType === "error") {
            setToastType(res.data.messageType);
            setToastMessage(res.data.message);
            setTimeout(() => {
              setToastType(null);
              setToastMessage(null);
            }, 3000);
          } else {
            setToastType(res.data.messageType);
            setToastMessage(res.data.message);
            window.location.reload();
          }
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleImageUpload = (e) => {
    setImage(e.target.files[0]);
    setPreview(URL.createObjectURL(e.target.files[0]));
    console.log(image);
  };
  return (
    <>
      {toastType && toastMessage ? (
        <Toast
          toastType={toastType}
          toastMessage={toastMessage}
          setToastMessage={setToastMessage}
          setToastType={setToastType}
        />
      ) : null}

      <form
        className="transition-all w-3/4 md:w-1/2 mx-auto pt-4"
        encType="multipart/form-data"
        onSubmit={submitForm}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6 ml-auto cursor-pointer text-red-700"
          onClick={() => setOpen(false)}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
        <div className="mb-6">
          <label
            htmlFor="name"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Name
          </label>
          <input
            type="text"
            dir="rtl"
            className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
            placeholder="Enter name"
            name="name"
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        {preview && (
          <div className="mb-6">
            <img
              className="h-auto min-w-full rounded-lg"
              src={preview}
              alt="Upload Preview"
            />
          </div>
        )}
        <div className="flex items-center justify-center w-full">
          <label
            htmlFor="dropzone-file"
            className="flex flex-col items-center justify-center w-full border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <svg
                className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 16"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                />
              </svg>
              <p className="flex flex-col mb-2 text-sm text-gray-500 dark:text-gray-400">
                <span className="font-semibold mx-auto">
                  Click to upload profile picture
                </span>
                <br />
                <span className="font-semibold mx-auto">
                  Image must be in square
                </span>
              </p>
            </div>
            <input
              id="dropzone-file"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
              required
            />
          </label>
        </div>
        <div className="mb-6">
          <button
            type="submit"
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg w-full mx-auto text-sm px-5 py-2.5 my-5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
          >
            Create Author
          </button>
        </div>
      </form>
    </>
  );
}
