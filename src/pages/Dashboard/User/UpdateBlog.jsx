import { useState } from "react";
import { WithContext as ReactTags } from "react-tag-input";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import toast from "react-hot-toast";
import { imageUpload } from "../../../apis/utils";
import Loading from "../../../components/Loading";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";

export default function AddBlog() {
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
      setTags(data?.blogTags);
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
    console.log("The tag at index " + index + " was clicked");
  };

  const onClearAll = () => {
    setTags([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const form = e.target;
    const blogName = form.blogName.value;
    const blogImage = form.blogImage.files[0];
    const blogDescription = form.blogDescription.value;
    const ownerName = user?.displayName;
    const ownerImage = user?.photoURL;
    const ownerEmail = user?.email;

    const blogImageUrl = blogImage
      ? await imageUpload(blogImage)
      : blog?.blogImage;

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
      <Helmet>
        <title>Update Blog | Okkhor</title>
      </Helmet>
      {loading ? (
        <Loading />
      ) : (
        <section className="container mx-auto max-w-2xl px-4 py-10">
          <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              Update Blog
            </h1>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Edit your existing blog post.
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-900 dark:text-white">
                  Blog Name
                </label>
                <input
                  type="text"
                  name="blogName"
                  id="blogName"
                  defaultValue={blog?.blogName}
                  className="block w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm transition focus:border-black focus:bg-white focus:outline-none focus:ring-1 focus:ring-black dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:focus:border-white dark:focus:ring-white"
                  placeholder="Enter blog title"
                  required
                  onChange={(e) => {
                    blog.blogName = e.target.value;
                  }}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-900 dark:text-white">
                  Blog Image
                </label>
                <input
                  type="file"
                  name="blogImage"
                  id="blogImage"
                  className="block w-full rounded-lg border border-gray-200 bg-gray-50 text-sm file:mr-4 file:rounded-md file:border-0 file:bg-gray-200 file:px-4 file:py-2 file:text-sm file:font-semibold hover:file:bg-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:file:bg-gray-800 dark:file:text-white dark:hover:file:bg-gray-700"
                  accept="image/*"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-900 dark:text-white">
                  Description
                </label>
                <textarea
                  name="blogDescription"
                  id="blogDescription"
                  placeholder="Write your content here..."
                  defaultValue={blog?.blogDescription}
                  className="block min-h-[150px] w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm transition focus:border-black focus:bg-white focus:outline-none focus:ring-1 focus:ring-black dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:focus:border-white dark:focus:ring-white"
                  required
                  onChange={(e) => {
                    blog.blogDescription = e.target.value;
                  }}
                ></textarea>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-900 dark:text-white">
                  Tags
                </label>
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
                      "w-full flex-1 rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm transition focus:border-black focus:bg-white focus:outline-none focus:ring-1 focus:ring-black dark:border-gray-700 dark:bg-gray-900 dark:text-white",
                    clearAll:
                      "bg-black dark:bg-white text-white dark:text-black text-xs font-semibold px-3 py-2 rounded-lg hover:opacity-80 transition ml-2",
                    selected: "mt-3 flex items-center gap-2 flex-wrap",
                    tag: "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-sm px-3 py-1 rounded-full cursor-pointer border border-gray-200 dark:border-gray-700",
                    remove: "ml-2 text-gray-500 hover:text-red-500",
                  }}
                />
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  className="inline-flex w-full items-center justify-center rounded-lg bg-black px-6 py-3 text-sm font-semibold text-white transition hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
                >
                  Update Blog
                </button>
              </div>
            </form>
          </div>
        </section>
      )}
    </>
  );
}
