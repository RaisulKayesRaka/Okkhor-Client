import { useState } from "react";
import { WithContext as ReactTags } from "react-tag-input";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import toast from "react-hot-toast";
import Loading from "../../../components/Loading";
import { Helmet } from "react-helmet-async";
export default function AddBlog() {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleDelete = (index) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  const onTagUpdate = (index, newTag) => {
    const updatedTags = [...tags];
    updatedTags.splice(index, 1, newTag);
    setTags(updatedTags);
  };

  const handleAddition = (tag) => {
    setTags((prevTags) => {
      return [...prevTags, tag];
    });
  };

  const handleDrag = (tag, currPos, newPos) => {
    const newTags = tags.slice();

    newTags.splice(currPos, 1);
    newTags.splice(newPos, 0, tag);

    // re-render
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
    const blogImageUrl = form.blogImage.value;
    const blogDescription = form.blogDescription.value;
    const ownerName = user?.displayName;
    const ownerImage = user?.photoURL;
    const ownerEmail = user?.email;
    const type = "Normal";
    const status = "Pending";
    const blogData = {
      blogName,
      blogImage: blogImageUrl,
      blogDescription,
      blogTags: tags,
      ownerName,
      ownerImage,
      ownerEmail,
      type,
      status,
      isReported: false,
      upvotes: 0,
      downvotes: 0,
      date: new Date().toISOString(),
    };

    try {
      const { data } = await axiosSecure.post("/blogs", blogData);
      if (data?.insertedId) {
        toast.success("Blog added successfully");
        form.reset();
        setTags([]);
      } else {
        toast.error(data?.message);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Add Blog | Okkhor</title>
      </Helmet>
      {loading ? (
        <Loading />
      ) : (
        <section className="container mx-auto max-w-2xl px-4 py-10">
          <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              Add Blog
            </h1>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Share your thoughts with the community.
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
                  className="block w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm transition focus:border-black focus:bg-white focus:outline-none focus:ring-1 focus:ring-black dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:focus:border-white dark:focus:ring-white"
                  placeholder="Enter blog title"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-900 dark:text-white">
                  Blog Image URL
                </label>
                <input
                  type="url"
                  name="blogImage"
                  id="blogImage"
                  className="block w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm transition focus:border-black focus:bg-white focus:outline-none focus:ring-1 focus:ring-black dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:focus:border-white dark:focus:ring-white"
                  placeholder="https://example.com/image.jpg"
                  required
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
                  className="block min-h-[150px] w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm transition focus:border-black focus:bg-white focus:outline-none focus:ring-1 focus:ring-black dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:focus:border-white dark:focus:ring-white"
                  required
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
                  Publish Blog
                </button>
              </div>
            </form>
          </div>
        </section>
      )}
    </>
  );
}
