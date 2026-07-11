# Arbitration Simulation Lab

Interactive Arabic legal training platform for the lecture **Commencement of Arbitration Proceedings**.

Version 1.0 is now fully local and self-contained. It keeps the existing interface, preserves the current construction arbitration case, and removes all Firebase/backend dependencies.

## What It Includes

- One lecture.
- One integrated construction arbitration case.
- Three practical tasks:
  - Request for Arbitration.
  - Response to the Request for Arbitration.
  - Procedural Order No. 1.
- Local access control with two codes only:
  - `2030` for students.
  - `1984` for instructors.
- Session persistence with `sessionStorage`.
- Drafts and submissions saved locally in `localStorage`.
- Arabic PDF download and print support.
- Instructor dashboard with:
  - Case data.
  - Reference templates.
  - Reset session.
  - Logout.

## Access Code Configuration

Change the codes in:

[`js/config/access-config.js`](js/config/access-config.js)

That file is the only place you need to update the access codes later.

## Local Storage

- Login state is stored in `sessionStorage`.
- Student profile, drafts, and local submissions are stored in `localStorage`.
- No data is sent to a backend or external API.

## PDF Output

The PDF document includes:

- Student name.
- Case number.
- Case title.
- Document title.
- Course name.
- Instructor name.
- Date and creation time.
- Page numbers.
- Document body.
- Signature area.

The document is prepared for Arabic RTL output and A4 printing.

## GitHub Pages

The project runs directly on GitHub Pages because it is static HTML, CSS, and JavaScript.

## Run Locally

Serve the folder with any local web server, for example:

```bash
python -m http.server 8000
```

Then open the local URL in your browser.

## Project Files

- `index.html` - main application shell.
- `style.css` - existing interface styles.
- `css/platform.css` - platform-specific additions.
- `script.js` - existing lecture behavior.
- `js/platform.js` - bootstraps the platform.
- `js/data/case-file.js` - the integrated case data.
- `js/config/access-config.js` - student and instructor codes.
