export const githubClassroomUrlPrompt = `

## getting github classroom link

## Preparation
- Always ask for key information if not provided:
  - "Which classroom would you like to create an assignment in?"
  - "What would you like to name the assignment?"

## Step-by-Step Process

1. **Navigate to GitHub Classroom**
   \`\`\`javascript
   // Navigate to GitHub Classroom
   await page.goto('https://classroom.github.com');
   \`\`\`

2. **Select the Target Classroom**
   \`\`\`javascript
   // Click on the desired classroom
   await page.getByRole('link', { name: 'your-classroom-name' }).click();
   \`\`\`

3. **Click the "New assignment" button**
   \`\`\`javascript
   // Click New assignment
   await page.getByRole('link', { name: 'New assignment' }).click();
   \`\`\`

4. **Enter the assignment title**
   \`\`\`javascript
   // Fill in the assignment title
   await page.getByRole('textbox', { name: 'Assignment title' }).fill('your-assignment-name');
   \`\`\`

5. **Click "Continue" to move to the next step**
   \`\`\`javascript
   // Click Continue
   await page.getByRole('button', { name: 'Continue' }).click();
   \`\`\`

6. **Configure starter code (optional) and click "Continue" to proceed**
   \`\`\`javascript
   // Optional: Select a starter code repository if needed
   // await page.getByRole('combobox', { name: 'Find a GitHub repository' }).fill('your-repo');

   // Click Continue
   await page.getByRole('button', { name: 'Continue' }).click();
   \`\`\`

7. **Set up autograding (optional) and click "Create assignment"**
   \`\`\`javascript
   // Optional: Set up autograding tests if needed
   // await page.getByRole('button', { name: 'Add test' }).click();

   // Click Create assignment
   await page.getByRole('button', { name: 'Create assignment' }).click();
   \`\`\`

8. **Copy the assignment invitation link to share with students**
   \`\`\`javascript
   // Click Copy assignment invitation link
   await page.getByRole('button', { name: 'Copy assignment invitation' }).first().click();

   // The link is now in clipboard and ready to share with students
   \`\`\`

## Tips and Best Practices
- Always verify with the user if specific settings are needed (like deadlines, visibility, etc.)
- Test the invitation link by opening it in another browser to ensure it works correctly
- Consider optional features like starter code and autograding tests for more complex assignments
- Remember to communicate the invitation link to students via email, LMS, or other channels

## Common Issues and Solutions
- If authentication is needed, prompt the user to authenticate in their browser
- If a classroom isn't visible, ensure the user has proper permissions
- For starter code issues, verify that the repository is properly set as a template
- If GitHub Classroom is slow, advise patience during high-traffic periods
`