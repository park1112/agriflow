type Post = {
  id: string;
  title: string;
  content: string;
};

type PostItemProps = {
  post: Post;
};

const PostItem = ({ post }: PostItemProps) => {
  return (
    <div className="border p-4 rounded mb-4 bg-white">
      <h2 className="text-xl font-bold mb-2">{post.title}</h2>
      <p>{post.content}</p>
    </div>
  );
};

export default PostItem;
