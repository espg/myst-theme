import classNames from 'classnames';
import { MyST } from 'myst-to-react';
import type { GenericParent } from 'myst-common';

/**
 * Non-dismissible site-wide header part.
 *
 * Unlike the existing `<Banner>`, this is intended for permanent brand strips,
 * image banners, or affiliation marks — no close button, no localStorage. It
 * sits above the (sticky) navbar in the layout flow. Authors style it via the
 * site's `style:` option (custom CSS) targeting `.myst-blog-site-header`.
 *
 * Renders nothing if `content` is missing or empty.
 */
export function SiteHeader({
  content,
  className,
}: {
  content?: GenericParent;
  className?: string;
}) {
  // Render the wrapper whenever the part is configured (even with empty markdown),
  // so author CSS can style an image-only header. Returns null only when the part
  // is entirely absent.
  if (!content) return null;
  return (
    <header
      aria-label="Site header"
      className={classNames('myst-blog-site-header w-full', className)}
    >
      {content.children && content.children.length > 0 ? <MyST ast={content} /> : null}
    </header>
  );
}
