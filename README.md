# canvasManagement


install specflow template `dotnet new install Specflow.Templates.DotNet`

view templates with `dotnet new -l`

find outdated packages `dotnet list package --outdated`


Development command: `dotnet watch --project Management.Web/`


## Canvas HTML Hack

<https://nowucca.com/2020/07/04/working-around-canvas-limitations.html>

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

have lock date mimic an offset after drag and drop changes due date

schedule planning view? just outline concepts? (maybe some non-canvas scheduled thing that only shows up in planner? like a note, could be de-emphasized in webpage)
- probably have a notes section for each module. Have a toggle to expand notes in module

holiday schedule

multi-section support for due dates/times

better error handling when files are unparseable

websocket server to watch file system for changes, notify frontend it should invalidate cache

lectures
- create 1 lecture for a given day
- have a way of running a lecture from an unauthenticated computer? maybe just view lecture notes?


tighter integration with git
- regularly make git commits
- handle merging?
- maybe a different storage backend?
- user motivated restore?