import os
import glob

# Map of specific files and their replacements
replacements = {
    "src/components/Banner.jsx": [("rounded-[2.5rem]", "rounded-3xl")],
    "src/components/Newsletter.jsx": [("rounded-[2.5rem]", "rounded-3xl")],
    "src/components/Dashboard/DashboardCard.jsx": [("rounded-[2.5rem]", "rounded-2xl")],
    "src/components/BlogCard.jsx": [("rounded-[1.5rem]", "rounded-2xl")],
    "src/components/Testimonials.jsx": [("rounded-[1.5rem]", "rounded-2xl")],
    "src/components/FollowListModal.jsx": [("rounded-[2.5rem]", "rounded-3xl")],
    "src/pages/Auth/Login.jsx": [("rounded-[2.5rem]", "rounded-3xl")],
    "src/pages/Auth/Register.jsx": [("rounded-[2.5rem]", "rounded-3xl")],
    "src/pages/Auth/ForgotPassword.jsx": [("rounded-[2.5rem]", "rounded-3xl")],
    "src/pages/About.jsx": [("rounded-[2.5rem]", "rounded-3xl")],
    "src/pages/Blogs/Blogs.jsx": [("rounded-[2.5rem]", "rounded-2xl"), ("rounded-[1.5rem]", "rounded-2xl")],
    "src/pages/Blogs/BlogDetails.jsx": [("rounded-[2.5rem]", "rounded-2xl"), ("rounded-[1.5rem]", "rounded-2xl")],
    "src/pages/Dashboard/User/MyBlogs.jsx": [("rounded-[2.5rem]", "rounded-2xl")],
    "src/pages/Dashboard/User/SavedBlogs.jsx": [("rounded-[2.5rem]", "rounded-2xl")],
    "src/pages/Dashboard/Moderator/BlogReviewQueue.jsx": [("rounded-[2.5rem]", "rounded-2xl")],
    "src/pages/Dashboard/Moderator/ReportedContents.jsx": [("rounded-[2.5rem]", "rounded-2xl")],
    "src/pages/Dashboard/Admin/ManageUsers.jsx": [("rounded-[2.5rem]", "rounded-2xl")],
}

for file_path, changes in replacements.items():
    if os.path.exists(file_path):
        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read()
        
        for old, new in changes:
            content = content.replace(old, new)
        
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(content)
        print(f"Updated {file_path}")
    else:
        print(f"File not found: {file_path}")

print("Done.")
