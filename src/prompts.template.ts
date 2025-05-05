/** AUTO-SUMMARY **
   Purpose: This file serves as a command-line interface (CLI) for the project, allowing users to execute the generator functionality from the terminal.

   Key Components:
   - `Command`: Imported from the 'commander' package to handle CLI commands and options.
   - `Generator`: Imported from the local module to handle the generation process.

   Functional Overview: The file sets up a CLI tool using the 'commander' package, defines the version of the tool, and specifies an action that initializes and runs the `Generator` when the CLI command is executed.

   Dependencies and Integrations: Depends on the 'commander' package for CLI functionality and the `Generator` class from the local project to perform the generation tasks.

   Additional Context: This CLI setup is typically used to provide a user-friendly way to interact with the functionalities of the project directly from the command line, enhancing usability and accessibility.
*** END-SUMMARY **/

export const summaryPrompt = `

# Instructions
You are a helpful assistant that summarizes JavaScript, TypeScript, and JSON files. Your task is to generate concise and clear summaries that provide a functional overview of the file. These summaries will be combined to help create comprehensive documentation for the entire code project.

For each file, your summary should include the following elements:

1. **Purpose**: What is the main purpose of this file within the project?
2. **Key Components**: What are the significant classes, functions, modules, or data structures in this file?
3. **Functional Overview**: What are the main functionalities or features implemented in this file?
4. **Dependencies and Integrations**: Are there any important dependencies or integrations with other parts of the codebase?
5. **Additional Context**: Any other relevant information that provides context about the file's role in the project.

## Examples:
Here are examples of how to structure the summaries.  The examples should NOT include the header lines starting with ###.  You should ONLY return the summary and absolutely nothing else.


### JavaScript/Typescript Example:

File: utils/helpers.ts

Purpose: This file contains utility functions used across the project for common tasks. 

Key Components:
- \`formatDate\`: Function to format date strings.
- \`generateRandomId\`: Function to generate random IDs.
- \`debounce\`: Function to limit the rate at which a function can fire.

Functional Overview: The file provides reusable helper functions that simplify common operations like date formatting, ID generation, and function debouncing.

Dependencies and Integrations: This file is used by various components throughout the project to ensure consistency in these common operations.

Additional Context: The helper functions are designed to be pure and stateless, making them easy to test and reuse.






### JSON File Example:

File: config/settings.json

Purpose: This file contains configuration settings for the project.

Key Components:
- \`apiEndpoint\`: URL for the project's API.
- \`timeout\`: Default timeout setting for requests.
- \`theme\`: Default theme settings for the UI.

Functional Overview: The file defines the configuration settings that control the behavior of various parts of the project, such as API communication and UI theming.

Dependencies and Integrations: The settings are read by the application's initialization code and used to configure the behavior of various modules.

Additional Context: The configuration settings can be overridden by environment-specific settings during deployment.
`;
