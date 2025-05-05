/** AUTO-SUMMARY **
   Purpose: This file provides templates and guidelines for generating comprehensive README files for projects.

   Key Components:
   - `readmeSystemPrompt`: A detailed guide outlining the steps to create a README file, including understanding the project, reviewing files and tools, generating README sections, and final review instructions.
   - `readmeTemplate`: A template for a README file that includes sections like Description, Badges, Visuals, Installation, Usage, Support, Roadmap, Contributing, Authors and Acknowledgment, License, and Project Status.

   Functional Overview: The file serves as a resource for generating structured and detailed README files that provide all necessary information about a project, from installation and usage to contributing and licensing.

   Dependencies and Integrations: This file is likely used by documentation tools or developers directly to ensure that all projects within the organization have consistent and thorough README files.

   Additional Context: The provided templates and guidelines emphasize the importance of clear and comprehensive documentation in project management and open-source contributions, facilitating better understanding and collaboration.
*** END-SUMMARY **/
export const readmeSystemPrompt = `
You are an AI tasked with crafting a comprehensive README file for a given project. The user will provide a list of files and their descriptions, as well as a list of tools and their descriptions. Your job is to use this information to generate a detailed README using the provided template. Here are the steps you should follow:

1. **Understand the Project**:
   - Review the provided project name and description.
   - Note the key features and any unique aspects of the project.
   - Identify any linked references or context that might be useful.

2. **Review Files and Tools**:
   - Examine the list of files and their descriptions.
   - Examine the list of tools and their descriptions.
   - If you need more information about the contents of a file, request it using the format:
     \`\`\`
     {FILE_REQUEST: "/path/to/the/file"}
     \`\`\`
   
3. **Generate the README Sections**:
   - **Name**: Insert the project name.
   - **Description**: Use the provided description and elaborate on the features, context, and differentiating factors.
   - **Badges**: Add relevant badges. Swap out links or references as needed.
   - **Visuals**: Include any provided visuals or suggest where visuals should be added.
   - **Installation**:
     - List any prerequisites or system requirements.
     - Provide detailed steps to install and run the project.
   - **Usage**: Provide clear examples of how to use the project, including code snippets and expected outputs.
   - **Support**: Mention where users can go for help (e.g., GitHub issues, email).
   - **Roadmap**: List any future plans or features for the project.
   - **Contributing**: Explain how users can contribute, including steps to set up a development environment and run tests.
   - **Authors and Acknowledgment**: List the main authors and contributors.
   - **License**: State the project's license and provide a link to the LICENSE file.
   - **Project Status**: Indicate the current status of the project and any requests for maintainers if needed.

4. **Additional Instructions**:
   - Include any relevant instructions on how to start or run the project.
   - If there are any dependencies or setup steps specific to the tools mentioned, include those as well.

5. **Final Review**:
   - Ensure all sections are completed and coherent.
   - Double-check all links and references to ensure they are correct and relevant.

---

When you are ready, begin by providing the project name and description, followed by the lists of files and tools. If you need more details about any specific file, use the {FILE_REQUEST} format to obtain the RAW content of the file. Once you have all the necessary information, proceed to craft the README using the provided template and your structured approach.`;

export const readmeTemplate = `
-------------------------------------
# Project Name

## Description
Provide a brief overview of what your project does and its purpose. Explain the specific problems it solves and any unique features. If applicable, include links to related resources or references for further context.

## Badges
[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)](https://shields.io)
[![License](https://img.shields.io/badge/license-MIT-blue)](LICENSE)
[![Version](https://img.shields.io/badge/version-1.0.0-orange)](https://github.com/user/repo/releases)

## Visuals
![Screenshot](link-to-screenshot.png)

If your project benefits from visual aids, include relevant images, GIFs, or even videos to help users understand its functionality and interface.

## Installation
### Requirements
- List any prerequisites, such as software versions or system requirements.
- Example: \`Node.js >= 14.0\`, \`Python 3.8\`, \`Windows 10\`

### Steps
1. Clone the repository:
    \`\`\`bash
    git clone https://github.com/user/repo.git
    cd repo
    \`\`\`
2. Install dependencies:
    \`\`\`bash
    npm install
    \`\`\`
3. Run the application:
    \`\`\`bash
    npm start
    \`\`\`

## Usage
Provide clear examples of how to use your project. Include code snippets and expected outputs.

\`\`\`bash
# Example command
command --option
\`\`\`
Output:
\`\`\`
Expected output
\`\`\`

For more detailed usage and examples, refer to the [Documentation](link-to-documentation).

## Support
If you need help, please reach out via:
- [GitHub Issues](https://github.com/user/repo/issues)
- Email: support@example.com

## Roadmap
Outline your future plans and upcoming features for the project.

- [ ] Feature 1
- [ ] Feature 2
- [ ] Feature 3

## Contributing
Contributions are welcome! To get started:

1. Fork the repository.
2. Create a new branch (\`git checkout -b feature-branch\`).
3. Make your changes.
4. Commit your changes (\`git commit -m 'Add new feature'\`).
5. Push to the branch (\`git push origin feature-branch\`).
6. Open a pull request.

For more detailed instructions, see the [Contributing Guidelines](CONTRIBUTING.md).

### Development Setup
- Run \`npm install\` to install dependencies.
- Use \`npm run lint\` to check code quality.
- Run tests with \`npm test\`.

## Authors and Acknowledgment
- **Author Name** - Initial work - [GitHub Profile](https://github.com/author)
- Acknowledge contributors and collaborators.

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Project Status
This project is currently active/inactive. If development has slowed down or stopped, please consider contributing or taking over maintenance.

------------------
`;
