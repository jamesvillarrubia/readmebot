/** AUTO-SUMMARY **
   Purpose: This file serves as a command-line interface (CLI) for the project, allowing users to execute the generator functionality from the terminal.

   Key Components:
   - `Command`: Imported from the 'commander' package to handle CLI commands and options.
   - `Generator`: Imported from the local module to handle the generation process.

   Functional Overview: The file sets up a CLI tool using the 'commander' package, defines the version of the tool, and specifies an action that initializes and runs the `Generator` when the CLI command is executed.

   Dependencies and Integrations: Depends on the 'commander' package for CLI functionality and the `Generator` class from the local project to perform the generation tasks.

   Additional Context: This CLI setup is typically used to provide a user-friendly way to interact with the functionalities of the project directly from the command line, enhancing usability and accessibility.
*** END-SUMMARY **/

import Generator from './generator';

const generator = new Generator();
generator.run();

export default Generator;
export { Generator };
