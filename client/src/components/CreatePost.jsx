import { useEffect, useState } from "react";
import Axios from "../utils/Axios";
import AuthorSearchInput from "./AuthorSearchInput";
import TagSearchInput from "./TagSearchInput";
import Loading from "./Loading";
import Toast from "./Toast";

export default function CreatePost({ setOpen }) {
  const [preview, setPreview] = useState(null);
  const [title, setTitle] = useState(null);
  const [content, setContent] = useState(null);
  const [authors, setAuthors] = useState([]);
  const [selectedAuthor, setSelectedAuthor] = useState(null);
  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toastType, setToastType] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);
  const selectedTagsIds = selectedTags.map((tag) => tag._id);

  useEffect(() => {
    async function fetchAuthors() {
      await Axios.get("/author").then((res) => {
        if (res.data.messageType === "error") {
          setToastType(res.data.messageType);
          setToastMessage(res.data.message);
          setTimeout(() => {
            setToastType(null);
            setToastMessage(null);
          }, 3000);
        } else {
          setAuthors(res.data);
          setLoading(false);
        }
      });
    }
    fetchAuthors();
  }, []);

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
      } else if (title === null) {
        setToastType("error");
        setToastMessage("Post title cannot be empty");
        setTimeout(() => {
          setToastType(null);
          setToastMessage(null);
        }, 3000);
      } else if (content === null) {
        setToastType("error");
        setToastMessage("Post content cannot be empty");
        setTimeout(() => {
          setToastType(null);
          setToastMessage(null);
        }, 3000);
      } else if (selectedAuthor === null) {
        setToastType("error");
        setToastMessage("Please select an author");
        setTimeout(() => {
          setToastType(null);
          setToastMessage(null);
        }, 3000);
      } else if (selectedTags.length <= 0) {
        setToastType("error");
        setToastMessage("Please add at least one tag");
        setTimeout(() => {
          setToastType(null);
          setToastMessage(null);
        }, 3000);
      } else {
        const formData = new FormData();
        formData.append("title", title);
        formData.append("content", content);
        formData.append("author", selectedAuthor._id);
        for (let i = 0; i < selectedTagsIds.length; i++) {
          formData.append("tags", selectedTagsIds[i]);
        }
        formData.append("image", image);

        await Axios.post("/post", formData, {
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
      {!loading ? (
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
              htmlFor="title"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Title
            </label>
            <input
              dir="rtl"
              type="text"
              className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
              placeholder="Enter title"
              name="title"
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="content"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Your content
            </label>
            <textarea
              id="content"
              dir="rtl"
              rows={4}
              className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Write your content here..."
              defaultValue={""}
              onChange={(e) => setContent(e.target.value)}
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
          <div className="flex items-center justify-center w-full mb-6">
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
                    Click to upload your image
                  </span>
                  <br />
                  <span className="font-semibold mx-auto">
                    Image must be in 1280 x 720 resolution
                  </span>
                </p>
              </div>
              <input
                id="dropzone-file"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
            </label>
          </div>
          <div className="mb-6">
            <AuthorSearchInput
              selectedAuthor={selectedAuthor}
              setSelectedAuthor={setSelectedAuthor}
              authors={authors}
              setAuthors={setAuthors}
            />
          </div>
          <div>
            <TagSearchInput
              selectedTags={selectedTags}
              setSelectedTags={setSelectedTags}
              tags={tags}
              setTags={setTags}
              selectedTagsIds={selectedTagsIds}
            />
          </div>
          <div className="mb-6">
            <button
              type="submit"
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg w-full mx-auto text-sm px-5 py-2.5 my-5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
            >
              Create Post
            </button>
          </div>
        </form>
      ) : (
        <Loading />
      )}
    </>
  );
}
