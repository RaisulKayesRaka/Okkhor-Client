import { useState } from "react";
import { WithContext as ReactTags } from "react-tag-input";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import toast from "react-hot-toast";
import Loading from "../../../components/Loading";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import DashboardPageHeader from "../../../components/Dashboard/DashboardPageHeader";
import DashboardCard from "../../../components/Dashboard/DashboardCard";
export default function UpdateBlog() {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const [tags, setTags] = useState([]);
  const navigate = useNavigate();
  const { data: blog = {}, refetch } = useQuery({
    queryKey: ["blog", id],
    queryFn: async () => {
      const { data } = await axiosSecure.get(`/blogs/${id}`);
      if (data?.blogTags && data.blogTags.length > 0) {
        if (typeof data.blogTags[0] === "string") {
          setTags(data.blogTags.map((tag) => ({ id: tag, text: tag })));
        } else {
          setTags(data.blogTags);
        }
      } else {
        setTags([]);
      }
      return data;
    },
  });
  const handleDelete = (index) => {
    setTags(tags.filter((_, i) => i !== index));
  };
  const onTagUpdate = (index, newTag) => {
    const updatedTags = [...tags];
    updatedTags.splice(index, 1, newTag);
    setTags(updatedTags);
  };
  const handleAddition = (tag) => {
    setTags((prevTags) => [...prevTags, tag]);
  };
  const handleDrag = (tag, currPos, newPos) => {
    const newTags = tags.slice();
    newTags.splice(currPos, 1);
    newTags.splice(newPos, 0, tag);
    setTags(newTags);
  };
  const handleTagClick = (index) => {
    console.log("The tag at index" + index + " was clicked");
  };
  const onClearAll = () => {
    setTags([]);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const form = e.target;
    const blogName = form.blogName.value;
    const blogImageUrl = form.blogImage.value || blog?.blogImage;
    const blogDescription = form.blogDescription.value;
    const ownerName = user?.displayName;
    const ownerImage = user?.photoURL;
    const ownerEmail = user?.email;
    const blogData = {
      blogName,
      blogImage: blogImageUrl,
      blogDescription,
      blogTags: tags,
      ownerName,
      ownerImage,
      ownerEmail,
    };
    try {
      await axiosSecure.put(`/blogs/${id}`, blogData);
      toast.success("Blog updated successfully");
      refetch();
      navigate(`/blogs/${id}`);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      {" "}
      <Helmet>
        {" "}
        <title>Update Blog | Okkhor</title>{" "}
      </Helmet>{" "}
      {loading ? (
        <Loading />
      ) : (
        <section className="w-full">
          {" "}
          <DashboardPageHeader
            title="Update Blog"
            subtitle="Edit your existing blog post."
          />{" "}
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 gap-8 lg:grid-cols-3"
          >
            {" "}
            {/* Left Column - Main Content */}{" "}
            <div className="space-y-6 lg:col-span-2">
              {" "}
              <DashboardCard className="p-6">
                {" "}
                <div className="space-y-6">
                  {" "}
                  <div>
                    {" "}
                    <label className="mb-2 block text-sm font-semibold text-gray-900 dark:text-white">
                      {" "}
                      Blog Name{" "}
                    </label>{" "}
                    <input
                      type="text"
                      name="blogName"
                      id="blogName"
                      defaultValue={blog?.blogName}
                      className="block w-full rounded-full border border-gray-200/50 bg-gray-50 px-5 py-3 text-sm transition focus:border-black focus:bg-white focus:outline-none focus:ring-1 focus:ring-black dark:border-gray-800 dark:bg-gray-900 dark:text-white dark:focus:border-white dark:focus:ring-white"
                      placeholder="Enter blog title"
                      required
                      onChange={(e) => {
                        blog.blogName = e.target.value;
                      }}
                    />{" "}
                  </div>{" "}
                  <div>
                    {" "}
                    <label className="mb-2 block text-sm font-semibold text-gray-900 dark:text-white">
                      {" "}
                      Blog Image URL{" "}
                    </label>{" "}
                    <input
                      type="url"
                      name="blogImage"
                      id="blogImage"
                      defaultValue={blog?.blogImage}
                      className="block w-full rounded-full border border-gray-200/50 bg-gray-50 px-5 py-3 text-sm transition focus:border-black focus:bg-white focus:outline-none focus:ring-1 focus:ring-black dark:border-gray-800 dark:bg-gray-900 dark:text-white dark:focus:border-white dark:focus:ring-white"
                      placeholder="https://example.com/image.jpg"
                    />{" "}
                  </div>{" "}
                  <div>
                    {" "}
                    <label className="mb-2 block text-sm font-semibold text-gray-900 dark:text-white">
                      {" "}
                      Description{" "}
                    </label>{" "}
                    <textarea
                      name="blogDescription"
                      id="blogDescription"
                      placeholder="Write your content here..."
                      defaultValue={blog?.blogDescription}
                      className="block min-h-[150px] w-full rounded-2xl border border-gray-200/50 bg-gray-50 px-5 py-4 text-sm transition focus:border-black focus:bg-white focus:outline-none focus:ring-1 focus:ring-black dark:border-gray-800 dark:bg-gray-900 dark:text-white dark:focus:border-white dark:focus:ring-white"
                      required
                      onChange={(e) => {
                        blog.blogDescription = e.target.value;
                      }}
                    ></textarea>{" "}
                  </div>{" "}
                </div>{" "}
              </DashboardCard>{" "}
            </div>{" "}
            {/* Right Column - Meta & Actions */}{" "}
            <div className="space-y-6">
              {" "}
              <DashboardCard className="p-6">
                {" "}
                <div className="space-y-6">
                  {" "}
                  <div>
                    {" "}
                    <label className="mb-2 block text-sm font-semibold text-gray-900 dark:text-white">
                      {" "}
                      Tags{" "}
                    </label>{" "}
                    <ReactTags
                      tags={tags}
                      inputFieldPosition="top"
                      handleDelete={handleDelete}
                      handleAddition={handleAddition}
                      handleDrag={handleDrag}
                      handleTagClick={handleTagClick}
                      onTagUpdate={onTagUpdate}
                      editable
                      clearAll
                      onClearAll={onClearAll}
                      maxTags={7}
                      allowAdditionFromPaste
                      classNames={{
                        tagInput: "flex item-center justify-center gap-4",
                        tagInputField:
                          "w-full flex-1 rounded-full border border-gray-200/50 bg-gray-50 px-5 py-3 text-sm transition focus:border-black focus:bg-white focus:outline-none focus:ring-1 focus:ring-black dark:border-gray-800 dark:bg-gray-900 dark:text-white",
                        clearAll:
                          "bg-black dark:bg-green-500 text-white dark:text-white text-xs font-semibold px-4 py-2 rounded-full hover:opacity-80 transition ml-2",
                        selected: "mt-3 flex items-center gap-2 flex-wrap",
                        tag: "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-sm px-3 py-1 rounded-full cursor-pointer border border-gray-200 dark:border-gray-800",
                        remove: "ml-2 text-gray-600 hover:text-red-500",
                      }}
                    />{" "}
                  </div>{" "}
                  <div className="border-t border-gray-200 pt-4 dark:border-gray-800">
                    {" "}
                    <button
                      type="submit"
                      className="inline-flex w-full items-center justify-center rounded-full bg-green-600 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-green-700 dark:bg-green-500 dark:text-white dark:hover:bg-green-600"
                    >
                      {" "}
                      Update Blog{" "}
                    </button>{" "}
                  </div>{" "}
                </div>{" "}
              </DashboardCard>{" "}
            </div>{" "}
          </form>{" "}
        </section>
      )}{" "}
    </>
  );
}
