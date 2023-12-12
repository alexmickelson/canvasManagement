# canvasManagement


install specflow template `dotnet new install Specflow.Templates.DotNet`

view templates with `dotnet new -l`

find outdated packages `dotnet list package --outdated`


Development command: `dotnet watch --project Management.Web/`


# Razor Hack

Apparently the VSCode razor extension was compiled with a preview of dotnet 6... and only uses openssl 1.1. After installing openssl1.1 you can tell vscode to provide it with `export CLR_OPENSSL_VERSION_OVERRIDE=1.1; code ~/projects/canvasManagement`.

The issue can be tracked [here](https://github.com/dotnet/razor/issues/6241)




"Name: test assignment
LockAt: 1/1/0001 12:00:00 AM
DueAt: 1/1/0001 12:00:00 AM
AssignmentGroupName: Final Project
SubmissionTypes:
- online_upload

---
here is the description
## Rubric
- 4pts: do task 1
- 2pts: do task 2
"


"Name: test assignment
LockAt: 1/1/0001 12:00:00 AM
DueAt: 1/1/0001 12:00:00 AM
AssignmentGroupName: Final Project
SubmissionTypes:

---



Local Description:
pMake a new C# console program./p
pAdd functionality to your program to ask the user three different questions and include their responses in a message back to the user.  For example, ask the user their name then ask their age then ask their favorite food.  Then tell the user Your name is {name}, your age is {age}, and you like to eat {favoriteFood}./p
pSubmit a copy of your code via canvas./p
hrh2Rubric/h2- 7pts: code submitted and correctly runs br/

Canvas Description: 
pMake a new C# console program./p
pAdd functionality to your program to ask the user three different questions and include their responses in a message back to the user.  For example, ask the user their name then ask their age then ask their favorite food.  Then tell the user Your name is {name}, your age is {age}, and you like to eat {favoriteFood}./p
pSubmit a copy of your code via canvas./p
hrh2Rubric/h2- 7pts: code submitted and correctly runs br

Canvas Raw Description: 
<link rel="stylesheet" href="https://instructure-uploads-2.s3.amazonaws.com/account_20000000000010/attachments/118917933/canvas_global_app.css"><p>Make a new C# console program.</p>
<p>Add functionality to your program to ask the user three different questions and include their responses in a message back to the user.  For example, ask the user their name then ask their age then ask their favorite food.  Then tell the user "Your name is {name}, your age is {age}, and you like to eat {favoriteFood}".</p>
<p>Submit a copy of your code via canvas.</p>
<hr><h2>Rubric</h2>- 7pts: code submitted and correctly runs <br><script src="https://instructure-uploads-2.s3.amazonaws.com/account_20000000000010/attachments/152669279/Canvas_Theme_Sept_2023.js"></script>