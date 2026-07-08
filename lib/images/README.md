# lib/images/

Image path helper.

- **`imageUrl(src)`** — resolves a property image path to a full URL. Use it for
  every image; never hard-code `/images/...` in a component.

Today images are served locally from `/public/images`. To move to a CDN
(Cloudinary, S3/CloudFront, …), set `NEXT_PUBLIC_IMAGE_BASE_URL` and — if the CDN
rewrites paths — adjust this one file. No component changes required.
