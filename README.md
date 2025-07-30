# canvasManagement

## Canvas HTML Hack

<https://nowucca.com/2020/07/04/working-around-canvas-limitations.html>

## Getting Started and Usage (v3)

All class data files are stored in markdown files in a folder. I recommend making this folder a git repo. Here's an example docker compose:

```yml
services:
  canvas_manager:
    image: alexmickelson/canvas_management:3
    user: "1000:1000"
    container_name: canvas-manager
    ports:
      - 3000:3000
    env_file:
      - .env
    environment:
      - storageDirectory=/app/storage
      - TZ=America/Denver
      - NEXT_PUBLIC_ENABLE_FILE_SYNC=true
    volumes:
      - ./globalSettings.yml:/app/globalSettings.yml
      - ~/projects/faculty:/app/storage
      - ~/projects/facultyFiles:/app/public/images/facultyFiles
```

The `globalSettings.yml` file specifies which folders in your storage directory you want to display in the UI. This way you can have old classes files stored, but not bring them into the UI unless you need to (like when you are planning a new semester, you might want to see the old semester).

`globalSettings.yml` can start like this, this file will be edited as you add classes to manage.

```yml
courses: []
```


## Enable Image Support


You must set the `NEXT_PUBLIC_ENABLE_FILE_SYNC` environment variable to true. Images need to be available in the `/app/public/` directory in the container so that nextjs will serve them as static files. Images can also be set to public URL's on the web.

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

file uploads
- working on assignments, needs to be added to pages/quizes

multi-section support for due dates/times

better error handling when files are unparsable
- currently falling back on orignal file url, need to raise this interaction to the user

tighter integration with git
- regularly make git commits
- handle merging?
- maybe a different storage backend?
- user motivated restore?

display days settings
- hide all sundays (horizontal space)


mermaid charts:
- inline display
- merjaidjs has a way to encode the chart as base64 and pass it to a url to get a png back
    - <https://github.com/mermaidjs/mermaid-live-editor/issues/41>
    - aparently not just any base64 encoding works, use their function
- if the chart gets auto-converted to a png to be displayed, it should work properly on canvas as well
- could lead to a lot of tmp png's being added while the chart is being changed (each change will trigger an upload to canvas)
- maybe track a list of unreferenced files and delete them?

remember expanded modules as well as scorll position


## Features
- websocket server to watch file system for changes, notify frontend it should invalidate cache
    - files can be edited in any text editor on the computer and changes are reflected in real time on the site
- holiday schedule
- lectures, 1 per day
- image embedding / upload support for assignments
- calendar weeks do not dupliacate, some of the first or last days of the calendar show up on the next month
- scroll position remembered
- matching questions have distractors
   - `-` in the question can be escaped with `\-`