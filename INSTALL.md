# Install Guide

This repository can produce a normal Windows installer and portable-style builds. Build outputs are written to `build/` after running `yarn run build` or `build-local.bat`.

## Normal Install

Use the generated NSIS installer:

```text
build/marktext-setup.exe
```

Copy `marktext-setup.exe` to the target computer and run it. It installs MarkText for the current user, typically under:

```text
%LOCALAPPDATA%\Programs\marktext
```

This option creates the normal Windows app install, including Start Menu integration.

## Portable Use

Do not copy only `MarkText.exe`; Electron apps require the adjacent runtime files, DLLs, and `resources` directory.

For a portable-style copy, use one of these outputs:

```text
build/marktext-x64-win.zip
build/win-unpacked/
```

Recommended process:

1. Copy `build/marktext-x64-win.zip` to the target computer.
2. Extract the zip to a folder of your choice.
3. Run `MarkText.exe` from the extracted folder.

Alternatively, copy the entire `build/win-unpacked/` folder and run:

```text
win-unpacked/MarkText.exe
```

## Local Build Helper

Use `build-local.bat` from the repository root for day-to-day local work:

```bat
build-local.bat
```

The script asks:

```text
Run Dev? [y/N]
```

Choose `y` to run MarkText in development mode with `yarn run dev`. A separate compile step is not needed before dev mode.

If dev mode is not selected, the script asks:

```text
Compile and install? [Y/n]
```

Choose the default `Y` to build the app with `yarn run build`, then silently install `build/marktext-setup.exe` over the current local install.

After installing, the script asks:

```text
Make this install the default Markdown app for this user? [y/N]
```

Choose `y` to register the installed MarkText executable as the current user's handler for `.md`, `.markdown`, `.mdown`, `.mkd`, and `.mkdn` files. This writes user-level registry keys only. On Windows 10/11, an existing protected Default apps choice may still need to be confirmed in Settings > Apps > Default apps.

The helper also switches to Node `16.20.2`, prefers Windows PowerShell 5 for older dependency scripts, sets Visual Studio build variables, and reapplies the local Windows 11 SDK workaround for the pinned `node-gyp` dependency when needed.
