# MySQL portfolio content manager

This project now has a small content manager for every portfolio record:

- Projects: Innovation, Business Intelligence, Data Analytics, and Web Development
- Certifications and digital credentials
- Professional-development courses
- Extracurricular and academic achievements
- Professional experience, leadership committees, and NGO involvement
- Event management and volunteering

## One-time setup

1. Install a PHP + MySQL web stack such as XAMPP, Laragon, or a PHP-capable web host. PHP is required because a browser cannot connect safely to MySQL by itself.
2. Create/import the database using [`database/schema.sql`](database/schema.sql).
3. Copy `api/config.php.example` to `api/config.php`, then set the MySQL credentials and a long admin password.
4. Place the portfolio in the PHP server's web directory and visit it through the server, for example `http://localhost/PORTFOLIO/index.html` — do not open the HTML file directly.
5. Visit `/admin/`, sign in, and add an entry.

## How the three-item rule works

Every public category is ordered by the **Date** entered in Admin (newest first). The homepage and About page load exactly the newest three entries for each displayed group. Entries older than the newest three remain in MySQL and are shown automatically in that group’s **See more** archive.

Set a future entry as a draft by unticking **Publish immediately**; it will remain in the admin list but never appear publicly.

For images, first place the image in `assets/`, then enter a relative path such as `assets/projects/my-project.jpg`. For proof or project links, paste the complete URL.
