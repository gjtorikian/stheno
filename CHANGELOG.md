# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

## 0.1.1 - 2022-12-17

### Fixed

- Typescript errors in Parcel were messing with our packages output. This has been resolved and you should be able to install and consume the package normally.
- The README was in the .github directory, which I prefer but doesn't allow NPM to read it as part of the package. I moved it to solve that issue.

## 0.1.0 - 2022-12-01

### Added

- An initial codemirror config for a Proof of Concept on how Codemirror meet's Yetto's needs.
- An example playground for testing the configuration
- A readme and some basic usage documentation
