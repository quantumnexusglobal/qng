'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Navigation } from '@/components/landing/navigation';
import {
  ArrowLeft,
  Calendar,
  Clock,
  User,
  Tag,
  Share2,
  Bookmark,
  CheckCircle2,
  Sparkles,
  BookOpen,
  ArrowRight,
  PenSquare,
  Heart,
  MessageCircle,
  Send,
} from 'lucide-react';
import { getBlogBySlug, getBlogs, BlogPost } from '@/lib/blogs-store';
import { getUserIdentity, UserIdentity } from '@/lib/user-identity';

interface BlogComment {
  id: string;
  name: string;
  content: string;
  createdAt: string;
}

export default function SingleBlogPostPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;

  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [identity, setIdentity] = useState<UserIdentity | null>(null);
  const [comments, setComments] = useState<BlogComment[]>([]);
  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [interactionMessage, setInteractionMessage] = useState('');
  const [isInteracting, setIsInteracting] = useState(false);

  useEffect(() => {
    if (!slug) return;

    setIdentity(getUserIdentity());
    const found = getBlogBySlug(slug);
    if (found) {
      setPost(found);
      const all = getBlogs().filter((b) => b.status === 'Published' && b.id !== found.id);
      setRelatedPosts(all.slice(0, 3));
    }
    setIsLoading(false);

    const interactionEmail = getUserIdentity()?.email;
    const interactionQuery = new URLSearchParams({ slug });
    if (interactionEmail) interactionQuery.set('email', interactionEmail);
    fetch(`/api/blog-interactions?${interactionQuery.toString()}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setComments(data.comments || []);
          setLikes(data.likes || 0);
          setLiked(Boolean(data.liked));
        }
      })
      .catch(() => {});
  }, [slug]);

  const handleLike = async () => {
    if (!identity || isInteracting) return;
    setIsInteracting(true);
    setInteractionMessage('');
    try {
      const response = await fetch('/api/blog-interactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'like', blogSlug: slug, email: identity.email, name: identity.name }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      setLiked(data.liked);
      setLikes(data.likes);
    } catch (error: any) {
      setInteractionMessage(error.message || 'Unable to update like.');
    } finally {
      setIsInteracting(false);
    }
  };

  const handleComment = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!identity || !commentText.trim() || isInteracting) return;
    setIsInteracting(true);
    setInteractionMessage('');
    try {
      const response = await fetch('/api/blog-interactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'comment', blogSlug: slug, email: identity.email, name: identity.name, content: commentText }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      setComments((current) => [data.comment, ...current]);
      setCommentText('');
    } catch (error: any) {
      setInteractionMessage(error.message || 'Unable to post comment.');
    } finally {
      setIsInteracting(false);
    }
  };

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-background text-foreground pt-32 px-6">
        <Navigation />
        <div className="max-w-4xl mx-auto h-96 bg-foreground/5 rounded-3xl animate-pulse" />
      </main>
    );
  }

  if (!post) {
    return (
      <main className="min-h-screen bg-background text-foreground pt-32 px-6">
        <Navigation />
        <div className="max-w-xl mx-auto text-center py-20 bg-foreground/5 rounded-3xl border border-foreground/10">
          <BookOpen className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
          <h1 className="text-2xl font-display mb-3">Article Not Found</h1>
          <p className="text-sm text-muted-foreground mb-6">
            The article you are looking for might have been moved, removed, or is currently unpublished.
          </p>
          <Link
            href="/blog"
            className="px-6 py-2.5 rounded-full bg-foreground text-background font-medium text-sm transition-all"
          >
            Back to Blog Hub
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen bg-background text-foreground overflow-x-hidden">
      <Navigation />

      {/* Article Top Header Section */}
      <section className="relative pt-32 pb-12 px-6 lg:px-12 border-b border-foreground/10">
        <div className="max-w-4xl mx-auto">
          {/* Back button */}
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-muted-foreground hover:text-foreground mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Blog Index
          </Link>

          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="px-3 py-1 rounded-full bg-foreground/10 border border-foreground/10 text-xs font-mono font-medium text-foreground">
              {post.category}
            </span>
            <span className="text-xs text-muted-foreground font-mono flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {post.readTime}
            </span>
            <span className="text-xs text-muted-foreground font-mono flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {new Date(post.publishedAt).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-display tracking-tight leading-tight mb-6">
            {post.title}
          </h1>

          <p className="text-lg lg:text-xl text-muted-foreground leading-relaxed mb-8">
            {post.excerpt}
          </p>

          {/* Author Card & Share Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4 border-y border-foreground/10">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-foreground/10 border border-foreground/10 flex items-center justify-center font-display text-lg uppercase font-semibold">
                {post.author.name.charAt(0)}
              </div>
              <div>
                <div className="text-base font-semibold">{post.author.name}</div>
                <div className="text-xs text-muted-foreground">{post.author.role}</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleShare}
                className="px-4 py-2 rounded-full bg-foreground/5 hover:bg-foreground/10 border border-foreground/10 text-xs font-medium inline-flex items-center gap-2 transition-all"
              >
                {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
                {copied ? 'Link Copied!' : 'Share Article'}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Cover Image */}
      <section className="px-6 lg:px-12 py-10">
        <div className="max-w-4xl mx-auto">
          <div className="relative rounded-3xl overflow-hidden border border-foreground/10 shadow-2xl bg-foreground/5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full h-auto max-h-[70vh] object-contain mx-auto"
            />
          </div>
        </div>
      </section>

      {/* Article Body Content */}
      <section className="px-6 lg:px-12 pb-20">
        <div className="max-w-3xl mx-auto text-foreground/90 space-y-6 text-base lg:text-lg leading-relaxed font-sans">
          {post.content.split('\n\n').map((paragraph, idx) => {
            if (paragraph.startsWith('### ')) {
              return (
                <h3 key={idx} className="text-2xl font-display pt-6 pb-2 border-b border-foreground/10 text-foreground">
                  {paragraph.replace('### ', '')}
                </h3>
              );
            }
            if (paragraph.startsWith('#### ')) {
              return (
                <h4 key={idx} className="text-xl font-display pt-4 text-foreground">
                  {paragraph.replace('#### ', '')}
                </h4>
              );
            }
            if (paragraph.startsWith('> ')) {
              return (
                <blockquote
                  key={idx}
                  className="p-6 rounded-2xl bg-foreground/5 border-l-4 border-foreground italic my-6 text-foreground font-serif text-lg"
                >
                  {paragraph.replace('> ', '')}
                </blockquote>
              );
            }
            if (paragraph.startsWith('```')) {
              const codeClean = paragraph.replace(/```[a-z]*/g, '').trim();
              return (
                <pre
                  key={idx}
                  className="p-5 rounded-2xl bg-foreground/90 text-background font-mono text-sm overflow-x-auto my-6"
                >
                  <code>{codeClean}</code>
                </pre>
              );
            }
            if (paragraph.startsWith('|')) {
              // Simple markdown table renderer
              const rows = paragraph.trim().split('\n').filter((r) => !r.includes(':---'));
              return (
                <div key={idx} className="overflow-x-auto my-6 border border-foreground/10 rounded-2xl">
                  <table className="w-full text-left text-sm">
                    <tbody>
                      {rows.map((row, rIdx) => {
                        const cells = row.split('|').filter((c) => c.trim() !== '');
                        return (
                          <tr
                            key={rIdx}
                            className={rIdx === 0 ? 'bg-foreground/10 font-bold' : 'border-t border-foreground/10'}
                          >
                            {cells.map((cell, cIdx) => (
                              <td key={cIdx} className="p-3">
                                {cell.trim()}
                              </td>
                            ))}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              );
            }
            return (
              <p key={idx} className="text-muted-foreground leading-relaxed">
                {paragraph}
              </p>
            );
          })}

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="pt-8 mt-12 border-t border-foreground/10">
              <div className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5" />
                Topics & Keywords
              </div>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3.5 py-1.5 rounded-full bg-foreground/5 border border-foreground/10 text-xs font-medium"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Author Bio Box */}
          <div className="p-8 rounded-3xl bg-foreground/5 border border-foreground/10 mt-12 flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <div className="w-16 h-16 rounded-full bg-foreground/10 border border-foreground/10 flex items-center justify-center font-display text-2xl uppercase shrink-0">
              {post.author.name.charAt(0)}
            </div>
            <div>
              <div className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-1">
                Written by
              </div>
              <h3 className="text-xl font-display mb-1">{post.author.name}</h3>
              <p className="text-xs text-muted-foreground mb-3">{post.author.role}</p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Member of Quantum Nexus Global research and development team, focusing on hybrid quantum algorithm design and cloud infrastructure execution.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 lg:px-12 pb-20">
        <div className="max-w-3xl mx-auto border-y border-foreground/10 py-10">
          <div className="flex items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              <h2 className="text-2xl font-display">Community Discussion</h2>
            </div>
            <button
              type="button"
              onClick={handleLike}
              disabled={!identity || isInteracting}
              title={identity ? 'Like this article' : 'Join the community or register for an event to like'}
              className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition-colors ${liked ? 'border-rose-500/40 bg-rose-500/10 text-rose-500' : 'border-foreground/15 hover:bg-foreground/5'} disabled:cursor-not-allowed disabled:opacity-50`}
            >
              <Heart className={`w-4 h-4 ${liked ? 'fill-current' : ''}`} />
              {likes}
            </button>
          </div>

          {identity ? (
            <form onSubmit={handleComment} className="flex flex-col gap-3 mb-8">
              <textarea
                value={commentText}
                onChange={(event) => setCommentText(event.target.value)}
                maxLength={1000}
                placeholder="Share your thoughts..."
                className="min-h-28 w-full resize-y rounded-2xl border border-foreground/15 bg-foreground/5 px-4 py-3 text-sm outline-none focus:border-foreground/40"
              />
              <button
                type="submit"
                disabled={!commentText.trim() || isInteracting}
                className="self-end inline-flex items-center gap-2 rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Send className="w-4 h-4" /> Post Comment
              </button>
            </form>
          ) : (
            <p className="mb-8 rounded-2xl border border-foreground/10 bg-foreground/5 px-4 py-3 text-sm text-muted-foreground">
              Join the community or register for an event to like and comment on articles.
            </p>
          )}

          {interactionMessage && <p className="mb-5 text-sm text-rose-500">{interactionMessage}</p>}
          <div className="space-y-4">
            {comments.length === 0 ? (
              <p className="text-sm text-muted-foreground">No comments yet.</p>
            ) : comments.map((comment) => (
              <article key={comment.id} className="rounded-2xl border border-foreground/10 bg-foreground/[0.03] p-4">
                <div className="flex items-center justify-between gap-3 mb-2">
                  <span className="text-sm font-semibold">{comment.name}</span>
                  <time className="text-xs text-muted-foreground" dateTime={comment.createdAt}>
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </time>
                </div>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">{comment.content}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="px-6 lg:px-12 py-16 border-t border-foreground/10 bg-foreground/[0.02]">
          <div className="max-w-[1400px] mx-auto">
            <h2 className="text-2xl font-display mb-8">More from QNG Insights</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {relatedPosts.map((rel) => (
                <article
                  key={rel.id}
                  className="bg-background border border-foreground/10 rounded-2xl p-6 hover:border-foreground/25 transition-all flex flex-col justify-between"
                >
                  <div>
                    <span className="px-3 py-1 rounded-full bg-foreground/5 text-[11px] font-mono font-medium mb-4 inline-block">
                      {rel.category}
                    </span>
                    <h3 className="text-lg font-display mb-2 line-clamp-2">
                      <Link href={`/blog/${rel.slug}`} className="hover:underline">
                        {rel.title}
                      </Link>
                    </h3>
                    <p className="text-xs text-muted-foreground line-clamp-3 mb-4">{rel.excerpt}</p>
                  </div>
                  <Link
                    href={`/blog/${rel.slug}`}
                    className="text-xs font-semibold inline-flex items-center gap-1 hover:gap-2 transition-all mt-4"
                  >
                    Read Post <ArrowRight className="w-3 h-3" />
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
