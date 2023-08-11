import { useEffect, useState } from "react";
import Axios from "../utils/Axios";
import Loading from "./Loading";
import Toast from "./Toast";

export default function TagSearchInput({
  selectedTags,
  setSelectedTags,
  tags,
  setTags,
  selectedTagsIds,
}) {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [toastType, setToastType] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    async function fetchTags() {
      await Axios.get("/tag").then((res) => {
        if (res.data.messageType === "error") {
          setToastType(res.data.messageType);
          setToastMessage(res.data.message);
          setTimeout(() => {
            setToastType(null);
            setToastMessage(null);
          }, 3000);
        } else {
          setTags(res.data);
          setLoading(false);
        }
      });
    }
    fetchTags();
  }, []);

  //Applying our search filter function to our array of countries recieved from the API
  const filtered = tags.filter((tag) =>
    tag.title.toLowerCase().includes(query)
  );

  return (
    <div>
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
        <div className="w-full bg-white border border-gray-200 rounded-lg shadow sm:p-8 dark:bg-gray-800 dark:border-gray-700 mx-auto p-4 max-h-screen overflow-y-scroll">
          {selectedTags.length > 0 &&
            (console.log(selectedTags),
            console.log(selectedTagsIds),
            (
              <>
                <div className="flex items-center justify-between mb-4">
                  <h5 className="text-xl font-bold leading-none text-gray-900 dark:text-white">
                    Selected Tags
                  </h5>
                </div>
                <div className="flow-root">
                  <ul
                    role="list"
                    className="divide-y divide-gray-200 dark:divide-gray-700"
                  >
                    {selectedTags.map((tag, index) => (
                      <li
                        className="py-3 sm:py-2 flex justify-between"
                        key={index}
                      >
                        <div className="flex items-center space-x-4">
                          <div className="flex-1 min-w-0">
                            <p className="text-base font-medium text-gray-900 truncate dark:text-white">
                              {tag.title}
                            </p>
                            <p className="text-xs font-medium text-gray-900 truncate dark:text-white">
                              {tag.description}
                            </p>
                          </div>
                        </div>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-6 h-6 cursor-pointer text-red-500"
                          onClick={() => {
                            const objectWithIdIndex = selectedTags.findIndex(
                              (tags1) => tags1._id === tag._id
                            );
                            selectedTags.splice(objectWithIdIndex, 1);
                            setTags([...tags, tag]);
                          }}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            ))}
          <div className="my-4">
            <input
              dir="rtl"
              type="text"
              className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
              placeholder="Search Tags"
              name="title"
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center justify-between mb-4">
            <h5 className="text-xl font-bold leading-none text-gray-900 dark:text-white">
              All Tags
            </h5>
          </div>
          <div className="flow-root">
            <ul
              role="list"
              className="divide-y divide-gray-200 dark:divide-gray-700"
            >
              {tags.length <= 0 ? (
                <p>All Tags Selected</p>
              ) : (
                filtered.map((tag, index) => (
                  <li
                    className="py-3 sm:py-2 cursor-pointer"
                    key={index}
                    onClick={() => {
                      setSelectedTags([...selectedTags, tag]);
                      const objectWithIdIndex = tags.findIndex(
                        (tags1) => tags1._id === tag._id
                      );
                      tags.splice(objectWithIdIndex, 1);
                    }}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="flex-1 min-w-0">
                        <p className="text-base font-medium text-gray-900 truncate dark:text-white">
                          {tag.title}
                        </p>
                        <p className="text-xs font-medium text-gray-900 truncate dark:text-white">
                          {tag.description}
                        </p>
                      </div>
                    </div>
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
