/* eslint-disable react/prop-types */
import { IF } from '../url';

const HomePosts = ({ post }) => {
  // Format the date
  const formattedDate = new Date(post?.updatedAt).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="w-full flex flex-col lg:flex-row rounded-lg overflow-hidden shadow-lg transform transition-all hover:bg-slate-900 py-8 lg:items-center">
      {/* Left */}
      <div className="w-full lg:w-[40%] flex justify-center items-center h-72 lg:h-72 px-8 mb-4 lg:mb-0">
        <img src={IF + post?.photo} alt={post?.title} className="h-full w-full object-cover rounded-lg border border-1 border-slate-500" />
      </div>
      {/* Right */}
      <div className="flex flex-col p-6 lg:w-[50%] text-white">
        <div className="flex space-x-4 text-gray-400 text-sm">
          <p>{formattedDate}</p>
        </div>
        <h1 className="text-xl md:text-2xl font-bold mb-4 hover:text-green-400 transition duration-300">
          {post?.title}
        </h1>
        <p className="text-sm md:text-base leading-relaxed text-gray-300 mb-4">
          {post?.desc.slice(0, 150)}{" "}
          <span className="text-green-400 cursor-pointer hover:text-green-500">
            ...Read more
          </span>
        </p>
        <p className="text-gray-300 font-medium md:text-sm">@{post?.username}</p>
      </div>
    </div>
  );
}

export default HomePosts;
