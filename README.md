# canvasManagement


install specflow template `dotnet new install Specflow.Templates.DotNet`

view templates with `dotnet new -l`

find outdated packages `dotnet list package --outdated`


Development command: `dotnet watch --project Management.Web/`


# Razor Hack

Apparently the VSCode razor extension was compiled with a preview of dotnet 6... and only uses openssl 1.1. After installing openssl1.1 you can tell vscode to provide it with `export CLR_OPENSSL_VERSION_OVERRIDE=1.1; code ~/projects/canvasManagement`.

The issue can be tracked [here](https://github.com/dotnet/razor/issues/6241)


I am looking for a TA and grader for my CS 1410/1415 class. The labs are tuesdays at 7:30 - 9:30 am. Anyone who is interested, please message me on teams or send an email to alex.mickelson@snow.edu.