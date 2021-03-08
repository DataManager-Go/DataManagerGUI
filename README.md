# DataManagerGUI
This is the client for the [DataManagerServer](https://github.com/JojiiOfficial/DataManagerServer). It's features are the same as the CLI one's, so
if you are more interested in working with the command line rather than using your desktop, go ahead and check it out
[here](https://github.com/DataManager-Go/DataManagerCLI).
<br><br>
<b>Note:</b> This project is currently being rewritten. This will enable more features, simpler expansion and improved user experience.


# Installation
If you want to compile the GUI yourself:
<br>
```git clone https://github.com/DataManager-Go/DataManagerGUI``` <br>
```cd DataManagerGUI``` <br>
```go build``` <br>

This however won't create an all-in-one executable - you will need to have the resources in the same folder as the binary.<br>
Therefore, I recommend using shortcuts.
<br>

Check out my [Install Wizard](https://github.com/Yukaru-san/InstallWizard) to create a portable installer containing all files needed if you want to use the program on another computer!

# First Start
On your first start, the program will need to download the electron binaries.
![example5](https://files.jojii.de/preview/raw/qcqGuF5eVnANOquvgCaZVwzZ6)
<br>
<sub><sup>The yes/no buttons depend on your system's language</sup></sub>
<br>
After accepting, the program might take a few seconds to start - depending on your internet connection.

# Look & Feel
![example5](https://files.jojii.de/preview/raw/n1gHIGdZwgyICWPJ9kEEbnmGp)

- On the left side you can create, adjust and browse through your namespaces and groups
- You can upload multiple files and directories
- You can browse your files inside the selected namespace / group
- The table shows all found entries respecting your search and sorting filters
- For easy accessibility there are plenty of menus that you can open using RMB

***Working with the GUI and CLI at the same time?***<br>
You can reload the files at any time by pressing F5!
