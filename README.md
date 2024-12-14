# Syracuse.io 3.0

This is the source code for the next generation of https://syracuse.io - a consolidated directory and calendar of technology user groups and meetups in the Syracuse area.

## Prerequisites

- Node.js (v18 or later)
- npm (v9 or later)
- Git

## Local Development Setup

1. Clone the repository:
   ```sh
   git clone https://github.com/codesyracuse/syracuse.io.git
   cd syracuse.io
   ```

2. Install dependencies:
   ```sh
   npm install
   ```

3. Start the development server:
   ```sh
   npm run dev
   ```

4. Open your browser and visit `http://localhost:4321`

## Available Commands

| Command                   | Purpose                                          |
| :----------------------- | :----------------------------------------------- |
| `npm run dev`            | Start development server at `localhost:4321`     |
| `npm run build`          | Build production site to `./dist/`              |
| `npm run preview`        | Preview production build locally                 |
| `npm run astro ...`      | Run Astro CLI commands                          |

## Project Structure

Inside of your Astro project, you'll see the following folders and files:

```text
/
├── public/
│   └── favicon.svg
├── src/
│   ├── content/
│   │   └── groups/           # Community group content files
│   │       └── *.md         # Individual group markdown files
│   ├── layouts/
│   │   └── Layout.astro
│   └── pages/
│       └── index.astro
└── package.json
```

The `src/content/groups` directory contains markdown files for each community group. Each file should follow this format:

```markdown
---
title: "Group Name"
subtitle: "A brief description of the group"
summary: "A longer description of the group"
img: "/src/assets/groups/group-logo.png"
imgAlt: "Group Logo"
groupType: "meetup"
groupId: "group-name"
organizers:
  - "Organizer Name"
  - "Organizer Name"
---

Additional group details and information can go here in markdown format.
```

To learn more about the folder structure of an Astro project, refer to [our guide on project structure](https://docs.astro.build/en/basics/project-structure/).

## Contributing

1. Fork the repository
2. Create a new branch: `git checkout -b feature/your-feature-name`
3. Make your changes
4. Run tests (if applicable)
5. Commit your changes: `git commit -m 'Add some feature'`
6. Push to the branch: `git push origin feature/your-feature-name`
7. Submit a pull request

## Need Help?

- Check out [Astro's documentation](https://docs.astro.build)
- Join our [Discord community](TODO: Add Syracuse.io Discord link)
- Create an issue in this repository

## License

[Add license information]
