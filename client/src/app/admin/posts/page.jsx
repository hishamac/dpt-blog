"use client";
import React, { useEffect, useState } from "react";
import AdminNavbar from "../../../components/AdminNavbar";
import Loading from "../../../components/Loading";
import Axios from "../../../utils/Axios";
import CreatePost from "../../../components/CreatePost";
import DeleteModalPost from "../../../components/DeleteModalPost";
import AuthorSearchInput from "../../../components/AuthorSearchInput";
import TagSearchInput from "../../../components/TagSearchInput";
import Toast from "../../../components/Toast";

export default function Page() {
  const [open, setOpen] = useState(false);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState(false);
  const [updateModal, setUpdateModal] = useState(false);
  const [toUpdate, setToUpdate] = useState({});
  const [toDelete, setToDelete] = useState({});
  const [preview, setPreview] = useState(null);
  const [title, setTitle] = useState(null);
  const [content, setContent] = useState(null);
  const [authors, setAuthors] = useState([]);
  const [tags, setTags] = useState([]);
  const [image, setImage] = useState(null);
  const [selectedAuthor, setSelectedAuthor] = useState(null);
  const [selectedTags, setSelectedTags] = useState([]);
  const selectedTagsIds = selectedTags.map((tag) => tag._id);
  const [toastType, setToastType] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  function removeSelectedAuthor() {
    for (let i = 0; i < authors.length; i++) {
      const author = authors[i];
      if (author._id === selectedAuthor._id) {
        authors.splice(i, 1);
      }
    }
    return authors;
  }

  function removeSelectedTags() {
    for (let i = 0; i < selectedTags.length; i++) {
      const selectedTag = selectedTags[i];
      for (let i = 0; i < tags.length; i++) {
        const tag = tags[i];
        if (tag._id === selectedTag._id) {
          tags.splice(i, 1);
        }
      }
    }
    return tags;
  }

  async function fetchPosts() {
    await Axios.get("/post").then((res) => {
      if (res.data.messageType === "error") {
        setToastType(res.data.messageType);
        setToastMessage(res.data.message);
        setTimeout(() => {
          setToastType(null);
          setToastMessage(null);
        }, 3000);
      } else {
        setPosts(res.data);
        setLoading(false);
      }
    });
  }

  useEffect(() => {
    fetchPosts();
  }, []);

  function deletePost(id) {
    Axios.delete(`/post/${id}`).then((res) => {
      if (res.data.messageType === "error") {
        setToastType(res.data.messageType);
        setToastMessage(res.data.message);
        setTimeout(() => {
          setToastType(null);
          setToastMessage(null);
        }, 3000);
        setDeleteModal(false);
      } else {
        setToastType(res.data.messageType);
        setToastMessage(res.data.message);
        window.location.reload();
      }
    });
  }

  const handleImageUpload = (e) => {
    setImage(e.target.files[0]);
    setPreview(URL.createObjectURL(e.target.files[0]));
    console.log(image);
  };

  const updatePost = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);
      formData.append("author", selectedAuthor._id);
      for (let i = 0; i < selectedTagsIds.length; i++) {
        formData.append("tags", selectedTagsIds[i]);
      }
      formData.append("image", image);

      await Axios.put(`/post/${toUpdate._id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      }).then((res) => {
        if (res.data.messageType === "error") {
          setToastType(res.data.messageType);
          setToastMessage(res.data.message);
          setTimeout(() => {
            setToastType(null);
            setToastMessage(null);
          }, 3000);
          setDeleteModal(false);
        } else {
          setToastType(res.data.messageType);
          setToastMessage(res.data.message);
          window.location.reload();
        }
      });
    } catch (error) {
      console.log(error);
    }
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
      {loading ? (
        <Loading />
      ) : (
        <div className="flex flex-col">
          <AdminNavbar />
          {!open ? (
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg w-3/4 md:w-1/2 mx-auto text-sm px-5 py-2.5 my-5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
            >
              Create Post
            </button>
          ) : (
            <CreatePost setOpen={setOpen} />
          )}
          {deleteModal ? (
            <DeleteModalPost
              setDeleteModal={setDeleteModal}
              toDelete={toDelete}
              deletePost={deletePost}
            />
          ) : null}
          {updateModal ? (
            <div className="z-50 relative w-full max-w-[100%] md:max-w-[50%] mx-auto">
              <form
                className="mx-auto pt-4"
                encType="multipart/form-data"
                onSubmit={updatePost}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6 ml-auto cursor-pointer text-red-700"
                  onClick={() => setUpdateModal(false)}
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
                    defaultValue={title}
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
                    defaultValue={content}
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
                      name="image"
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
                    authors={selectedAuthor ? removeSelectedAuthor() : authors}
                    setAuthors={setAuthors}
                  />
                </div>
                <div>
                  <TagSearchInput
                    selectedTags={selectedTags}
                    setSelectedTags={setSelectedTags}
                    tags={selectedTags ? removeSelectedTags() : tags}
                    setTags={setTags}
                  />
                </div>
                <div className="mb-6">
                  <button
                    type="submit"
                    className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg w-full mx-auto text-sm px-5 py-2.5 my-5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                  >
                    Update Post
                  </button>
                </div>
              </form>
            </div>
          ) : null}
          <div className="w-full md:max-w-[50%] max-w-[75%] bg-white border border-gray-200 rounded-lg shadow sm:p-8 dark:bg-gray-800 dark:border-gray-700 mx-auto p-4 max-h-screen overflow-y-scroll">
            <div className="flex items-center justify-between mb-4">
              <h5 className="text-xl font-bold leading-none text-gray-900 dark:text-white">
                All Posts
              </h5>
            </div>
            <div className="flow-root">
              <ul
                role="list"
                className="divide-y divide-gray-200 dark:divide-gray-700"
              >
                {posts.length > 0 ? (
                  posts.map((post, index) => (
                    <li className="py-3 sm:py-2" key={index}>
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          <img
                            className="w-[64px] h-[36px] md:w-[128px] md:h-[72px] rounded-lg"
                            src={post.image}
                            alt="Neil image"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-base font-medium text-gray-900 truncate dark:text-white">
                            {post.title}
                          </p>
                          <p className="text-xs font-medium text-gray-900 truncate dark:text-white">
                            {post.author.name}
                          </p>
                        </div>
                        <div className="flex flex-row">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-6 h-6 m-[0.125rem] md:m-2 cursor-pointer"
                            onClick={() => {
                              setToUpdate(post);
                              setPreview(post.image);
                              setTitle(post.title);
                              setImage(post.image);
                              setContent(post.content);
                              setSelectedTags(post.tags);
                              setSelectedAuthor(post.author);
                              setUpdateModal(true);
                            }}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                            />
                          </svg>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-6 h-6 m-[0.125rem] md:m-2 cursor-pointer"
                            onClick={() => {
                              setToDelete(post);
                              setDeleteModal(true);
                            }}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                            />
                          </svg>
                        </div>
                      </div>
                    </li>
                  ))
                ) : (
                  <p>No Posts Found</p>
                )}
              </ul>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
