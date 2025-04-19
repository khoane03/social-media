import React, { useEffect, useState } from "react";
import { CheckCircle, Close, Send } from "@mui/icons-material";
import { Avatar } from "@mui/material";
import PostService from "../../service/PostService";
import { Link } from "react-router-dom";
import { PostActions } from "./PostAction";


type ViewPostProps = {
  isOpen: boolean;
  onClose: () => void;
  postId?: string;
};

type Post = {
  postId: string;
  userId: string;
  name: string;
  avatarUrl: string;
  isVerified: boolean;
  postContent: string;
  createdAt: string;
  images: string[];
};

const ViewPost: React.FC<ViewPostProps> = ({ isOpen, postId, onClose }) => {
  const [post, setPost] = useState<Post | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handlePrev = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? (post?.images.length ?? 1) - 1 : prev - 1
    );
  };

  const handleNext = () => {
    setCurrentImageIndex((prev) =>
      prev === (post?.images.length ?? 1) - 1 ? 0 : prev + 1
    );
  };


  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await PostService.getPostById(postId || "");
        setPost(response.data[0]);
      } catch (error) {
        console.error("Error fetching post:", error);
      }
    };

    if (postId) fetchPost();
  }, [postId]);

  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen || !post) return null;

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
      <div className="bg-white relative w-full max-w-3xl min-h-[60vh] max-h-[90vh] flex flex-col rounded-2xl overflow-hidden shadow-2xl">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 bg-gray-800/80 text-white rounded-full p-1.5 hover:bg-gray-900 transition-colors z-20"
        >
          <Close className="w-5 h-5" />
        </button>
  
        {/* Nội dung bài viết */}
        <div className="flex flex-col h-full p-5 gap-4">
          
          {/* Header */}
          <div className="flex items-center border-b border-gray-200 pb-3">
            <Avatar
              className="border border-gray-200 w-10 h-10"
              src={post.avatarUrl || "default.png"}
            />
            <div className="ml-3 flex items-center font-semibold text-gray-900">
              <Link to={`/profile/${post.userId}`} className="hover:underline">
                {post.name}
              </Link>
              {post.isVerified && (
                <CheckCircle className="text-blue-500 ml-1.5 w-4 h-4" />
              )}
            </div>
          </div>
  
          {/* Nội dung văn bản */}
          <div className="flex-grow overflow-y-auto text-gray-800 text-sm whitespace-pre-wrap pr-2">
            <p>{post.postContent}</p>
          </div>
  
          {/* Ảnh bài viết */}
          <div className="relative w-full rounded-lg overflow-hidden bg-gray-900 flex items-center justify-center">
            {post.images && post.images.length > 0 && (
              <>
                <img
                  src={post.images[currentImageIndex]}
                  alt="Post"
                  className="w-full h-auto max-h-[50vh] object-contain transition-transform duration-300"
                  style={{ aspectRatio: '16/9' }}
                />
                {post.images.length > 1 && (
                  <>
                    <button
                      onClick={handlePrev}
                      className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/40 hover:bg-white/60 text-white font-bold px-3 py-1 rounded-full transition-colors"
                    >
                      ❮
                    </button>
                    <button
                      onClick={handleNext}
                      className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/40 hover:bg-white/60 text-white font-bold px-3 py-1 rounded-full transition-colors"
                    >
                      ❯
                    </button>
                  </>
                )}
              </>
            ) 
            }
          </div>
          <PostActions postId={post.postId} />
  
          {/* Ô nhập comment */}
          <div className="flex items-center pt-3">
            <input
              type="text"
              placeholder="Viết bình luận..."
              className="w-full border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
            <Send className="text-blue-500 cursor-pointer ml-2 hover:text-blue-300" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewPost;
