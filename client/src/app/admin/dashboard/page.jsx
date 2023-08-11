"use client";
import { useEffect, useState } from "react";
import AdminNavbar from "../../../components/AdminNavbar";
import Card from "../../../components/Card";
import Loading from "../../../components/Loading";
import Axios from "../../../utils/Axios";
import Toast from "../../../components/Toast";

export default function Page() {
  const [loading, setLoading] = useState(true);
  const [allLengths, setAllLengths] = useState(null);
  const [toastType, setToastType] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);
  
  useEffect(() => {
    Axios.get("/auth/allLengths")
      .then((res) => {
        if (res.data.messageType === "error") {
          setToastType(res.data.messageType);
          setToastMessage(res.data.message);
          setTimeout(() => {
            setToastType(null);
            setToastMessage(null);
          }, 3000);
        } else {
          setAllLengths(res.data);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
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
        <div>
          <AdminNavbar />
          <div className="flex flex-col md:flex-row w-full justify-center p-5">
            <Card route="authors" main={allLengths.authors} sub="Authors" />
            <Card route="posts" main={allLengths.posts} sub="Posts" />
            <Card route="tags" main={allLengths.tags} sub="Tags" />
          </div>
        </div>
      )}
    </>
  );
}
