import { NextResponse } from 'next/server';
import { getMongoDbDatabase } from '@/lib/mongodb';
import { getServerSubmissions, readServerStore, saveServerSubmission, writeServerStore } from '@/lib/server-storage';

interface BlogComment {
  id: string;
  blogSlug: string;
  name: string;
  content: string;
  createdAt: string;
}

function normalizeEmail(value: unknown): string {
  return typeof value === 'string' ? value.trim().toLowerCase() : '';
}

async function isEligible(email: string): Promise<boolean> {
  const normalizedEmail = normalizeEmail(email);
  if (!normalizedEmail) return false;

  const localJoins = getServerSubmissions('joins');
  const localRegistrations = getServerSubmissions('registrations');
  if ([...localJoins, ...localRegistrations].some((record: any) => normalizeEmail(record.email) === normalizedEmail)) {
    return true;
  }

  try {
    const db = await getMongoDbDatabase();
    if (!db) return false;
    const [join, registration] = await Promise.all([
      db.collection('joins').findOne({ email: normalizedEmail }, { projection: { _id: 1 } }),
      db.collection('registrations').findOne({ email: normalizedEmail }, { projection: { _id: 1 } }),
    ]);
    return Boolean(join || registration);
  } catch {
    return false;
  }
}

async function getInteractionData(blogSlug: string) {
  const localComments = getServerSubmissions('blog-comments') as BlogComment[];
  const localLikes = getServerSubmissions('blog-likes') as { blogSlug: string; email: string }[];
  const comments = localComments.filter((comment) => comment.blogSlug === blogSlug);
  const likeEmails = localLikes
    .filter((like) => like.blogSlug === blogSlug)
    .map((like) => normalizeEmail(like.email));

  try {
    const db = await getMongoDbDatabase();
    if (db) {
      const [dbComments, dbLikes] = await Promise.all([
        db.collection('blog_comments').find({ blogSlug }).sort({ createdAt: -1 }).toArray(),
        db.collection('blog_likes').find({ blogSlug }).toArray(),
      ]);
      return {
        comments: [...comments, ...dbComments.map((comment: any) => ({
          id: comment.id || String(comment._id),
          blogSlug: comment.blogSlug,
          name: comment.name,
          content: comment.content,
          createdAt: new Date(comment.createdAt).toISOString(),
        }))],
        likeEmails: [...likeEmails, ...dbLikes.map((like: any) => normalizeEmail(like.email))],
      };
    }
  } catch {
    // Return the local backup when MongoDB is unavailable.
  }

  return { comments, likeEmails };
}

export async function GET(request: Request) {
  const searchParams = new URL(request.url).searchParams;
  const blogSlug = searchParams.get('slug')?.trim();
  const email = normalizeEmail(searchParams.get('email'));
  if (!blogSlug) return NextResponse.json({ success: false, error: 'Blog slug is required' }, { status: 400 });

  const { comments, likeEmails } = await getInteractionData(blogSlug);
  return NextResponse.json({
    success: true,
    comments,
    likes: likeEmails.length,
    liked: Boolean(email && likeEmails.includes(email)),
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const blogSlug = typeof body.blogSlug === 'string' ? body.blogSlug.trim() : '';
    const email = normalizeEmail(body.email);
    const name = typeof body.name === 'string' ? body.name.trim().slice(0, 80) : '';
    const action = body.action === 'like' ? 'like' : body.action === 'comment' ? 'comment' : '';

    if (!blogSlug || !email || !action || !(await isEligible(email))) {
      return NextResponse.json(
        { success: false, error: 'Join the community or register for an event to interact with blogs.' },
        { status: 403 }
      );
    }

    const db = await getMongoDbDatabase();
    if (action === 'like') {
      const localLikes = getServerSubmissions('blog-likes');
      const existingLocal = localLikes.find((like: any) => like.blogSlug === blogSlug && normalizeEmail(like.email) === email);
      let liked = Boolean(existingLocal);

      if (db) {
        const existing = await db.collection('blog_likes').findOne({ blogSlug, email });
        if (existing) {
          await db.collection('blog_likes').deleteOne({ _id: existing._id });
          liked = false;
        } else {
          await db.collection('blog_likes').insertOne({ id: `bl-${Date.now()}`, blogSlug, email, createdAt: new Date() });
          liked = true;
        }
      } else if (existingLocal) {
        const stored = readServerStore();
        stored['blog-likes'] = localLikes.filter((like: any) => !(like.blogSlug === blogSlug && normalizeEmail(like.email) === email));
        writeServerStore(stored);
        liked = false;
      } else {
        saveServerSubmission('blog-likes', { blogSlug, email, createdAt: new Date().toISOString() });
        liked = true;
      }

      const data = await getInteractionData(blogSlug);
      return NextResponse.json({ success: true, liked, likes: data.likeEmails.length });
    }

    if (!name || typeof body.content !== 'string' || !body.content.trim()) {
      return NextResponse.json({ success: false, error: 'Comment text is required' }, { status: 400 });
    }

    const comment: BlogComment = {
      id: `bc-${Date.now()}`,
      blogSlug,
      name,
      content: body.content.trim().slice(0, 1000),
      createdAt: new Date().toISOString(),
    };
    if (db) {
      await db.collection('blog_comments').insertOne(comment);
    } else {
      saveServerSubmission('blog-comments', comment);
    }

    return NextResponse.json({ success: true, comment }, { status: 201 });
  } catch (error: any) {
    console.error('Error handling blog interaction:', error);
    return NextResponse.json({ success: false, error: 'Unable to save blog interaction' }, { status: 500 });
  }
}
