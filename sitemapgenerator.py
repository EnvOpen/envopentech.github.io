import os
from datetime import datetime

# Configuration
BASE_URL = "https://www.envopen.org"  # Replace with your website's base URL
OUTPUT_FILE = "sitemap.xml"
WEBSITE_DIR = "."  # Replace with the path to your website files
MEDIA_EXTENSIONS = [".jpg", ".jpeg", ".png", ".gif", ".svg", ".mp4", ".pdf", ".webp"]

def generate_sitemap(base_url, website_dir):
    urls = []
    media_urls = []

    # Walk through the website directory to find files
    for root, _, files in os.walk(website_dir):
        for file in files:
            # Generate the relative path
            relative_path = os.path.relpath(os.path.join(root, file), website_dir)
            url = f"{base_url}/{relative_path.replace(os.sep, '/')}"

            # Categorize files
            if file.endswith(".html"):
                urls.append({"loc": url, "lastmod": datetime.now().strftime('%Y-%m-%d')})
            elif any(file.endswith(ext) for ext in MEDIA_EXTENSIONS):
                media_urls.append(url)

    # Generate XML content
    sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n'
    sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n'
    sitemap += '        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n'

    # Add HTML pages
    for url in urls:
        sitemap += "  <url>\n"
        sitemap += f"    <loc>{url['loc']}</loc>\n"
        sitemap += f"    <lastmod>{url['lastmod']}</lastmod>\n"
        sitemap += "    <changefreq>daily</changefreq>\n"
        sitemap += "    <priority>0.8</priority>\n"
        sitemap += "  </url>\n"

    # Add media files
    for media_url in media_urls:
        sitemap += "  <url>\n"
        sitemap += f"    <loc>{media_url}</loc>\n"
        sitemap += "    <changefreq>monthly</changefreq>\n"
        sitemap += "    <priority>0.5</priority>\n"
        if media_url.endswith((".jpg", ".jpeg", ".png", ".gif", ".svg")):
            sitemap += "    <image:image>\n"
            sitemap += f"      <image:loc>{media_url}</image:loc>\n"
            sitemap += "    </image:image>\n"
        sitemap += "  </url>\n"

    sitemap += "</urlset>"
    return sitemap

# Generate and save the sitemap
sitemap_content = generate_sitemap(BASE_URL, WEBSITE_DIR)
with open(OUTPUT_FILE, "w", encoding="utf-8") as file:
    file.write(sitemap_content)

print(f"Sitemap generated and saved to {OUTPUT_FILE}")