# Personal Portfolio Website

A modern, responsive portfolio website built with HTML, SCSS, and vanilla JavaScript. Designed for GitHub Pages deployment.

## Structure

- **Landing Page** (`index.html`): Hero, summary, experience highlights, skills highlights, flagship projects, publications, hobbies teaser, and contact CTA
- **Experience Page** (`experience.html`): Detailed timeline of roles with metrics, stack notes, and impact stories
- **Skills Page** (`skills.html`): Four skill pillars with proof points and tools/stack grid
- **Hobbies Page** (`hobbies.html`): Creative gallery with photo essays, music/making section, and collaboration CTA

## Development

### Prerequisites

- Sass compiler (Dart Sass recommended)

### Building

Compile SCSS to CSS:

```bash
sass style/main.scss style/main.css
```

For watch mode during development:

```bash
sass --watch style/main.scss style/main.css
```

## Deployment to GitHub Pages

1. Push your code to a GitHub repository
2. Go to repository Settings → Pages
3. Select the branch (usually `main` or `master`)
4. Select the root folder (`/`)
5. Save and your site will be live at `https://yourusername.github.io/repository-name/`

## Customization

- Update personal information in HTML files
- Modify colors and spacing in `style/base/_variables.scss`
- Add your own images to the `assets/` folder
- Replace placeholder content with your actual work, projects, and publications

## Browser Support

Modern browsers (Chrome, Firefox, Safari, Edge)

