"use client"

import { FaRegHeart, FaHeart } from "react-icons/fa6";
import { FaRegCommentAlt, FaCommentAlt } from "react-icons/fa";
import { useState } from "react";

const ViewPost = ({name,dp_url,content_url,like_cnt,comment_cnt}) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isCommented, setIsCommented] = useState(false);

  const handleLike = () => {
    setIsLiked(!isLiked);
  };

  const handleComment = () => {
    setIsCommented(!isCommented);
  };

  return (
    <div className="w-[500px] border border-black p-4 rounded-lg shadow-lg m-10">
      <div className="title flex items-center gap-4 font-bold text-xl mb-4">
        <div className="creater-dp w-[50px] h-[50px] border border-black rounded-full overflow-hidden">
          <img src="/dp.jpeg" alt="Creator's profile" className="w-full h-full object-cover" />
        </div>
        <div className="flex flex-col">
          <div className="creator-name text-lg">Aniket</div>
          <div className="post-title text-sm text-gray-500">Feeling happy</div>
        </div>
      </div>
      <div className="body mt-2 text-gray-700">
        <img src="/dp.jpeg" alt="Post content" className="w-full h-full object-cover" />
      </div>
      <div className="footer flex items-center gap-4 mt-4 text-gray-500 text-sm">
        <div onClick={handleLike} className="cursor-pointer">
          {isLiked ? <FaHeart className="w-[30px] h-[30px] text-red-500" /> : <FaRegHeart className="w-[30px] h-[30px]" />}
        </div>
        <div onClick={handleComment} className="cursor-pointer">
          {isCommented ? <FaCommentAlt className="w-[30px] h-[30px] text-blue-500" /> : <FaRegCommentAlt className="w-[30px] h-[30px]" />}
        </div>
        <div><p>Posted 2 hours ago</p></div>
      </div>
    </div>
  );
};

export default ViewPost;
