# Tutorial Next.js powered by Enonic

This tutorial is published on [Enonic's Developer Portal](https://developer.enonic.com/learn/nextjs)

## About

This project is based on the [Next.XP starter](https://github.com/enonic/starter-nextjs) and contains a working version of the Next.js application, representing the end result of the tutorial, as well as the tutorial documentation in `docs/`.

The same application is used for the Next.XP demo.

## Run the application

### In the cloud

Follow the [demo](https://developer.enonic.com/learn/nextjs/stable/demo) to deploy the application on Vercel, against an Enonic Cloud solution with sample content.

### Locally

The application needs a running Enonic back-end with the Headless Movie DB sample content. Requires Enonic XP 8.1+ with Guillotine 9 and the Next.XP app.

1. Install the [Enonic CLI](https://developer.enonic.com/start)
2. Create and start a sandbox from the `Headless Movie DB` template. It installs Content Studio, Guillotine, Next.XP and the Headless Movie DB application with its content:

   ```sh
   enonic sandbox create demo_nextjs -t hmdb -v 8.1.3 -f
   ```

   To use an existing sandbox instead, install the `Headless Movie DB` and `Next.XP` applications from Enonic Market: `XP menu` -> `Applications` -> `Install` at http://localhost:8080
3. Fetch and run the Next.js application:

```sh
npx degit github:enonic/tutorial-nextjs tutorial-nextjs
cd tutorial-nextjs
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Configuration

The application is configured through environment variables in `.env`. The committed values target the demo back-end: the Headless Movie DB application (`com.enonic.app.hmdb`) with the project `hmdb` and a site at `/hmdb`, on `http://localhost:8080`.

| Variable | Description |
|----------|-------------|
| `ENONIC_APP_NAME` | Name of the Enonic application that holds the content types and components |
| `ENONIC_API` | Absolute URL to the Enonic XP API root |
| `ENONIC_API_TOKEN` | Shared secret used to secure preview and revalidation requests |
| `ENONIC_MAPPINGS` | Maps locales to content projects and sites: `<locale>:<project>/<site>`, comma-separated |
| `GUILLOTINE_API` | Optional. Guillotine API descriptor, appended to `ENONIC_API` |
| `ENONIC_MEDIA_CDN` | Optional. Base URL for media, if it differs from `ENONIC_API` |
| `ENONIC_ADMIN` | Optional. Origin of Enonic admin, if it differs from the API origin |

To run against the back-end built in the tutorial, set `ENONIC_APP_NAME=com.example.tutorial.nextjs` and `ENONIC_MAPPINGS=en:intro/hmdb`. Put values that should not be committed in `.env.local`.

## Commands

```sh
npm run dev    # Start the application in development mode
npm run prod   # Build and start the application in production mode
npm run lint   # Run ESLint (also runs before every build)
```

## Releasing a new version

### Prepare this repo

1. Create new features in a branch
2. Test and verify the application
3. Update the docs if needed
4. Create a pull request to `master` on GitHub
5. Tag `master`, for example `git tag v6.0.0`, after the pull request is merged

### Update the starter repo

6. Move all relevant changes to a feature branch in [starter-nextjs](https://github.com/enonic/starter-nextjs)
7. Test and verify the changes
8. Create a pull request to `master` on GitHub
9. Tag `master`, for example `git tag v6.0.0`, after the pull request is merged

### Final step: Release

10. Merge the changes to `master` for both repositories
11. Verify that setting up a new Next.js application works according to the tutorial
12. Verify that the demo works

## Learn more

You can learn more in the [Next.js documentation](https://nextjs.org/docs).

For the integration with Enonic, see [`@enonic/nextjs-adapter`](https://www.npmjs.com/package/@enonic/nextjs-adapter).
