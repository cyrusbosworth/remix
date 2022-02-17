import { useLoaderData, Link, LoaderFunction } from 'remix';
import { db } from '~/utils/db.server';

export const loader: LoaderFunction = async () => {
  const data = {
    posts: await db.post.findMany({
      take: 20,
      select: { id: true, title: true, createdAt: true },
      orderBy: { createdAt: 'desc' },
    }),
  };
  return data;
};
type PostsType = {
  posts: [{ id: number; title: string; body: string; createdAt: string }];
};

function PostItems() {
  const { posts } = useLoaderData<PostsType>();

  return (
    <>
      <div className='page-header'>
        <h1>Posts</h1>
        <Link to='/posts/new' className='btn'>
          New Post
        </Link>
      </div>
      <ul className='posts-list'>
        {posts.map(post => (
          <li key={post.id}>
            <Link to={post.id.toString()}>
              <h3>{post.title}</h3>
              {new Date(post.createdAt).toLocaleString()}
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}

export default PostItems;
