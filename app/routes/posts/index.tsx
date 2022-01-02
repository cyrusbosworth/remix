import { useLoaderData } from 'remix';

export const loader = () => {
  const data = {
    posts: [
      { id: 1, title: 'Post 1', body: 'This is test post 1' },
      { id: 2, title: 'Post 2', body: 'This is test post 2' },
      { id: 3, title: 'Post 3', body: 'This is test post 3' },
      { id: 4, title: 'Post 4', body: 'This is test post 4' },
    ],
  };
  return data;
};

function PostItems() {
  return (
    <div>
      <h1>Posts</h1>
    </div>
  );
}

export default PostItems;
