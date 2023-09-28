# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

## 0.1.8 - 2023-09-28

This replaces our homegrown Liquid parser with the newly released official @codemirror/lang-liquid parser. Less to maintain ftw.

### Added

- Added the official `@codemirror/lang-liquid` parser, which gives us autocomplete for liquid blocks and alleviates our need to support one of our custom blocks.
- As mentioned above, we now support the [full, default liquid spec](https://shopify.github.io/liquid/) in terms of both autocomplete and syntax highlighting. The backend parsing is an exercise left to the consumer. 💅

### Removed

- We deleted and nuked from orbit @gjtorikian's stellar work on the @yettoapp/lang-liquid parser and will now be sending that repo to a farm upstate where it can play with other repos.

## 0.1.7 - 2023-08-22

This adds some explicit setters to the Stheno mode so that a client can control the current theme mode explicitly rather than just toggling.

### Added

- Two additional Command functions allowing for clients to set dark or light mode explicitly

## 0.1.6 - 2023-07-25

This makes the API more composable for consumers, that way you're not locked into the "yetto" way of using this and can integrate it into whatever tool you'd like

### Added

- A way to decorate image links to show them in the editor, optionally with a style object allowing you to apply classes to the wrapper (making tailwind styling easier)

### Fixed

- Liquid parsing is more consistent and less fragile
- Keybindings moved into the extensions directory to enable us to decompose them and have more control in the future

## 0.1.4 - 2023-06-15

Getting Stheno ready for our Alpha release, and I think we're in a fairly usable place now. I'll be adding lots more in the next couple weeks but I'd consider this the first "yeah you could probably use this" release.

### Added

- Add keyboard shortcuts for markdown styling
- Create slash commands for more complex "components" (code blocks, links, images)
- Add light and dark mode syntaxes based on GitHub's current light and dark mode colors

### Fixed

- Update build system from parcel to `@codemirror/buildhelper`
- Better encapsulate the functionality

## 0.1.3 - 2023-06-10

### Added
- Created both Light and Dark themes for Yetto
- Created a fully featured example that includes a toolbar to demonstrate how to interact with Stheno's internal commands
- Updated the config to work more ergonomically with Stimulus

## 0.1.1 - 2022-12-17

### Fixed

- Typescript errors in Parcel were messing with our packages output. This has been resolved and you should be able to install and consume the package normally.
- The README was in the .github directory, which I prefer but doesn't allow NPM to read it as part of the package. I moved it to solve that issue.

## 0.1.0 - 2022-12-01

### Added

- An initial codemirror config for a Proof of Concept on how Codemirror meet's Yetto's needs.
- An example playground for testing the configuration
- A readme and some basic usage documentation
