# canvasManagement


install specflow template `dotnet new install Specflow.Templates.DotNet`

view templates with `dotnet new -l`

find outdated packages `dotnet list package --outdated`


Development command: `dotnet watch --project Management.Web/`


## Canvas HTML Hack

<https://nowucca.com/2020/07/04/working-around-canvas-limitations.html>

## Getting Started and Usage

<!-- draft -->


### Enable Image Support


You must set the `ENABLE_FILE_SYNC` environment variable to true. Images need to be available in the `/app/public/` directory in the container so that nextjs will serve them as static files. Images can also be set to public URL's on the web.

When an image is detected by canvas manager, it will upload the image to the canvas course and keep a lookup table of the original path/url of the image to the canvas course URL.

For Snow College professors, images should be stored in a separate git repo from the `facultyFiles` git repo. Otherwise the `faculty` repository will become cluttered with duplicated large binary images. Set up your volume like this:

```yml
    volumes:
      - ~/projects/facultyFiles:/app/public/images/facultyFiles
```

You can now embed an image in an assignment by adding something like this line.

```md
![formulas](/images/facultyFiles/1405/lab-04-simple-math-formulas.png)
```

# ideas

matching questions

- different delimiter (-n in answer messes things up)
- add distractors

on calendar month, displays days that are on the same week as a month change (if month ends on monday, still show tues-sat)

file uploads
- image compression?
- scrape html, when image embedded, upload to canvas and add img tag to canvas asset in html before sending image
- put all images in an image repo in a /course/semester/filename format. upload the image to canvas, replace the url before sending it over with the canvas version.
    - store canvas image ids in settings?

allow multiple courses to be edited concurrently in different browser tabs

schedule planning view? just outline concepts? (maybe some non-canvas scheduled thing that only shows up in planner? like a note, could be de-emphasized in webpage)
- probably have a notes section for each module. Have a toggle to expand notes in module

holiday schedule

multi-section support for due dates/times

better error handling when files are unparsable

websocket server to watch file system for changes, notify frontend it should invalidate cache

lectures
- create 1 lecture for a given day
- have a way of running a lecture from an unauthenticated computer? maybe just view lecture notes?


tighter integration with git
- regularly make git commits
- handle merging?
- maybe a different storage backend?
- user motivated restore?

display days settings
- hide all sundays (horizontal space)


lecture preview link has server side render caching issues.

